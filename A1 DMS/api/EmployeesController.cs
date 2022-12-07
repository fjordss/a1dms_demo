using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.EntityFrameworkCore;
using A1DMS.V2;

namespace A1DMS.API
{
    public class EmployeeInfo
    {
        public int Code { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string Company { get; set; }
        public string Department { get; set; }
    }

    [Route("/api/[controller]")]
    [ApiController]

    public class EmployeesController : ControllerBase
    {
        private readonly UserService UserService;
        private readonly Context db;
        private readonly IViewHelper<EmployeeResult> Helper;

        public EmployeesController(UserService userService, Context context,  CallViewHelper callHelper)
        {
            this.UserService = userService;
            this.db = context;
            this.Helper = (IViewHelper<EmployeeResult>)callHelper(ViewHelpers.Employees);
        }

        [Authorize]
        [HttpGet]
        public ApiResponse<TableViewResponse<EmployeeResult>> Get()
        {
            var siteIds = this.UserService.GetSiteIds();
            var data = this.Helper.GetData();

            if (siteIds.Count > 0 && !this.UserService.HasRole(UserRole.Administrator))
                data.Rows = data.Rows.Where(e => siteIds.Contains(e.SiteId));

            return new ApiResponse<TableViewResponse<EmployeeResult>>(data);
        }

        [Authorize]
        [HttpGet("filterings")]
        public ApiResponse<IEnumerable<FilteringItem>> GetFilterings()
        {
            var siteIds = this.UserService.GetSiteIds();
            var filterings = this.Helper.GetFilterings();

            if (siteIds.Count > 0 && !this.UserService.HasRole(UserRole.Administrator))
            {
                var sites = this.db.Sites.ToList();

                var siteColumn = filterings.FirstOrDefault(f => f.Field == "site");
                if (siteColumn != null)
                    siteColumn.Choices = siteColumn.Choices.Where(c => siteIds.Select(id => sites.Find(s => s.Id == id).Name).Contains(c)).ToList();
            }    

            return new ApiResponse<IEnumerable<FilteringItem>>(filterings);
        }

        [Authorize(Policy = "Administrator")]
        [HttpGet("export")]
        public IActionResult Export()
        {
            var rows = this.Helper.Export();

            var columns = new List<ExcelColumn>();
            columns.Add(new ExcelColumn("Id", "Id"));
            columns.Add(new ExcelColumn("NGH #", "Code"));
            columns.Add(new ExcelColumn("First Name", "FirstName"));
            columns.Add(new ExcelColumn("Last Name", "LastName"));
            columns.Add(new ExcelColumn("Site", "Site"));
            columns.Add(new ExcelColumn("Company", "Company"));
            columns.Add(new ExcelColumn("PTS #", "PTSNumber"));
            columns.Add(new ExcelColumn("Additional Information", "AdditionalInfo"));
            columns.Add(new ExcelColumn("Created", "Date", value => ((DateTime)value).ToString("MM/dd/yyy")));
            columns.Add(new ExcelColumn("Inactive", "Inactive", value => (bool)value ? "Yes" : "No"));

            return File(ExcelHelper.Create(columns, rows), "application/octet-stream", "employees.xlsx");
        }

        [HttpGet("info/{code:int}")]
        public ApiResponse<EmployeeInfo> GetInfo(int code, string recaptchaToken, string kiosk)
        {
            var errors = new List<ApiResponseError>();

            if (string.IsNullOrEmpty(kiosk) && !CommonHelper.ValidateReCaptcha(recaptchaToken).Result)
            {
                errors.Add(new ApiResponseError(ApiResponse.UnknownError));

                return new ApiResponse<EmployeeInfo>(errors);
            }

            var info = this.db.Employees
                .Include(e => e.Company)
                .Include(e => e.Department)
                .Where(e => e.Code == code)
                .Select(e => new EmployeeInfo()
                {
                    Code = code,
                    FirstName = e.FirstName,
                    LastName = e.LastName,
                    Company = e.Company.Name,
                    Department = e.Department.Name
                })
                .FirstOrDefault();

            if (info == null)
            {
                errors.Add(new ApiResponseError("NGH# not found", "code"));

                return new ApiResponse<EmployeeInfo>(errors);
            }

            this.UserService.Set("card-code", code);
            this.UserService.Set("card-kiosk", kiosk != null ? kiosk : "");

            return new ApiResponse<EmployeeInfo>(info);
        }

        [Authorize]
        [HttpGet("{id:int}")]
        public ApiResponse<Employee> Get(int id)
        {
            var siteIds = this.UserService.GetSiteIds();

            var employee = this.db.Employees.FirstOrDefault(s => s.Id == id);
            if (employee != null && (siteIds.Count == 0 || this.UserService.HasRole(UserRole.Administrator) || siteIds.Contains(employee.SiteId)))
                return new ApiResponse<Employee>(employee);
            else
                return new ApiResponse<Employee>(new List<ApiResponseError>() { new ApiResponseError("Employee not found") });
        }

        [Authorize(Policy = "SiteAdministrator")]
        [HttpPost]
        public ApiResponse<Employee> Post([FromForm, Bind("Inactive",
                                                          "LastName",
                                                          "FirstName",
                                                          "Name",
                                                          "SiteId",
                                                          "CompanyId",
                                                          "DepartmentId",
                                                          "PTSNumber",
                                                          "AdditionalInfo")] Employee employee)
        {
            (var validated, var errors) = this.Validate(employee);
            if (validated)
            {
                var number = this.CreateNGHNumber(employee);
                if (!number.HasValue)
                    errors.Add(new ApiResponseError("Failed to create new NGH #"));

                employee.Name = employee.GetDisplayName();
                employee.Code = number.Value;
                employee.Date = DateTime.Now;

                try
                {
                    this.db.Add(employee);
                    this.db.SaveChanges();

                    return new ApiResponse<Employee>(employee);
                }
                catch (Exception e)
                {
                    errors.Add(new ApiResponseError(ApiResponse<Employee>.UnknownError));
                }
            }

            return new ApiResponse<Employee>(errors);
        }

        [Authorize(Policy = "SiteAdministrator")]
        [HttpPut("{id:int}")]
        public ApiResponse<Employee> Put(int id, [FromForm] Employee employee)
        {
            (var validated, var errors) = this.Validate(employee);
            if (validated)
            {
                var existing = this.db.Employees.FirstOrDefault(s => s.Id == id);
                if (existing == null)
                    errors.Add(new ApiResponseError("Employee not found"));
                else
                {
                    existing.FirstName = employee.FirstName;
                    existing.LastName = employee.LastName;
                    existing.Name = employee.GetDisplayName();
                    existing.Inactive = employee.Inactive;
                    existing.SiteId = employee.SiteId;
                    existing.CompanyId = employee.CompanyId;
                    existing.DepartmentId = employee.DepartmentId;
                    existing.PTSNumber = employee.PTSNumber;
                    existing.AdditionalInfo = employee.AdditionalInfo;

                    try
                    {
                        this.db.Update(existing);
                        this.db.SaveChanges();

                        return new ApiResponse<Employee>(existing);
                    }
                    catch (Exception e)
                    {
                        errors.Add(new ApiResponseError(ApiResponse<Employee>.UnknownError));
                    }
                }
            }

            return new ApiResponse<Employee>(errors);
        }

        [Authorize(Policy = "Administrator")]
        [HttpDelete("{id:int}")]
        public ApiResponse<Employee> Delete(int id)
        {
            var errors = new List<ApiResponseError>();

            var employee = this.db.Employees.FirstOrDefault(s => s.Id == id);
            if (employee != null)
            {
                try
                {
                    this.db.Remove(employee);
                    this.db.SaveChanges();

                    return new ApiResponse<Employee>(employee);
                }
                catch (Exception e)
                {
                    errors.Add(new ApiResponseError(ApiResponse<Employee>.UnknownError));
                }
            }
            else
                errors.Add(new ApiResponseError("Employee not found"));

            return new ApiResponse<Employee>(errors);
        }

        private (bool, List<ApiResponseError>) Validate(Employee employee)
        {
            var errors = new List<ApiResponseError>();

            employee.FirstName = this.HangleString(employee.FirstName);
            employee.LastName = this.HangleString(employee.LastName);
            employee.PTSNumber = this.HangleString(employee.PTSNumber);
            employee.AdditionalInfo = this.HangleString(employee.AdditionalInfo);

            if (this.db.Sites.Count(s => s.Id == employee.SiteId) == 0)
                errors.Add(new ApiResponseError("Site not found", "siteId"));

            if (this.db.Companies.Count(s => s.Id == employee.CompanyId) == 0)
                errors.Add(new ApiResponseError("Company not found", "companyId"));

            if (this.db.Departments.Count(s => s.Id == employee.DepartmentId) == 0)
                errors.Add(new ApiResponseError("Department not found", "departmentId"));

            return (errors.Count == 0, errors);
        }

        private string HangleString(string str)
        {
            return str != null ? str.Trim() : null;
        }

        private int? CreateNGHNumber(Employee employee)
        {
            if (employee.SiteId == 0)
                return null;

            var siteIndexes = new Dictionary<string, int>()
            {
                { "Orlan", 1 },
                { "Berkut", 2 },
                { "Odoptu", 3 },
                { "Chayvo", 4 },
                { "Rig 270", 4 },
                { "De-Kastri", 5 },
                { "Nogliki", 6 },
                { "Kholmsk", 7 }
            };

            var siteName = this.db.Sites.Where(s => s.Id == employee.SiteId).Select(s => s.Name).FirstOrDefault();
            if (string.IsNullOrEmpty(siteName) || !siteIndexes.ContainsKey(siteName))
                return null;

            var index = siteIndexes[siteName];

            var found = false;

            var employees = this.db
                .Employees
                .Where(e => e.Code >= index * 10000 && e.Code < (index + 1) * 10000)
                .Select(e => e.Code)
                .OrderBy(e => e)
                .AsEnumerable();

            if (employees.Count() > 0)
            {
                return employees.Aggregate((a, b) =>
                {
                    if (found)
                        return a;

                    if (b - a <= 1)
                        return b;
                    else
                    {
                        found = true;
                        return a;
                    }
                }) + 1;
            }
            else
                return index * 10000;
        }
    }
}

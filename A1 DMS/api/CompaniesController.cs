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
    [Route("/api/[controller]")]
    [ApiController]
    [Authorize]
    public class CompaniesController : ControllerBase
    {
        private readonly Context db;
        private readonly IViewHelper<Company> Helper;

        public CompaniesController(Context context, CallViewHelper callHelper)
        {
            this.db = context;
            this.Helper = (IViewHelper<Company>)callHelper(ViewHelpers.Companies);
        }

        [HttpGet]
        public ApiResponse<TableViewResponse<Company>> Get()
        {
            return new ApiResponse<TableViewResponse<Company>>(this.Helper.GetData());
        }

        [Authorize(Policy = "Administrator")]
        [HttpGet("filterings")]
        public ApiResponse<IEnumerable<FilteringItem>> GetFilterings()
        {
            return new ApiResponse<IEnumerable<FilteringItem>>(this.Helper.GetFilterings());
        }

        [Authorize(Policy = "Administrator")]
        [HttpGet("export")]
        public IActionResult Export()
        {
            var rows = this.Helper.Export();

            var columns = new List<ExcelColumn>();
            columns.Add(new ExcelColumn("Id", "Id"));
            columns.Add(new ExcelColumn("Name", "Name"));
            columns.Add(new ExcelColumn("Inactive", "Inactive", value => (bool)value ? "Yes" : "No"));

            return File(ExcelHelper.Create(columns, rows), "application/octet-stream", "companies.xlsx");
        }

        [Authorize(Policy = "Administrator")]
        [HttpGet("{id:int}")]
        public ApiResponse<Company> Get(int id)
        {
            var company = this.db.Companies.FirstOrDefault(s => s.Id == id);
            if (company != null)
                return new ApiResponse<Company>(company);
            else
                return new ApiResponse<Company>(new List<ApiResponseError>() { new ApiResponseError("Company not found") });
        }

        [Authorize(Policy = "Administrator")]
        [HttpPost]
        public ApiResponse<Company> Post([FromForm, Bind("Name", "Inactive")] Company company)
        {
            (var validated, var errors) = this.Validate(company, null);

            if (validated)
            {
                try
                {
                    this.db.Add(company);
                    this.db.SaveChanges();

                    return new ApiResponse<Company>(company);
                }
                catch (Exception e)
                {
                    errors.Add(new ApiResponseError(ApiResponse<Company>.UnknownError));
                }
            }

            return new ApiResponse<Company>(errors);
        }

        [Authorize(Policy = "Administrator")]
        [HttpPut("{id:int}")]
        public ApiResponse<Company> Put(int id, [FromForm] Company company)
        {
            (var validated, var errors) = this.Validate(company, id);

            if (validated)
            {
                var existing = this.db.Companies.FirstOrDefault(s => s.Id == id);
                if (existing == null)
                    errors.Add(new ApiResponseError("Company not found"));
                else
                {
                    existing.Name = company.Name;
                    existing.Inactive = company.Inactive;

                    try
                    {
                        this.db.Update(existing);
                        this.db.SaveChanges();

                        return new ApiResponse<Company>(existing);
                    }
                    catch (Exception e)
                    {
                        errors.Add(new ApiResponseError(ApiResponse<Company>.UnknownError));
                    }
                }
            }

            return new ApiResponse<Company>(errors);
        }

        [Authorize(Policy = "Administrator")]
        [HttpDelete("{id:int}")]
        public ApiResponse<Company> Delete(int id)
        {
            var errors = new List<ApiResponseError>();

            var company = this.db.Companies.FirstOrDefault(s => s.Id == id);
            if (company != null)
            {
                try
                {
                    this.db.Remove(company);
                    this.db.SaveChanges();

                    return new ApiResponse<Company>(company);
                }
                catch (Exception e)
                {
                    errors.Add(new ApiResponseError(ApiResponse<Company>.UnknownError));
                }
            }
            else
                errors.Add(new ApiResponseError("Company not found"));

            return new ApiResponse<Company>(errors);
        }

        private (bool, List<ApiResponseError>) Validate(Company company, int? companyId)
        {
            var errors = new List<ApiResponseError>();

            company.Name = company.Name != null ? company.Name.Trim() : "";

            if (string.IsNullOrEmpty(company.Name))
                errors.Add(new ApiResponseError(ApiResponse<Company>.FieldRequiredError, "name"));
            else
            {
                var existing = this.db.Companies.FirstOrDefault(s => s.Name.ToLower() == company.Name.ToLower() && (!companyId.HasValue || s.Id != companyId.Value));
                if (existing != null)
                    errors.Add(new ApiResponseError("Company with the same name already exists", "name"));
            }

            return (errors.Count == 0, errors);
        }
    }
}

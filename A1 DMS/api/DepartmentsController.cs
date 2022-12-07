using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.EntityFrameworkCore;
using A1DMS.V2;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace A1DMS.API
{
    [Route("/api/[controller]")]
    [ApiController]
    [Authorize]
    public class DepartmentsController : ControllerBase
    {
        private readonly Context db;
        private readonly IViewHelper<Department> Helper;

        public DepartmentsController(Context context, CallViewHelper callHelper)
        {
            this.db = context;
            this.Helper = (IViewHelper<Department>)callHelper(ViewHelpers.Departments);
        }

        [HttpGet]
        public ApiResponse<TableViewResponse<Department>> Get()
        {
            return new ApiResponse<TableViewResponse<Department>>(this.Helper.GetData());
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

            return File(ExcelHelper.Create(columns, rows), "application/octet-stream", "departments.xlsx");
        }

        [Authorize(Policy = "Administrator")]
        [HttpGet("{id:int}")]
        public ApiResponse<Department> Get(int id)
        {
            var department = this.db.Departments.FirstOrDefault(s => s.Id == id);
            if (department != null)
                return new ApiResponse<Department>(department);
            else
                return new ApiResponse<Department>(new List<ApiResponseError>() { new ApiResponseError("Department not found") });
        }

        [Authorize(Policy = "Administrator")]
        [HttpPost]
        public ApiResponse<Department> Post([FromForm, Bind("Name", "Inactive")] Department department)
        {
            (var validated, var errors) = this.Validate(department, null);

            if (validated)
            {
                try
                {
                    this.db.Add(department);
                    this.db.SaveChanges();

                    return new ApiResponse<Department>(department);
                }
                catch (Exception e)
                {
                    errors.Add(new ApiResponseError(ApiResponse<Department>.UnknownError));
                }
            }

            return new ApiResponse<Department>(errors);
        }

        [Authorize(Policy = "Administrator")]
        [HttpPut("{id:int}")]
        public ApiResponse<Department> Put(int id, [FromForm] Department department)
        {
            (var validated, var errors) = this.Validate(department, id);

            if (validated)
            {
                var existing = this.db.Departments.FirstOrDefault(s => s.Id == id);
                if (existing == null)
                    errors.Add(new ApiResponseError("Department not found"));
                else
                {
                    existing.Name = department.Name;
                    existing.Inactive = department.Inactive;

                    try
                    {
                        this.db.Update(existing);
                        this.db.SaveChanges();

                        return new ApiResponse<Department>(existing);
                    }
                    catch (Exception e)
                    {
                        errors.Add(new ApiResponseError(ApiResponse<Department>.UnknownError));
                    }
                }
            }

            return new ApiResponse<Department>(errors);
        }

        [Authorize(Policy = "Administrator")]
        [HttpDelete("{id:int}")]
        public ApiResponse<Department> Delete(int id)
        {
            var errors = new List<ApiResponseError>();

            var department = this.db.Departments.FirstOrDefault(s => s.Id == id);
            if (department != null)
            {
                try
                {
                    this.db.Remove(department);
                    this.db.SaveChanges();

                    return new ApiResponse<Department>(department);
                }
                catch (Exception e)
                {
                    errors.Add(new ApiResponseError(ApiResponse<Department>.UnknownError));
                }
            }
            else
                errors.Add(new ApiResponseError("Department not found"));

            return new ApiResponse<Department>(errors);
        }

        private (bool, List<ApiResponseError>) Validate(Department department, int? departmentId)
        {
            var errors = new List<ApiResponseError>();

            department.Name = department.Name != null ? department.Name.Trim() : "";

            if (string.IsNullOrEmpty(department.Name))
                errors.Add(new ApiResponseError(ApiResponse<Department>.FieldRequiredError, "name"));
            else
            {
                var existing = this.db.Departments.FirstOrDefault(s => s.Name.ToLower() == department.Name.ToLower() && (!departmentId.HasValue || s.Id != departmentId.Value));
                if (existing != null)
                    errors.Add(new ApiResponseError("Department with the same name already exists", "name"));
            }

            return (errors.Count == 0, errors);
        }
    }
}

using Microsoft.AspNetCore.Mvc;
using System;
using System.Drawing;
using System.Collections.Generic;
using System.Linq;
using System.IO;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.EntityFrameworkCore;
using A1DMS.V2;
using Spire.Xls;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace A1DMS.API
{
    [Route("/api/[controller]")]
    [ApiController]
    public class SitesController : ControllerBase
    {
        private readonly UserService UserService;
        private readonly IViewHelper<Site> Helper;
        private readonly Context db;

        public SitesController(UserService userService, Context context, CallViewHelper callHelper)
        {
            this.UserService = userService;
            this.Helper = (IViewHelper<Site>)callHelper(ViewHelpers.Sites);
            this.db = context;
        }

        [HttpGet]
        public ApiResponse<TableViewResponse<Site>> Get()
        {
            var data = this.Helper.GetData();

            if (this.UserService.IsAuthenticated)
            {
                var siteIds = this.UserService.GetSiteIds();
                if (siteIds.Count > 0 && !this.UserService.HasRole(UserRole.Administrator))
                    data.Rows = data.Rows.Where(s => siteIds.Contains(s.Id));
            }
            else
            {
                data.Rows = data.Rows.Where(s => !s.Inactive);
                foreach (var row in data.Rows)
                    row.Id = 0;
            }

            return new ApiResponse<TableViewResponse<Site>>(data);
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

            return File(ExcelHelper.Create(columns, rows), "application/octet-stream", "sites.xlsx");
        }

        [Authorize(Policy = "Administrator")]
        [HttpGet("{id:int}")]
        public ApiResponse<Site> Get(int id)
        {
            var site = this.db.Sites.FirstOrDefault(s => s.Id == id);
            if (site != null)
                return new ApiResponse<Site>(site);
            else
                return new ApiResponse<Site>(new List<ApiResponseError>() { new ApiResponseError("Site not found") });
        }

        [Authorize(Policy = "Administrator")]
        [HttpPost]
        public ApiResponse<Site> Post([FromForm, Bind("Name", "Inactive")] Site site)
        {
            (var validated, var errors) = this.Validate(site, null);

            if (validated)
            {
                try
                {
                    this.db.Add(site);
                    this.db.SaveChanges();

                    return new ApiResponse<Site>(site);
                }
                catch (Exception e)
                {
                    errors.Add(new ApiResponseError(ApiResponse<Site>.UnknownError));
                }
            }

            return new ApiResponse<Site>(errors);
        }

        [Authorize(Policy = "Administrator")]
        [HttpPut("{id:int}")]
        public ApiResponse<Site> Put(int id, [FromForm] Site site)
        {
            (var validated, var errors) = this.Validate(site, id);

            if (validated)
            {
                var existing = this.db.Sites.FirstOrDefault(s => s.Id == id);
                if (existing == null)
                    errors.Add(new ApiResponseError("Site not found"));
                else
                {
                    existing.Name = site.Name;
                    existing.Inactive = site.Inactive;

                    try
                    {
                        this.db.Update(existing);
                        this.db.SaveChanges();

                        return new ApiResponse<Site>(existing);
                    }
                    catch (Exception e)
                    {
                        errors.Add(new ApiResponseError(ApiResponse<Site>.UnknownError));
                    }
                }
            }

            return new ApiResponse<Site>(errors);
        }

        [Authorize(Policy = "Administrator")]
        [HttpDelete("{id:int}")]
        public ApiResponse<Site> Delete(int id)
        {
            var errors = new List<ApiResponseError>();

            var site = this.db.Sites.FirstOrDefault(s => s.Id == id);
            if (site != null)
            {
                try
                {
                    this.db.Remove(site);
                    this.db.SaveChanges();

                    return new ApiResponse<Site>(site);
                }
                catch (Exception e)
                {
                    errors.Add(new ApiResponseError(ApiResponse<Site>.UnknownError));
                }
            }
            else
                errors.Add(new ApiResponseError("Site not found"));

            return new ApiResponse<Site>(errors);
        }

        private (bool, List<ApiResponseError>) Validate(Site site, int? siteId)
        {
            var errors = new List<ApiResponseError>();

            site.Name = site.Name != null ? site.Name.Trim() : "";

            if (string.IsNullOrEmpty(site.Name))
                errors.Add(new ApiResponseError(ApiResponse<Site>.FieldRequiredError, "name"));
            else
            {
                var existing = this.db.Sites.FirstOrDefault(s => s.Name.ToLower() == site.Name.ToLower() && (!siteId.HasValue || s.Id != siteId.Value));
                if (existing != null)
                    errors.Add(new ApiResponseError("Site with the same name already exists", "name"));
            }

            return (errors.Count == 0, errors);
        }
    }
}

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
    [Route("/api/reporting/[controller]")]
    [ApiController]
    [Authorize]
    public class CordController : ControllerBase
    {
        private readonly CordViewHelper Helper;

        public CordController(CallViewHelper callHelper)
        {
            this.Helper = (CordViewHelper)callHelper(ViewHelpers.CordReport);
        }

        [HttpGet("byCompany")]
        public ApiResponse<TableViewResponse<CordReportItem>> GetByCompany([FromQuery] List<string> sites,
                                                    [FromQuery] List<string> companies,
                                                    [FromQuery] List<string> departments,
                                                    [FromQuery] DateTime? from,
                                                    [FromQuery] DateTime? to)
        {
            this.Helper.ParseProperties("byCompany", sites, companies, departments, from, to);

            return new ApiResponse<TableViewResponse<CordReportItem>>(this.Helper.GetData());
        }

        [HttpGet("byCompany/filterings")]
        public ApiResponse<IEnumerable<FilteringItem>> GetByCompanyFilterings([FromQuery] List<string> sites,
                                                        [FromQuery] List<string> companies,
                                                        [FromQuery] List<string> departments,
                                                        [FromQuery] DateTime? from,
                                                        [FromQuery] DateTime? to)
        {
            this.Helper.ParseProperties("byCompany", sites, companies, departments, from, to);

            return new ApiResponse<IEnumerable<FilteringItem>>(this.Helper.GetFilterings());
        }

        [HttpGet("byCompany/totals")]
        public ApiResponse<IEnumerable<TotalItem>> GetByCompanyTotals([FromQuery] List<string> sites,
                                                        [FromQuery] List<string> companies,
                                                        [FromQuery] List<string> departments,
                                                        [FromQuery] DateTime? from,
                                                        [FromQuery] DateTime? to)
        {
            this.Helper.ParseProperties("byCompany", sites, companies, departments, from, to);

            return new ApiResponse<IEnumerable<TotalItem>>(this.Helper.GetTotals());
        }

        [HttpGet("byDepartment")]
        public ApiResponse<TableViewResponse<CordReportItem>> GetByDepartment([FromQuery] List<string> sites,
                                                    [FromQuery] List<string> companies,
                                                    [FromQuery] List<string> departments,
                                                    [FromQuery] DateTime? from,
                                                    [FromQuery] DateTime? to)
        {
            this.Helper.ParseProperties("byDepartment", sites, companies, departments, from, to);

            return new ApiResponse<TableViewResponse<CordReportItem>>(this.Helper.GetData());
        }

        [HttpGet("byDepartment/filterings")]
        public ApiResponse<IEnumerable<FilteringItem>> GetByDepartmentFilterings([FromQuery] List<string> sites,
                                                        [FromQuery] List<string> companies,
                                                        [FromQuery] List<string> departments,
                                                        [FromQuery] DateTime? from,
                                                        [FromQuery] DateTime? to)
        {
            this.Helper.ParseProperties("byDepartment", sites, companies, departments, from, to);

            return new ApiResponse<IEnumerable<FilteringItem>>(this.Helper.GetFilterings());
        }

        [HttpGet("byDepartment/totals")]
        public ApiResponse<IEnumerable<TotalItem>> GetByDepartmentTotals([FromQuery] List<string> sites,
                                                       [FromQuery] List<string> companies,
                                                       [FromQuery] List<string> departments,
                                                       [FromQuery] DateTime? from,
                                                       [FromQuery] DateTime? to)
        {
            this.Helper.ParseProperties("byDepartment", sites, companies, departments, from, to);

            return new ApiResponse<IEnumerable<TotalItem>>(this.Helper.GetTotals());
        }

        [HttpGet("byENLDepartment")]
        public ApiResponse<TableViewResponse<CordReportItem>> GetByENLDepartment([FromQuery] List<string> sites,
                                                    [FromQuery] List<string> companies,
                                                    [FromQuery] List<string> departments,
                                                    [FromQuery] DateTime? from,
                                                    [FromQuery] DateTime? to)
        {
            this.Helper.ParseProperties("byENLDepartment", sites, companies, departments, from, to);

            return new ApiResponse<TableViewResponse<CordReportItem>>(this.Helper.GetData());
        }

        [HttpGet("byENLDepartment/filterings")]
        public ApiResponse<IEnumerable<FilteringItem>> GetByENLDepartmentFilterings([FromQuery] List<string> sites,
                                                        [FromQuery] List<string> companies,
                                                        [FromQuery] List<string> departments,
                                                        [FromQuery] DateTime? from,
                                                        [FromQuery] DateTime? to)
        {
            this.Helper.ParseProperties("byENLDepartment", sites, companies, departments, from, to);

            return new ApiResponse<IEnumerable<FilteringItem>>(this.Helper.GetFilterings());
        }

        [HttpGet("byENLDepartment/totals")]
        public ApiResponse<IEnumerable<TotalItem>> GetByENLDepartmentTotals([FromQuery] List<string> sites,
                                                       [FromQuery] List<string> companies,
                                                       [FromQuery] List<string> departments,
                                                       [FromQuery] DateTime? from,
                                                       [FromQuery] DateTime? to)
        {
            this.Helper.ParseProperties("byENLDepartment", sites, companies, departments, from, to);

            return new ApiResponse<IEnumerable<TotalItem>>(this.Helper.GetTotals());
        }
    }
}

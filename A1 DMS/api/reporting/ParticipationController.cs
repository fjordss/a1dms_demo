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
    [Route("/api/reporting/[controller]")]
    [ApiController]
    [Authorize]
    public class ParticipationController : ControllerBase
    {
        private readonly ParticipationViewHelper Helper;

        public ParticipationController(CallViewHelper callHelper)
        {
            this.Helper = (ParticipationViewHelper)callHelper(ViewHelpers.ParticipationReport);
        }

        [HttpGet]
        public ApiResponse<TableViewResponse<MonthlyReportItem>> Get([FromQuery] List<string> sites,
                                                        [FromQuery] List<string> companies, 
                                                        [FromQuery] List<string> departments,
                                                        [FromQuery] int year,
                                                        [FromQuery] int month)
        {
            this.Helper.ParseProperties(sites, companies, departments, year, month);

            return new ApiResponse<TableViewResponse<MonthlyReportItem>>(this.Helper.GetData());
        }

        [HttpGet("filterings")]
        public ApiResponse<IEnumerable<FilteringItem>> GetFilterings([FromQuery] List<string> sites,
                                                        [FromQuery] List<string> companies,
                                                        [FromQuery] List<string> departments,
                                                        [FromQuery] int year,
                                                        [FromQuery] int month)
        {
            this.Helper.ParseProperties(sites, companies, departments, year, month);

            return new ApiResponse<IEnumerable<FilteringItem>>(this.Helper.GetFilterings());
        }

        [HttpGet("totals")]
        public ApiResponse<IEnumerable<TotalItem>> GetTotals([FromQuery] List<string> sites,
                                                        [FromQuery] List<string> companies,
                                                        [FromQuery] List<string> departments,
                                                        [FromQuery] int year,
                                                        [FromQuery] int month)
        {
            this.Helper.ParseProperties(sites, companies, departments, year, month);

            return new ApiResponse<IEnumerable<TotalItem>>(this.Helper.GetTotals());
        }
    }
}

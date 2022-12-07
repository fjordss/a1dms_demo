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
    public class OIMSController : ControllerBase
    {
        private readonly OIMSViewHelper Helper;

        public OIMSController(CallViewHelper callHelper)
        {
            this.Helper = (OIMSViewHelper)callHelper(ViewHelpers.OIMSReport);
        }

        [HttpGet]
        public ApiResponse<TableViewResponse<OIMSReportItem>> Get([FromQuery] List<string> sites,
                                                    [FromQuery] List<string> companies, 
                                                    [FromQuery] List<string> departments,
                                                    [FromQuery] DateTime? from,
                                                    [FromQuery] DateTime? to)
        {
            this.Helper.ParseProperties(sites, companies, departments, from, to);

            return new ApiResponse<TableViewResponse<OIMSReportItem>>(this.Helper.GetData());
        }

        [HttpGet("filterings")]
        public ApiResponse<IEnumerable<FilteringItem>> GetFilterings([FromQuery] List<string> sites,
                                                                     [FromQuery] List<string> companies,
                                                                     [FromQuery] List<string> departments,
                                                                     [FromQuery] DateTime? from,
                                                                     [FromQuery] DateTime? to)
        {
            this.Helper.ParseProperties(sites, companies, departments, from, to);

            return new ApiResponse<IEnumerable<FilteringItem>>(this.Helper.GetFilterings());
        }

        [HttpGet("totals")]
        public ApiResponse<IEnumerable<TotalItem>> GetTotals([FromQuery] List<string> sites,
                                                        [FromQuery] List<string> companies,
                                                        [FromQuery] List<string> departments,
                                                        [FromQuery] DateTime? from,
                                                        [FromQuery] DateTime? to)
        {
            this.Helper.ParseProperties(sites, companies, departments, from, to);

            return new ApiResponse<IEnumerable<TotalItem>>(this.Helper.GetTotals());
        }
    }
}

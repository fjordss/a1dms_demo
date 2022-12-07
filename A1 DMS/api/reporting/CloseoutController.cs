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
    public class CloseoutController : ControllerBase
    {
        private readonly CloseoutViewHelper Helper;

        public CloseoutController(CallViewHelper callHelper)
        {
            this.Helper = (CloseoutViewHelper)callHelper(ViewHelpers.CloseoutReport);
        }

        [HttpGet]
        public ApiResponse<TableViewResponse<ActionItemResult>> Get([FromQuery] List<string> sites,
                                                    [FromQuery] List<string> companies,
                                                    [FromQuery] List<string> departments,
                                                    [FromQuery] DateTime? from,
                                                    [FromQuery] DateTime? to)
        {
            this.Helper.ParseProperties(sites, companies, departments, from, to);

            return new ApiResponse<TableViewResponse<ActionItemResult>>(this.Helper.GetData());
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
    }
}

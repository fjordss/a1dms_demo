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
    public class NominatedCardsController : ControllerBase
    {
        private readonly NominatedCardsViewHelper Helper;

        public NominatedCardsController(CallViewHelper callHelper)
        {
            this.Helper = (NominatedCardsViewHelper)callHelper(ViewHelpers.NominatedCardsReport);
        }

        [HttpGet]
        public ApiResponse<TableViewResponse<NGHCardResult>> Get([FromQuery] List<string> sites,
                                                    [FromQuery] List<string> companies,
                                                    [FromQuery] List<string> departments,
                                                    [FromQuery] List<string> categories,
                                                    [FromQuery] DateTime? from,
                                                    [FromQuery] DateTime? to)
        {
            this.Helper.ParseProperties(sites, companies, departments, categories, from, to);

            return new ApiResponse<TableViewResponse<NGHCardResult>>(this.Helper.GetData());
        }

        [HttpGet("filterings")]
        public ApiResponse<IEnumerable<FilteringItem>> GetFilterings([FromQuery] List<string> sites,
                                                        [FromQuery] List<string> companies,
                                                        [FromQuery] List<string> departments,
                                                        [FromQuery] List<string> categories,
                                                        [FromQuery] DateTime? from,
                                                        [FromQuery] DateTime? to)
        {
            this.Helper.ParseProperties(sites, companies, departments, categories, from, to);

            return new ApiResponse<IEnumerable<FilteringItem>>(this.Helper.GetFilterings());
        }
    }
}

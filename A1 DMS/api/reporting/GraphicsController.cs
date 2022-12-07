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
    public class GraphicsController : ControllerBase
    {
        private readonly GraphicsViewHelper Helper;

        public GraphicsController(GraphicsViewHelper helper)
        {
            this.Helper = helper;
        }

        [HttpGet]
        public ApiResponse<Dictionary<string, object>> Get([FromQuery] List<string> sites,
                                                    [FromQuery] List<string> companies, 
                                                    [FromQuery] List<string> departments,
                                                    [FromQuery] DateTime? from,
                                                    [FromQuery] DateTime? to)
        {
            this.Helper.ParseProperties(sites, companies, departments, from, to);

            return new ApiResponse<Dictionary<string, object>>(this.Helper.GetData());
        }
    }
}

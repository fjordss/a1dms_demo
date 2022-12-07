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
    public class DateController : ControllerBase
    {
        public DateController()
        {
        }

        [HttpGet]
        public ApiResponse<DateTime> Get()
        {
            return new ApiResponse<DateTime>(DateTime.Now);
        }
    }
}

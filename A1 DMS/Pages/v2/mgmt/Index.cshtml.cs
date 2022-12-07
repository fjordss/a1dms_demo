using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http.Extensions;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using Microsoft.EntityFrameworkCore;

namespace A1DMS.Pages.Management
{
    [Authorize]
    public class Index : PageModel
    {
        public readonly UserService UserService;

        public Index(UserService userService)
        {

        }

        public void OnGet()
        {
        }
    }
}
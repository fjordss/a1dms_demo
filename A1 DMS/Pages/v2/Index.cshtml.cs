using System;
using System.IO;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Http.Extensions;
using Microsoft.AspNetCore.StaticFiles;
using Newtonsoft.Json;
using Microsoft.Extensions.Configuration;
using System.Net;
using System.Runtime.InteropServices.ComTypes;
using Amazon.Runtime;
using Amazon.SQS;
using Amazon.SQS.Model;

namespace A1DMS.Pages.V2
{
    public class Index : PageModel
    {
        public string Kiosk;

        public Index()
        {
            
        }

        public void OnGet(string kiosk)
        {
            this.Kiosk = kiosk;
        }
    }
}

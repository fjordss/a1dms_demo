using System;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Web;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using System.ComponentModel.DataAnnotations;
using System.Reflection;
using Microsoft.Extensions.Hosting;

namespace A1DMS
{
    public static class EMailHelper
    {
        public static void CreateUserActiovationMessage(this EMailMessage message, string host, string name, string logonName, string entryCode)
        {
            message.Subject = "Your access to NGH Web portal";

            var body = "";


            message.Body = body;
        }

        public static void CreatePasswodRestoreMessage(this EMailMessage message, string host, string name, string restoreCode)
        {
            message.Subject = "NGH Web portal password reset";

            var body = "";


            message.Body = body;
        }
    }
}
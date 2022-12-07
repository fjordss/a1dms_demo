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
    public static class TranslationHelper
    {
        public static Language GetStringLanguage(string str)
        {
            var en = 0;
            var ru = 0;
            foreach (var c in str)
            {
                var s = char.ToLower(c);
                if (s >= 'a' && s <= 'z')
                    en++;
                else if (s >= 'а' && s <= 'я')
                    ru++;
            }

            return en >= ru ? Language.English : Language.Russian;
        }
    }
}

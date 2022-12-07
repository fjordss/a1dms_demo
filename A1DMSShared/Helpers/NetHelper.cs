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
    public static class NetHelper
    {
        public static string SendJsonHttpRequest(string url, string text, string authToken = null, Dictionary<string, string> headers = null)
        {
            var client = new HttpClient();

            if (!string.IsNullOrEmpty(authToken))
                client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", authToken);

            if (headers != null)
            {
                foreach (var header in headers)
                    client.DefaultRequestHeaders.Add(header.Key, header.Value);
            }

            var result = client.PostAsync(url, new StringContent(text, Encoding.UTF8, "application/json")).Result;

            return result.Content.ReadAsStringAsync().Result;
        }

        public static string SendGetHttpRequest(string url)
        {
            var client = new HttpClient();

            var result = client.GetAsync(url).Result;

            return result.Content.ReadAsStringAsync().Result;
        }
    }
}

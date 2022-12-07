using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Security.Claims;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.TestHost;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.Extensions.Primitives;
using Moq;
using A1DMS;
using Newtonsoft.Json;

namespace T
{
    class PageContextOptions
    {
        public Dictionary<string, StringValues> Query { get; set; } = new Dictionary<string, StringValues>();
        public Dictionary<string, StringValues> Form { get; set; } = new Dictionary<string, StringValues>();

        public Administrator SignInUser { get; set; }

        public void AddRequest(string key, string value)
        {

        }
    }

    class PageContext
    {
        public HttpContext HttpContext { get; private set; }

        public PageContext()
        {
            this.HttpContext = new DefaultHttpContext();
        }

        public PageContext(PageContextOptions options)
        {
            this.HttpContext = new DefaultHttpContext();

            if (options != null)
                this.HandleOptions(options);
        }

        public PageContext(Action<PageContextOptions> action)
        {
            this.HttpContext = new DefaultHttpContext();

            if (action != null)
            {
                var options = new PageContextOptions();
                action(options);

                this.HandleOptions(options);
            }
        }

        private void HandleOptions(PageContextOptions options)
        {
            if (options.SignInUser != null)
                this.SignIn(options.SignInUser);

            if (options.Query != null)
                this.HttpContext.Request.Query = new QueryCollection(options.Query);

            if (options.Form != null)
                this.HttpContext.Request.Form = new FormCollection(options.Form);
        }

        private void SignIn(Administrator user)
        {
            var claims = new List<Claim>
            {
                new Claim(ClaimsIdentity.DefaultNameClaimType, user.LogonName),
                new Claim(ClaimsIdentity.DefaultRoleClaimType, ((int)user.Role).ToString()),
                new Claim("UserId", user.Id.ToString()),
                new Claim("Name", !string.IsNullOrEmpty(user.Name) ? user.Name : user.LogonName),
                new Claim("LogonName", user.LogonName),
                new Claim("EMail", user.EMail),
                new Claim("SiteIds", JsonConvert.SerializeObject(user.SiteIds != null ? user.SiteIds : new List<int>()))
            };

            var identity = new ClaimsIdentity(claims, "ApplicationCookie", ClaimsIdentity.DefaultNameClaimType, ClaimsIdentity.DefaultRoleClaimType);
            this.HttpContext.User = new ClaimsPrincipal(identity);
        }
    }
}

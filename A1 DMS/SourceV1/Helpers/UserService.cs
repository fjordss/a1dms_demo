using Microsoft.AspNetCore.Http;
using System;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Security.Claims;
using System.Threading.Tasks;
using System.Web;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using System.ComponentModel.DataAnnotations;
using System.Reflection;
using Microsoft.AspNetCore.DataProtection;
using Microsoft.Extensions.Hosting;
using System.Security.Cryptography;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Identity;

namespace A1DMS
{ 
    public class UserService
    {
        public string IndexUrl { get; } = "/mgmt/";
        public string AuthUrl { get; } = "/mgmt/auth";
        public string ChangePwdUrl { get; } = "/mgmt/changepwd";

        private HttpContext Context { get; set; }
        private readonly Context db;

        public HttpRequest Request
        {
            get => this.Context.Request;
        }

        public bool IsAuthenticated
        {
            get => this.Context.User != null && this.Context.User.Identity != null && this.Context.User.Identity.IsAuthenticated;
        }

        public UserService(Context context, IHttpContextAccessor http)
        {
            this.db = context;
            this.Context = http.HttpContext;
        }

        public void SignIn(Administrator user)
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
            this.Context.SignInAsync(CookieAuthenticationDefaults.AuthenticationScheme, new ClaimsPrincipal(identity)).Wait();
        }

        public void SignOut()
        {
            this.Context.SignOutAsync(CookieAuthenticationDefaults.AuthenticationScheme).Wait();
        }

        public void Set<T>(string key, T value)
        {
            if (typeof(T) == typeof(string))
                this.Context.Session.SetString(key, (string)(object)value);
            else if (typeof(T) == typeof(int))
                this.Context.Session.SetInt32(key, (int)(object)value);
            else
                this.Context.Session.SetString(key, value != null ? JsonConvert.SerializeObject(value) : null);
        }

        public T Get<T>(string key)
        {
            if (typeof(T) == typeof(string))
                return (T)(object)this.Context.Session.GetString(key);
            else if (typeof(T) == typeof(int))
                return (T)(object)this.Context.Session.GetInt32(key);
            else
            {
                var value = this.Context.Session.GetString(key);
                if (value == null)
                    return default(T);

                return JsonConvert.DeserializeObject<T>(value);
            }
        }

        public void Remove(string key)
        {
            this.Context.Session.Remove(key);
        }

        public bool Contains(string key)
        {
            byte[] value;
            return this.Context.Session.TryGetValue(key, out value);
        }

        public bool HasRole(UserRole role)
        {
            var roles = Convert.ToInt32(this.Context.User.Claims.First(c => c.Type == ClaimsIdentity.DefaultRoleClaimType).Value);
            return (roles & (int)role) != 0;
        }

        public string GetName()
        {
            return this.Context.User.Claims.FirstOrDefault(c => c.Type == "Name")?.Value;
        }

        public string GetLogonName()
        {
            return this.Context.User.Identity.Name;
        }

        public string GetEMail()
        {
            return this.Context.User.Claims.FirstOrDefault(c => c.Type == "EMail")?.Value;
        }

        public int GetUserId()
        {
            return Convert.ToInt32(this.Context.User.Claims.First(c => c.Type == "UserId").Value);
        }

        public List<int> GetSiteIds()
        {
            var siteIdsStr = this.Context.User.Claims.FirstOrDefault(c => c.Type == "SiteIds")?.Value;
            if (siteIdsStr == null)
                return new List<int>();

            return JsonConvert.DeserializeObject<List<int>>(siteIdsStr);
        }

        public Administrator GetUserByCredentials(string logonName, string password)
        {
            var user = this.db.Administrators.Where(a => (a.LogonName.ToLower() == logonName.ToLower() || a.EMail.ToLower() == logonName.ToLower()) && a.Password != null).FirstOrDefault();
            if (user != null)
            {
                var hash = Convert.FromBase64String(user.Password);
                var salt = new byte[16];
                Array.Copy(hash, 0, salt, 0, 16);

                var provider = new Rfc2898DeriveBytes(password, salt, 1288);

                var pass = provider.GetBytes(20);

                var failed = false;
                for (var i = 0; i < 20; i++)
                {
                    if (hash[i + 16] != pass[i])
                    {
                        failed = true;
                        break;
                    }
                }

                if (!failed)
                    return user;
            }

            return null;
        }

        public string GetEncrypted(string str)
        {
            var salt = new byte[16];
            new RNGCryptoServiceProvider().GetBytes(salt);

            var provider = new Rfc2898DeriveBytes(str, salt, 1288);

            var password = provider.GetBytes(20);

            var hash = new byte[36];

            Array.Copy(password, 0, hash, 16, 20);
            Array.Copy(salt, 0, hash, 0, 16);

            return Convert.ToBase64String(hash);
        }
    }
}
using System;
using System.Security.Claims;
using System.Collections.Generic;
using System.Linq;
using System.Text.Encodings.Web;
using System.Text.Unicode;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.HttpsPolicy;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.WebEncoders;
using Microsoft.EntityFrameworkCore;
using Npgsql.EntityFrameworkCore.PostgreSQL;
using Microsoft.Extensions.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc.Infrastructure;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.AspNetCore.HttpOverrides;
using Microsoft.AspNetCore.Rewrite;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http.Features;

namespace A1DMS
{
    public class Startup
    {
        public static IConfiguration Configuration { get; private set; }
        public IHostEnvironment Environment { get; }

        public Startup(IConfiguration configuration, IHostEnvironment environment)
        {
            this.Environment = environment;

            Configuration = new ConfigurationBuilder()
                .AddJsonFile($"appsettings.{Environment.EnvironmentName}.json")
                .Build();
        }

        private void AddAuthorizationPolicies(AuthorizationOptions options)
        {
            options.AddPolicy("Administrator", policy =>
            {
                policy.RequireAssertion(handler =>
                {
                    var claim = handler.User.Claims.FirstOrDefault(c => c.Type == ClaimsIdentity.DefaultRoleClaimType);
                    if (claim == null)
                        return false;

                    var roles = (UserRole)Convert.ToInt32(claim.Value);
                    return (roles & UserRole.Administrator) == UserRole.Administrator;
                });
            });

            options.AddPolicy("SiteAdministrator", policy =>
            {
                policy.RequireAssertion(handler =>
                {
                    var claim = handler.User.Claims.FirstOrDefault(c => c.Type == ClaimsIdentity.DefaultRoleClaimType);
                    if (claim == null)
                        return false;

                    var roles = (UserRole)Convert.ToInt32(claim.Value);
                    return (roles & (UserRole.Administrator | UserRole.SiteAdministrator)) != 0;
                });
            });

            options.AddPolicy("Nomination", policy =>
            {
                policy.RequireAssertion(handler =>
                {
                    var claim = handler.User.Claims.FirstOrDefault(c => c.Type == ClaimsIdentity.DefaultRoleClaimType);
                    if (claim == null)
                        return false;

                    var roles = (UserRole)Convert.ToInt32(claim.Value);
                    return (roles & (UserRole.Administrator | UserRole.SSHEUser | UserRole.VotingUser)) != 0;
                });
            });

            options.AddPolicy("NominationSSHEUser", policy =>
            {
                policy.RequireAssertion(handler =>
                {
                    var claim = handler.User.Claims.FirstOrDefault(c => c.Type == ClaimsIdentity.DefaultRoleClaimType);
                    if (claim == null)
                        return false;

                    var roles = (UserRole)Convert.ToInt32(claim.Value);
                    return (roles & (UserRole.Administrator | UserRole.SSHEUser)) != 0;
                });
            });

            options.AddPolicy("NominationVotingUser", policy =>
            {
                policy.RequireAssertion(handler =>
                {
                    var claim = handler.User.Claims.FirstOrDefault(c => c.Type == ClaimsIdentity.DefaultRoleClaimType);
                    if (claim == null)
                        return false;

                    var roles = (UserRole)Convert.ToInt32(claim.Value);
                    return (roles & (UserRole.Administrator | UserRole.VotingUser)) != 0;
                });
            });
        }

        public void ConfigureServices(IServiceCollection services)
        {
            services.Configure<ForwardedHeadersOptions>(options =>
            {
                options.ForwardedHeaders = ForwardedHeaders.XForwardedFor | ForwardedHeaders.XForwardedProto | ForwardedHeaders.XForwardedHost;
                options.RequireHeaderSymmetry = true;
            });

            services.AddRazorPages();
            services.AddServerSideBlazor();

            services.AddDbContext<Context>(opt => opt.UseNpgsql(Configuration["ConnectionString"]));

            services.AddAuthentication(CookieAuthenticationDefaults.AuthenticationScheme).AddCookie(options =>
            {
                options.LoginPath = "/mgmt/auth";
            });

            services.AddAuthorization(options => this.AddAuthorizationPolicies(options));

            services.AddSingleton<IHttpContextAccessor, HttpContextAccessor>();

            services.AddScoped<UserService>();
            services.AddScoped<DateRangeSelector>();

            services.AddScoped<A1DMS.V1.EmployeesViewHelper>();
            services.AddScoped<A1DMS.V1.SitesViewHelper>();
            services.AddScoped<A1DMS.V1.DepartmentsViewHelper>();
            services.AddScoped<A1DMS.V1.CompaniesViewHelper>();
            services.AddScoped<A1DMS.V1.UsersViewHelper>();
            services.AddScoped<A1DMS.V1.CardsViewHelper>();
            services.AddScoped<A1DMS.V1.CordViewHelper>();
            services.AddScoped<A1DMS.V1.CloseoutViewHelper>();
            services.AddScoped<A1DMS.V1.ObserverViewHelper>();
            services.AddScoped<A1DMS.V1.OIMSViewHelper>();
            services.AddScoped<A1DMS.V1.ParticipationViewHelper>();
            services.AddScoped<A1DMS.V1.GraphicsViewHelper>();
            services.AddScoped<A1DMS.V1.NominatedCardsViewHelper>();
            services.AddScoped<A1DMS.V1.NominationViewHelper>();

            services.AddScoped<A1DMS.V1.CallViewHelper>(factory => type => Startup.GetViewHelperByTypeV1(factory, type));

            services.AddScoped<A1DMS.V2.EmployeesViewHelper>();
            services.AddScoped<A1DMS.V2.SitesViewHelper>();
            services.AddScoped<A1DMS.V2.DepartmentsViewHelper>();
            services.AddScoped<A1DMS.V2.CompaniesViewHelper>();
            services.AddScoped<A1DMS.V2.UsersViewHelper>();
            services.AddScoped<A1DMS.V2.CardsViewHelper>();
            services.AddScoped<A1DMS.V2.CordViewHelper>();
            services.AddScoped<A1DMS.V2.CloseoutViewHelper>();
            services.AddScoped<A1DMS.V2.ObserverViewHelper>();
            services.AddScoped<A1DMS.V2.OIMSViewHelper>();
            services.AddScoped<A1DMS.V2.ParticipationViewHelper>();
            services.AddScoped<A1DMS.V2.GraphicsViewHelper>();
            services.AddScoped<A1DMS.V2.NominatedCardsViewHelper>();
            services.AddScoped<A1DMS.V2.NominationsViewHelper>();

            services.AddScoped<A1DMS.V2.CallViewHelper>(factory => type => Startup.GetViewHelperByTypeV2(factory, type));

            services.AddScoped<CallQueue>(factory => type => Startup.GetQueueByType(factory, type));


            services.AddControllersWithViews().AddRazorRuntimeCompilation();
            services.Configure<WebEncoderOptions>(options =>
            {
                options.TextEncoderSettings = new TextEncoderSettings(UnicodeRanges.All);
            });

            services.AddDistributedMemoryCache();

            services.AddSession(opt => opt.IdleTimeout = TimeSpan.FromHours(5));

            services.AddControllers();
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
        {
            app.UseForwardedHeaders();
            if (env.EnvironmentName == "Development" || env.EnvironmentName == "Staging")
            {
                app.UseDeveloperExceptionPage();
            }
            else
            {
                app.UseExceptionHandler("/Error");
                // The default HSTS value is 30 days. You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.
                app.UseHsts();
            }

            app.UseHttpsRedirection();
            app.UseStaticFiles();

            var options = new RewriteOptions()
                .AddRewrite("^kiosk/([a-zA-Z0-9]+)$", "/index?kiosk=$1", true)
                .AddRewrite("^mgmt/auth/([a-z0-9]+)$", "/mgmt/auth?handler=enterByCode&code=$1", true)
                .AddRewrite("^v2/kiosk/([a-zA-Z0-9]+)$", "/v2/index?kiosk=$1", true);

            app.UseRewriter(options);

            app.Use(async (context, next) =>
            {
                if (context.Request.Path.Value.StartsWith("/v2/mgmt"))
                    context.Request.Path = "/v2/mgmt";

                await next();
            });

            app.UseRouting();

            app.UseAuthentication();
            app.UseAuthorization();

            app.UseSession(new SessionOptions() { IdleTimeout = TimeSpan.FromHours(5) });

            app.UseEndpoints(endpoints =>
            {
                endpoints.MapRazorPages();
                endpoints.MapBlazorHub();
                endpoints.MapControllers();
            });
        }

        public static Queue GetQueueByType(IServiceProvider factory, QueueType type)
        {
            var queues = Configuration.GetSection("Queues");

            var url = queues[type.ToString() + "QueueUrl"];
            var accessKey = queues["AccessKey"];
            var secretKey = queues["SecretKey"];

            return new Queue(type, url, accessKey, secretKey);
        }

        public static object GetViewHelperByTypeV1(IServiceProvider factory, A1DMS.V1.ViewHelpers type)
        {
            var helper = (object)null;
            switch (type)
            {
                case A1DMS.V1.ViewHelpers.Employees: helper = factory.GetService<A1DMS.V1.EmployeesViewHelper>(); break;
                case A1DMS.V1.ViewHelpers.Sites: helper = factory.GetService<A1DMS.V1.SitesViewHelper>(); break;
                case A1DMS.V1.ViewHelpers.Departments: helper = factory.GetService<A1DMS.V1.DepartmentsViewHelper>(); break;
                case A1DMS.V1.ViewHelpers.Companies: helper = factory.GetService<A1DMS.V1.CompaniesViewHelper>(); break;
                case A1DMS.V1.ViewHelpers.Users: helper = factory.GetService<A1DMS.V1.UsersViewHelper>(); break;
                case A1DMS.V1.ViewHelpers.Cards: helper = factory.GetService<A1DMS.V1.CardsViewHelper>(); break;
                case A1DMS.V1.ViewHelpers.CordReport: helper = factory.GetService<A1DMS.V1.CordViewHelper>(); break;
                case A1DMS.V1.ViewHelpers.CloseoutReport: helper = factory.GetService<A1DMS.V1.CloseoutViewHelper>(); break;
                case A1DMS.V1.ViewHelpers.ObserverReport: helper = factory.GetService<A1DMS.V1.ObserverViewHelper>(); break;
                case A1DMS.V1.ViewHelpers.OIMSReport: helper = factory.GetService<A1DMS.V1.OIMSViewHelper>(); break;
                case A1DMS.V1.ViewHelpers.ParticipationReport: helper = factory.GetService<A1DMS.V1.ParticipationViewHelper>(); break;
                case A1DMS.V1.ViewHelpers.NominatedCardsReport: helper = factory.GetService<A1DMS.V1.NominatedCardsViewHelper>(); break;
                case A1DMS.V1.ViewHelpers.NominationReport: helper = factory.GetService<A1DMS.V1.NominationViewHelper>(); break;
            }

            return helper;
        }

        public static object GetViewHelperByTypeV2(IServiceProvider factory, A1DMS.V2.ViewHelpers type)
        {
            var helper = (object)null;
            switch (type)
            {
                case A1DMS.V2.ViewHelpers.Employees: helper = factory.GetService<A1DMS.V2.EmployeesViewHelper>(); break;
                case A1DMS.V2.ViewHelpers.Sites: helper = factory.GetService<A1DMS.V2.SitesViewHelper>(); break;
                case A1DMS.V2.ViewHelpers.Departments: helper = factory.GetService<A1DMS.V2.DepartmentsViewHelper>(); break;
                case A1DMS.V2.ViewHelpers.Companies: helper = factory.GetService<A1DMS.V2.CompaniesViewHelper>(); break;
                case A1DMS.V2.ViewHelpers.Users: helper = factory.GetService<A1DMS.V2.UsersViewHelper>(); break;
                case A1DMS.V2.ViewHelpers.Cards: helper = factory.GetService<A1DMS.V2.CardsViewHelper>(); break;
                case A1DMS.V2.ViewHelpers.CordReport: helper = factory.GetService<A1DMS.V2.CordViewHelper>(); break;
                case A1DMS.V2.ViewHelpers.CloseoutReport: helper = factory.GetService<A1DMS.V2.CloseoutViewHelper>(); break;
                case A1DMS.V2.ViewHelpers.ObserverReport: helper = factory.GetService<A1DMS.V2.ObserverViewHelper>(); break;
                case A1DMS.V2.ViewHelpers.OIMSReport: helper = factory.GetService<A1DMS.V2.OIMSViewHelper>(); break;
                case A1DMS.V2.ViewHelpers.ParticipationReport: helper = factory.GetService<A1DMS.V2.ParticipationViewHelper>(); break;
                case A1DMS.V2.ViewHelpers.NominatedCardsReport: helper = factory.GetService<A1DMS.V2.NominatedCardsViewHelper>(); break;
                case A1DMS.V2.ViewHelpers.NominationReport: helper = factory.GetService<A1DMS.V2.NominationsViewHelper>(); break;
            }

            return helper;
        }
    }
}

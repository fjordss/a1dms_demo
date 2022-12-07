using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Text.RegularExpressions;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using A1DMS.V2;

namespace A1DMS.API
{
    [Route("/api/[controller]")]
    [ApiController]
    [Authorize]
    public class UsersController : ControllerBase
    {
        private readonly Context db;
        private readonly IViewHelper<UserResult> Helper;
        private readonly UserService UserService;
        private readonly Queue Queue;
        private readonly IConfiguration Config;

        public UsersController(Context context, CallViewHelper callHelper, UserService userService, CallQueue callQueue, IConfiguration config)
        {
            this.db = context;
            this.Helper = (IViewHelper<UserResult>)callHelper(ViewHelpers.Users);
            this.UserService = userService;
            this.Config = config;
            this.Queue = callQueue(QueueType.Mail);
        }

        [Authorize(Policy = "Administrator")]
        [HttpGet]
        public ApiResponse<TableViewResponse<UserResult>> Get()
        {
            return new ApiResponse<TableViewResponse<UserResult>>(this.Helper.GetData());
        }

        [Authorize(Policy = "Administrator")]
        [HttpGet("filterings")]
        public ApiResponse<IEnumerable<FilteringItem>> GetFilterings()
        {
            return new ApiResponse<IEnumerable<FilteringItem>>(this.Helper.GetFilterings());
        }

        [Authorize(Policy = "Administrator")]
        [HttpGet("export")]
        public IActionResult Export()
        {
            var rows = this.Helper.Export();

            var columns = new List<ExcelColumn>();
            columns.Add(new ExcelColumn("Id", "Id"));
            columns.Add(new ExcelColumn("Name", "Name"));
            columns.Add(new ExcelColumn("Logon Name", "LogonName"));
            columns.Add(new ExcelColumn("EMail", "EMail"));
            columns.Add(new ExcelColumn("Role", "Role"));
            columns.Add(new ExcelColumn("Company", "Company"));
            columns.Add(new ExcelColumn("Sites", "Sites"));
            columns.Add(new ExcelColumn("Created by", "CreatedBy"));

            return File(ExcelHelper.Create(columns, rows), "application/octet-stream", "users.xlsx");
        }

        [HttpGet("current")]
        public ApiResponse<Administrator> GetCurrent()
        {
            return new ApiResponse<Administrator>(this.db.Administrators.FirstOrDefault(a => a.Id == this.UserService.GetUserId()));
        }

        [Authorize(Policy = "Administrator")]
        [HttpGet("{id:int}")]
        public ApiResponse<Administrator> Get(int id)
        {
            var user = this.db.Administrators.FirstOrDefault(s => s.Id == id);
            if (user != null)
                return new ApiResponse<Administrator>(user);
            else
                return new ApiResponse<Administrator>(new List<ApiResponseError>() { new ApiResponseError("User not found") });
        }

        [Authorize(Policy = "Administrator")]
        [HttpPost]
        public ApiResponse<Administrator> Post([FromForm, Bind("LastName", "FirstName", "LogonName", "Name", "EMail", "CompanyId")] Administrator user, [FromForm] List<int> siteIds, [FromForm] int role)
        {
            user.Role = (UserRole)role;
            user.SiteIds = siteIds;
            user.LogonName = user.LogonName.Trim().ToLower();
            user.EMail = user.EMail.Trim().ToLower();

            (var validated, var errors) = this.Validate(user, null);
            if (validated)
            {
                user.CreatedById = this.UserService.GetUserId();
                user.Name = user.GetDisplayName();
                user.ChangePasswordAtNextLogon = true;
                user.EntryCode = Guid.NewGuid().ToString().Replace("-", "");

                try
                {
                    this.db.Add(user);
                    this.db.SaveChanges();

                    this.SendEMail(user);

                    return new ApiResponse<Administrator>(user);
                }
                catch (Exception e)
                {
                    errors.Add(new ApiResponseError(ApiResponse<Administrator>.UnknownError));
                }
            }

            return new ApiResponse<Administrator>(errors);
        }

        [Authorize(Policy = "Administrator")]
        [HttpPut("{id:int}")]
        public ApiResponse<Administrator> Put(int id, 
                                              [FromForm, Bind("LastName", "FirstName", "LogonName", "Name", "EMail", "CompanyId")] Administrator user, 
                                              [FromForm] List<int> siteIds, 
                                              [FromForm] int role)
        {
            (var validated, var errors) = this.Validate(user, id);
            if (validated)
            {
                var existing = this.db.Administrators.FirstOrDefault(s => s.Id == id);
                if (existing == null)
                    errors.Add(new ApiResponseError("User not found"));
                else
                {
                    existing.FirstName = user.FirstName;
                    existing.LastName = user.LastName;
                    existing.LogonName = user.LogonName.Trim().ToLower();
                    existing.EMail = user.EMail.Trim().ToLower();
                    existing.Name = user.GetDisplayName();
                    existing.Role = (UserRole)role;
                    existing.SiteIds = siteIds;
                    existing.CompanyId = user.CompanyId;
                    
                    try
                    {
                        this.db.Update(existing);
                        this.db.SaveChanges();

                        return new ApiResponse<Administrator>(existing);
                    }
                    catch (Exception e)
                    {
                        errors.Add(new ApiResponseError(ApiResponse<Administrator>.UnknownError));
                    }
                }
            }

            return new ApiResponse<Administrator>(errors);
        }

        [Authorize(Policy = "Administrator")]
        [HttpDelete("{id:int}")]
        public ApiResponse<Administrator> Delete(int id)
        {
            var errors = new List<ApiResponseError>();

            var user = this.db.Administrators.FirstOrDefault(s => s.Id == id);
            if (user != null)
            {
                try
                {
                    this.db.Remove(user);
                    this.db.SaveChanges();

                    return new ApiResponse<Administrator>(user);
                }
                catch (Exception e)
                {
                    errors.Add(new ApiResponseError(ApiResponse<Administrator>.UnknownError));
                }
            }
            else
                errors.Add(new ApiResponseError("User not found"));

            return new ApiResponse<Administrator>(errors);
        }

        private (bool, List<ApiResponseError>) Validate(Administrator user, int? userId)
        {
            var errors = new List<ApiResponseError>();
            var existings = this.db.Administrators.Where(e => (e.LogonName.ToLower() == user.LogonName || e.EMail.ToLower() == user.EMail || e.EMail.ToLower() == user.LogonName || e.LogonName.ToLower() == user.EMail) && (!userId.HasValue || e.Id != userId.Value)).ToList();
            foreach (var existing in existings)
            {
                if (existing.LogonName.ToLower() == user.LogonName)
                    errors.Add(new ApiResponseError("Logon name " + existing.LogonName + " is not unique", "logonName"));

                if (existing.EMail.ToLower() == user.EMail)
                    errors.Add(new ApiResponseError("E-mail " + existing.EMail + " is not unique", "eMail"));

                if (existing.EMail.ToLower() == user.LogonName)
                    errors.Add(new ApiResponseError("Logon name is set as e-mail of another user", "logonName"));

                if (existing.LogonName.ToLower() == user.EMail)
                    errors.Add(new ApiResponseError("E-mail is set as logon name of another user"));
            }

            if (!Regex.IsMatch(user.EMail, @"^[a-zA-Z\d]?[a-zA-Z\d\-_\.]*[a-zA-Z\d]{1}@[a-zA-Z\d]?[a-zA-Z\d\.\-]*[a-zA-Z\d]{1}\.[a-zA-Z]+$"))
                errors.Add(new ApiResponseError("Wrong e-mail format", "eMail"));

            return (errors.Count == 0, errors);
        }

        private void SendEMail(Administrator user)
        {
            var sites = this.db.Sites.ToList();

            var odoptuId = sites.First(s => s.Name == "Odoptu").Id;
            var chayvoId = sites.First(s => s.Name == "Chayvo").Id;
            var noglikiId = sites.First(s => s.Name == "Nogliki").Id;
            var deKastriId = sites.First(s => s.Name == "De-Kastri").Id;
            if (user.SiteIds != null && (user.SiteIds.Contains(odoptuId) ||
                                         user.SiteIds.Contains(chayvoId) ||
                                         user.SiteIds.Contains(noglikiId) ||
                                         user.SiteIds.Contains(deKastriId)))
            {
                return;
            }

            var message = new EMailMessage();
            message.Recepients.Add(user.EMail);
            message.CreateUserActiovationMessage(this.Config["Host"], user.Name, user.LogonName, user.EntryCode);

            this.Queue.Initialize();
            if (this.Queue.IsValid)
                this.Queue.SendMessage(message);
        }
    }
}

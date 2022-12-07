using System;
using System.Collections.Generic;
using System.Linq;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using Microsoft.EntityFrameworkCore;
using A1DMS;
using A1DMS.Pages;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;

namespace T.Pages.Mgmt.Users
{
    [TestClass]
    public class TestCreateUser
    {
        private CreateUser Page;
        private ServiceHelper ServiceHelper = new ServiceHelper();

        [TestInitialize]
        public void Initialize()
        {
            var pageContext = new PageContext(opt =>
            {
                opt.SignInUser = CommonHelper.GetRandomUser();
                opt.Form.Add("Administrator.Role", new string[] { ((int)UserRole.Supervisor).ToString() });
            });

            this.Page = new CreateUser(this.ServiceHelper.GetDbContext(),
                                       this.ServiceHelper.GetUserService(pageContext),
                                       this.ServiceHelper.GetQueue(),
                                       this.ServiceHelper.GetConfiguration());
        }

        [TestMethod]
        public void TestOnGet()
        {
            //

            this.Page.OnGet();

            //

            Assert.IsTrue(this.Page.Sites != null && this.Page.Sites.Count > 0 &&
                          this.Page.Companies != null && this.Page.Companies.Count > 0);
        }


        [TestMethod]
        public void TestOnPost()
        {
            var logonName = "john.conor";

            this.Page.Administrator = new Administrator();
            this.Page.Administrator.FirstName = "John";
            this.Page.Administrator.LastName = "Conor";
            this.Page.Administrator.Name = this.Page.Administrator.GetDisplayName();
            this.Page.Administrator.EMail = "John.Conor@test.com";
            this.Page.Administrator.LogonName = logonName;
            this.Page.Administrator.CompanyId = CommonHelper.GetRandomCompany().Id;
            this.Page.Administrator.CreatedById = CommonHelper.GetRandomUser().Id;

            //

            var result = this.Page.OnPost();

            //

            if (result is RedirectResult)
            {
                var db = this.ServiceHelper.GetDbContext();

                var user = db.Administrators.FirstOrDefault(s => s.LogonName == logonName);

                db.Remove(user);
                db.SaveChanges();
            }

            Assert.IsTrue(result is RedirectResult);
        }
    }
}
using System;
using System.Collections.Generic;
using System.Linq;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using A1DMS;
using A1DMS.Pages;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;

namespace T.Pages.Mgmt.Users
{
    [TestClass]
    public class TestEditUser
    {
        private EditUser Page;
        private ServiceHelper ServiceHelper = new ServiceHelper();

        [TestInitialize]
        public void Initialize()
        {
            var pageContext = new PageContext(opt =>
            {
                opt.Form.Add("Administrator.Role", new string[] 
                {
                    ((int)UserRole.Supervisor).ToString(),
                    ((int)UserRole.VotingUser).ToString()
                });
            });

            this.Page = new EditUser(this.ServiceHelper.GetDbContext(), this.ServiceHelper.GetUserService(pageContext));
        }

        [TestMethod]
        public void TestOnGetEmpty()
        {
            //

            var result = this.Page.OnGet(null);

            //

            Assert.IsTrue(result is NotFoundResult);
        }

        [TestMethod]
        public void TestOnGetWithId()
        {
            var user = CommonHelper.GetRandomUser();

            //

            this.Page.OnGet(user.Id);

            //

            Assert.IsTrue(this.Page.Administrator != null && this.Page.Administrator.Id == user.Id);
        }


        [TestMethod]
        public void TestOnPost()
        {
            var db = this.ServiceHelper.GetDbContext();

            this.Page.Administrator = CommonHelper.GetRandomUser();

            var userName = "TestUser";

            var oldRole = this.Page.Administrator.Role;
            var oldName = this.Page.Administrator.LogonName;
            this.Page.Administrator.LogonName = userName;

            //

            var result = this.Page.OnPost();

            var user = db.Administrators.FirstOrDefault(e => e.Id == this.Page.Administrator.Id);

            var newName = user.LogonName;
            user.LogonName = oldName;
            user.Role = oldRole;

            db.Attach(user);
            db.SaveChanges();

            //

            Assert.IsTrue(newName == userName);
        }
    }
}

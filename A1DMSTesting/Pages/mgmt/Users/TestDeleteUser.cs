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
    public class TestDeleteUser
    {
        private DeleteUser Page;
        private ServiceHelper ServiceHelper = new ServiceHelper();

        [TestInitialize]
        public void Initialize()
        {
            this.Page = new DeleteUser(this.ServiceHelper.GetDbContext());
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
        public void TestOnPostEmpty()
        {
            //

            var result = this.Page.OnGet(null);

            //

            Assert.IsTrue(result is NotFoundResult);
        }

        [TestMethod]
        public void TestOnPostWithId()
        {
            var db = this.ServiceHelper.GetDbContext();

            var user = new Administrator();
            user.FirstName = "John";
            user.LastName = "Conor";
            user.Name = user.GetDisplayName();
            user.EMail = "John.Conor@test.com";
            user.LogonName = "john.conor";
            user.CompanyId = CommonHelper.GetRandomCompany().Id;
            user.CreatedById = CommonHelper.GetRandomUser().Id;

            db.Add(user);
            db.SaveChanges();

            //

            var result = this.Page.OnPost(user.Id);

            //

            Assert.IsTrue(db.Administrators.FirstOrDefault(s => s.Id == user.Id) == null);
        }
    }
}

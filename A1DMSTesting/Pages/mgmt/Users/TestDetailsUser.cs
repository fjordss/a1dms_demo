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
    public class TestDetailsUser
    {
        private DetailsUser Page;
        private ServiceHelper ServiceHelper = new ServiceHelper();

        [TestInitialize]
        public void Initialize()
        {
            this.Page = new DetailsUser(this.ServiceHelper.GetDbContext());
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
    }
}

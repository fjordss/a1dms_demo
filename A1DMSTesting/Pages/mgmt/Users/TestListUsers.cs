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
    public class TestListUsers
    {
        private ListUsers Page;
        private ServiceHelper ServiceHelper = new ServiceHelper();

        [TestInitialize]
        public void Initialize()
        {
            var pageContext = new PageContext(opt => opt.SignInUser = CommonHelper.GetRandomUser());

            this.Page = new ListUsers(this.ServiceHelper.GetDbContext(), this.ServiceHelper.GetViewHelper(pageContext), this.ServiceHelper.GetQueue());
        }

        [TestMethod]
        public void TestOnGet()
        {
            //

            this.Page.OnGet(null);

            //

            Assert.IsTrue(true);
        }

        [TestMethod]
        public void TestOnGetData()
        {
            //

            var content = ((ContentResult)this.Page.OnGetData()).Content;
            var obj = JsonConvert.DeserializeObject(content);

            //

            Assert.IsTrue(CommonHelper.IsBootstrapTableResponse(obj, false));
        }

        [TestMethod]
        public void TestOnGetFiltering()
        {
            //

            var content = ((ContentResult)this.Page.OnGetFiltering()).Content;
            var obj = JsonConvert.DeserializeObject(content);

            //

            Assert.IsTrue(CommonHelper.IsFilteringArray(obj));
        }
    }
}

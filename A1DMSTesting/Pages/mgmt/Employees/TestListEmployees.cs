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

namespace T.Pages.Mgmt.Employees
{
    [TestClass]
    public class TestListEmployees
    {
        private ListEmployees Page;
        private ServiceHelper ServiceHelper = new ServiceHelper();

        [TestInitialize]
        public void Initialize()
        {
            var pageContext = new PageContext(opt => opt.SignInUser = CommonHelper.GetRandomUser());

            this.Page = new ListEmployees(this.ServiceHelper.GetViewHelper(pageContext));
        }

        [TestMethod]
        public void TestOnGet()
        {
            //

            this.Page.OnGet();

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

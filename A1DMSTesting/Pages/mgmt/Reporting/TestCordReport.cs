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

namespace T.Pages.Mgmt.Reporting
{
    [TestClass]
    public class TestCordReport
    {
        private CordReport Page;
        private ServiceHelper ServiceHelper = new ServiceHelper();

        [TestInitialize]
        public void Initialize()
        {
            var user = CommonHelper.GetRandomUser();

            var pageContext = new PageContext(options => options.SignInUser = user);

            this.Page = new CordReport(this.ServiceHelper.GetViewHelper(pageContext));
        }

        [TestMethod]
        public void TestOnGet()
        {
            //

            this.Page.OnGet();

            //

            Assert.IsTrue(this.Page.Sites != null && this.Page.Sites.Count > 0);
            Assert.IsTrue(this.Page.Companies != null && this.Page.Companies.Count > 0);
            Assert.IsTrue(this.Page.Departments != null && this.Page.Departments.Count > 0);
        }

        [TestMethod]
        public void TestOnGetData()
        {
            var sites = new List<string>();
            var companies = new List<string>();
            var departments = new List<string>();
            var from = (DateTime?)null;
            var to = (DateTime?)null;

            //

            var content1 = ((ContentResult)this.Page.OnGetData("byCompany", sites, departments, companies, from, to)).Content;
            var content2 = ((ContentResult)this.Page.OnGetData("byDepartment", sites, departments, companies, from, to)).Content;
            var content3 = ((ContentResult)this.Page.OnGetData("byENLDepartment", sites, departments, companies, from, to)).Content;

            var obj1 = JsonConvert.DeserializeObject(content1);
            var obj2 = JsonConvert.DeserializeObject(content2);
            var obj3 = JsonConvert.DeserializeObject(content3);

            //

            Assert.IsTrue(CommonHelper.IsBootstrapTableResponse(obj1, true));
            Assert.IsTrue(CommonHelper.IsBootstrapTableResponse(obj2, true));
            Assert.IsTrue(CommonHelper.IsBootstrapTableResponse(obj3, true));
        }
    }
}

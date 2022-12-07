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
    public class TestNominatedCardsReport
    {
        private NominatedCardsReport Page;
        private ServiceHelper ServiceHelper = new ServiceHelper();

        [TestInitialize]
        public void Initialize()
        {
            var user = CommonHelper.GetRandomUser();

            var pageContext = new PageContext(options => options.SignInUser = user);

            this.Page = new NominatedCardsReport(this.ServiceHelper.GetViewHelper(pageContext));
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
            var categories = new List<string>();
            var from = (DateTime?)null;
            var to = (DateTime?)null;

            //

            var content = ((ContentResult)this.Page.OnGetData(sites, departments, companies, categories, from, to)).Content;

            var obj = JsonConvert.DeserializeObject(content);

            //

            Assert.IsTrue(CommonHelper.IsBootstrapTableResponse(obj, false));
        }

        [TestMethod]
        public void TestOnGetFiltering()
        {
            var sites = new List<string>();
            var companies = new List<string>();
            var departments = new List<string>();
            var categories = new List<string>();
            var from = (DateTime?)null;
            var to = (DateTime?)null;

            //

            var content = ((ContentResult)this.Page.OnGetFiltering(sites, departments, companies, categories, from, to)).Content;

            var obj = JsonConvert.DeserializeObject(content);

            //

            Assert.IsTrue(CommonHelper.IsFilteringArray(obj));
        }
    }
}

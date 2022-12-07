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
using A1DMS.V1;

namespace T.Pages.Mgmt.Reporting
{
    [TestClass]
    public class TestGraphicsReport
    {
        private GraphicsReport Page;
        private ServiceHelper ServiceHelper = new ServiceHelper();

        [TestInitialize]
        public void Initialize()
        {
            var user = CommonHelper.GetRandomUser();

            var pageContext = new PageContext(options => options.SignInUser = user);

            this.Page = new GraphicsReport(new GraphicsViewHelper(this.ServiceHelper.GetHttpContextAccessor(pageContext),
                                                                  this.ServiceHelper.GetDbContext(),
                                                                  this.ServiceHelper.GetUserService(pageContext)));
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

            var content = ((ContentResult)this.Page.OnGetData(sites, departments, companies, from, to)).Content;

            var obj = JsonConvert.DeserializeObject(content);

            //

            Assert.IsTrue(obj is JObject);
            Assert.IsTrue(((JObject)obj).ContainsKey("base"));
            Assert.IsTrue(((JObject)obj).ContainsKey("byCompany"));
            Assert.IsTrue(((JObject)obj).ContainsKey("byDepartment"));
            Assert.IsTrue(((JObject)obj).ContainsKey("byENLDepartment"));
        }
    }
}

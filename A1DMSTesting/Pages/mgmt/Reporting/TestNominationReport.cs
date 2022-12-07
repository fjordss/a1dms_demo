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
    public class TestNominationReport
    {
        private A1DMS.Pages.NominationReport Page;
        private ServiceHelper ServiceHelper = new ServiceHelper();

        [TestInitialize]
        public void Initialize()
        {
            var user = CommonHelper.GetRandomUser(UserRole.Administrator);

            var pageContext = new PageContext(options => options.SignInUser = user);

            this.Page = new A1DMS.Pages.NominationReport(this.ServiceHelper.GetDbContext(),
                                                         this.ServiceHelper.GetViewHelper(pageContext),
                                                         this.ServiceHelper.GetUserService(pageContext));
        }

        [TestMethod]
        public void TestOnGet()
        {
            //

            this.Page.OnGet();

            //

            Assert.IsTrue(this.Page.Sites != null && this.Page.Sites.Count > 0);
        }

        [TestMethod]
        public void TestOnGetData()
        {
            var site = CommonHelper.GetRandomSite().Name;

            //

            var content = ((ContentResult)this.Page.OnGetData(site, null)).Content;

            var obj = JsonConvert.DeserializeObject(content);

            //

            Assert.IsTrue(CommonHelper.IsBootstrapTableResponse(obj, false));
            Assert.IsTrue(((JObject)obj).ContainsKey("reportId"));
            Assert.IsTrue(((JObject)obj).ContainsKey("stage"));
            Assert.IsTrue(((JObject)obj).ContainsKey("from"));
            Assert.IsTrue(((JObject)obj).ContainsKey("to"));
        }

        [TestMethod]
        public void TestOnGetFiltering()
        {
            var site = CommonHelper.GetRandomSite().Name;

            //

            var content = ((ContentResult)this.Page.OnGetFiltering(site, null)).Content;

            var obj = JsonConvert.DeserializeObject(content);

            //

            Assert.IsTrue(CommonHelper.IsFilteringArray(obj));
        }
    }
}

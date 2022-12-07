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
    public class TestCloseoutReport
    {
        private CloseoutReport Page;
        private ServiceHelper ServiceHelper = new ServiceHelper();

        [TestInitialize]
        public void Initialize()
        {
            var user = CommonHelper.GetRandomUser();

            var pageContext = new PageContext(options => options.SignInUser = user);

            this.Page = new CloseoutReport(this.ServiceHelper.GetDbContext(), this.ServiceHelper.GetViewHelper(pageContext));
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

            Assert.IsTrue(CommonHelper.IsBootstrapTableResponse(obj, false));
        }

        [TestMethod]
        public void TestOnGetFiltering()
        {
            var sites = new List<string>();
            var companies = new List<string>();
            var departments = new List<string>();
            var from = (DateTime?)null;
            var to = (DateTime?)null;

            //

            var content = ((ContentResult)this.Page.OnGetFiltering(sites, departments, companies, from, to)).Content;

            var obj = JsonConvert.DeserializeObject(content);

            //

            Assert.IsTrue(CommonHelper.IsFilteringArray(obj));
        }

        [TestMethod]
        public void TestOnGetActionItem()
        {
            var actionItem = CommonHelper.GetRandomAI();

            //

            var content = ((ContentResult)this.Page.OnGetActionItem(actionItem.Id)).Content;

            var obj = JsonConvert.DeserializeObject(content);

            //

            Assert.IsInstanceOfType(obj, typeof(JObject));
            Assert.AreEqual((int)((JObject)obj)["id"], actionItem.Id);
        }

        [TestMethod]
        public void TestOnPostSaveAI()
        {
            var db = this.ServiceHelper.GetDbContext();

            var actionItem = CommonHelper.GetRandomAI();

            var newComment = actionItem.Comments + "test";

            var data = new JObject();
            data["id"] = actionItem.Id;
            data["status"] = actionItem.Status.ToString();
            data["responsible"] = actionItem.ResponsibleId.HasValue ? actionItem.ResponsibleId.ToString() : "";
            data["otherReponsible"] = actionItem.OtherResponsible;
            data["furtherActions"] = actionItem.FurtherActions;
            data["targetDate"] = actionItem.TargetDate.HasValue ? actionItem.TargetDate.Value.ToString("yyyy-MM-dd") : "";
            data["closedById"] = actionItem.ClosedById.HasValue ? actionItem.ClosedById.ToString() : "";
            data["closeoutComments"] = newComment;
            data["closureDate"] = actionItem.ClosureDate.HasValue ? actionItem.ClosureDate.Value.ToString("yyyy-MM-dd") : "";

            //

            var content = ((ContentResult)this.Page.OnPostSaveAI(JsonConvert.SerializeObject(data))).Content;

            var newActionItem = db.ActionItems.FirstOrDefault(a => a.Id == actionItem.Id);

            //

            Assert.AreEqual(content, "success");
            Assert.AreEqual(newActionItem.Comments, newComment);
        }
    }
}

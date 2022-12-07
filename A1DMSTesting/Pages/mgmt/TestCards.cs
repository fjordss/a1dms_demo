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

namespace T.Pages.Mgmt
{
    [TestClass]
    public class TestListNGHCards
    {
        private ListNGHCards Page;
        private ServiceHelper ServiceHelper = new ServiceHelper();

        [TestInitialize]
        public void Initialize()
        {
            var user = CommonHelper.GetRandomUser();

            var pageContext = new PageContext(options => options.SignInUser = user);

            this.Page = new ListNGHCards(this.ServiceHelper.GetDbContext(), 
                                     this.ServiceHelper.GetViewHelper(pageContext), 
                                     this.ServiceHelper.GetUserService(pageContext));
        }

        [TestMethod]
        public void TestOnGet()
        {
            //

            this.Page.OnGet();

            //

            Assert.IsTrue(this.Page.Sites != null && this.Page.Sites.Count > 0 &&
                          this.Page.Companies != null && this.Page.Companies.Count > 0 &&
                          this.Page.Departments != null && this.Page.Departments.Count > 0);
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

            var result = (ContentResult)this.Page.OnGetData(sites, departments, companies, from, to);
            var content = result.Content;

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
        public void  TestOnGetCard()
        {
            var card = CommonHelper.GetRandomCard();

            //

            var content = ((ContentResult)this.Page.OnGetCard(card.Id)).Content;
            var obj = (JObject)JsonConvert.DeserializeObject(content);

            //

            Assert.IsTrue(obj != null && obj.ContainsKey("site"));
        }

        [TestMethod]
        public void TestOnGetNominationPermitted()
        {
            var card = CommonHelper.GetRandomCard();

            //

            var content = ((ContentResult)this.Page.OnGetNominationPermitted(card.Id)).Content;
            var obj = (JObject)JsonConvert.DeserializeObject(content);

            //

            Assert.IsTrue(obj != null && ((JObject)obj).ContainsKey("result") &&
                                         ((JObject)obj).ContainsKey("from") &&
                                         ((JObject)obj).ContainsKey("to"));
        }

        [TestMethod]
        public void TestOnPostSetNomination()
        {
            var card = CommonHelper.GetRandomCard();

            //

            var content = ((ContentResult)this.Page.OnPostSetNomination(card.Id, "HID")).Content;

            //

            Assert.IsTrue(content == "success");
        }
    }
}

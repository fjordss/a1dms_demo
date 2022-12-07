using System;
using System.Collections.Generic;
using System.Linq;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using Microsoft.EntityFrameworkCore;
using A1DMS;
using A1DMS.Pages;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;

namespace T.Pages.Mgmt.Sites
{
    [TestClass]
    public class TestCreateSite
    {
        private CreateSite Page;
        private ServiceHelper ServiceHelper = new ServiceHelper();

        [TestInitialize]
        public void Initialize()
        {
            this.Page = new CreateSite(this.ServiceHelper.GetDbContext());
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
        public void TestOnPostExisting()
        {
            this.Page.Site = new Site();
            this.Page.Site.Name = CommonHelper.GetRandomSite().Name;

            //

            var result = this.Page.OnPost();

            //

            Assert.IsTrue(result is PageResult && !string.IsNullOrEmpty(this.Page.Error));
        }

        [TestMethod]
        public void TestOnPost()
        {
            var siteName = "TestSite";

            this.Page.Site = new Site();
            this.Page.Site.Name = siteName;

            //

            var result = this.Page.OnPost();

            //

            if (result is RedirectToPageResult)
            {
                var db = this.ServiceHelper.GetDbContext();

                var site = db.Sites.FirstOrDefault(s => s.Name == siteName);

                db.Remove(site);
                db.SaveChanges();
            }

            Assert.IsTrue(result is RedirectToPageResult);
        }
    }
}
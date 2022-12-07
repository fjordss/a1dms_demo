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

namespace T.Pages.Mgmt.Sites
{
    [TestClass]
    public class TestEditSite
    {
        private EditSite Page;
        private ServiceHelper ServiceHelper = new ServiceHelper();

        [TestInitialize]
        public void Initialize()
        {
            this.Page = new EditSite(this.ServiceHelper.GetDbContext());
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
            var site = CommonHelper.GetRandomSite();

            //

            this.Page.OnGet(site.Id);

            //

            Assert.IsTrue(this.Page.Site != null && this.Page.Site.Id == site.Id);
        }


        [TestMethod]
        public void TestOnPost()
        {
            var db = this.ServiceHelper.GetDbContext();

            this.Page.Site = CommonHelper.GetRandomSite();

            var siteName = "TestSite";

            var oldName = this.Page.Site.Name;
            this.Page.Site.Name = siteName;

            //

            var result = this.Page.OnPost();

            var site = db.Sites.FirstOrDefault(e => e.Id == this.Page.Site.Id);

            var newName = site.Name;
            site.Name = oldName;

            db.Attach(site);
            db.SaveChanges();

            //

            Assert.IsTrue(newName == siteName);
        }
    }
}

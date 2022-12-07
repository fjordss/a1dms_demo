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
    public class TestDeleteSite
    {
        private DeleteSite Page;
        private ServiceHelper ServiceHelper = new ServiceHelper();

        [TestInitialize]
        public void Initialize()
        {
            this.Page = new DeleteSite(this.ServiceHelper.GetDbContext());
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
        public void TestOnPostEmpty()
        {
            //

            var result = this.Page.OnGet(null);

            //

            Assert.IsTrue(result is NotFoundResult);
        }

        [TestMethod]
        public void TestOnPostWithId()
        {
            var db = this.ServiceHelper.GetDbContext();

            var siteName = "testSite";

            var site = new Site();
            site.Name = siteName;

            db.Add(site);
            db.SaveChanges();

            //

            var result = this.Page.OnPost(site.Id);

            //

            Assert.IsTrue(db.Sites.FirstOrDefault(s => s.Id == site.Id) == null);
        }
    }
}

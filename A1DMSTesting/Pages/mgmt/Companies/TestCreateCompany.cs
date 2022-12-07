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

namespace T.Pages.Mgmt.Companies
{
    [TestClass]
    public class TestCreateCompany
    {
        private CreateCompany Page;
        private ServiceHelper ServiceHelper = new ServiceHelper();

        [TestInitialize]
        public void Initialize()
        {
            this.Page = new CreateCompany(this.ServiceHelper.GetDbContext());
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
            this.Page.Company = new Company();
            this.Page.Company.Name = CommonHelper.GetRandomCompany().Name;

            //

            var result = this.Page.OnPost();

            //

            Assert.IsTrue(result is PageResult && !string.IsNullOrEmpty(this.Page.Error));
        }

        [TestMethod]
        public void TestOnPost()
        {
            var companyName = "TestCompany";

            this.Page.Company = new Company();
            this.Page.Company.Name = companyName;

            //

            var result = this.Page.OnPost();

            //

            if (result is RedirectToPageResult)
            {
                var db = this.ServiceHelper.GetDbContext();

                var company = db.Companies.FirstOrDefault(s => s.Name == companyName);

                db.Remove(company);
                db.SaveChanges();
            }

            Assert.IsTrue(result is RedirectToPageResult);
        }
    }
}
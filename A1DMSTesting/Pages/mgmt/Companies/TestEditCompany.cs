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

namespace T.Pages.Mgmt.Companies
{
    [TestClass]
    public class TestEditCompany
    {
        private EditCompany Page;
        private ServiceHelper ServiceHelper = new ServiceHelper();

        [TestInitialize]
        public void Initialize()
        {
            this.Page = new EditCompany(this.ServiceHelper.GetDbContext());
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
            var company = CommonHelper.GetRandomCompany();

            //

            this.Page.OnGet(company.Id);

            //

        }


        [TestMethod]
        public void TestOnPost()
        {
            var db = this.ServiceHelper.GetDbContext();

            this.Page.Company = CommonHelper.GetRandomCompany();

            var companyName = "TestCompany";

            var oldName = this.Page.Company.Name;
            this.Page.Company.Name = companyName;

            //

            var result = this.Page.OnPost();

            var company = db.Companies.FirstOrDefault(e => e.Id == this.Page.Company.Id);

            var newName = company.Name;
            company.Name = oldName;

            db.Attach(company);
            db.SaveChanges();

            //

            Assert.IsTrue(newName == companyName);
        }
    }
}

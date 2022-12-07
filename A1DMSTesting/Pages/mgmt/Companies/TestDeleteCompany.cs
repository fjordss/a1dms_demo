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
    public class TestDeleteCompany
    {
        private DeleteCompany Page;
        private ServiceHelper ServiceHelper = new ServiceHelper();

        [TestInitialize]
        public void Initialize()
        {
            this.Page = new DeleteCompany(this.ServiceHelper.GetDbContext());
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

            Assert.IsTrue(this.Page.Company != null && this.Page.Company.Id == company.Id);
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

            var companyName = "testCompany";

            var company = new Company();
            company.Name = companyName;

            db.Add(company);
            db.SaveChanges();

            //

            var result = this.Page.OnPost(company.Id);

            //

            Assert.IsTrue(db.Companies.FirstOrDefault(s => s.Id == company.Id) == null);
        }
    }
}

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

namespace T.Pages.Mgmt.Employees
{
    [TestClass]
    public class TestDeleteEmployee
    {
        private DeleteEmployee Page;
        private ServiceHelper ServiceHelper = new ServiceHelper();

        [TestInitialize]
        public void Initialize()
        {
            this.Page = new DeleteEmployee(this.ServiceHelper.GetDbContext());
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
            var user = CommonHelper.GetRandomUser();

            //

            this.Page.OnGet(user.Id);

            //

            Assert.IsTrue(this.Page.Employee != null && this.Page.Employee.Id == user.Id);
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

            var employee = new Employee();
            employee.FirstName = "John";
            employee.LastName = "Conor";
            employee.SiteId = CommonHelper.GetRandomSite().Id;
            employee.CompanyId = CommonHelper.GetRandomCompany().Id;
            employee.DepartmentId = CommonHelper.GetRandomDepartment().Id;

            db.Add(employee);
            db.SaveChanges();

            //

            var result = this.Page.OnPost(employee.Id);

            //

            Assert.IsTrue(db.Employees.FirstOrDefault(e => e.Id == employee.Id) == null);
        }
    }
}

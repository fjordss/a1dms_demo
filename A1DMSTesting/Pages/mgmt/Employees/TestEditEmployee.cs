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
    public class TestEditEmployee
    {
        private EditEmployee Page;
        private ServiceHelper ServiceHelper = new ServiceHelper();

        [TestInitialize]
        public void Initialize()
        {
            var pageContext = new PageContext(opt => opt.SignInUser = CommonHelper.GetRandomUser());

            this.Page = new EditEmployee(this.ServiceHelper.GetDbContext(), this.ServiceHelper.GetUserService(pageContext));
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
            Assert.IsTrue(this.Page.Sites != null && this.Page.Sites.Count > 0);
            Assert.IsTrue(this.Page.Companies != null && this.Page.Companies.Count > 0);
            Assert.IsTrue(this.Page.Departments != null && this.Page.Departments.Count > 0);
        }


        [TestMethod]
        public void TestOnPost()
        {
            var db = this.ServiceHelper.GetDbContext();

            this.Page.Employee = CommonHelper.GetRandomEmployee();

            var oldName = this.Page.Employee.FirstName;
            this.Page.Employee.FirstName = "test";

            //

            var result = this.Page.OnPost();

            var employee = db.Employees.FirstOrDefault(e => e.Id == this.Page.Employee.Id);

            var newName = employee.FirstName;
            employee.FirstName = oldName;

            db.Attach(employee);
            db.SaveChanges();

            //

            Assert.IsTrue(newName == "test");
        }
    }
}

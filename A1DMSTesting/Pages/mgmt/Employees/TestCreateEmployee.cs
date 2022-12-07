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
    public class TestCreateEmployee
    {
        private CreateEmployee Page;
        private ServiceHelper ServiceHelper = new ServiceHelper();

        [TestInitialize]
        public void Initialize()
        {
            var user = CommonHelper.GetRandomUser();

            var pageContext = new PageContext(options => options.SignInUser = user);

            this.Page = new CreateEmployee(this.ServiceHelper.GetDbContext(), this.ServiceHelper.GetUserService(pageContext));
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
        public void TestOnPost()
        {
            this.Page.Employee = new Employee();
            this.Page.Employee.FirstName = "John";
            this.Page.Employee.LastName = "Conor";
            this.Page.Employee.SiteId = CommonHelper.GetRandomSite().Id;
            this.Page.Employee.CompanyId = CommonHelper.GetRandomCompany().Id;
            this.Page.Employee.DepartmentId = CommonHelper.GetRandomDepartment().Id;

            //

            var result = this.Page.OnPost();

            //

            if (result is RedirectToPageResult)
            {
                var redirect = (RedirectToPageResult)result;
                var id = int.Parse(redirect.RouteValues["id"].ToString());

                var db = this.ServiceHelper.GetDbContext();

                var employee = db.Employees.FirstOrDefault(e => e.Id == id);

                db.Remove(employee);
                db.SaveChanges();
            }

            Assert.IsTrue(result is RedirectToPageResult);
        }
    }
}

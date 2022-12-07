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

namespace T.Pages.Mgmt.Departments
{
    [TestClass]
    public class TestCreateDepartment
    {
        private CreateDepartment Page;
        private ServiceHelper ServiceHelper = new ServiceHelper();

        [TestInitialize]
        public void Initialize()
        {
            this.Page = new CreateDepartment(this.ServiceHelper.GetDbContext());
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
            this.Page.Department = new Department();
            this.Page.Department.Name = CommonHelper.GetRandomDepartment().Name;

            //

            var result = this.Page.OnPost();

            //

            Assert.IsTrue(result is PageResult && !string.IsNullOrEmpty(this.Page.Error));
        }

        [TestMethod]
        public void TestOnPost()
        {
            var deptName = "TestDepartment";

            this.Page.Department = new Department();
            this.Page.Department.Name = deptName;

            //

            var result = this.Page.OnPost();

            //

            if (result is RedirectToPageResult)
            {
                var db = this.ServiceHelper.GetDbContext();

                var dept = db.Departments.FirstOrDefault(s => s.Name == deptName);

                db.Remove(dept);
                db.SaveChanges();
            }

            Assert.IsTrue(result is RedirectToPageResult);
        }
    }
}
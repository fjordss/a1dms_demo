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

namespace T.Pages.Mgmt.Departments
{
    [TestClass]
    public class TestEditDepartment
    {
        private EditDepartment Page;
        private ServiceHelper ServiceHelper = new ServiceHelper();

        [TestInitialize]
        public void Initialize()
        {
            this.Page = new EditDepartment(this.ServiceHelper.GetDbContext());
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
            var dept = CommonHelper.GetRandomDepartment();

            //

            this.Page.OnGet(dept.Id);

            //

            Assert.IsTrue(this.Page.Department != null && this.Page.Department.Id == dept.Id);
        }


        [TestMethod]
        public void TestOnPost()
        {
            var db = this.ServiceHelper.GetDbContext();

            this.Page.Department = CommonHelper.GetRandomDepartment();

            var deptName = "TestDept";

            var oldName = this.Page.Department.Name;
            this.Page.Department.Name = deptName;

            //

            var result = this.Page.OnPost();

            var dept = db.Departments.FirstOrDefault(e => e.Id == this.Page.Department.Id);

            var newName = dept.Name;
            dept.Name = oldName;

            db.Attach(dept);
            db.SaveChanges();

            //

            Assert.IsTrue(newName == deptName);
        }
    }
}

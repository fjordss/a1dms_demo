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
    public class TestDeleteDepartment
    {
        private DeleteDepartment Page;
        private ServiceHelper ServiceHelper = new ServiceHelper();

        [TestInitialize]
        public void Initialize()
        {
            this.Page = new DeleteDepartment(this.ServiceHelper.GetDbContext());
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

            var deptName = "testDept";

            var dept = new Department();
            dept.Name = deptName;

            db.Add(dept);
            db.SaveChanges();

            //

            var result = this.Page.OnPost(dept.Id);

            //

            Assert.IsTrue(db.Departments.FirstOrDefault(s => s.Id == dept.Id) == null);
        }
    }
}

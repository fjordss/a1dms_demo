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
    public class TestDetailsDepartment
    {
        private DetailsDepartment Page;
        private ServiceHelper ServiceHelper = new ServiceHelper();

        [TestInitialize]
        public void Initialize()
        {
            this.Page = new DetailsDepartment(this.ServiceHelper.GetDbContext());
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
    }
}

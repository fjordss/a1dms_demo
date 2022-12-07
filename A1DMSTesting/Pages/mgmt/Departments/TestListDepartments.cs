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
    public class TestListDepartments
    {
        private ListDepartments Page;
        private ServiceHelper ServiceHelper = new ServiceHelper();

        [TestInitialize]
        public void Initialize()
        {
            var pageContext = new PageContext(opt => opt.SignInUser = CommonHelper.GetRandomUser());

            this.Page = new ListDepartments(this.ServiceHelper.GetViewHelper(pageContext));
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
        public void TestOnGetData()
        {
            //

            var content = ((ContentResult)this.Page.OnGetData()).Content;
            var obj = JsonConvert.DeserializeObject(content);

            //

            Assert.IsTrue(CommonHelper.IsBootstrapTableResponse(obj, true));
        }
    }
}

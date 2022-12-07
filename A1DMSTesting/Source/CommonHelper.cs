using System;
using System.Linq;
using System.Collections.Generic;
using System.Text;
using Newtonsoft.Json.Linq;
using A1DMS;
using Microsoft.EntityFrameworkCore;

namespace T
{
    static class CommonHelper
    {
        public static bool IsBootstrapTableResponse(object obj, bool clientSide)
        {
            if (clientSide)
                return obj != null && (obj is JArray);

            return obj != null && (obj is JObject) && ((JObject)obj).ContainsKey("rows") &&
                                                      ((JObject)obj).ContainsKey("total") &&
                                                      ((JObject)obj).ContainsKey("totalNotFiltered");
        }

        public static bool IsFilteringArray(object obj)
        {
            return obj != null && (obj is JArray);
        }

        public static Administrator GetRandomUser()
        {
            var db = new ServiceHelper().GetDbContext();
            var user = db.Administrators.Skip((int)(new Random().NextDouble() * db.Administrators.Count())).FirstOrDefault();
            if (user == null)
                throw new Exception("No users found in database");

            return user;
        }

        public static Administrator GetRandomUser(UserRole Role)
        {
            var db = new ServiceHelper().GetDbContext();

            var count = db.Administrators.Where(u => u.Role == Role).Count();

            var user = db.Administrators.Where(u => u.Role == Role).Skip((int)(new Random().NextDouble() * count)).FirstOrDefault();
            if (user == null)
                throw new Exception("No users found in database");

            return user;
        }

        public static NGHCard GetRandomCard()
        {
            var db = new ServiceHelper().GetDbContext();
            var card = db.NGHCards.Skip((int)(new Random().NextDouble() * db.NGHCards.Count())).FirstOrDefault();
            if (card == null)
                throw new Exception("No NGH cards found in database");

            return card;
        }

        public static ActionItem GetRandomAI()
        {
            var db = new ServiceHelper().GetDbContext();
            var actionItem = db.ActionItems.Skip((int)(new Random().NextDouble() * db.ActionItems.Count())).FirstOrDefault();
            if (actionItem == null)
                throw new Exception("No action items found in database");

            return actionItem;
        }

        public static Site GetRandomSite()
        {
            var db = new ServiceHelper().GetDbContext();
            var site = db.Sites.Skip((int)(new Random().NextDouble() * db.Sites.Count())).FirstOrDefault();
            if (site == null)
                throw new Exception("No sites found in database");

            return site;
        }

        public static Company GetRandomCompany()
        {
            var db = new ServiceHelper().GetDbContext();
            var company = db.Companies.Skip((int)(new Random().NextDouble() * db.Companies.Count())).FirstOrDefault();
            if (company == null)
                throw new Exception("No companies found in database");

            return company;
        }

        public static Department GetRandomDepartment()
        {
            var db = new ServiceHelper().GetDbContext();
            var department = db.Departments.Skip((int)(new Random().NextDouble() * db.Departments.Count())).FirstOrDefault();
            if (department == null)
                throw new Exception("No departments found in database");

            return department;
        }

        public static Employee GetRandomEmployee()
        {
            var db = new ServiceHelper().GetDbContext();
            var employee = db.Employees.Skip((int)(new Random().NextDouble() * db.Employees.Count())).FirstOrDefault();
            if (employee == null)
                throw new Exception("No employees found in database");

            return employee;
        }
    }
}

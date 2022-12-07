using System;
using System.Collections.Generic;
using System.Linq;
using System.Globalization;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;

namespace A1DMS.V2
{
    public class EmployeesViewHelper : IViewHelper<EmployeeResult>
    {
        public TableView<Employee, EmployeeResult> Table { get; private set; }

        private readonly HttpContext Context;
        private readonly Context db;
        private readonly UserService UserService;

        public EmployeesViewHelper(IHttpContextAccessor accessor, Context context, UserService userService)
        {
            this.Context = accessor.HttpContext;
            this.db = context;
            this.UserService = userService;

            this.GetTable();
        }

        private void GetTable()
        {
            this.Table = new TableView<Employee, EmployeeResult>();
            this.Table.PageSize = 30;
            this.Table.Request = this.Context.Request;

            this.Table.GetBaseQuery = this.GetBaseQuery;

            this.Table.Sort = this.Sort;
            this.Table.Filter = this.Filter;
            this.Table.Search = this.Search;
            this.Table.SearchEverywhere = this.SearchEverywhere;

            this.Table.GetFilteringValues = this.GetFilteringValues;

            this.Table.GetResult = this.GetResult;
        }

        public TableViewResponse<EmployeeResult> GetData()
        {
            this.Table.Proceed(true);

            return this.Table.Response;
        }

        public IEnumerable<FilteringItem> GetFilterings()
        {
            this.Table.Proceed(false);

            if (this.Table.GetFilteringValues != null)
                return this.Table.GetFilteringValues(this.Table.Response.Rows);

            return new List<FilteringItem>();
        }

        public IEnumerable<TotalItem> GetTotals()
        {
            throw new NotImplementedException();
        }

        public IEnumerable<EmployeeResult> Export()
        {
            this.Table.Proceed(false);

            return this.Table.Response.Rows;
        }

        private IQueryable<Employee> GetBaseQuery(List<PropertyItem> properties)
        {
            var query = this.db
                .Employees
                .OrderByDescending(s => s.Code)
                .Include(e => e.Company)
                .Include(e => e.Department)
                .Include(e => e.Site)
                .AsQueryable();

            var siteIds = this.UserService.GetSiteIds();
            if (siteIds.Count > 0)
                query = query.Where(s => siteIds.Contains(s.Site.Id));

            return query;
        }

        private IQueryable<Employee> Sort(IQueryable<Employee> query, string name, SortType sortType)
        {
            switch (name)
            {
                case "code": query = sortType == SortType.Ascending ? query.OrderBy(a => a.Code) : query.OrderByDescending(a => a.Code); break;
                case "date": query = sortType == SortType.Ascending ? query.OrderBy(a => a.Date) : query.OrderByDescending(a => a.Date); break;
                case "firstName": query = sortType == SortType.Ascending ? query.OrderBy(a => a.FirstName) : query.OrderByDescending(a => a.FirstName); break;
                case "lastName": query = sortType == SortType.Ascending ? query.OrderBy(a => a.LastName) : query.OrderByDescending(a => a.LastName); break;
                case "site": query = sortType == SortType.Ascending ? query.OrderBy(a => a.Site.Name) : query.OrderByDescending(a => a.Site.Name); break;
                case "company": query = sortType == SortType.Ascending ? query.OrderBy(a => a.Company.Name) : query.OrderByDescending(a => a.Company.Name); break;
                case "department": query = sortType == SortType.Ascending ? query.OrderBy(a => a.Department.Name) : query.OrderByDescending(a => a.Department.Name); break;
                case "PTSNumber": query = sortType == SortType.Ascending ? query.OrderBy(a => a.PTSNumber) : query.OrderByDescending(a => a.PTSNumber); break;
                case "additionalInfo": query = sortType == SortType.Ascending ? query.OrderBy(a => a.AdditionalInfo) : query.OrderByDescending(a => a.AdditionalInfo); break;
            }

            return query;
        }

        private IQueryable<Employee> Filter(IQueryable<Employee> query, string name, List<string> choices)
        {
            name = char.ToLower(name.First()) + name.Substring(1);

            var list = (List<Employee>)null;
            switch (name)
            {
                case "code": query = query.Where(e => choices.Contains(e.Code.ToString())); break;
                case "date": list = query.ToList().Where(e => choices.Contains(e.Date.ToString("MM/dd/yyyy", CultureInfo.InvariantCulture))).ToList(); break;
                case "firstName": query = query.Where(e => choices.Contains(e.FirstName)); break;
                case "lastName": query = query.Where(e => choices.Contains(e.LastName)); break;
                case "site": query = query.Where(e => choices.Contains(e.Site.Name)); break;
                case "company": query = query.Where(e => choices.Contains(e.Company.Name)); break;
                case "department": query = query.Where(e => choices.Contains(e.Department.Name)); break;
                case "PTSNumber": query = query.Where(e => choices.Contains(e.PTSNumber)); break;
                case "additionalInfo": query = query.Where(e => choices.Contains(e.AdditionalInfo)); break;
                case "inactive":
                    var boolChoices = choices.Select(c => c == "Yes");

                    query = query.Where(e => boolChoices.Contains(e.Inactive)); 
                    break;
            }

            if (list != null)
                query = list.AsQueryable();

            return query;
        }

        private IQueryable<Employee> Search(IQueryable<Employee> query, string name, string text)
        {
            var s = text.ToLower();

            switch (name)
            {
                case "code": query = query.Where(e => e.Code.ToString().ToLower().Contains(s)); break;
                case "firstName": query = query.Where(e => e.FirstName.ToLower().Contains(s)); break;
                case "lastName": query = query.Where(e => e.LastName.ToLower().Contains(s)); break;
                case "site": query = query.Where(e => e.Site.Name.ToLower().Contains(s)); break;
                case "company": query = query.Where(e => e.Company.Name.ToLower().Contains(s)); break;
                case "department": query = query.Where(e => e.Department.Name.ToLower().Contains(s)); break;
                case "PTSNumber": query = query.Where(e => e.PTSNumber.ToLower().Contains(s)); break;
                case "additionalInfo": query = query.Where(e => e.AdditionalInfo.ToLower().Contains(s)); break;
            }

            return query;
        }

        private IQueryable<Employee> SearchEverywhere(IQueryable<Employee> query, string text)
        {
            var s = text.ToLower();
            return query.Where(e => e.Code.ToString().ToLower().Contains(s) ||
                                         e.FirstName.ToLower().Contains(s) ||
                                         e.LastName.ToLower().Contains(s) ||
                                         e.Site.Name.ToLower().Contains(s) ||
                                         e.Company.Name.ToLower().Contains(s) ||
                                         e.Department.Name.ToLower().Contains(s) ||
                                         e.PTSNumber.ToLower().Contains(s) ||
                                         e.AdditionalInfo.ToLower().Contains(s));
        }

        private List<EmployeeResult> GetResult(IQueryable<Employee> query)
        {
            return query.Select(e => new EmployeeResult
            {
                Id = e.Id,
                Code = e.Code,
                Date = e.Date,
                FirstName = e.FirstName,
                LastName = e.LastName,
                SiteId = e.Site.Id,
                Site = e.Site.Name,
                Department = e.Department.Name,
                Company = e.Company.Name,
                PTSNumber = e.PTSNumber,
                AdditionalInfo = e.AdditionalInfo,
                Inactive = e.Inactive
            }).ToList();
        }

        private List<FilteringItem> GetFilteringValues(IEnumerable<EmployeeResult> collection)
        {
            var list = new List<FilteringItem>();

            list.Add(new FilteringItem() { Field = "code", Choices = collection.Select(e => e.Code).Distinct().OrderBy(e => e).ToList().ConvertAll(e => e.ToString()) });
            list.Add(new FilteringItem() { Field = "date", Choices = collection.Select(i => i.Date).OrderBy(i => i).Select(d => d.ToString("MM/dd/yyyy", CultureInfo.InvariantCulture)).Distinct().ToList() });
            list.Add(new FilteringItem() { Field = "firstName", Choices = collection.Select(e => e.FirstName != null ? e.FirstName.Trim() : "").Distinct().OrderBy(e => e) });
            list.Add(new FilteringItem() { Field = "lastName", Choices = collection.Select(e => e.LastName != null ? e.LastName.Trim() : "").Distinct().OrderBy(e => e) });
            list.Add(new FilteringItem() { Field = "company", Choices = collection.Select(e => e.Company).Distinct().OrderBy(e => e) });
            list.Add(new FilteringItem() { Field = "department", Choices = collection.Select(e => e.Department).Distinct().OrderBy(e => e) });
            list.Add(new FilteringItem() { Field = "site", Choices = collection.Select(e => e.Site).Distinct().OrderBy(e => e).ToList() });
            list.Add(new FilteringItem() { Field = "PTSNumber", Choices = collection.Select(e => e.PTSNumber != null ? e.PTSNumber : "").Distinct().OrderBy(e => e) });
            list.Add(new FilteringItem() { Field = "additionalInfo", Choices = collection.Select(e => e.AdditionalInfo != null ? e.AdditionalInfo : "").Distinct().OrderBy(e => e) });
            list.Add(new FilteringItem() { Field = "inactive", Choices = collection.Select(e => e.Inactive ? "Yes" : "No").Distinct().OrderBy(e => e) });

            return list;
        }
    }

    public class EmployeeResult
    {
        public int Id { get; set; }
        public int Code { get; set; }
        public DateTime Date { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public int SiteId { get; set; }
        public string Site { get; set; }
        public string Department { get; set; }
        public string Company { get; set; }
        public string PTSNumber { get; set; }
        public string AdditionalInfo { get; set; }
        public bool Inactive { get; set; }
    }
}

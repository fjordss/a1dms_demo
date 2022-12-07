using System;
using System.Collections.Generic;
using System.Linq;
using System.Globalization;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;

namespace A1DMS.V1
{
    public class EmployeesViewHelper : IViewHelper<EmployeeResult>
    {
        public TableView Table { get; set; }

        private readonly HttpContext Context;
        private readonly Context db;
        private readonly UserService UserService;

        public EmployeesViewHelper(IHttpContextAccessor accessor, Context context, UserService userService)
        {
            this.Context = accessor.HttpContext;
            this.db = context;
            this.UserService = userService;

            this.Table = this.GetTable();
        }

        private TableView<Employee, EmployeeResult> GetTable()
        {
            var table = new TableView<Employee, EmployeeResult>();
            table.ServerSide = true;
            table.PageSize = 30;
            table.Request = this.Context.Request;
            table.GetBaseQuery = this.GetBaseQuery;

            table.Sort = this.Sort;
            table.Filter = this.Filter;
            table.Search = this.Search;

            table.GetFilteringValues = this.GetFilteringValues;
            table.GetApiFilteringValues = this.GetApiFilteringValues;

            table.GetResult = this.GetResult;

            return table;
        }

        public TableViewResponse<EmployeeResult> GetData()
        {
            this.Table.Proceed(true);

            return ((TableView<Employee, EmployeeResult>)this.Table).ApiResponse;
        }

        public IEnumerable<FilteringItem> GetFilterings()
        {
            if (this.Table.GetFilteringValues != null)
                return this.Table.GetApiFilteringValues(this.Table.Properties);

            return new List<FilteringItem>();
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
            name = char.ToLower(name.First()) + name.Substring(1);

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
            }

            if (list != null)
                query = list.AsQueryable();

            return query;
        }

        private IQueryable<Employee> Search(IQueryable<Employee> query, string searchString)
        {
            var s = searchString.ToLower();
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
                Site = e.Site.Name,
                Department = e.Department.Name,
                Company = e.Company.Name,
                PTSNumber = e.PTSNumber,
                AdditionalInfo = e.AdditionalInfo,
                Inactive = e.Inactive
            }).ToList();
        }

        private List<FilteringItem> GetFilteringValues(List<PropertyItem> properties)
        {
            var list = new List<FilteringItem>();

            list.Add(new FilteringItem() { Field = "Code", Choices = this.GetBaseQuery(properties).Select(e => e.Code).Distinct().OrderBy(e => e).ToList().Cast<object>().ToList() });
            list.Add(new FilteringItem() { Field = "Date", Choices = this.GetBaseQuery(properties).Select(i => i.Date).OrderBy(i => i).Select(d => d.ToString("MM/dd/yyyy", CultureInfo.InvariantCulture)).Distinct().Cast<object>().ToList() });
            list.Add(new FilteringItem() { Field = "FirstName", Choices = this.GetBaseQuery(properties).Select(e => e.FirstName.Trim()).Distinct().OrderBy(e => e).ToList().Cast<object>().ToList() });
            list.Add(new FilteringItem() { Field = "LastName", Choices = this.GetBaseQuery(properties).Select(e => e.LastName.Trim()).Distinct().OrderBy(e => e).ToList().Cast<object>().ToList() });
            list.Add(new FilteringItem() { Field = "Company", Choices = this.GetBaseQuery(properties).Select(e => e.Company.Name).Distinct().OrderBy(e => e).ToList().Cast<object>().ToList() });
            list.Add(new FilteringItem() { Field = "Department", Choices = this.GetBaseQuery(properties).Select(e => e.Department.Name).Distinct().OrderBy(e => e).ToList().Cast<object>().ToList() });
            list.Add(new FilteringItem() { Field = "Site", Choices = this.GetBaseQuery(properties).Select(e => e.Site.Name).Distinct().OrderBy(e => e).ToList().Cast<object>().ToList() });
            list.Add(new FilteringItem() { Field = "PTSNumber", Choices = this.GetBaseQuery(properties).Select(e => e.PTSNumber != null ? e.PTSNumber : "").Distinct().OrderBy(e => e).ToList().Cast<object>().ToList() });
            list.Add(new FilteringItem() { Field = "AdditionalInfo", Choices = this.GetBaseQuery(properties).Select(e => e.AdditionalInfo != null ? e.AdditionalInfo : "").Distinct().OrderBy(e => e).ToList().Cast<object>().ToList() });

            return list;
        }

        private List<FilteringItem> GetApiFilteringValues(List<PropertyItem> properties)
        {
            var list = new List<FilteringItem>();

            list.Add(new FilteringItem() { Name = "code", Choices = this.GetBaseQuery(properties).Select(e => e.Code).Distinct().OrderBy(e => e).ToList().Cast<object>().ToList() });
            list.Add(new FilteringItem() { Name = "date", Choices = this.GetBaseQuery(properties).Select(i => i.Date).OrderBy(i => i).Select(d => d.ToString("MM/dd/yyyy", CultureInfo.InvariantCulture)).Distinct().Cast<object>().ToList() });
            list.Add(new FilteringItem() { Name = "firstName", Choices = this.GetBaseQuery(properties).Select(e => e.FirstName.Trim()).Distinct().OrderBy(e => e).ToList().Cast<object>().ToList() });
            list.Add(new FilteringItem() { Name = "lastName", Choices = this.GetBaseQuery(properties).Select(e => e.LastName.Trim()).Distinct().OrderBy(e => e).ToList().Cast<object>().ToList() });
            list.Add(new FilteringItem() { Name = "company", Choices = this.GetBaseQuery(properties).Select(e => e.Company.Name).Distinct().OrderBy(e => e).ToList().Cast<object>().ToList() });
            list.Add(new FilteringItem() { Name = "department", Choices = this.GetBaseQuery(properties).Select(e => e.Department.Name).Distinct().OrderBy(e => e).ToList().Cast<object>().ToList() });
            list.Add(new FilteringItem() { Name = "site", Choices = this.GetBaseQuery(properties).Select(e => e.Site.Name).Distinct().OrderBy(e => e).ToList().Cast<object>().ToList() });
            list.Add(new FilteringItem() { Name = "PTSNumber", Choices = this.GetBaseQuery(properties).Select(e => e.PTSNumber != null ? e.PTSNumber : "").Distinct().OrderBy(e => e).ToList().Cast<object>().ToList() });
            list.Add(new FilteringItem() { Name = "additionalInfo", Choices = this.GetBaseQuery(properties).Select(e => e.AdditionalInfo != null ? e.AdditionalInfo : "").Distinct().OrderBy(e => e).ToList().Cast<object>().ToList() });

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
        public string Site { get; set; }
        public string Department { get; set; }
        public string Company { get; set; }
        public string PTSNumber { get; set; }
        public string AdditionalInfo { get; set; }
        public bool Inactive { get; set; }
    }
}

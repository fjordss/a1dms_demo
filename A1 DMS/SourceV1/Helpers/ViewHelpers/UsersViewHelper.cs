using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection;
using System.Globalization;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;

namespace A1DMS.V1
{
    public class TableViewResponse<T>
    {
        public int Total { get; set; }
        public IEnumerable<T> Rows { get; set; }
        public IEnumerable<TotalItem> Totals { get; set; }
    }

    public class UsersViewHelper : IViewHelper<UserResult>
    {
        public TableView Table { get; set; }

        private readonly HttpContext Context;
        private readonly Context db;

        private List<Site> Sites;

        public UsersViewHelper(IHttpContextAccessor accessor, Context context)
        {
            this.Context = accessor.HttpContext;
            this.db = context;
            this.Table = this.GetTable();

            this.Sites = this.db.Sites.ToList();
        }

        private TableView<Administrator, UserResult> GetTable()
        {
            var table = new TableView<Administrator, UserResult>();
            table.PageSize = 30;
            table.Request = this.Context.Request;
            table.ServerSide = true;

            table.GetBaseQuery = this.GetBaseQuery;
            table.Sort = this.Sort;
            table.Filter = this.Filter;
            table.Search = this.Search;

            table.GetResult = this.GetResult;

            table.GetFilteringValues = this.GetFilteringValues;
            table.GetApiFilteringValues = this.GetApiFilteringValues;

            return table;
        }

        public TableViewResponse<UserResult> GetData()
        {
            this.Table.Proceed(true);

            return ((TableView<Administrator, UserResult>)this.Table).ApiResponse;
        }

        public IEnumerable<FilteringItem> GetFilterings()
        {
            if (this.Table.GetFilteringValues != null)
                return this.Table.GetApiFilteringValues(this.Table.Properties);

            return new List<FilteringItem>();
        }

        private IQueryable<Administrator> GetBaseQuery(PropertyItemCollection properties)
        {
            return this.db.Administrators
                            .Include(a => a.Company)
                            .Include(a => a.CreatedBy)
                            .Where(a => !a.Hidden)
                            .OrderBy(a => a.Name);
        }

        private IQueryable<Administrator> Sort(IQueryable<Administrator> query, string name, SortType sortType)
        {
            name = char.ToLower(name.First()) + name.Substring(1);

            switch (name)
            {
                case "name": query = sortType == SortType.Ascending ? query.OrderBy(a => a.Name) : query.OrderByDescending(a => a.Name); break;
                case "logonName": query = sortType == SortType.Ascending ? query.OrderBy(a => a.LogonName) : query.OrderByDescending(a => a.LogonName); break;
                case "company": query = sortType == SortType.Ascending ? query.OrderBy(a => a.Company.Name) : query.OrderByDescending(a => a.Company.Name); break;
                case "eMail": query = sortType == SortType.Ascending ? query.OrderBy(a => a.EMail) : query.OrderByDescending(a => a.EMail); break;
                case "createdBy": query = sortType == SortType.Ascending ? query.OrderBy(a => a.CreatedBy.Name) : query.OrderByDescending(a => a.CreatedBy.Name); break;
            }

            return query;
        }

        private IQueryable<Administrator> Filter(IQueryable<Administrator> query, string name, List<string> choices)
        {
            name = char.ToLower(name.First()) + name.Substring(1);

            switch (name)
            {
                case "mame": query = query.Where(e => choices.Contains(e.Name)); break;
                case "logonName": query = query.Where(e => choices.Contains(e.LogonName)); break;
                case "company": query = query.Where(e => choices.Contains(e.Company != null ? e.Company.Name : "")); break;
                case "eMail": query = query.Where(e => choices.Contains(e.EMail != null ? e.EMail : "")); break;
                case "role":
                    var Roles = choices.Select(c => (int)CommonHelper.GetEnumByDisplayName<UserRole>(c)).Aggregate((a, b) => a | b);
                    query = query.ToList().Where(e => ((int)e.Role & Roles) > 0).AsQueryable();
                    break;
                case "sites":
                    var SiteIds = choices.Select(c => this.Sites.Find(s => s.Name == c).Id);
                    query = query.ToList().Where(a => a.SiteIds != null && a.SiteIds.Any(i => SiteIds.Contains(i))).AsQueryable();
                    break;
                case "createdBy": query = query.Where(e => choices.Contains(e.CreatedBy.Name)); break;
            }

            return query;
        }

        private IQueryable<Administrator> Search(IQueryable<Administrator> query, string searchString)
        {
            var s = searchString.ToLower();
            return query.Where(e => e.Name.ToLower().Contains(s) ||
                                    e.LogonName.ToLower().Contains(s) ||
                                    e.Company.Name.ToLower().Contains(s) ||
                                    e.EMail.ToLower().Contains(s) ||
                                    e.CreatedBy.Name.ToLower().Contains(s));
        }

        private List<UserResult> GetResult(IQueryable<Administrator> query)
        {
            return query.ToList().Select(a => new UserResult()
            {
                Id = a.Id,
                Name = a.Name,
                LogonName = a.LogonName,
                EMail = a.EMail,
                Company = a.Company.Name,
                Role = CommonHelper.GetRoles(a.Role),
                Sites = a.SiteIds != null ? string.Join(", ", a.SiteIds.Select(id => this.Sites.Find(s => s.Id == id).Name).OrderBy(s => s)) : "",
                CreatedBy = a.CreatedBy.Name,
                Activated = a.Password != null
            }).ToList();
        }

        private List<FilteringItem> GetFilteringValues(PropertyItemCollection properties)
        {
            var Collection = this.GetBaseQuery(properties).ToList();

            var Roles = typeof(UserRole).GetFields(BindingFlags.Public | BindingFlags.Static).Select(f => CommonHelper.GetEnumDisplayName(Enum.Parse<UserRole>(f.Name)));

            var List = new List<FilteringItem>();

            List.Add(new FilteringItem() { Field = "Name", Choices = Collection.Select(i => i.Name != null ? i.Name : "").Distinct().OrderBy(i => i).Select(i => i.ToString()).Cast<object>().ToList() });
            List.Add(new FilteringItem() { Field = "LogonName", Choices = Collection.Select(i => i.LogonName).Distinct().OrderBy(i => i).Select(i => i.ToString()).Cast<object>().ToList() });
            List.Add(new FilteringItem() { Field = "EMail", Choices = Collection.Select(i => i.EMail != null ? i.EMail : "").Distinct().OrderBy(i => i).Select(i => i.ToString()).Cast<object>().ToList() });
            List.Add(new FilteringItem() { Field = "Company", Choices = Collection.Select(i => i.Company != null ? i.Company.Name : "").Distinct().OrderBy(i => i).Select(i => i.ToString()).Cast<object>().ToList() });
            List.Add(new FilteringItem() { Field = "Role", Choices = Roles.Cast<object>().ToList() });
            List.Add(new FilteringItem() { Field = "Sites", Choices = this.Sites.Select(s => s.Name).OrderBy(i => i).Cast<object>().ToList() });
            List.Add(new FilteringItem() { Field = "CreatedBy", Choices = Collection.Select(a => a.CreatedBy.Name).Distinct().OrderBy(i => i).Select(i => i.ToString()).Cast<object>().ToList() });

            return List;
        }

        private List<FilteringItem> GetApiFilteringValues(PropertyItemCollection properties)
        {
            var Collection = this.GetBaseQuery(properties).ToList();

            var Roles = typeof(UserRole).GetFields(BindingFlags.Public | BindingFlags.Static).Select(f => CommonHelper.GetEnumDisplayName(Enum.Parse<UserRole>(f.Name)));

            var List = new List<FilteringItem>();

            List.Add(new FilteringItem() { Name = "name", Choices = Collection.Select(i => i.Name != null ? i.Name : "").Distinct().OrderBy(i => i).Select(i => i.ToString()).Cast<object>().ToList() });
            List.Add(new FilteringItem() { Name = "logonName", Choices = Collection.Select(i => i.LogonName).Distinct().OrderBy(i => i).Select(i => i.ToString()).Cast<object>().ToList() });
            List.Add(new FilteringItem() { Name = "eMail", Choices = Collection.Select(i => i.EMail != null ? i.EMail : "").Distinct().OrderBy(i => i).Select(i => i.ToString()).Cast<object>().ToList() });
            List.Add(new FilteringItem() { Name = "company", Choices = Collection.Select(i => i.Company != null ? i.Company.Name : "").Distinct().OrderBy(i => i).Select(i => i.ToString()).Cast<object>().ToList() });
            List.Add(new FilteringItem() { Name = "role", Choices = Roles.Cast<object>().ToList() });
            List.Add(new FilteringItem() { Name = "sites", Choices = this.Sites.Select(s => s.Name).OrderBy(i => i).Cast<object>().ToList() });
            List.Add(new FilteringItem() { Name = "createdBy", Choices = Collection.Select(a => a.CreatedBy.Name).Distinct().OrderBy(i => i).Select(i => i.ToString()).Cast<object>().ToList() });

            return List;
        }
    }

    public class UserResult
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string LogonName { get; set; }
        public string Role { get; set; }
        public string Company { get; set; }
        public string EMail { get; set; }
        public string Sites { get; set; }
        public string CreatedBy { get; set; }
        public bool Activated { get; set; }
    }
}

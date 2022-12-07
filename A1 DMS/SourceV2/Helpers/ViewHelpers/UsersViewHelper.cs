using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection;
using System.Globalization;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;

namespace A1DMS.V2
{
    public class UsersViewHelper : IViewHelper<UserResult>
    {
        public TableView<Administrator, UserResult> Table { get; private set; }

        private readonly HttpContext Context;
        private readonly Context db;

        private List<Site> Sites;

        public UsersViewHelper(IHttpContextAccessor accessor, Context context)
        {
            this.Context = accessor.HttpContext;
            this.db = context;
            
            this.GetTable();

            this.Sites = this.db.Sites.ToList();
        }

        public TableViewResponse<UserResult> GetData()
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

        public IEnumerable<UserResult> Export()
        {
            this.Table.Proceed(false);

            return this.Table.Response.Rows;
        }

        private void GetTable()
        {
            this.Table = new TableView<Administrator, UserResult>();
            this.Table.PageSize = 30;
            this.Table.Request = this.Context.Request;

            this.Table.GetBaseQuery = this.GetBaseQuery;
            this.Table.Sort = this.Sort;
            this.Table.Filter = this.Filter;
            this.Table.Search = this.Search;
            this.Table.SearchEverywhere = this.SearchEverywhere;

            this.Table.GetResult = this.GetResult;

            this.Table.GetFilteringValues = this.GetFilteringValues;
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

        private IQueryable<Administrator> Search(IQueryable<Administrator> query, string name, string text)
        {
            var s = text.ToLower();
            switch (name)
            {
                case "name": query = query.Where(e => e.Name.ToLower().Contains(s)); break;
                case "logonName": query = query.Where(e => e.LogonName.ToLower().Contains(s)); break;
                case "company": query = query.Where(e => e.Company.Name.ToLower().Contains(s)); break;
                case "eMail": query = query.Where(e => e.EMail.ToLower().Contains(s)); break;
                case "createdBy": query = query.Where(e => e.CreatedBy.Name.ToLower().Contains(s)); break;
            }

            return query;
        }

        private IQueryable<Administrator> SearchEverywhere(IQueryable<Administrator> query, string searchString)
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

        private List<FilteringItem> GetFilteringValues(IEnumerable<UserResult> collection)
        {
            var roles = typeof(UserRole).GetFields(BindingFlags.Public | BindingFlags.Static).Select(f => CommonHelper.GetEnumDisplayName(Enum.Parse<UserRole>(f.Name)));

            var list = new List<FilteringItem>();

            list.Add(new FilteringItem() { Field = "name", Choices = collection.Select(i => i.Name != null ? i.Name : "").Distinct().OrderBy(i => i).Select(i => i.ToString()) });
            list.Add(new FilteringItem() { Field = "logonName", Choices = collection.Select(i => i.LogonName).Distinct().OrderBy(i => i).Select(i => i.ToString()) });
            list.Add(new FilteringItem() { Field = "eMail", Choices = collection.Select(i => i.EMail != null ? i.EMail : "").Distinct().OrderBy(i => i).Select(i => i.ToString()) });
            list.Add(new FilteringItem() { Field = "company", Choices = collection.Select(i => i.Company != null ? i.Company : "").Distinct().OrderBy(i => i).Select(i => i.ToString()) });
            list.Add(new FilteringItem() { Field = "role", Choices = roles });
            list.Add(new FilteringItem() { Field = "sites", Choices = this.Sites.Select(s => s.Name).OrderBy(i => i) });
            list.Add(new FilteringItem() { Field = "createdBy", Choices = collection.Select(a => a.CreatedBy).Distinct().OrderBy(i => i).Select(i => i.ToString()) });

            return list;
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

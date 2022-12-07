using System;
using System.Collections.Generic;
using System.Linq;
using System.Globalization;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;

namespace A1DMS.V2
{
    public class DepartmentsViewHelper : IViewHelper<Department>
    {
        public TableView<Department, Department> Table { get; set; }

        private readonly HttpContext Context;
        private readonly Context db;

        public DepartmentsViewHelper(IHttpContextAccessor accessor, Context context)
        {
            this.Context = accessor.HttpContext;
            this.db = context;

            this.GetTable();
        }

        public TableViewResponse<Department> GetData()
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

        public IEnumerable<Department> Export()
        {
            this.Table.Proceed(false);

            return this.Table.Response.Rows;
        }

        private void GetTable()
        {
            this.Table = new TableView<Department, Department>();
            this.Table.Request = this.Context.Request;
            this.Table.PageSize = 30;

            this.Table.GetBaseQuery = this.GetBaseQuery;
            this.Table.Sort = this.Sort;
            this.Table.Filter = this.Filter;
            this.Table.Search = this.Search;
            this.Table.SearchEverywhere = this.SearchEverywhere;

            this.Table.GetFilteringValues = this.GetFilteringValues;

            this.Table.GetResult = this.GetResult;
        }

        private IQueryable<Department> GetBaseQuery(PropertyItemCollection properties)
        {
            return this.db.Departments.OrderBy(a => a.Name);
        }

        private IQueryable<Department> Sort(IQueryable<Department> query, string name, SortType sortType)
        {
            switch (name)
            {
                case "name": query = sortType == SortType.Ascending ? query.OrderBy(a => a.Name) : query.OrderByDescending(a => a.Name); break;
            }

            return query;
        }

        private IQueryable<Department> Filter(IQueryable<Department> query, string name, List<string> choices)
        {
            switch (name)
            {
                case "name": query = query.Where(e => choices.Contains(e.Name)); break;
                case "inactive":
                    var boolChoices = choices.Select(c => c == "Yes");

                    query = query.Where(e => boolChoices.Contains(e.Inactive));
                    break;
            }

            return query;
        }

        private IQueryable<Department> Search(IQueryable<Department> query, string name, string text)
        {
            var s = text.ToLower();
            switch (name)
            {
                case "name": query = query.Where(e => e.Name.ToLower().Contains(s)); break;
            }

            return query;
        }

        private IQueryable<Department> SearchEverywhere(IQueryable<Department> query, string text)
        {
            var s = text.ToLower();

            return query.Where(e => e.Name.ToLower().Contains(s));
        }

        private List<Department> GetResult(IQueryable<Department> query)
        {
            return query.ToList();
        }

        private List<FilteringItem> GetFilteringValues(IEnumerable<Department> collection)
        {
            var list = new List<FilteringItem>();

            list.Add(new FilteringItem() { Field = "name", Choices = collection.Select(i => i.Name).Distinct().OrderBy(i => i) });
            list.Add(new FilteringItem() { Field = "inactive", Choices = collection.Select(e => e.Inactive ? "Yes" : "No").Distinct().OrderBy(e => e) });

            return list;
        }
    }
}

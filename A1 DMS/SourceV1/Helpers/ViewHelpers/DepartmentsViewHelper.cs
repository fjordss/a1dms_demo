using System;
using System.Collections.Generic;
using System.Linq;
using System.Globalization;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;

namespace A1DMS.V1
{
    public class DepartmentsViewHelper : IViewHelper<Department>
    {
        public TableView Table { get; set; }

        private readonly HttpContext Context;
        private readonly Context db;

        public DepartmentsViewHelper(IHttpContextAccessor accessor, Context context)
        {
            this.Context = accessor.HttpContext;
            this.db = context;
            this.Table = this.GetTable();
        }

        private TableView<Department, Department> GetTable()
        {
            var table = new TableView<Department, Department>();
            table.Request = this.Context.Request;
            table.PageSize = 30;

            table.GetBaseQuery = this.GetBaseQuery;
            table.Sort = this.Sort;
            table.Filter = this.Filter;

            table.GetResult = this.GetResult;

            return table;
        }

        private IQueryable<Department> GetBaseQuery(PropertyItemCollection properties)
        {
            return this.db.Departments.OrderBy(a => a.Name);
        }

        private IQueryable<Department> Sort(IQueryable<Department> query, string name, SortType sortType)
        {
            switch (name)
            {
                case "Name": query = sortType == SortType.Ascending ? query.OrderBy(a => a.Name) : query.OrderByDescending(a => a.Name); break;
            }

            return query;
        }

        private IQueryable<Department> Filter(IQueryable<Department> query, string name, List<string> choices)
        {
            switch (name)
            {
                case "Name": query = query.Where(e => choices.Contains(e.Name)); break;
            }

            return query;
        }

        private List<Department> GetResult(IQueryable<Department> query)
        {
            return query.ToList();
        }

        public TableViewResponse<Department> GetData()
        {
            throw new NotImplementedException();
        }

        public IEnumerable<FilteringItem> GetFilterings()
        {
            if (this.Table.GetFilteringValues != null)
                return this.Table.GetFilteringValues(this.Table.Properties);

            return new List<FilteringItem>();
        }
    }
}

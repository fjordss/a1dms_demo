using System;
using System.Collections.Generic;
using System.Linq;
using System.Globalization;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;

namespace A1DMS.V1
{
    public class CompaniesViewHelper : IViewHelper<Company>
    {
        public TableView Table { get; set; }

        private readonly HttpContext Context;
        private readonly Context db;

        public CompaniesViewHelper(IHttpContextAccessor accessor, Context context)
        {
            this.Context = accessor.HttpContext;
            this.db = context;
            this.Table = this.GetTable();
        }

        private TableView<Company, Company> GetTable()
        {
            var table = new TableView<Company, Company>();
            table.PageSize = 30;
            table.Request = this.Context.Request;

            table.GetBaseQuery = this.GetBaseQuery;
            table.Sort = this.Sort;
            table.Filter = this.Filter;

            table.GetResult = this.GetResult;

            return table;
        }

        private IQueryable<Company> GetBaseQuery(PropertyItemCollection properties)
        {
            return this.db.Companies.OrderBy(a => a.Name);
        }

        private IQueryable<Company> Sort(IQueryable<Company> query, string name, SortType sortType)
        {
            switch (name)
            {
                case "Name": query = sortType == SortType.Ascending ? query.OrderBy(a => a.Name) : query.OrderByDescending(a => a.Name); break;
            }

            return query;
        }

        private IQueryable<Company> Filter(IQueryable<Company> query, string name, List<string> choices)
        {
            switch (name)
            {
                case "Name": query = query.Where(e => choices.Contains(e.Name)); break;
            }

            return query;
        }

        private List<Company> GetResult(IQueryable<Company> query)
        {
            return query.ToList();
        }

        public TableViewResponse<Company> GetData()
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

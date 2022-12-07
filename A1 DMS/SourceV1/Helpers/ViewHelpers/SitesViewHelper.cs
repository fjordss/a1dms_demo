using System;
using System.Collections.Generic;
using System.Linq;
using System.Globalization;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;

namespace A1DMS.V1
{
    public class SitesViewHelper : IViewHelper<Site>
    {
        public TableView Table { get; set; }

        private readonly HttpContext Context;
        private readonly Context db;

        public SitesViewHelper(IHttpContextAccessor accessor, Context context)
        {
            this.Context = accessor.HttpContext;
            this.db = context;
            this.Table = this.GetTable();
        }

        private TableView<Site, Site> GetTable()
        {
            var table = new TableView<Site, Site>();
            table.PageSize = 30;
            table.Request = this.Context.Request;

            table.GetBaseQuery = this.GetBaseQuery;
            table.Sort = this.Sort;
            table.Filter = this.Filter;

            table.GetResult = this.GetResult;

            return table;
        }

        private IQueryable<Site> GetBaseQuery(PropertyItemCollection properties)
        {
            return this.db.Sites.OrderBy(a => a.Name);
        }

        private IQueryable<Site> Sort(IQueryable<Site> query, string name, SortType sortType)
        {
            switch (name)
            {
                case "Name": query = sortType == SortType.Ascending ? query.OrderBy(a => a.Name) : query.OrderByDescending(a => a.Name); break;
            }

            return query;
        }

        private IQueryable<Site> Filter(IQueryable<Site> query, string name, List<string> choices)
        {
            switch (name)
            {
                case "Name": query = query.Where(e => choices.Contains(e.Name)); break;
            }

            return query;
        }

        private List<Site> GetResult(IQueryable<Site> query)
        {
            return query.ToList();
        }

        public TableViewResponse<Site> GetData()
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

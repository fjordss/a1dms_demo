using System;
using System.Collections.Generic;
using System.Linq;
using System.Globalization;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using Spire.Xls;

namespace A1DMS.V2
{
    public class SitesViewHelper : IViewHelper<Site>
    {
        public TableView<Site, Site> Table { get; set; }

        private readonly HttpContext Context;
        private readonly Context db;

        public SitesViewHelper(IHttpContextAccessor accessor, Context context)
        {
            this.Context = accessor.HttpContext;
            this.db = context;
            
            this.GetTable();
        }

        public TableViewResponse<Site> GetData()
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

        public IEnumerable<Site> Export()
        {
            this.Table.Proceed(false);

            return this.Table.Response.Rows;
        }

        private void GetTable()
        {
            this.Table = new TableView<Site, Site>();
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

        private IQueryable<Site> GetBaseQuery(PropertyItemCollection properties)
        {
            return this.db.Sites.OrderBy(a => a.Name);
        }

        private IQueryable<Site> Sort(IQueryable<Site> query, string name, SortType sortType)
        {
            switch (name)
            {
                case "name": query = sortType == SortType.Ascending ? query.OrderBy(a => a.Name) : query.OrderByDescending(a => a.Name); break;
            }

            return query;
        }

        private IQueryable<Site> Filter(IQueryable<Site> query, string name, List<string> choices)
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

        private IQueryable<Site> Search(IQueryable<Site> query, string name, string text)
        {
            var s = text.ToLower();
            switch (name)
            {
                case "name": query = query.Where(e => e.Name.ToLower().Contains(s)); break;
            }

            return query;
        }

        private IQueryable<Site> SearchEverywhere(IQueryable<Site> query, string text)
        {
            var s = text.ToLower();

            return query.Where(e => e.Name.ToLower().Contains(s));
        }

        private List<Site> GetResult(IQueryable<Site> query)
        {
            return query.ToList();
        }

        private List<FilteringItem> GetFilteringValues(IEnumerable<Site> collection)
        {
            var list = new List<FilteringItem>();

            list.Add(new FilteringItem() { Field = "name", Choices = collection.Select(i => i.Name).Distinct().OrderBy(i => i) });
            list.Add(new FilteringItem() { Field = "inactive", Choices = collection.Select(e => e.Inactive ? "Yes" : "No").Distinct().OrderBy(e => e) });

            return list;
        }
    }
}

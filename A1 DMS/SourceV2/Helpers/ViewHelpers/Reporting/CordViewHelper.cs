using System;
using System.Collections.Generic;
using System.Linq;
using System.Text.RegularExpressions;
using System.Reflection;
using System.Globalization;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Mvc;

namespace A1DMS.V2
{
    public class CordViewHelper : IViewHelper<CordReportItem>
    {
        public TableView<CordReportItem, CordReportItem> Table { get; set; }

        private readonly HttpContext context;
        private readonly Context db;
        private readonly UserService userService;

        private List<Site> Sites;

        public CordViewHelper(IHttpContextAccessor accessor, Context context, UserService userService)
        {
            this.context = accessor.HttpContext;
            this.db = context;
            this.userService = userService;

            this.GetTable();
        }

        public TableViewResponse<CordReportItem> GetData()
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
            this.Table.Proceed(false);

            if (this.Table.GetTotals != null)
                return this.Table.GetTotals(this.Table.Response.Rows);

            return new List<TotalItem>();
        }

        public IEnumerable<CordReportItem> Export()
        {
            throw new NotImplementedException();
        }

        public void ParseProperties(string type, List<string> sites, List<string> companies, List<string> departments, DateTime? from, DateTime? to)
        {
            if (this.Sites == null)
                this.Sites = this.db.Sites.ToList();

            var siteNames = this.userService.GetSiteIds().Select(id => this.Sites.Find(s => s.Id == id).Name).ToList();

            if (sites != null && sites.Count > 0)
                this.Table.Properties.SetValue("Sites", sites);
            else if (siteNames.Count > 0)
                this.Table.Properties.SetValue("Sites", siteNames);

            if (companies != null && companies.Count > 0)
                this.Table.Properties.SetValue("Companies", companies);

            if (departments != null && departments.Count > 0)
                this.Table.Properties.SetValue("Departments", departments);

            if (from.HasValue)
                this.Table.Properties.SetValue("From", from.Value);

            if (to.HasValue)
                this.Table.Properties.SetValue("To", to.Value.AddDays(1).AddSeconds(-1));

            this.Table.Properties.SetValue("Type", type);
        }

        private void GetTable()
        {
            this.Table = new TableView<CordReportItem, CordReportItem>();
            this.Table.PageSize = 1000;
            this.Table.Request = this.context.Request;

            this.Table.GetBaseQuery = this.GetBaseQuery;

            this.Table.Sort = this.Sort;
            this.Table.Filter = this.Filter;
            this.Table.Search = this.Search;
            this.Table.SearchEverywhere = this.SearchEverywhere;

            this.Table.GetResult = this.GetResult;

            this.Table.GetFilteringValues = this.GetFilteringValues;
            this.Table.GetTotals = this.GetTotals;
        }

        private IQueryable<CordReportItem> GetBaseQuery(PropertyItemCollection properties)
        {
            var type = properties.GetValue<string>("Type");

            var query = this.db.NGHCards.AsQueryable();

            if (properties.ContainsKey("Sites"))
                query = query.Where(a => properties.GetValue<List<string>>("Sites").Contains(a.Site));

            if (properties.ContainsKey("Companies"))
                query = query.Where(a => properties.GetValue<List<string>>("Companies").Contains(a.Company));

            if (properties.ContainsKey("Departments"))
                query = query.Where(a => properties.GetValue<List<string>>("Departments").Contains(a.Department));

            if (properties.ContainsKey("From"))
                query = query.Where(a => a.Date >= properties.GetValue<DateTime>("From"));

            if (properties.ContainsKey("To"))
                query = query.Where(a => a.Date <= properties.GetValue<DateTime>("To"));

            if (type == "byENLDepartment")
                query = query.Where(c => c.Company == "ENL");

            var Grouping = type == "byCompany" ? query.GroupBy(c => c.Company) : query.GroupBy(c => c.Department);
            return Grouping.Select(g => new CordReportItem()
            {
                Cord = g.Key,
                TotalCards = g.Count(),
                HID = g.Where(g => g.ReportType == "Hazard ID").Count(),
                SafeBehavior = g.Where(g => g.ReportType == "Safe Behavior").Count(),
                UnsafeBehavior = g.Where(g => g.ReportType == "Unsafe Behavior").Count(),
                OffTheSite = g.Where(g => g.HazardIdentification.Contains("Off the Site")).Count(),
                Security = g.Where(g => g.HazardIdentification.Contains("Security")).Count(),
                Environmental = g.Where(g => g.HazardIdentification.Contains("Environmental")).Count()
            });
        }

        private IQueryable<CordReportItem> Sort(IQueryable<CordReportItem> query, string name, SortType sortType)
        {
            switch (name)
            {
                case "cord": query = sortType == SortType.Ascending ? query.OrderBy(a => a.Cord) : query.OrderByDescending(a => a.Cord); break;
                case "totalCards": query = sortType == SortType.Ascending ? query.OrderBy(a => a.TotalCards) : query.OrderByDescending(a => a.TotalCards); break;
                case "hid": query = sortType == SortType.Ascending ? query.OrderBy(a => a.HID) : query.OrderByDescending(a => a.HID); break;
                case "safeBehavior": query = sortType == SortType.Ascending ? query.OrderBy(a => a.SafeBehavior) : query.OrderByDescending(a => a.SafeBehavior); break;
                case "unsafeBehavior": query = sortType == SortType.Ascending ? query.OrderBy(a => a.UnsafeBehavior) : query.OrderByDescending(a => a.UnsafeBehavior); break;
                case "offTheSite": query = sortType == SortType.Ascending ? query.OrderBy(a => a.OffTheSite) : query.OrderByDescending(a => a.OffTheSite); break;
                case "security": query = sortType == SortType.Ascending ? query.OrderBy(a => a.Security) : query.OrderByDescending(a => a.Security); break;
                case "environmental": query = sortType == SortType.Ascending ? query.OrderBy(a => a.Environmental) : query.OrderByDescending(a => a.Environmental); break;
            }

            return query;
        }

        private IQueryable<CordReportItem> Filter(IQueryable<CordReportItem> query, string name, List<string> choices)
        {
            switch (name)
            {
                case "cord": query = query.Where(e => choices.Contains(e.Cord)); break;
                case "totalCards": query = query.Where(e => choices.Contains(e.TotalCards.ToString())); break;
                case "hid": query = query.Where(e => choices.Contains(e.HID.ToString())); break;
                case "safeBehavior": query = query.Where(e => choices.Contains(e.SafeBehavior.ToString())); break;
                case "unsafeBehavior": query = query.Where(e => choices.Contains(e.UnsafeBehavior.ToString())); break;
                case "offTheSite": query = query.Where(e => choices.Contains(e.OffTheSite.ToString())); break;
                case "security": query = query.Where(e => choices.Contains(e.Security.ToString())); break;
                case "environmental": query = query.Where(e => choices.Contains(e.Environmental.ToString())); break;
            }

            return query;
        }

        private IQueryable<CordReportItem> Search(IQueryable<CordReportItem> query, string name, string text)
        {
            var s = text.ToLower();
            switch (name)
            {
                case "cord": query = query.Where(e => e.Cord.ToLower().Contains(s)); break;
                case "totalCards": query = query.Where(e => e.TotalCards.ToString().ToLower().Contains(s)); break;
                case "hid": query = query.Where(e => e.HID.ToString().ToLower().Contains(s)); break;
                case "safeBehavior": query = query.Where(e => e.SafeBehavior.ToString().ToLower().Contains(s)); break;
                case "unsafeBehavior": query = query.Where(e => e.UnsafeBehavior.ToString().ToLower().Contains(s)); break;
                case "offTheSite": query = query.Where(e => e.OffTheSite.ToString().ToLower().Contains(s)); break;
                case "security": query = query.Where(e => e.Security.ToString().ToLower().Contains(s)); break;
                case "environmental": query = query.Where(e => e.Environmental.ToString().ToLower().Contains(s)); break;
            }

            return query;
        }

        private IQueryable<CordReportItem> SearchEverywhere(IQueryable<CordReportItem> query, string text)
        {
            var s = text.ToLower();
            return query.Where(e => e.Cord.ToLower().Contains(s) ||
                                    e.TotalCards.ToString().ToLower().Contains(s) ||
                                    e.HID.ToString().ToLower().Contains(s) ||
                                    e.SafeBehavior.ToString().ToLower().Contains(s) ||
                                    e.UnsafeBehavior.ToString().ToLower().Contains(s) ||
                                    e.OffTheSite.ToString().ToLower().Contains(s) ||
                                    e.Security.ToString().ToLower().Contains(s) ||
                                    e.Environmental.ToString().ToLower().Contains(s));
        }

        private List<FilteringItem> GetFilteringValues(IEnumerable<CordReportItem> collection)
        {
            var list = new List<FilteringItem>();

            list.Add(new FilteringItem() { Field = "cord", Choices = collection.Select(i => i.Cord).Distinct().OrderBy(i => i) });
            list.Add(new FilteringItem() { Field = "totalCards", Choices = collection.Select(i => i.TotalCards).Distinct().OrderBy(i => i).Select(i => i.ToString()) }); ;
            list.Add(new FilteringItem() { Field = "hid", Choices = collection.Select(i => i.HID).Distinct().OrderBy(i => i).Select(i => i.ToString()) });
            list.Add(new FilteringItem() { Field = "safeBehavior", Choices = collection.Select(i => i.SafeBehavior).Distinct().OrderBy(i => i).Select(i => i.ToString()) });
            list.Add(new FilteringItem() { Field = "unsafeBehavior", Choices = collection.Select(i => i.UnsafeBehavior).Distinct().OrderBy(i => i).Select(i => i.ToString()) });
            list.Add(new FilteringItem() { Field = "offTheSite", Choices = collection.Select(i => i.OffTheSite).Distinct().OrderBy(i => i).Select(i => i.ToString()) });
            list.Add(new FilteringItem() { Field = "security", Choices = collection.Select(i => i.Security).Distinct().OrderBy(i => i).Select(i => i.ToString()) });
            list.Add(new FilteringItem() { Field = "environmental", Choices = collection.Select(i => i.Environmental).Distinct().OrderBy(i => i).Select(i => i.ToString()) });

            return list;
        }

        private List<TotalItem> GetTotals(IEnumerable<CordReportItem> collection)
        {
            var totals = new List<TotalItem>();

            totals.Add(new TotalItem() { Field = "totalCards", Total = collection.Select(i => i.TotalCards).Sum().ToString() });
            totals.Add(new TotalItem() { Field = "hid", Total = collection.Select(i => i.HID).Sum().ToString() });
            totals.Add(new TotalItem() { Field = "safeBehavior", Total = collection.Select(i => i.SafeBehavior).Sum().ToString() });
            totals.Add(new TotalItem() { Field = "unsafeBehavior", Total = collection.Select(i => i.UnsafeBehavior).Sum().ToString() });
            totals.Add(new TotalItem() { Field = "offTheSite", Total = collection.Select(i => i.OffTheSite).Sum().ToString() });
            totals.Add(new TotalItem() { Field = "security", Total = collection.Select(i => i.Security).Sum().ToString() });
            totals.Add(new TotalItem() { Field = "environmental", Total = collection.Select(i => i.Environmental).Sum().ToString() });

            return totals;
        }

        private List<CordReportItem> GetResult(IQueryable<CordReportItem> query)
        {
            return query.ToList();
        }
    }

    public class BaseTimeReportItem
    {
        public int TotalCards { get; set; }
        public int HID { get; set; }
        public int SafeBehavior { get; set; }
        public int UnsafeBehavior { get; set; }
        public int OffTheSite { get; set; }
        public int Security { get; set; }
        public int Environmental { get; set; }
    }

    public class CordReportItem : BaseTimeReportItem
    {
        public string Cord { get; set; }
    }
}

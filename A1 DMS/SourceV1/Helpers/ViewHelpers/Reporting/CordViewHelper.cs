using System;
using System.Collections.Generic;
using System.Linq;
using System.Text.RegularExpressions;
using System.Reflection;
using System.Globalization;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Mvc;

namespace A1DMS.V1
{
    public class CordViewHelper : IViewHelper<ByCordReportItem>
    {
        public TableView Table { get; set; }

        private readonly HttpContext Context;
        private readonly Context db;
        private readonly UserService UserService;

        private List<Site> Sites;

        public CordViewHelper(IHttpContextAccessor accessor, Context context, UserService userService)
        {
            this.Context = accessor.HttpContext;
            this.db = context;
            this.UserService = userService;

            this.Table = this.GetTable();
        }

        public (List<Site>, List<Company>, List<Department>) GetFields()
        {
            var siteIds = this.UserService.GetSiteIds();
            var query = this.db.Sites.OrderBy(a => a.Name).AsQueryable();
            if (siteIds.Count > 0)
                query = query.Where(s => siteIds.Contains(s.Id));

            this.Sites = query.ToList();
            var companies = this.db.Companies.OrderBy(a => a.Name).ToList();
            var departments = this.db.Departments.OrderBy(a => a.Name).ToList();

            return (this.Sites, companies, departments);
        }

        public void ParseProperties(string type, List<string> sites, List<string> companies, List<string> departments, DateTime? from, DateTime? to)
        {
            if (this.Sites == null)
                this.Sites = this.db.Sites.ToList();

            var siteNames = this.UserService.GetSiteIds().Select(id => this.Sites.Find(s => s.Id == id).Name).ToList();

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

        private TableView<ByCordReportItem, ByCordReportItem> GetTable()
        {
            var table = new TableView<ByCordReportItem, ByCordReportItem>();

            table.PageSize = 30;
            table.Request = this.Context.Request;
            table.GetBaseQuery = this.GetBaseQuery;

            table.Sort = this.Sort;
            table.Filter = this.Filter;

            table.GetResult = this.GetResult;

            return table;
        }

        private IQueryable<ByCordReportItem> GetBaseQuery(PropertyItemCollection properties)
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
            return Grouping.Select(g => new ByCordReportItem()
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

        private IQueryable<ByCordReportItem> Sort(IQueryable<ByCordReportItem> query, string name, SortType sortType)
        {
            switch (name)
            {
                case "Cord": query = sortType == SortType.Ascending ? query.OrderBy(a => a.Cord) : query.OrderByDescending(a => a.Cord); break;
                case "TotalCards": query = sortType == SortType.Ascending ? query.OrderBy(a => a.TotalCards) : query.OrderByDescending(a => a.TotalCards); break;
                case "HID": query = sortType == SortType.Ascending ? query.OrderBy(a => a.HID) : query.OrderByDescending(a => a.HID); break;
                case "SafeBehavior": query = sortType == SortType.Ascending ? query.OrderBy(a => a.SafeBehavior) : query.OrderByDescending(a => a.SafeBehavior); break;
                case "UnsafeBehavior": query = sortType == SortType.Ascending ? query.OrderBy(a => a.UnsafeBehavior) : query.OrderByDescending(a => a.UnsafeBehavior); break;
                case "OffTheSite": query = sortType == SortType.Ascending ? query.OrderBy(a => a.OffTheSite) : query.OrderByDescending(a => a.OffTheSite); break;
                case "Security": query = sortType == SortType.Ascending ? query.OrderBy(a => a.Security) : query.OrderByDescending(a => a.Security); break;
                case "Environmental": query = sortType == SortType.Ascending ? query.OrderBy(a => a.Environmental) : query.OrderByDescending(a => a.Environmental); break;
            }

            return query;
        }

        private IQueryable<ByCordReportItem> Filter(IQueryable<ByCordReportItem> query, string name, List<string> choices)
        {
            switch (name)
            {
                case "Cord": query = query.Where(e => choices.Contains(e.Cord)); break;
                case "TotalCards": query = query.Where(e => choices.Contains(e.TotalCards.ToString())); break;
                case "HID": query = query.Where(e => choices.Contains(e.HID.ToString())); break;
                case "SafeBehavior": query = query.Where(e => choices.Contains(e.SafeBehavior.ToString())); break;
                case "UnsafeBehavior": query = query.Where(e => choices.Contains(e.UnsafeBehavior.ToString())); break;
                case "OffTheSite": query = query.Where(e => choices.Contains(e.OffTheSite.ToString())); break;
                case "Security": query = query.Where(e => choices.Contains(e.Security.ToString())); break;
                case "Environmental": query = query.Where(e => choices.Contains(e.Environmental.ToString())); break;
            }

            return query;
        }

        private List<ByCordReportItem> GetResult(IQueryable<ByCordReportItem> query)
        {
            return query.ToList();
        }

        public TableViewResponse<ByCordReportItem> GetData()
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

    public class ByCordReportItem : BaseTimeReportItem
    {
        public string Cord { get; set; }
    }
}

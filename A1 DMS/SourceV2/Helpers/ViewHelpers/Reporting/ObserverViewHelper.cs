using System;
using System.Globalization;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;

namespace A1DMS.V2
{
    public class ObserverViewHelper : IViewHelper<ObserverReportItem>
    {
        private readonly Context db;
        private readonly HttpContext Context;
        private readonly UserService UserService;

        private List<Site> Sites;

        public TableView<ObserverReportItem, ObserverReportItem> Table { get; set; }

        public ObserverViewHelper(IHttpContextAccessor accessor, Context context, UserService userService)
        {
            this.Context = accessor.HttpContext;
            this.db = context;
            this.UserService = userService;

            this.GetTable();
        }

        public TableViewResponse<ObserverReportItem> GetData()
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

        public IEnumerable<ObserverReportItem> Export()
        {
            this.Table.Proceed(false);

            return this.Table.Response.Rows;
        }

        private void GetTable()
        {
            this.Table = new TableView<ObserverReportItem, ObserverReportItem>();

            this.Table.PageSize = 30;
            this.Table.Request = this.Context.Request;
            this.Table.GetBaseQuery = this.GetBaseQuery;

            this.Table.Sort = this.Sort;
            this.Table.Filter = this.Filter;
            this.Table.Search = this.Search;
            this.Table.SearchEverywhere = this.SearchEverywhere;

            this.Table.GetTotals = this.GetTotals;
            this.Table.GetFilteringValues = this.GetFilteringValues;

            this.Table.GetResult = this.GetResult;
        }

        public void ParseProperties(List<string> sites, List<string> companies, List<string> departments, DateTime? from, DateTime? to)
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
        }

        private IQueryable<ObserverReportItem> GetBaseQuery(PropertyItemCollection properties)
        {
            var year = DateTime.Now.Year;
            var months = new DateTime[13];
            for (var i = 0; i < 12; i++)
                months[i] = DateTime.Parse((i + 1) + "/01/" + year, CultureInfo.InvariantCulture);

            months[12] = DateTime.Parse("01/01/" + (year + 1));

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

            return query
                .GroupBy(c => new { c.EmployeeId, c.Site, c.Company, c.Department, Name = c.LastName + ", " + c.FirstName })
                .Select(g => new ObserverReportItem()
                {
                    Name = g.Key.Name,
                    Company = g.Key.Company,
                    Department = g.Key.Department,
                    Site = g.Key.Site,
                    TotalCards = g.Count(),
                    HID = g.Where(g => g.ReportType == "Hazard ID").Count(),
                    SafeBehavior = g.Where(g => g.ReportType == "Safe Behavior").Count(),
                    UnsafeBehavior = g.Where(g => g.ReportType == "Unsafe Behavior").Count(),
                    OffTheSite = g.Where(g => g.HazardIdentification.Contains("Off the Site")).Count(),
                    Security = g.Where(g => g.HazardIdentification.Contains("Security")).Count(),
                    Environmental = g.Where(g => g.HazardIdentification.Contains("Environmental")).Count(),
                    Jan = g.Where(g => g.Date >= months[0] && g.Date < months[1]).Count(),
                    Feb = g.Where(g => g.Date >= months[1] && g.Date < months[2]).Count(),
                    Mar = g.Where(g => g.Date >= months[2] && g.Date < months[3]).Count(),
                    Apr = g.Where(g => g.Date >= months[3] && g.Date < months[4]).Count(),
                    May = g.Where(g => g.Date >= months[4] && g.Date < months[5]).Count(),
                    Jun = g.Where(g => g.Date >= months[5] && g.Date < months[6]).Count(),
                    Jul = g.Where(g => g.Date >= months[6] && g.Date < months[7]).Count(),
                    Aug = g.Where(g => g.Date >= months[7] && g.Date < months[8]).Count(),
                    Sep = g.Where(g => g.Date >= months[8] && g.Date < months[9]).Count(),
                    Oct = g.Where(g => g.Date >= months[9] && g.Date < months[10]).Count(),
                    Nov = g.Where(g => g.Date >= months[10] && g.Date < months[11]).Count(),
                    Dec = g.Where(g => g.Date >= months[11] && g.Date < months[12]).Count()
                });
        }

        private IQueryable<ObserverReportItem> Sort(IQueryable<ObserverReportItem> query, string name, SortType sortType)
        {
            switch (name)
            {
                case "name": query = sortType == SortType.Ascending ? query.OrderBy(a => a.Name) : query.OrderByDescending(a => a.Name); break;
                case "site": query = sortType == SortType.Ascending ? query.OrderBy(a => a.Site) : query.OrderByDescending(a => a.Site); break;
                case "company": query = sortType == SortType.Ascending ? query.OrderBy(a => a.Company) : query.OrderByDescending(a => a.Company); break;
                case "department": query = sortType == SortType.Ascending ? query.OrderBy(a => a.Department) : query.OrderByDescending(a => a.Department); break;
                case "totalCards": query = sortType == SortType.Ascending ? query.OrderBy(a => a.TotalCards) : query.OrderByDescending(a => a.TotalCards); break;
                case "hid": query = sortType == SortType.Ascending ? query.OrderBy(a => a.HID) : query.OrderByDescending(a => a.HID); break;
                case "safeBehavior": query = sortType == SortType.Ascending ? query.OrderBy(a => a.SafeBehavior) : query.OrderByDescending(a => a.SafeBehavior); break;
                case "unsafeBehavior": query = sortType == SortType.Ascending ? query.OrderBy(a => a.UnsafeBehavior) : query.OrderByDescending(a => a.UnsafeBehavior); break;
                case "offTheSite": query = sortType == SortType.Ascending ? query.OrderBy(a => a.OffTheSite) : query.OrderByDescending(a => a.OffTheSite); break;
                case "security": query = sortType == SortType.Ascending ? query.OrderBy(a => a.Security) : query.OrderByDescending(a => a.Security); break;
                case "environmental": query = sortType == SortType.Ascending ? query.OrderBy(a => a.Environmental) : query.OrderByDescending(a => a.Environmental); break;
                case "jan": query = sortType == SortType.Ascending ? query.OrderBy(a => a.Jan) : query.OrderByDescending(a => a.Jan); break;
                case "feb": query = sortType == SortType.Ascending ? query.OrderBy(a => a.Feb) : query.OrderByDescending(a => a.Feb); break;
                case "mar": query = sortType == SortType.Ascending ? query.OrderBy(a => a.Mar) : query.OrderByDescending(a => a.Mar); break;
                case "apr": query = sortType == SortType.Ascending ? query.OrderBy(a => a.Apr) : query.OrderByDescending(a => a.Apr); break;
                case "may": query = sortType == SortType.Ascending ? query.OrderBy(a => a.May) : query.OrderByDescending(a => a.May); break;
                case "jun": query = sortType == SortType.Ascending ? query.OrderBy(a => a.Jun) : query.OrderByDescending(a => a.Jun); break;
                case "jul": query = sortType == SortType.Ascending ? query.OrderBy(a => a.Jul) : query.OrderByDescending(a => a.Jul); break;
                case "aug": query = sortType == SortType.Ascending ? query.OrderBy(a => a.Aug) : query.OrderByDescending(a => a.Aug); break;
                case "sep": query = sortType == SortType.Ascending ? query.OrderBy(a => a.Sep) : query.OrderByDescending(a => a.Sep); break;
                case "oct": query = sortType == SortType.Ascending ? query.OrderBy(a => a.Oct) : query.OrderByDescending(a => a.Oct); break;
                case "nov": query = sortType == SortType.Ascending ? query.OrderBy(a => a.Nov) : query.OrderByDescending(a => a.Nov); break;
                case "dec": query = sortType == SortType.Ascending ? query.OrderBy(a => a.Dec) : query.OrderByDescending(a => a.Dec); break;
            }

            return query;
        }

        private IQueryable<ObserverReportItem> Filter(IQueryable<ObserverReportItem> query, string name, List<string> choices)
        {
            switch (name)
            {
                case "name": query = query.Where(e => choices.Contains(e.Name)); break;
                case "site": query = query.Where(e => choices.Contains(e.Site)); break;
                case "company": query = query.Where(e => choices.Contains(e.Company)); break;
                case "department": query = query.Where(e => choices.Contains(e.Department)); break;
                case "totalCards": query = query.Where(e => choices.Contains(e.TotalCards.ToString())); break;
                case "hid": query = query.Where(e => choices.Contains(e.HID.ToString())); break;
                case "safeBehavior": query = query.Where(e => choices.Contains(e.SafeBehavior.ToString())); break;
                case "unsafeBehavior": query = query.Where(e => choices.Contains(e.UnsafeBehavior.ToString())); break;
                case "offTheSite": query = query.Where(e => choices.Contains(e.OffTheSite.ToString())); break;
                case "security": query = query.Where(e => choices.Contains(e.Security.ToString())); break;
                case "environmental": query = query.Where(e => choices.Contains(e.Environmental.ToString())); break;
                case "jan": query = query.Where(e => choices.Contains(e.Jan.ToString())); break;
                case "feb": query = query.Where(e => choices.Contains(e.Feb.ToString())); break;
                case "mar": query = query.Where(e => choices.Contains(e.Mar.ToString())); break;
                case "apr": query = query.Where(e => choices.Contains(e.Apr.ToString())); break;
                case "may": query = query.Where(e => choices.Contains(e.May.ToString())); break;
                case "jun": query = query.Where(e => choices.Contains(e.Jun.ToString())); break;
                case "jul": query = query.Where(e => choices.Contains(e.Jul.ToString())); break;
                case "aug": query = query.Where(e => choices.Contains(e.Aug.ToString())); break;
                case "sep": query = query.Where(e => choices.Contains(e.Sep.ToString())); break;
                case "oct": query = query.Where(e => choices.Contains(e.Oct.ToString())); break;
                case "nov": query = query.Where(e => choices.Contains(e.Nov.ToString())); break;
                case "dec": query = query.Where(e => choices.Contains(e.Dec.ToString())); break;
            }

            return query;
        }

        private IQueryable<ObserverReportItem> Search(IQueryable<ObserverReportItem> query, string name, string text)
        {
            var s = text.ToLower();

            switch (name)
            {
                case "name": query = query.Where(e => e.Name.ToLower().Contains(s)); break;
                case "site": query = query.Where(e => e.Site.ToLower().Contains(s)); break;
                case "company": query = query.Where(e => e.Company.ToLower().Contains(s)); break;
                case "department": query = query.Where(e => e.Department.ToLower().Contains(s)); break;
                case "totalCards": query = query.Where(e => e.TotalCards.ToString().Contains(s)); break;
                case "hid": query = query.Where(e => e.HID.ToString().Contains(s)); break;
                case "safeBehavior": query = query.Where(e => e.SafeBehavior.ToString().Contains(s)); break;
                case "unsafeBehavior": query = query.Where(e => e.UnsafeBehavior.ToString().Contains(s)); break;
                case "offTheSite": query = query.Where(e => e.OffTheSite.ToString().Contains(s)); break;
                case "security": query = query.Where(e => e.Security.ToString().Contains(s)); break;
                case "environmental": query = query.Where(e => e.Environmental.ToString().Contains(s)); break;
                case "jan": query = query.Where(e => e.Jan.ToString().Contains(s)); break;
                case "feb": query = query.Where(e => e.Feb.ToString().Contains(s)); break;
                case "mar": query = query.Where(e => e.Mar.ToString().Contains(s)); break;
                case "apr": query = query.Where(e => e.Apr.ToString().Contains(s)); break;
                case "may": query = query.Where(e => e.May.ToString().Contains(s)); break;
                case "jun": query = query.Where(e => e.Jun.ToString().Contains(s)); break;
                case "jul": query = query.Where(e => e.Jul.ToString().Contains(s)); break;
                case "aug": query = query.Where(e => e.Aug.ToString().Contains(s)); break;
                case "sep": query = query.Where(e => e.Sep.ToString().Contains(s)); break;
                case "oct": query = query.Where(e => e.Oct.ToString().Contains(s)); break;
                case "nov": query = query.Where(e => e.Nov.ToString().Contains(s)); break;
                case "dec": query = query.Where(e => e.Dec.ToString().Contains(s)); break;
            }

            return query;
        }

        private IQueryable<ObserverReportItem> SearchEverywhere(IQueryable<ObserverReportItem> query, string searchString)
        {
            var s = searchString.ToLower();

            return query.Where(i => i.Name.ToLower().Contains(s) ||
                                    i.Site.ToLower().Contains(s) ||
                                    i.Company.ToLower().Contains(s) ||
                                    i.Department.ToLower().Contains(s) ||
                                    i.Site.ToLower().Contains(s) ||
                                    i.TotalCards.ToString().Contains(s) ||
                                    i.HID.ToString().Contains(s) ||
                                    i.SafeBehavior.ToString().Contains(s) ||
                                    i.UnsafeBehavior.ToString().Contains(s) ||
                                    i.OffTheSite.ToString().Contains(s) ||
                                    i.Security.ToString().Contains(s) ||
                                    i.Environmental.ToString().Contains(s) ||
                                    i.Jan.ToString().Contains(s) ||
                                    i.Feb.ToString().Contains(s) ||
                                    i.Mar.ToString().Contains(s) ||
                                    i.Apr.ToString().Contains(s) ||
                                    i.May.ToString().Contains(s) ||
                                    i.Jun.ToString().Contains(s) ||
                                    i.Jul.ToString().Contains(s) ||
                                    i.Aug.ToString().Contains(s) ||
                                    i.Sep.ToString().Contains(s) ||
                                    i.Oct.ToString().Contains(s) ||
                                    i.Nov.ToString().Contains(s) ||
                                    i.Dec.ToString().Contains(s));
        }

        private List<ObserverReportItem> GetResult(IQueryable<ObserverReportItem> query)
        {
            return query.ToList();
        }

        private List<TotalItem> GetTotals(IEnumerable<ObserverReportItem> collection)
        {
            var totals = new List<TotalItem>();

            totals.Add(new TotalItem() { Field = "totalCards", Total = collection.Select(i => i.TotalCards).Sum().ToString() });
            totals.Add(new TotalItem() { Field = "hid", Total = collection.Select(i => i.HID).Sum().ToString() });
            totals.Add(new TotalItem() { Field = "safeBehavior", Total = collection.Select(i => i.SafeBehavior).Sum().ToString() });
            totals.Add(new TotalItem() { Field = "unsafeBehavior", Total = collection.Select(i => i.UnsafeBehavior).Sum().ToString() });
            totals.Add(new TotalItem() { Field = "offTheSite", Total = collection.Select(i => i.OffTheSite).Sum().ToString() });
            totals.Add(new TotalItem() { Field = "security", Total = collection.Select(i => i.Security).Sum().ToString() });
            totals.Add(new TotalItem() { Field = "environmental", Total = collection.Select(i => i.Environmental).Sum().ToString() });
            totals.Add(new TotalItem() { Field = "jan", Total = collection.Select(i => i.Jan).Sum().ToString() });
            totals.Add(new TotalItem() { Field = "feb", Total = collection.Select(i => i.Feb).Sum().ToString() });
            totals.Add(new TotalItem() { Field = "mar", Total = collection.Select(i => i.Mar).Sum().ToString() });
            totals.Add(new TotalItem() { Field = "apr", Total = collection.Select(i => i.Apr).Sum().ToString() });
            totals.Add(new TotalItem() { Field = "may", Total = collection.Select(i => i.May).Sum().ToString() });
            totals.Add(new TotalItem() { Field = "jun", Total = collection.Select(i => i.Jun).Sum().ToString() });
            totals.Add(new TotalItem() { Field = "jul", Total = collection.Select(i => i.Jul).Sum().ToString() });
            totals.Add(new TotalItem() { Field = "aug", Total = collection.Select(i => i.Aug).Sum().ToString() });
            totals.Add(new TotalItem() { Field = "sep", Total = collection.Select(i => i.Sep).Sum().ToString() });
            totals.Add(new TotalItem() { Field = "oct", Total = collection.Select(i => i.Oct).Sum().ToString() });
            totals.Add(new TotalItem() { Field = "nov", Total = collection.Select(i => i.Nov).Sum().ToString() });
            totals.Add(new TotalItem() { Field = "dec", Total = collection.Select(i => i.Dec).Sum().ToString() });

            return totals;
        }

        private List<FilteringItem> GetFilteringValues(IEnumerable<ObserverReportItem> collection)
        {
            var list = new List<FilteringItem>();

            list.Add(new FilteringItem() { Field = "name", Choices = collection.Select(i => i.Name).Distinct().OrderBy(i => i) });
            list.Add(new FilteringItem() { Field = "site", Choices = collection.Select(i => i.Site).Distinct().OrderBy(i => i) });
            list.Add(new FilteringItem() { Field = "company", Choices = collection.Select(i => i.Company).Distinct().OrderBy(i => i) });
            list.Add(new FilteringItem() { Field = "department", Choices = collection.Select(i => i.Department).Distinct().OrderBy(i => i) });
            list.Add(new FilteringItem() { Field = "totalCards", Choices = collection.Select(i => i.TotalCards).Distinct().OrderBy(i => i).Select(i => i.ToString()) });
            list.Add(new FilteringItem() { Field = "hid", Choices = collection.Select(i => i.HID).Distinct().OrderBy(i => i).Select(i => i.ToString()) });
            list.Add(new FilteringItem() { Field = "safeBehavior", Choices = collection.Select(i => i.SafeBehavior).Distinct().OrderBy(i => i).Select(i => i.ToString()) });
            list.Add(new FilteringItem() { Field = "unsafeBehavior", Choices = collection.Select(i => i.UnsafeBehavior).Distinct().OrderBy(i => i).Select(i => i.ToString()) });
            list.Add(new FilteringItem() { Field = "offTheSite", Choices = collection.Select(i => i.OffTheSite).Distinct().OrderBy(i => i).Select(i => i.ToString()) });
            list.Add(new FilteringItem() { Field = "security", Choices = collection.Select(i => i.Security).Distinct().OrderBy(i => i).Select(i => i.ToString()) });
            list.Add(new FilteringItem() { Field = "environmental", Choices = collection.Select(i => i.Environmental).Distinct().OrderBy(i => i).Select(i => i.ToString()) });
            list.Add(new FilteringItem() { Field = "jan", Choices = collection.Select(i => i.Jan).Distinct().OrderBy(i => i).Select(i => i.ToString()) });
            list.Add(new FilteringItem() { Field = "feb", Choices = collection.Select(i => i.Feb).Distinct().OrderBy(i => i).Select(i => i.ToString()) });
            list.Add(new FilteringItem() { Field = "mar", Choices = collection.Select(i => i.Mar).Distinct().OrderBy(i => i).Select(i => i.ToString()) });
            list.Add(new FilteringItem() { Field = "apr", Choices = collection.Select(i => i.Apr).Distinct().OrderBy(i => i).Select(i => i.ToString()) });
            list.Add(new FilteringItem() { Field = "may", Choices = collection.Select(i => i.May).Distinct().OrderBy(i => i).Select(i => i.ToString()) });
            list.Add(new FilteringItem() { Field = "jun", Choices = collection.Select(i => i.Jun).Distinct().OrderBy(i => i).Select(i => i.ToString()) });
            list.Add(new FilteringItem() { Field = "jul", Choices = collection.Select(i => i.Jul).Distinct().OrderBy(i => i).Select(i => i.ToString()) });
            list.Add(new FilteringItem() { Field = "aug", Choices = collection.Select(i => i.Aug).Distinct().OrderBy(i => i).Select(i => i.ToString()) });
            list.Add(new FilteringItem() { Field = "sep", Choices = collection.Select(i => i.Sep).Distinct().OrderBy(i => i).Select(i => i.ToString()) });
            list.Add(new FilteringItem() { Field = "oct", Choices = collection.Select(i => i.Oct).Distinct().OrderBy(i => i).Select(i => i.ToString()) });
            list.Add(new FilteringItem() { Field = "nov", Choices = collection.Select(i => i.Nov).Distinct().OrderBy(i => i).Select(i => i.ToString()) });
            list.Add(new FilteringItem() { Field = "dec", Choices = collection.Select(i => i.Dec).Distinct().OrderBy(i => i).Select(i => i.ToString()) });

            return list;
        }
    }

    public class ObserverReportItem : BaseTimeReportItem
    {
        public string Name { get; set; }
        public string Company { get; set; }
        public string Department { get; set; }
        public string Site { get; set; }
        public int Jan { get; set; }
        public int Feb { get; set; }
        public int Mar { get; set; }
        public int Apr { get; set; }
        public int May { get; set; }
        public int Jun { get; set; }
        public int Jul { get; set; }
        public int Aug { get; set; }
        public int Sep { get; set; }
        public int Oct { get; set; }
        public int Nov { get; set; }
        public int Dec { get; set; }
    }
}

using System;
using System.Globalization;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;

namespace A1DMS.V1
{
    public class ObserverViewHelper : IViewHelper<ObserverReportItem>
    {
        private readonly Context db;
        private readonly HttpContext Context;
        private readonly UserService UserService;

        private List<Site> Sites;

        public TableView Table { get; set; }

        public ObserverViewHelper(IHttpContextAccessor accessor, Context context, UserService userService)
        {
            this.Context = accessor.HttpContext;
            this.db = context;
            this.UserService = userService;

            this.Table = this.GetTable();
        }

        private TableView<ObserverReportItem, ObserverReportItem> GetTable()
        {
            var table = new TableView<ObserverReportItem, ObserverReportItem>();

            table.ServerSide = true;
            table.PageSize = 30;
            table.Request = this.Context.Request;
            table.GetBaseQuery = this.GetBaseQuery;

            table.Sort = this.Sort;
            table.Filter = this.Filter;
            table.Search = this.Search;

            table.GetTotals = this.GetTotals;
            table.GetFilteringValues = this.GetFilteringValues;

            table.GetResult = this.GetResult;

            return table;
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
                case "Name": query = sortType == SortType.Ascending ? query.OrderBy(a => a.Name) : query.OrderByDescending(a => a.Name); break;
                case "Site": query = sortType == SortType.Ascending ? query.OrderBy(a => a.Site) : query.OrderByDescending(a => a.Site); break;
                case "Company": query = sortType == SortType.Ascending ? query.OrderBy(a => a.Company) : query.OrderByDescending(a => a.Company); break;
                case "Department": query = sortType == SortType.Ascending ? query.OrderBy(a => a.Department) : query.OrderByDescending(a => a.Department); break;
                case "TotalCards": query = sortType == SortType.Ascending ? query.OrderBy(a => a.TotalCards) : query.OrderByDescending(a => a.TotalCards); break;
                case "HID": query = sortType == SortType.Ascending ? query.OrderBy(a => a.HID) : query.OrderByDescending(a => a.HID); break;
                case "SafeBehavior": query = sortType == SortType.Ascending ? query.OrderBy(a => a.SafeBehavior) : query.OrderByDescending(a => a.SafeBehavior); break;
                case "UnsafeBehavior": query = sortType == SortType.Ascending ? query.OrderBy(a => a.UnsafeBehavior) : query.OrderByDescending(a => a.UnsafeBehavior); break;
                case "OffTheSite": query = sortType == SortType.Ascending ? query.OrderBy(a => a.OffTheSite) : query.OrderByDescending(a => a.OffTheSite); break;
                case "Security": query = sortType == SortType.Ascending ? query.OrderBy(a => a.Security) : query.OrderByDescending(a => a.Security); break;
                case "Environmental": query = sortType == SortType.Ascending ? query.OrderBy(a => a.Environmental) : query.OrderByDescending(a => a.Environmental); break;
                case "Jan": query = sortType == SortType.Ascending ? query.OrderBy(a => a.Jan) : query.OrderByDescending(a => a.Jan); break;
                case "Feb": query = sortType == SortType.Ascending ? query.OrderBy(a => a.Feb) : query.OrderByDescending(a => a.Feb); break;
                case "Mar": query = sortType == SortType.Ascending ? query.OrderBy(a => a.Mar) : query.OrderByDescending(a => a.Mar); break;
                case "Apr": query = sortType == SortType.Ascending ? query.OrderBy(a => a.Apr) : query.OrderByDescending(a => a.Apr); break;
                case "May": query = sortType == SortType.Ascending ? query.OrderBy(a => a.May) : query.OrderByDescending(a => a.May); break;
                case "Jun": query = sortType == SortType.Ascending ? query.OrderBy(a => a.Jun) : query.OrderByDescending(a => a.Jun); break;
                case "Jul": query = sortType == SortType.Ascending ? query.OrderBy(a => a.Jul) : query.OrderByDescending(a => a.Jul); break;
                case "Aug": query = sortType == SortType.Ascending ? query.OrderBy(a => a.Aug) : query.OrderByDescending(a => a.Aug); break;
                case "Sep": query = sortType == SortType.Ascending ? query.OrderBy(a => a.Sep) : query.OrderByDescending(a => a.Sep); break;
                case "Oct": query = sortType == SortType.Ascending ? query.OrderBy(a => a.Oct) : query.OrderByDescending(a => a.Oct); break;
                case "Nov": query = sortType == SortType.Ascending ? query.OrderBy(a => a.Nov) : query.OrderByDescending(a => a.Nov); break;
                case "Dec": query = sortType == SortType.Ascending ? query.OrderBy(a => a.Dec) : query.OrderByDescending(a => a.Dec); break;
            }

            return query;
        }

        private IQueryable<ObserverReportItem> Filter(IQueryable<ObserverReportItem> query, string name, List<string> choices)
        {
            switch (name)
            {
                case "Name": query = query.Where(e => choices.Contains(e.Name)); break;
                case "Site": query = query.Where(e => choices.Contains(e.Site)); break;
                case "Company": query = query.Where(e => choices.Contains(e.Company)); break;
                case "Department": query = query.Where(e => choices.Contains(e.Department)); break;
                case "TotalCards": query = query.Where(e => choices.Contains(e.TotalCards.ToString())); break;
                case "HID": query = query.Where(e => choices.Contains(e.HID.ToString())); break;
                case "SafeBehavior": query = query.Where(e => choices.Contains(e.SafeBehavior.ToString())); break;
                case "UnsafeBehavior": query = query.Where(e => choices.Contains(e.UnsafeBehavior.ToString())); break;
                case "OffTheSite": query = query.Where(e => choices.Contains(e.OffTheSite.ToString())); break;
                case "Security": query = query.Where(e => choices.Contains(e.Security.ToString())); break;
                case "Environmental": query = query.Where(e => choices.Contains(e.Environmental.ToString())); break;
                case "Jan": query = query.Where(e => choices.Contains(e.Jan.ToString())); break;
                case "Feb": query = query.Where(e => choices.Contains(e.Feb.ToString())); break;
                case "Mar": query = query.Where(e => choices.Contains(e.Mar.ToString())); break;
                case "Apr": query = query.Where(e => choices.Contains(e.Apr.ToString())); break;
                case "May": query = query.Where(e => choices.Contains(e.May.ToString())); break;
                case "Jun": query = query.Where(e => choices.Contains(e.Jun.ToString())); break;
                case "Jul": query = query.Where(e => choices.Contains(e.Jul.ToString())); break;
                case "Aug": query = query.Where(e => choices.Contains(e.Aug.ToString())); break;
                case "Sep": query = query.Where(e => choices.Contains(e.Sep.ToString())); break;
                case "Oct": query = query.Where(e => choices.Contains(e.Oct.ToString())); break;
                case "Nov": query = query.Where(e => choices.Contains(e.Nov.ToString())); break;
                case "Dec": query = query.Where(e => choices.Contains(e.Dec.ToString())); break;
            }

            return query;
        }

        private IQueryable<ObserverReportItem> Search(IQueryable<ObserverReportItem> query, string searchString)
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

        private List<TotalItem> GetTotals(List<ObserverReportItem> list)
        {
            var totals = new List<TotalItem>();

            totals.Add(new TotalItem() { Field = "TotalCards", Total = list.Select(i => i.TotalCards).Sum().ToString() });
            totals.Add(new TotalItem() { Field = "HID", Total = list.Select(i => i.HID).Sum().ToString() });
            totals.Add(new TotalItem() { Field = "SafeBehavior", Total = list.Select(i => i.SafeBehavior).Sum().ToString() });
            totals.Add(new TotalItem() { Field = "UnsafeBehavior", Total = list.Select(i => i.UnsafeBehavior).Sum().ToString() });
            totals.Add(new TotalItem() { Field = "OffTheSite", Total = list.Select(i => i.OffTheSite).Sum().ToString() });
            totals.Add(new TotalItem() { Field = "Security", Total = list.Select(i => i.Security).Sum().ToString() });
            totals.Add(new TotalItem() { Field = "Environmental", Total = list.Select(i => i.Environmental).Sum().ToString() });
            totals.Add(new TotalItem() { Field = "Jan", Total = list.Select(i => i.Jan).Sum().ToString() });
            totals.Add(new TotalItem() { Field = "Feb", Total = list.Select(i => i.Feb).Sum().ToString() });
            totals.Add(new TotalItem() { Field = "Mar", Total = list.Select(i => i.Mar).Sum().ToString() });
            totals.Add(new TotalItem() { Field = "Apr", Total = list.Select(i => i.Apr).Sum().ToString() });
            totals.Add(new TotalItem() { Field = "May", Total = list.Select(i => i.May).Sum().ToString() });
            totals.Add(new TotalItem() { Field = "Jun", Total = list.Select(i => i.Jun).Sum().ToString() });
            totals.Add(new TotalItem() { Field = "Jul", Total = list.Select(i => i.Jul).Sum().ToString() });
            totals.Add(new TotalItem() { Field = "Aug", Total = list.Select(i => i.Aug).Sum().ToString() });
            totals.Add(new TotalItem() { Field = "Sep", Total = list.Select(i => i.Sep).Sum().ToString() });
            totals.Add(new TotalItem() { Field = "Oct", Total = list.Select(i => i.Oct).Sum().ToString() });
            totals.Add(new TotalItem() { Field = "Nov", Total = list.Select(i => i.Nov).Sum().ToString() });
            totals.Add(new TotalItem() { Field = "Dec", Total = list.Select(i => i.Dec).Sum().ToString() });

            return totals;
        }

        private List<FilteringItem> GetFilteringValues(PropertyItemCollection properties)
        {
            var collection = this.GetBaseQuery(properties).ToList();

            var list = new List<FilteringItem>();

            list.Add(new FilteringItem() { Field = "Name", Choices = collection.Select(i => i.Name).Distinct().OrderBy(i => i).Cast<object>().ToList() });
            list.Add(new FilteringItem() { Field = "Site", Choices = collection.Select(i => i.Site).Distinct().OrderBy(i => i).Cast<object>().ToList() });
            list.Add(new FilteringItem() { Field = "Company", Choices = collection.Select(i => i.Company).Distinct().OrderBy(i => i).Cast<object>().ToList() });
            list.Add(new FilteringItem() { Field = "Department", Choices = collection.Select(i => i.Department).Distinct().OrderBy(i => i).Cast<object>().ToList() });
            list.Add(new FilteringItem() { Field = "TotalCards", Choices = collection.Select(i => i.TotalCards).Distinct().OrderBy(i => i).Cast<object>().ToList() });
            list.Add(new FilteringItem() { Field = "HID", Choices = collection.Select(i => i.HID).Distinct().OrderBy(i => i).Cast<object>().ToList() });
            list.Add(new FilteringItem() { Field = "SafeBehavior", Choices = collection.Select(i => i.SafeBehavior).Distinct().OrderBy(i => i).Cast<object>().ToList() });
            list.Add(new FilteringItem() { Field = "UnsafeBehavior", Choices = collection.Select(i => i.UnsafeBehavior).Distinct().OrderBy(i => i).Cast<object>().ToList() });
            list.Add(new FilteringItem() { Field = "OffTheSite", Choices = collection.Select(i => i.OffTheSite).Distinct().OrderBy(i => i).Cast<object>().ToList() });
            list.Add(new FilteringItem() { Field = "Security", Choices = collection.Select(i => i.Security).Distinct().OrderBy(i => i).Cast<object>().ToList() });
            list.Add(new FilteringItem() { Field = "Environmental", Choices = collection.Select(i => i.Environmental).Distinct().OrderBy(i => i).Cast<object>().ToList() });
            list.Add(new FilteringItem() { Field = "Jan", Choices = collection.Select(i => i.Jan).Distinct().OrderBy(i => i).Cast<object>().ToList() });
            list.Add(new FilteringItem() { Field = "Feb", Choices = collection.Select(i => i.Feb).Distinct().OrderBy(i => i).Cast<object>().ToList() });
            list.Add(new FilteringItem() { Field = "Mar", Choices = collection.Select(i => i.Mar).Distinct().OrderBy(i => i).Cast<object>().ToList() });
            list.Add(new FilteringItem() { Field = "Apr", Choices = collection.Select(i => i.Apr).Distinct().OrderBy(i => i).Cast<object>().ToList() });
            list.Add(new FilteringItem() { Field = "May", Choices = collection.Select(i => i.May).Distinct().OrderBy(i => i).Cast<object>().ToList() });
            list.Add(new FilteringItem() { Field = "Jun", Choices = collection.Select(i => i.Jun).Distinct().OrderBy(i => i).Cast<object>().ToList() });
            list.Add(new FilteringItem() { Field = "Jul", Choices = collection.Select(i => i.Jul).Distinct().OrderBy(i => i).Cast<object>().ToList() });
            list.Add(new FilteringItem() { Field = "Aug", Choices = collection.Select(i => i.Aug).Distinct().OrderBy(i => i).Cast<object>().ToList() });
            list.Add(new FilteringItem() { Field = "Sep", Choices = collection.Select(i => i.Sep).Distinct().OrderBy(i => i).Cast<object>().ToList() });
            list.Add(new FilteringItem() { Field = "Oct", Choices = collection.Select(i => i.Oct).Distinct().OrderBy(i => i).Cast<object>().ToList() });
            list.Add(new FilteringItem() { Field = "Nov", Choices = collection.Select(i => i.Nov).Distinct().OrderBy(i => i).Cast<object>().ToList() });
            list.Add(new FilteringItem() { Field = "Dec", Choices = collection.Select(i => i.Dec).Distinct().OrderBy(i => i).Cast<object>().ToList() });

            return list;
        }

        public TableViewResponse<ObserverReportItem> GetData()
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

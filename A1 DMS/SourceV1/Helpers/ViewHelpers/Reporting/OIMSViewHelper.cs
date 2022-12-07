using System;
using System.Globalization;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;

namespace A1DMS.V1
{
    public class OIMSViewHelper : IViewHelper<SiteReportItem>
    {
        private readonly Context db;
        private readonly HttpContext Context;
        private readonly UserService UserService;

        private List<Site> Sites;

        public TableView Table { get; set; }

        public OIMSViewHelper(IHttpContextAccessor accessor, Context context, UserService userService)
        {
            this.Context = accessor.HttpContext;
            this.db = context;
            this.UserService = userService;

            this.Table = this.GetTable();
        }

        private TableView<SiteReportItem, SiteReportItem> GetTable()
        {
            var table = new TableView<SiteReportItem, SiteReportItem>();

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

        private IQueryable<SiteReportItem> GetBaseQuery(PropertyItemCollection properties)
        {
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

            var items = query
                .SelectMany(c => this.db.ActionItems
                    .DefaultIfEmpty()
                    .Where(a => a.Id == c.ActionItemId),
                    (c, a) => new
                    {
                        Card = c,
                        ActionItem = a
                    }
                )
                .GroupBy(c => new { c.Card.Site })
                .Select(g => new SiteReportItem()
                {
                    Site = g.Key.Site,
                    TotalCards = g.Count(),
                    HID = g.Where(g => g.Card.ReportType == "Hazard ID").Count(),
                    SafeBehavior = g.Where(g => g.Card.ReportType == "Safe Behavior").Count(),
                    UnsafeBehavior = g.Where(g => g.Card.ReportType == "Unsafe Behavior").Count(),
                    OpenActionItems = g.Where(g => g.ActionItem != null && g.ActionItem.Status != ActionItemStatus.Closed).Count(),
                    ExpiredActionItems = g.Where(g => g.ActionItem != null && g.ActionItem.Status != ActionItemStatus.Closed && g.ActionItem.TargetDate != null && g.ActionItem.TargetDate < DateTime.Today).Count(),
                    ActionItemsWithoutDates = g.Where(g => g.ActionItem != null && g.ActionItem.TargetDate == null).Count()
                })
                .ToList();

            foreach (var item in items)
            {
                item.SafeUnsafeTotal = item.SafeBehavior + item.UnsafeBehavior;
                item.HIDPercent = Math.Round((double)item.HID * 100 / item.TotalCards, 1);
                item.SafeBehaviorPercent = Math.Round((double)item.SafeBehavior * 100 / item.TotalCards, 1);
                item.UnsafeBehaviorPercent = Math.Round((double)item.UnsafeBehavior * 100 / item.TotalCards, 1);
                item.SafeUnsafeTotalPercent = Math.Round((double)(item.SafeBehavior + item.UnsafeBehavior) * 100 / item.TotalCards, 1);
            }

            return items.AsQueryable();
        }

        private IQueryable<SiteReportItem> Sort(IQueryable<SiteReportItem> query, string name, SortType sortType)
        {
            switch (name)
            {
                case "Site": query = sortType == SortType.Ascending ? query.OrderBy(a => a.Site) : query.OrderByDescending(a => a.Site); break;
                case "TotalCards": query = sortType == SortType.Ascending ? query.OrderBy(a => a.TotalCards) : query.OrderByDescending(a => a.TotalCards); break;
                case "HID": query = sortType == SortType.Ascending ? query.OrderBy(a => a.HID) : query.OrderByDescending(a => a.HID); break;
                case "SafeBehavior": query = sortType == SortType.Ascending ? query.OrderBy(a => a.SafeBehavior) : query.OrderByDescending(a => a.SafeBehavior); break;
                case "UnsafeBehavior": query = sortType == SortType.Ascending ? query.OrderBy(a => a.UnsafeBehavior) : query.OrderByDescending(a => a.UnsafeBehavior); break;
                case "SafeUnsafeTotal": query = sortType == SortType.Ascending ? query.OrderBy(a => a.SafeUnsafeTotal) : query.OrderByDescending(a => a.SafeUnsafeTotal); break;
                case "HIDPercent": query = sortType == SortType.Ascending ? query.OrderBy(a => a.HIDPercent) : query.OrderByDescending(a => a.HIDPercent); break;
                case "SafeBehaviorPercent": query = sortType == SortType.Ascending ? query.OrderBy(a => a.SafeBehaviorPercent) : query.OrderByDescending(a => a.SafeBehaviorPercent); break;
                case "UnsafeBehaviorPercent": query = sortType == SortType.Ascending ? query.OrderBy(a => a.UnsafeBehaviorPercent) : query.OrderByDescending(a => a.UnsafeBehaviorPercent); break;
                case "SafeUnsafeTotalPercent": query = sortType == SortType.Ascending ? query.OrderBy(a => a.SafeUnsafeTotalPercent) : query.OrderByDescending(a => a.SafeUnsafeTotalPercent); break;
                case "OpenActionItems": query = sortType == SortType.Ascending ? query.OrderBy(a => a.OpenActionItems) : query.OrderByDescending(a => a.OpenActionItems); break;
                case "ExpiredActionItems": query = sortType == SortType.Ascending ? query.OrderBy(a => a.ExpiredActionItems) : query.OrderByDescending(a => a.ExpiredActionItems); break;
                case "ActionItemsWithoutDates": query = sortType == SortType.Ascending ? query.OrderBy(a => a.ActionItemsWithoutDates) : query.OrderByDescending(a => a.ActionItemsWithoutDates); break;
            }

            return query;
        }

        private IQueryable<SiteReportItem> Filter(IQueryable<SiteReportItem> query, string name, List<string> choices)
        {
            switch (name)
            {
                case "Site": query = query.Where(e => choices.Contains(e.Site)); break;
                case "TotalCards": query = query.Where(e => choices.Contains(e.TotalCards.ToString())); break;
                case "HID": query = query.Where(e => choices.Contains(e.HID.ToString())); break;
                case "SafeBehavior": query = query.Where(e => choices.Contains(e.SafeBehavior.ToString())); break;
                case "UnsafeBehavior": query = query.Where(e => choices.Contains(e.UnsafeBehavior.ToString())); break;
                case "SafeUnsafeTotal": query = query.Where(e => choices.Contains(e.SafeUnsafeTotal.ToString())); break;
                case "HIDPercent": query = query.Where(e => choices.Contains(e.HIDPercent.ToString() + "%")); break;
                case "SafeBehaviorPercent": query = query.Where(e => choices.Contains(e.SafeBehaviorPercent.ToString() + "%")); break;
                case "UnsafeBehaviorPercent": query = query.Where(e => choices.Contains(e.UnsafeBehaviorPercent.ToString() + "%")); break;
                case "SafeUnsafeTotalPercent": query = query.Where(e => choices.Contains(e.SafeUnsafeTotalPercent.ToString() + "%")); break;
                case "OpenActionItems": query = query.Where(e => choices.Contains(e.OpenActionItems.ToString())); break;
                case "ExpiredActionItems": query = query.Where(e => choices.Contains(e.ExpiredActionItems.ToString())); break;
                case "ActionItemsWithoutDates": query = query.Where(e => choices.Contains(e.ActionItemsWithoutDates.ToString())); break;
            }

            return query;
        }

        private IQueryable<SiteReportItem> Search(IQueryable<SiteReportItem> query, string searchString)
        {
            var s = searchString.ToLower();

            return query.Where(i => i.Site.ToLower().Contains(s) ||
                                    i.TotalCards.ToString().Contains(s) ||
                                    i.HID.ToString().Contains(s) ||
                                    i.SafeBehavior.ToString().Contains(s) ||
                                    i.UnsafeBehavior.ToString().Contains(s) ||
                                    i.SafeUnsafeTotal.ToString().Contains(s) ||
                                    (i.HIDPercent.ToString() + "%").Contains(s) ||
                                    (i.SafeBehaviorPercent.ToString() + "%").Contains(s) ||
                                    (i.UnsafeBehaviorPercent.ToString() + "%").Contains(s) ||
                                    (i.SafeUnsafeTotalPercent.ToString() + "%").Contains(s) ||
                                    i.OpenActionItems.ToString().Contains(s) ||
                                    i.ExpiredActionItems.ToString().Contains(s) ||
                                    i.ActionItemsWithoutDates.ToString().Contains(s));
        }

        private List<SiteReportItem> GetResult(IQueryable<SiteReportItem> query)
        {
            return query.ToList();
        }

        private List<TotalItem> GetTotals(List<SiteReportItem> list)
        {
            var totals = new List<TotalItem>();

            var total = list.Select(i => i.TotalCards).Sum();
            var hid = list.Select(i => i.HID).Sum();
            var safe = list.Select(i => i.SafeBehavior).Sum();
            var _unsafe = list.Select(i => i.UnsafeBehavior).Sum();

            totals.Add(new TotalItem() { Field = "TotalCards", Total = total.ToString() });
            totals.Add(new TotalItem() { Field = "HID", Total = hid.ToString() });
            totals.Add(new TotalItem() { Field = "SafeBehavior", Total = safe.ToString() });
            totals.Add(new TotalItem() { Field = "UnsafeBehavior", Total = _unsafe.ToString() });
            totals.Add(new TotalItem() { Field = "SafeUnsafeTotal", Total = list.Select(i => i.SafeUnsafeTotal).Sum().ToString() });
            totals.Add(new TotalItem() { Field = "HIDPercent", Total = total > 0 ? Math.Round((100 * (double)hid / total), 1).ToString() + "%" : "" });
            totals.Add(new TotalItem() { Field = "SafeBehaviorPercent", Total = total > 0 ? Math.Round((100 * (double)safe / total), 1).ToString() + "%" : "" });
            totals.Add(new TotalItem() { Field = "UnsafeBehaviorPercent", Total = total > 0 ? Math.Round((100 * (double)_unsafe / total), 1).ToString() + "%" : "" });
            totals.Add(new TotalItem() { Field = "SafeUnsafeTotalPercent", Total = total > 0 ? Math.Round((100 * (double)(safe + _unsafe) / total), 1).ToString() + "%" : "" });
            totals.Add(new TotalItem() { Field = "OpenActionItems", Total = list.Select(i => i.OpenActionItems).Sum().ToString() });
            totals.Add(new TotalItem() { Field = "ExpiredActionItems", Total = list.Select(i => i.ExpiredActionItems).Sum().ToString() });
            totals.Add(new TotalItem() { Field = "ActionItemsWithoutDates", Total = list.Select(i => i.ActionItemsWithoutDates).Sum().ToString() });

            return totals;
        }

        private List<FilteringItem> GetFilteringValues(PropertyItemCollection properties)
        {
            var collection = this.GetBaseQuery(properties).ToList();

            var list = new List<FilteringItem>();

            list.Add(new FilteringItem() { Field = "Site", Choices = collection.Select(i => i.Site).Distinct().OrderBy(i => i).Cast<object>().ToList() });
            list.Add(new FilteringItem() { Field = "TotalCards", Choices = collection.Select(i => i.TotalCards).Distinct().OrderBy(i => i).Cast<object>().ToList() });
            list.Add(new FilteringItem() { Field = "HID", Choices = collection.Select(i => i.HID).Distinct().OrderBy(i => i).Cast<object>().ToList() });
            list.Add(new FilteringItem() { Field = "SafeBehavior", Choices = collection.Select(i => i.SafeBehavior).Distinct().OrderBy(i => i).Cast<object>().ToList() });
            list.Add(new FilteringItem() { Field = "UnsafeBehavior", Choices = collection.Select(i => i.UnsafeBehavior).Distinct().OrderBy(i => i).Cast<object>().ToList() });
            list.Add(new FilteringItem() { Field = "SafeUnsafeTotal", Choices = collection.Select(i => i.SafeUnsafeTotal).Distinct().OrderBy(i => i).Cast<object>().ToList() });
            list.Add(new FilteringItem() { Field = "HIDPercent", Choices = collection.Select(i => Math.Round(i.HIDPercent, 1) + "%").Distinct().OrderBy(i => i).Cast<object>().ToList() });
            list.Add(new FilteringItem() { Field = "SafeBehaviorPercent", Choices = collection.Select(i => Math.Round(i.SafeBehaviorPercent, 1) + "%").Distinct().OrderBy(i => i).Cast<object>().ToList() });
            list.Add(new FilteringItem() { Field = "UnsafeBehaviorPercent", Choices = collection.Select(i => Math.Round(i.UnsafeBehaviorPercent, 1) + "%").Distinct().OrderBy(i => i).Cast<object>().ToList() });
            list.Add(new FilteringItem() { Field = "SafeUnsafeTotalPercent", Choices = collection.Select(i => Math.Round(i.SafeUnsafeTotalPercent, 1) + "%").Distinct().OrderBy(i => i).Cast<object>().ToList() });
            list.Add(new FilteringItem() { Field = "OpenActionItems", Choices = collection.Select(i => i.OpenActionItems).Distinct().OrderBy(i => i).Cast<object>().ToList() });
            list.Add(new FilteringItem() { Field = "ExpiredActionItems", Choices = collection.Select(i => i.ExpiredActionItems).Distinct().OrderBy(i => i).Cast<object>().ToList() });
            list.Add(new FilteringItem() { Field = "ActionItemsWithoutDates", Choices = collection.Select(i => i.ActionItemsWithoutDates).Distinct().OrderBy(i => i).Cast<object>().ToList() });

            return list;
        }

        public TableViewResponse<SiteReportItem> GetData()
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

    public class SiteReportItem : BaseTimeReportItem
    {
        public string Site { get; set; }
        public int SafeUnsafeTotal { get; set; }
        public double HIDPercent { get; set; }
        public double SafeBehaviorPercent { get; set; }
        public double UnsafeBehaviorPercent { get; set; }
        public double SafeUnsafeTotalPercent { get; set; }
        public int OpenActionItems { get; set; }
        public int ExpiredActionItems { get; set; }
        public int ActionItemsWithoutDates { get; set; }
    }
}

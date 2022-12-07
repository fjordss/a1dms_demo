using System;
using System.Globalization;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;

namespace A1DMS.V2
{
    public class OIMSViewHelper : IViewHelper<OIMSReportItem>
    {
        private readonly Context db;
        private readonly HttpContext Context;
        private readonly UserService UserService;

        public TableView<OIMSReportItem, OIMSReportItem> Table { get; set; }

        public OIMSViewHelper(IHttpContextAccessor accessor, Context context, UserService userService)
        {
            this.Context = accessor.HttpContext;
            this.db = context;
            this.UserService = userService;

            this.GetTable();
        }

        public TableViewResponse<OIMSReportItem> GetData()
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

        public IEnumerable<OIMSReportItem> Export()
        {
            throw new NotImplementedException();
        }

        private void GetTable()
        {
            this.Table = new TableView<OIMSReportItem, OIMSReportItem>();

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
            var sitesList = this.db.Sites.ToList();

            var siteNames = this.UserService.GetSiteIds().Select(id => sitesList.Find(s => s.Id == id).Name).ToList();

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

        private IQueryable<OIMSReportItem> GetBaseQuery(PropertyItemCollection properties)
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
                .Select(g => new OIMSReportItem()
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

        private IQueryable<OIMSReportItem> Sort(IQueryable<OIMSReportItem> query, string name, SortType sortType)
        {
            switch (name)
            {
                case "site": query = sortType == SortType.Ascending ? query.OrderBy(a => a.Site) : query.OrderByDescending(a => a.Site); break;
                case "totalCards": query = sortType == SortType.Ascending ? query.OrderBy(a => a.TotalCards) : query.OrderByDescending(a => a.TotalCards); break;
                case "hid": query = sortType == SortType.Ascending ? query.OrderBy(a => a.HID) : query.OrderByDescending(a => a.HID); break;
                case "safeBehavior": query = sortType == SortType.Ascending ? query.OrderBy(a => a.SafeBehavior) : query.OrderByDescending(a => a.SafeBehavior); break;
                case "unsafeBehavior": query = sortType == SortType.Ascending ? query.OrderBy(a => a.UnsafeBehavior) : query.OrderByDescending(a => a.UnsafeBehavior); break;
                case "safeUnsafeTotal": query = sortType == SortType.Ascending ? query.OrderBy(a => a.SafeUnsafeTotal) : query.OrderByDescending(a => a.SafeUnsafeTotal); break;
                case "hidPercent": query = sortType == SortType.Ascending ? query.OrderBy(a => a.HIDPercent) : query.OrderByDescending(a => a.HIDPercent); break;
                case "safeBehaviorPercent": query = sortType == SortType.Ascending ? query.OrderBy(a => a.SafeBehaviorPercent) : query.OrderByDescending(a => a.SafeBehaviorPercent); break;
                case "unsafeBehaviorPercent": query = sortType == SortType.Ascending ? query.OrderBy(a => a.UnsafeBehaviorPercent) : query.OrderByDescending(a => a.UnsafeBehaviorPercent); break;
                case "safeUnsafeTotalPercent": query = sortType == SortType.Ascending ? query.OrderBy(a => a.SafeUnsafeTotalPercent) : query.OrderByDescending(a => a.SafeUnsafeTotalPercent); break;
                case "openActionItems": query = sortType == SortType.Ascending ? query.OrderBy(a => a.OpenActionItems) : query.OrderByDescending(a => a.OpenActionItems); break;
                case "expiredActionItems": query = sortType == SortType.Ascending ? query.OrderBy(a => a.ExpiredActionItems) : query.OrderByDescending(a => a.ExpiredActionItems); break;
                case "actionItemsWithoutDates": query = sortType == SortType.Ascending ? query.OrderBy(a => a.ActionItemsWithoutDates) : query.OrderByDescending(a => a.ActionItemsWithoutDates); break;
            }

            return query;
        }

        private IQueryable<OIMSReportItem> Filter(IQueryable<OIMSReportItem> query, string name, List<string> choices)
        {
            switch (name)
            {
                case "site": query = query.Where(e => choices.Contains(e.Site)); break;
                case "totalCards": query = query.Where(e => choices.Contains(e.TotalCards.ToString())); break;
                case "hid": query = query.Where(e => choices.Contains(e.HID.ToString())); break;
                case "safeBehavior": query = query.Where(e => choices.Contains(e.SafeBehavior.ToString())); break;
                case "unsafeBehavior": query = query.Where(e => choices.Contains(e.UnsafeBehavior.ToString())); break;
                case "safeUnsafeTotal": query = query.Where(e => choices.Contains(e.SafeUnsafeTotal.ToString())); break;
                case "hidPercent": query = query.Where(e => choices.Contains(e.HIDPercent.ToString() + "%")); break;
                case "safeBehaviorPercent": query = query.Where(e => choices.Contains(e.SafeBehaviorPercent.ToString() + "%")); break;
                case "unsafeBehaviorPercent": query = query.Where(e => choices.Contains(e.UnsafeBehaviorPercent.ToString() + "%")); break;
                case "safeUnsafeTotalPercent": query = query.Where(e => choices.Contains(e.SafeUnsafeTotalPercent.ToString() + "%")); break;
                case "openActionItems": query = query.Where(e => choices.Contains(e.OpenActionItems.ToString())); break;
                case "expiredActionItems": query = query.Where(e => choices.Contains(e.ExpiredActionItems.ToString())); break;
                case "actionItemsWithoutDates": query = query.Where(e => choices.Contains(e.ActionItemsWithoutDates.ToString())); break;
            }

            return query;
        }

        private IQueryable<OIMSReportItem> Search(IQueryable<OIMSReportItem> query, string name, string text)
        {
            var s = text.ToLower();

            switch (name)
            {
                case "site": query = query.Where(e => e.Site.ToLower().Contains(s)); break;
                case "totalCards": query = query.Where(e => e.TotalCards.ToString().Contains(s)); break;
                case "hid": query = query.Where(e => e.HID.ToString().Contains(s)); break;
                case "safeBehavior": query = query.Where(e => e.SafeBehavior.ToString().Contains(s)); break;
                case "unsafeBehavior": query = query.Where(e => e.UnsafeBehavior.ToString().Contains(s)); break;
                case "safeUnsafeTotal": query = query.Where(e => e.SafeUnsafeTotal.ToString().Contains(s)); break;
                case "hidPercent": query = query.Where(e => e.HIDPercent.ToString().Contains(s)); break;
                case "safeBehaviorPercent": query = query.Where(e => e.SafeBehaviorPercent.ToString().Contains(s)); break;
                case "unsafeBehaviorPercent": query = query.Where(e => e.UnsafeBehavior.ToString().Contains(s)); break;
                case "safeUnsafeTotalPercent": query = query.Where(e => e.SafeUnsafeTotalPercent.ToString().Contains(s)); break;
                case "openActionItems": query = query.Where(e => e.OpenActionItems.ToString().Contains(s)); break;
                case "expiredActionItems": query = query.Where(e => e.ExpiredActionItems.ToString().Contains(s)); break;
                case "actionItemsWithoutDates": query = query.Where(e => e.ActionItemsWithoutDates.ToString().Contains(s)); break;
            }

            return query;
        }

        private IQueryable<OIMSReportItem> SearchEverywhere(IQueryable<OIMSReportItem> query, string searchString)
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

        private List<OIMSReportItem> GetResult(IQueryable<OIMSReportItem> query)
        {
            return query.ToList();
        }

        private List<TotalItem> GetTotals(IEnumerable<OIMSReportItem> collection)
        {
            var totals = new List<TotalItem>();

            var total = collection.Select(i => i.TotalCards).Sum();
            var hid = collection.Select(i => i.HID).Sum();
            var safe = collection.Select(i => i.SafeBehavior).Sum();
            var _unsafe = collection.Select(i => i.UnsafeBehavior).Sum();

            totals.Add(new TotalItem() { Field = "totalCards", Total = total.ToString() });
            totals.Add(new TotalItem() { Field = "hid", Total = hid.ToString() });
            totals.Add(new TotalItem() { Field = "safeBehavior", Total = safe.ToString() });
            totals.Add(new TotalItem() { Field = "unsafeBehavior", Total = _unsafe.ToString() });
            totals.Add(new TotalItem() { Field = "safeUnsafeTotal", Total = collection.Select(i => i.SafeUnsafeTotal).Sum().ToString() });
            totals.Add(new TotalItem() { Field = "hidPercent", Total = total > 0 ? Math.Round((100 * (double)hid / total), 1).ToString() + "%" : "" });
            totals.Add(new TotalItem() { Field = "safeBehaviorPercent", Total = total > 0 ? Math.Round((100 * (double)safe / total), 1).ToString() + "%" : "" });
            totals.Add(new TotalItem() { Field = "unsafeBehaviorPercent", Total = total > 0 ? Math.Round((100 * (double)_unsafe / total), 1).ToString() + "%" : "" });
            totals.Add(new TotalItem() { Field = "safeUnsafeTotalPercent", Total = total > 0 ? Math.Round((100 * (double)(safe + _unsafe) / total), 1).ToString() + "%" : "" });
            totals.Add(new TotalItem() { Field = "openActionItems", Total = collection.Select(i => i.OpenActionItems).Sum().ToString() });
            totals.Add(new TotalItem() { Field = "expiredActionItems", Total = collection.Select(i => i.ExpiredActionItems).Sum().ToString() });
            totals.Add(new TotalItem() { Field = "actionItemsWithoutDates", Total = collection.Select(i => i.ActionItemsWithoutDates).Sum().ToString() });

            return totals;
        }

        private List<FilteringItem> GetFilteringValues(IEnumerable<OIMSReportItem> collection)
        {
            var list = new List<FilteringItem>();

            list.Add(new FilteringItem() { Field = "site", Choices = collection.Select(i => i.Site).Distinct().OrderBy(i => i) });
            list.Add(new FilteringItem() { Field = "totalCards", Choices = collection.Select(i => i.TotalCards).Distinct().OrderBy(i => i).Select(i => i.ToString()) });
            list.Add(new FilteringItem() { Field = "hid", Choices = collection.Select(i => i.HID).Distinct().OrderBy(i => i).Select(i => i.ToString()) });
            list.Add(new FilteringItem() { Field = "safeBehavior", Choices = collection.Select(i => i.SafeBehavior).Distinct().OrderBy(i => i).Select(i => i.ToString()) });
            list.Add(new FilteringItem() { Field = "unsafeBehavior", Choices = collection.Select(i => i.UnsafeBehavior).Distinct().OrderBy(i => i).Select(i => i.ToString()) });
            list.Add(new FilteringItem() { Field = "safeUnsafeTotal", Choices = collection.Select(i => i.SafeUnsafeTotal).Distinct().OrderBy(i => i).Select(i => i.ToString()) });
            list.Add(new FilteringItem() { Field = "hidPercent", Choices = collection.Select(i => Math.Round(i.HIDPercent, 1) + "%").Distinct().OrderBy(i => i) });
            list.Add(new FilteringItem() { Field = "safeBehaviorPercent", Choices = collection.Select(i => Math.Round(i.SafeBehaviorPercent, 1) + "%").Distinct().OrderBy(i => i) });
            list.Add(new FilteringItem() { Field = "unsafeBehaviorPercent", Choices = collection.Select(i => Math.Round(i.UnsafeBehaviorPercent, 1) + "%").Distinct().OrderBy(i => i) });
            list.Add(new FilteringItem() { Field = "safeUnsafeTotalPercent", Choices = collection.Select(i => Math.Round(i.SafeUnsafeTotalPercent, 1) + "%").Distinct().OrderBy(i => i) });
            list.Add(new FilteringItem() { Field = "openActionItems", Choices = collection.Select(i => i.OpenActionItems).Distinct().OrderBy(i => i).Select(i => i.ToString()) });
            list.Add(new FilteringItem() { Field = "expiredActionItems", Choices = collection.Select(i => i.ExpiredActionItems).Distinct().OrderBy(i => i).Select(i => i.ToString()) });
            list.Add(new FilteringItem() { Field = "actionItemsWithoutDates", Choices = collection.Select(i => i.ActionItemsWithoutDates).Distinct().OrderBy(i => i).Select(i => i.ToString()) });

            return list;
        }
    }

    public class OIMSReportItem : BaseTimeReportItem
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

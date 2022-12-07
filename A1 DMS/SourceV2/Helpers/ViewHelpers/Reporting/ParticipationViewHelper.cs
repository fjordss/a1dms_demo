using System;
using System.Globalization;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;

namespace A1DMS.V2
{
    public class ParticipationViewHelper : IViewHelper<MonthlyReportItem>
    {
        private readonly Context db;
        private readonly HttpContext Context;
        private readonly UserService UserService;

        public TableView<MonthlyReportItem, MonthlyReportItem> Table { get; set; }

        public ParticipationViewHelper(IHttpContextAccessor accessor, Context context, UserService userService)
        {
            this.Context = accessor.HttpContext;
            this.db = context;
            this.UserService = userService;

            this.GetTable();
        }

        public TableViewResponse<MonthlyReportItem> GetData()
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

        public IEnumerable<MonthlyReportItem> Export()
        {
            this.Table.Proceed(false);

            return this.Table.Response.Rows;
        }

        private void GetTable()
        {
            this.Table = new TableView<MonthlyReportItem, MonthlyReportItem>();

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

        public void ParseProperties(List<string> sites, List<string> companies, List<string> departments, int year, int month)
        {
            var siteList = this.db.Sites.ToList();

            var siteNames = this.UserService.GetSiteIds().Select(id => siteList.Find(s => s.Id == id).Name).ToList();

            if (sites != null && sites.Count > 0)
                this.Table.Properties.SetValue("Sites", sites);
            else if (siteNames.Count > 0)
                this.Table.Properties.SetValue("Sites", siteNames);

            if (companies != null && companies.Count > 0)
                this.Table.Properties.SetValue("Companies", companies);

            if (departments != null && departments.Count > 0)
                this.Table.Properties.SetValue("Departments", departments);

            var From = DateTime.ParseExact(year + "-" + month + "-1", "yyyy-M-d", CultureInfo.InvariantCulture);

            this.Table.Properties.SetValue("From", From);
            this.Table.Properties.SetValue("To", From.AddMonths(1).AddSeconds(-1));
        }

        private IQueryable<MonthlyReportItem> GetBaseQuery(PropertyItemCollection properties)
        {
            var from = properties.GetValue<DateTime>("From");
            var to = properties.GetValue<DateTime>("To");

            var query = this.db.Employees
               .Include(c => c.Company)
               .Include(d => d.Department)
               .Include(s => s.Site)
               .AsQueryable();

            if (properties.ContainsKey("Sites"))
                query = query.Where(a => properties.GetValue<List<string>>("Sites").Contains(a.Site.Name));

            if (properties.ContainsKey("Companies"))
                query = query.Where(a => properties.GetValue<List<string>>("Companies").Contains(a.Company.Name));

            if (properties.ContainsKey("Departments"))
                query = query.Where(a => properties.GetValue<List<string>>("Departments").Contains(a.Department.Name));

            return query
                .SelectMany(a =>
                    a.NGHCards
                        .DefaultIfEmpty()
                        .Where(c => c.Date >= from && c.Date <= to),
                    (e, c) => new
                    {
                        Employee = e,
                        Card = c
                    })
                .GroupBy(a => new
                {
                    Id = a.Employee.Id,
                    Code = a.Employee.Code,
                    Name = (!string.IsNullOrEmpty(a.Employee.LastName) ? a.Employee.LastName + ", " : "") + (!string.IsNullOrEmpty(a.Employee.FirstName) ? a.Employee.FirstName : ""),
                    Company = a.Employee.Company.Name,
                    Department = a.Employee.Department.Name,
                    Site = a.Employee.Site.Name
                })
                .Select(g => new MonthlyReportItem()
                {
                    Code = g.Key.Code,
                    Name = g.Key.Name,
                    Company = g.Key.Company,
                    Department = g.Key.Department,
                    Site = g.Key.Site,
                    TotalCards = g.Count(a => a.Card != null),
                    D1 = g.Count(a => a.Card.Date.Day == 1),
                    D2 = g.Count(a => a.Card.Date.Day == 2),
                    D3 = g.Count(a => a.Card.Date.Day == 3),
                    D4 = g.Count(a => a.Card.Date.Day == 4),
                    D5 = g.Count(a => a.Card.Date.Day == 5),
                    D6 = g.Count(a => a.Card.Date.Day == 6),
                    D7 = g.Count(a => a.Card.Date.Day == 7),
                    D8 = g.Count(a => a.Card.Date.Day == 8),
                    D9 = g.Count(a => a.Card.Date.Day == 9),
                    D10 = g.Count(a => a.Card.Date.Day == 10),
                    D11 = g.Count(a => a.Card.Date.Day == 11),
                    D12 = g.Count(a => a.Card.Date.Day == 12),
                    D13 = g.Count(a => a.Card.Date.Day == 13),
                    D14 = g.Count(a => a.Card.Date.Day == 14),
                    D15 = g.Count(a => a.Card.Date.Day == 15),
                    D16 = g.Count(a => a.Card.Date.Day == 16),
                    D17 = g.Count(a => a.Card.Date.Day == 17),
                    D18 = g.Count(a => a.Card.Date.Day == 18),
                    D19 = g.Count(a => a.Card.Date.Day == 19),
                    D20 = g.Count(a => a.Card.Date.Day == 20),
                    D21 = g.Count(a => a.Card.Date.Day == 21),
                    D22 = g.Count(a => a.Card.Date.Day == 22),
                    D23 = g.Count(a => a.Card.Date.Day == 23),
                    D24 = g.Count(a => a.Card.Date.Day == 24),
                    D25 = g.Count(a => a.Card.Date.Day == 25),
                    D26 = g.Count(a => a.Card.Date.Day == 26),
                    D27 = g.Count(a => a.Card.Date.Day == 27),
                    D28 = g.Count(a => a.Card.Date.Day == 28),
                    D29 = g.Count(a => a.Card.Date.Day == 29),
                    D30 = g.Count(a => a.Card.Date.Day == 30),
                    D31 = g.Count(a => a.Card.Date.Day == 31)
                })
                .Where(d => d.D1 != 0 || d.D2 != 0 || d.D3 != 0 || d.D4 != 0 || d.D5 != 0 || d.D6 != 0 || d.D7 != 0 || d.D8 != 0 || d.D9 != 0 || d.D10 != 0 ||
                            d.D11 != 0 || d.D12 != 0 || d.D13 != 0 || d.D14 != 0 || d.D15 != 0 || d.D16 != 0 || d.D17 != 0 || d.D18 != 0 || d.D19 != 0 || d.D20 != 0 ||
                            d.D21 != 0 || d.D22 != 0 || d.D23 != 0 || d.D24 != 0 || d.D25 != 0 || d.D26 != 0 || d.D27 != 0 || d.D28 != 0 || d.D29 != 0 || d.D30 != 0 ||
                            d.D31 != 0)
                .OrderBy(a => a.Name);
        }

        private IQueryable<MonthlyReportItem> Sort(IQueryable<MonthlyReportItem> query, string name, SortType sortType)
        {
            switch (name)
            {
                case "code": query = sortType == SortType.Ascending ? query.OrderBy(a => a.Code) : query.OrderByDescending(a => a.Code); break;
                case "name": query = sortType == SortType.Ascending ? query.OrderBy(a => a.Name) : query.OrderByDescending(a => a.Name); break;
                case "company": query = sortType == SortType.Ascending ? query.OrderBy(a => a.Company) : query.OrderByDescending(a => a.Company); break;
                case "department": query = sortType == SortType.Ascending ? query.OrderBy(a => a.Department) : query.OrderByDescending(a => a.Department); break;
                case "site": query = sortType == SortType.Ascending ? query.OrderBy(a => a.Site) : query.OrderByDescending(a => a.Site); break;
                case "totalCards": query = sortType == SortType.Ascending ? query.OrderBy(a => a.TotalCards) : query.OrderByDescending(a => a.TotalCards); break;
                case "d1": query = sortType == SortType.Ascending ? query.OrderBy(a => a.D1) : query.OrderByDescending(a => a.D1); break;
                case "d2": query = sortType == SortType.Ascending ? query.OrderBy(a => a.D2) : query.OrderByDescending(a => a.D2); break;
                case "d3": query = sortType == SortType.Ascending ? query.OrderBy(a => a.D3) : query.OrderByDescending(a => a.D3); break;
                case "d4": query = sortType == SortType.Ascending ? query.OrderBy(a => a.D4) : query.OrderByDescending(a => a.D4); break;
                case "d5": query = sortType == SortType.Ascending ? query.OrderBy(a => a.D5) : query.OrderByDescending(a => a.D5); break;
                case "d6": query = sortType == SortType.Ascending ? query.OrderBy(a => a.D6) : query.OrderByDescending(a => a.D6); break;
                case "d7": query = sortType == SortType.Ascending ? query.OrderBy(a => a.D7) : query.OrderByDescending(a => a.D7); break;
                case "d8": query = sortType == SortType.Ascending ? query.OrderBy(a => a.D8) : query.OrderByDescending(a => a.D8); break;
                case "d9": query = sortType == SortType.Ascending ? query.OrderBy(a => a.D9) : query.OrderByDescending(a => a.D9); break;
                case "d10": query = sortType == SortType.Ascending ? query.OrderBy(a => a.D10) : query.OrderByDescending(a => a.D10); break;
                case "d11": query = sortType == SortType.Ascending ? query.OrderBy(a => a.D11) : query.OrderByDescending(a => a.D11); break;
                case "d12": query = sortType == SortType.Ascending ? query.OrderBy(a => a.D12) : query.OrderByDescending(a => a.D12); break;
                case "d13": query = sortType == SortType.Ascending ? query.OrderBy(a => a.D13) : query.OrderByDescending(a => a.D13); break;
                case "d14": query = sortType == SortType.Ascending ? query.OrderBy(a => a.D14) : query.OrderByDescending(a => a.D14); break;
                case "d15": query = sortType == SortType.Ascending ? query.OrderBy(a => a.D15) : query.OrderByDescending(a => a.D15); break;
                case "d16": query = sortType == SortType.Ascending ? query.OrderBy(a => a.D16) : query.OrderByDescending(a => a.D16); break;
                case "d17": query = sortType == SortType.Ascending ? query.OrderBy(a => a.D17) : query.OrderByDescending(a => a.D17); break;
                case "d18": query = sortType == SortType.Ascending ? query.OrderBy(a => a.D18) : query.OrderByDescending(a => a.D18); break;
                case "d19": query = sortType == SortType.Ascending ? query.OrderBy(a => a.D19) : query.OrderByDescending(a => a.D19); break;
                case "d20": query = sortType == SortType.Ascending ? query.OrderBy(a => a.D20) : query.OrderByDescending(a => a.D20); break;
                case "d21": query = sortType == SortType.Ascending ? query.OrderBy(a => a.D21) : query.OrderByDescending(a => a.D21); break;
                case "d22": query = sortType == SortType.Ascending ? query.OrderBy(a => a.D22) : query.OrderByDescending(a => a.D22); break;
                case "d23": query = sortType == SortType.Ascending ? query.OrderBy(a => a.D23) : query.OrderByDescending(a => a.D23); break;
                case "d24": query = sortType == SortType.Ascending ? query.OrderBy(a => a.D24) : query.OrderByDescending(a => a.D24); break;
                case "d25": query = sortType == SortType.Ascending ? query.OrderBy(a => a.D25) : query.OrderByDescending(a => a.D25); break;
                case "d26": query = sortType == SortType.Ascending ? query.OrderBy(a => a.D26) : query.OrderByDescending(a => a.D26); break;
                case "d27": query = sortType == SortType.Ascending ? query.OrderBy(a => a.D27) : query.OrderByDescending(a => a.D27); break;
                case "d28": query = sortType == SortType.Ascending ? query.OrderBy(a => a.D28) : query.OrderByDescending(a => a.D28); break;
                case "d29": query = sortType == SortType.Ascending ? query.OrderBy(a => a.D29) : query.OrderByDescending(a => a.D29); break;
                case "d30": query = sortType == SortType.Ascending ? query.OrderBy(a => a.D30) : query.OrderByDescending(a => a.D30); break;
                case "d31": query = sortType == SortType.Ascending ? query.OrderBy(a => a.D31) : query.OrderByDescending(a => a.D31); break;
            }

            return query;
        }

        private IQueryable<MonthlyReportItem> Filter(IQueryable<MonthlyReportItem> query, string name, List<string> choices)
        {
            switch (name)
            {
                case "code": query = query.Where(e => choices.Contains(e.Code.ToString())); break;
                case "name": query = query.Where(e => choices.Contains(e.Name)); break;
                case "company": query = query.Where(e => choices.Contains(e.Company)); break;
                case "department": query = query.Where(e => choices.Contains(e.Department)); break;
                case "site": query = query.Where(e => choices.Contains(e.Site)); break;
                case "totalCards": query = query.Where(e => choices.Contains(e.TotalCards.ToString())); break;
                case "d1": query = query.Where(e => choices.Contains(e.D1.ToString())); break;
                case "d2": query = query.Where(e => choices.Contains(e.D2.ToString())); break;
                case "d3": query = query.Where(e => choices.Contains(e.D3.ToString())); break;
                case "d4": query = query.Where(e => choices.Contains(e.D4.ToString())); break;
                case "d5": query = query.Where(e => choices.Contains(e.D5.ToString())); break;
                case "d6": query = query.Where(e => choices.Contains(e.D6.ToString())); break;
                case "d7": query = query.Where(e => choices.Contains(e.D7.ToString())); break;
                case "d8": query = query.Where(e => choices.Contains(e.D8.ToString())); break;
                case "d9": query = query.Where(e => choices.Contains(e.D9.ToString())); break;
                case "d10": query = query.Where(e => choices.Contains(e.D10.ToString())); break;
                case "d11": query = query.Where(e => choices.Contains(e.D11.ToString())); break;
                case "d12": query = query.Where(e => choices.Contains(e.D12.ToString())); break;
                case "d13": query = query.Where(e => choices.Contains(e.D13.ToString())); break;
                case "d14": query = query.Where(e => choices.Contains(e.D14.ToString())); break;
                case "d15": query = query.Where(e => choices.Contains(e.D15.ToString())); break;
                case "d16": query = query.Where(e => choices.Contains(e.D16.ToString())); break;
                case "d17": query = query.Where(e => choices.Contains(e.D17.ToString())); break;
                case "d18": query = query.Where(e => choices.Contains(e.D18.ToString())); break;
                case "d19": query = query.Where(e => choices.Contains(e.D19.ToString())); break;
                case "d20": query = query.Where(e => choices.Contains(e.D20.ToString())); break;
                case "d21": query = query.Where(e => choices.Contains(e.D21.ToString())); break;
                case "d22": query = query.Where(e => choices.Contains(e.D22.ToString())); break;
                case "d23": query = query.Where(e => choices.Contains(e.D23.ToString())); break;
                case "d24": query = query.Where(e => choices.Contains(e.D24.ToString())); break;
                case "d25": query = query.Where(e => choices.Contains(e.D25.ToString())); break;
                case "d26": query = query.Where(e => choices.Contains(e.D26.ToString())); break;
                case "d27": query = query.Where(e => choices.Contains(e.D27.ToString())); break;
                case "d28": query = query.Where(e => choices.Contains(e.D28.ToString())); break;
                case "d29": query = query.Where(e => choices.Contains(e.D29.ToString())); break;
                case "d30": query = query.Where(e => choices.Contains(e.D30.ToString())); break;
                case "d31": query = query.Where(e => choices.Contains(e.D31.ToString())); break;
            }

            return query;
        }

        private IQueryable<MonthlyReportItem> Search(IQueryable<MonthlyReportItem> query, string name, string text)
        {
            var s = text.ToLower();

            switch (name)
            {
                case "code": query = query.Where(e => e.Code.ToString().Contains(s)); break;
                case "name": query = query.Where(e => e.Name.ToLower().Contains(s)); break;
                case "company": query = query.Where(e => e.Company.ToLower().Contains(s)); break;
                case "department": query = query.Where(e => e.Department.ToLower().Contains(s)); break;
                case "site": query = query.Where(e => e.Site.ToLower().Contains(s)); break;
                case "totalCards": query = query.Where(e => e.TotalCards.ToString().Contains(s)); break;
                case "d1": query = query.Where(e => e.D1.ToString().Contains(s)); break;
                case "d2": query = query.Where(e => e.D2.ToString().Contains(s)); break;
                case "d3": query = query.Where(e => e.D3.ToString().Contains(s)); break;
                case "d4": query = query.Where(e => e.D4.ToString().Contains(s)); break;
                case "d5": query = query.Where(e => e.D5.ToString().Contains(s)); break;
                case "d6": query = query.Where(e => e.D6.ToString().Contains(s)); break;
                case "d7": query = query.Where(e => e.D7.ToString().Contains(s)); break;
                case "d8": query = query.Where(e => e.D8.ToString().Contains(s)); break;
                case "d9": query = query.Where(e => e.D9.ToString().Contains(s)); break;
                case "d10": query = query.Where(e => e.D10.ToString().Contains(s)); break;
                case "d11": query = query.Where(e => e.D11.ToString().Contains(s)); break;
                case "d12": query = query.Where(e => e.D12.ToString().Contains(s)); break;
                case "d13": query = query.Where(e => e.D13.ToString().Contains(s)); break;
                case "d14": query = query.Where(e => e.D14.ToString().Contains(s)); break;
                case "d15": query = query.Where(e => e.D15.ToString().Contains(s)); break;
                case "d16": query = query.Where(e => e.D16.ToString().Contains(s)); break;
                case "d17": query = query.Where(e => e.D17.ToString().Contains(s)); break;
                case "d18": query = query.Where(e => e.D18.ToString().Contains(s)); break;
                case "d19": query = query.Where(e => e.D19.ToString().Contains(s)); break;
                case "d20": query = query.Where(e => e.D20.ToString().Contains(s)); break;
                case "d21": query = query.Where(e => e.D21.ToString().Contains(s)); break;
                case "d22": query = query.Where(e => e.D22.ToString().Contains(s)); break;
                case "d23": query = query.Where(e => e.D23.ToString().Contains(s)); break;
                case "d24": query = query.Where(e => e.D24.ToString().Contains(s)); break;
                case "d25": query = query.Where(e => e.D25.ToString().Contains(s)); break;
                case "d26": query = query.Where(e => e.D26.ToString().Contains(s)); break;
                case "d27": query = query.Where(e => e.D27.ToString().Contains(s)); break;
                case "d28": query = query.Where(e => e.D28.ToString().Contains(s)); break;
                case "d29": query = query.Where(e => e.D29.ToString().Contains(s)); break;
                case "d30": query = query.Where(e => e.D30.ToString().Contains(s)); break;
                case "d31": query = query.Where(e => e.D31.ToString().Contains(s)); break;
            }

            return query;
        }

        private IQueryable<MonthlyReportItem> SearchEverywhere(IQueryable<MonthlyReportItem> query, string searchString)
        {
            var s = searchString.ToLower();

            return query.Where(i => i.Code.ToString().Contains(s) ||
                                    i.Name.ToLower().Contains(s) ||
                                    i.Company.ToLower().Contains(s) ||
                                    i.Department.ToLower().Contains(s) ||
                                    i.Site.ToLower().Contains(s) ||
                                    i.TotalCards.ToString().Contains(s) ||
                                    i.D1.ToString().Contains(s) ||
                                    i.D2.ToString().Contains(s) ||
                                    i.D3.ToString().Contains(s) ||
                                    i.D4.ToString().Contains(s) ||
                                    i.D5.ToString().Contains(s) ||
                                    i.D6.ToString().Contains(s) ||
                                    i.D7.ToString().Contains(s) ||
                                    i.D8.ToString().Contains(s) ||
                                    i.D9.ToString().Contains(s) ||
                                    i.D10.ToString().Contains(s) ||
                                    i.D11.ToString().Contains(s) ||
                                    i.D12.ToString().Contains(s) ||
                                    i.D13.ToString().Contains(s) ||
                                    i.D14.ToString().Contains(s) ||
                                    i.D15.ToString().Contains(s) ||
                                    i.D16.ToString().Contains(s) ||
                                    i.D17.ToString().Contains(s) ||
                                    i.D18.ToString().Contains(s) ||
                                    i.D19.ToString().Contains(s) ||
                                    i.D20.ToString().Contains(s) ||
                                    i.D21.ToString().Contains(s) ||
                                    i.D22.ToString().Contains(s) ||
                                    i.D23.ToString().Contains(s) ||
                                    i.D24.ToString().Contains(s) ||
                                    i.D25.ToString().Contains(s) ||
                                    i.D26.ToString().Contains(s) ||
                                    i.D27.ToString().Contains(s) ||
                                    i.D28.ToString().Contains(s) ||
                                    i.D29.ToString().Contains(s) ||
                                    i.D30.ToString().Contains(s) ||
                                    i.D31.ToString().Contains(s));
        }

        private List<MonthlyReportItem> GetResult(IQueryable<MonthlyReportItem> query)
        {
            return query.ToList();
        }

        private List<TotalItem> GetTotals(IEnumerable<MonthlyReportItem> collection)
        {
            var totals = new List<TotalItem>();

            totals.Add(new TotalItem() { Field = "totalCards", Total = collection.Select(i => i.TotalCards).Sum().ToString() });
            totals.Add(new TotalItem() { Field = "d1", Total = collection.Select(i => i.D1).Sum().ToString() });
            totals.Add(new TotalItem() { Field = "d2", Total = collection.Select(i => i.D2).Sum().ToString() });
            totals.Add(new TotalItem() { Field = "d3", Total = collection.Select(i => i.D3).Sum().ToString() });
            totals.Add(new TotalItem() { Field = "d4", Total = collection.Select(i => i.D4).Sum().ToString() });
            totals.Add(new TotalItem() { Field = "d5", Total = collection.Select(i => i.D5).Sum().ToString() });
            totals.Add(new TotalItem() { Field = "d6", Total = collection.Select(i => i.D6).Sum().ToString() });
            totals.Add(new TotalItem() { Field = "d7", Total = collection.Select(i => i.D7).Sum().ToString() });
            totals.Add(new TotalItem() { Field = "d8", Total = collection.Select(i => i.D8).Sum().ToString() });
            totals.Add(new TotalItem() { Field = "d9", Total = collection.Select(i => i.D9).Sum().ToString() });
            totals.Add(new TotalItem() { Field = "d10", Total = collection.Select(i => i.D10).Sum().ToString() });
            totals.Add(new TotalItem() { Field = "d11", Total = collection.Select(i => i.D11).Sum().ToString() });
            totals.Add(new TotalItem() { Field = "d12", Total = collection.Select(i => i.D12).Sum().ToString() });
            totals.Add(new TotalItem() { Field = "d13", Total = collection.Select(i => i.D13).Sum().ToString() });
            totals.Add(new TotalItem() { Field = "d14", Total = collection.Select(i => i.D14).Sum().ToString() });
            totals.Add(new TotalItem() { Field = "d15", Total = collection.Select(i => i.D15).Sum().ToString() });
            totals.Add(new TotalItem() { Field = "d16", Total = collection.Select(i => i.D16).Sum().ToString() });
            totals.Add(new TotalItem() { Field = "d17", Total = collection.Select(i => i.D17).Sum().ToString() });
            totals.Add(new TotalItem() { Field = "d18", Total = collection.Select(i => i.D18).Sum().ToString() });
            totals.Add(new TotalItem() { Field = "d19", Total = collection.Select(i => i.D19).Sum().ToString() });
            totals.Add(new TotalItem() { Field = "d20", Total = collection.Select(i => i.D20).Sum().ToString() });
            totals.Add(new TotalItem() { Field = "d21", Total = collection.Select(i => i.D21).Sum().ToString() });
            totals.Add(new TotalItem() { Field = "d22", Total = collection.Select(i => i.D22).Sum().ToString() });
            totals.Add(new TotalItem() { Field = "d23", Total = collection.Select(i => i.D23).Sum().ToString() });
            totals.Add(new TotalItem() { Field = "d24", Total = collection.Select(i => i.D24).Sum().ToString() });
            totals.Add(new TotalItem() { Field = "d25", Total = collection.Select(i => i.D25).Sum().ToString() });
            totals.Add(new TotalItem() { Field = "d26", Total = collection.Select(i => i.D26).Sum().ToString() });
            totals.Add(new TotalItem() { Field = "d27", Total = collection.Select(i => i.D27).Sum().ToString() });
            totals.Add(new TotalItem() { Field = "d28", Total = collection.Select(i => i.D28).Sum().ToString() });
            totals.Add(new TotalItem() { Field = "d29", Total = collection.Select(i => i.D29).Sum().ToString() });
            totals.Add(new TotalItem() { Field = "d30", Total = collection.Select(i => i.D30).Sum().ToString() });
            totals.Add(new TotalItem() { Field = "d31", Total = collection.Select(i => i.D31).Sum().ToString() });

            return totals;
        }

        private List<FilteringItem> GetFilteringValues(IEnumerable<MonthlyReportItem> collection)
        {
            var list = new List<FilteringItem>();

            list.Add(new FilteringItem() { Field = "code", Choices = collection.Select(i => i.Code).Distinct().OrderBy(i => i).Select(i => i.ToString()) });
            list.Add(new FilteringItem() { Field = "name", Choices = collection.Select(i => i.Name).Distinct().OrderBy(i => i) });
            list.Add(new FilteringItem() { Field = "site", Choices = collection.Select(i => i.Site).Distinct().OrderBy(i => i) });
            list.Add(new FilteringItem() { Field = "company", Choices = collection.Select(i => i.Company).Distinct().OrderBy(i => i) });
            list.Add(new FilteringItem() { Field = "department", Choices = collection.Select(i => i.Department).Distinct().OrderBy(i => i) });
            list.Add(new FilteringItem() { Field = "totalCards", Choices = collection.Select(i => i.TotalCards).Distinct().OrderBy(i => i).Select(i => i.ToString()) });
            list.Add(new FilteringItem() { Field = "d1", Choices = collection.Select(i => i.D1).Distinct().OrderBy(i => i).Select(i => i.ToString()) });
            list.Add(new FilteringItem() { Field = "d2", Choices = collection.Select(i => i.D2).Distinct().OrderBy(i => i).Select(i => i.ToString()) });
            list.Add(new FilteringItem() { Field = "d3", Choices = collection.Select(i => i.D3).Distinct().OrderBy(i => i).Select(i => i.ToString()) });
            list.Add(new FilteringItem() { Field = "d4", Choices = collection.Select(i => i.D4).Distinct().OrderBy(i => i).Select(i => i.ToString()) });
            list.Add(new FilteringItem() { Field = "d5", Choices = collection.Select(i => i.D5).Distinct().OrderBy(i => i).Select(i => i.ToString()) });
            list.Add(new FilteringItem() { Field = "d6", Choices = collection.Select(i => i.D6).Distinct().OrderBy(i => i).Select(i => i.ToString()) });
            list.Add(new FilteringItem() { Field = "d7", Choices = collection.Select(i => i.D7).Distinct().OrderBy(i => i).Select(i => i.ToString()) });
            list.Add(new FilteringItem() { Field = "d8", Choices = collection.Select(i => i.D8).Distinct().OrderBy(i => i).Select(i => i.ToString()) });
            list.Add(new FilteringItem() { Field = "d9", Choices = collection.Select(i => i.D9).Distinct().OrderBy(i => i).Select(i => i.ToString()) });
            list.Add(new FilteringItem() { Field = "d10", Choices = collection.Select(i => i.D10).Distinct().OrderBy(i => i).Select(i => i.ToString()) });
            list.Add(new FilteringItem() { Field = "d11", Choices = collection.Select(i => i.D11).Distinct().OrderBy(i => i).Select(i => i.ToString()) });
            list.Add(new FilteringItem() { Field = "d12", Choices = collection.Select(i => i.D12).Distinct().OrderBy(i => i).Select(i => i.ToString()) });
            list.Add(new FilteringItem() { Field = "d13", Choices = collection.Select(i => i.D13).Distinct().OrderBy(i => i).Select(i => i.ToString()) });
            list.Add(new FilteringItem() { Field = "d14", Choices = collection.Select(i => i.D14).Distinct().OrderBy(i => i).Select(i => i.ToString()) });
            list.Add(new FilteringItem() { Field = "d15", Choices = collection.Select(i => i.D15).Distinct().OrderBy(i => i).Select(i => i.ToString()) });
            list.Add(new FilteringItem() { Field = "d16", Choices = collection.Select(i => i.D16).Distinct().OrderBy(i => i).Select(i => i.ToString()) });
            list.Add(new FilteringItem() { Field = "d17", Choices = collection.Select(i => i.D17).Distinct().OrderBy(i => i).Select(i => i.ToString()) });
            list.Add(new FilteringItem() { Field = "d18", Choices = collection.Select(i => i.D18).Distinct().OrderBy(i => i).Select(i => i.ToString()) });
            list.Add(new FilteringItem() { Field = "d19", Choices = collection.Select(i => i.D19).Distinct().OrderBy(i => i).Select(i => i.ToString()) });
            list.Add(new FilteringItem() { Field = "d20", Choices = collection.Select(i => i.D20).Distinct().OrderBy(i => i).Select(i => i.ToString()) });
            list.Add(new FilteringItem() { Field = "d21", Choices = collection.Select(i => i.D21).Distinct().OrderBy(i => i).Select(i => i.ToString()) });
            list.Add(new FilteringItem() { Field = "d22", Choices = collection.Select(i => i.D22).Distinct().OrderBy(i => i).Select(i => i.ToString()) });
            list.Add(new FilteringItem() { Field = "d23", Choices = collection.Select(i => i.D23).Distinct().OrderBy(i => i).Select(i => i.ToString()) });
            list.Add(new FilteringItem() { Field = "d24", Choices = collection.Select(i => i.D24).Distinct().OrderBy(i => i).Select(i => i.ToString()) });
            list.Add(new FilteringItem() { Field = "d25", Choices = collection.Select(i => i.D25).Distinct().OrderBy(i => i).Select(i => i.ToString()) });
            list.Add(new FilteringItem() { Field = "d26", Choices = collection.Select(i => i.D26).Distinct().OrderBy(i => i).Select(i => i.ToString()) });
            list.Add(new FilteringItem() { Field = "d27", Choices = collection.Select(i => i.D27).Distinct().OrderBy(i => i).Select(i => i.ToString()) });
            list.Add(new FilteringItem() { Field = "d28", Choices = collection.Select(i => i.D28).Distinct().OrderBy(i => i).Select(i => i.ToString()) });
            list.Add(new FilteringItem() { Field = "d29", Choices = collection.Select(i => i.D29).Distinct().OrderBy(i => i).Select(i => i.ToString()) });
            list.Add(new FilteringItem() { Field = "d30", Choices = collection.Select(i => i.D30).Distinct().OrderBy(i => i).Select(i => i.ToString()) });
            list.Add(new FilteringItem() { Field = "d31", Choices = collection.Select(i => i.D31).Distinct().OrderBy(i => i).Select(i => i.ToString()) });

            return list;
        }
    }

    public class MonthlyReportItem
    {
        public int Code { get; set; }
        public string Name { get; set; }
        public string Company { get; set; }
        public string Department { get; set; }
        public string Site { get; set; }
        public int TotalCards { get; set; }
        public int D1 { get; set; }
        public int D2 { get; set; }
        public int D3 { get; set; }
        public int D4 { get; set; }
        public int D5 { get; set; }
        public int D6 { get; set; }
        public int D7 { get; set; }
        public int D8 { get; set; }
        public int D9 { get; set; }
        public int D10 { get; set; }
        public int D11 { get; set; }
        public int D12 { get; set; }
        public int D13 { get; set; }
        public int D14 { get; set; }
        public int D15 { get; set; }
        public int D16 { get; set; }
        public int D17 { get; set; }
        public int D18 { get; set; }
        public int D19 { get; set; }
        public int D20 { get; set; }
        public int D21 { get; set; }
        public int D22 { get; set; }
        public int D23 { get; set; }
        public int D24 { get; set; }
        public int D25 { get; set; }
        public int D26 { get; set; }
        public int D27 { get; set; }
        public int D28 { get; set; }
        public int D29 { get; set; }
        public int D30 { get; set; }
        public int D31 { get; set; }
    }
}

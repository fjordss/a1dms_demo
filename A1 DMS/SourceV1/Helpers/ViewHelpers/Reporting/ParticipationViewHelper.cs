using System;
using System.Globalization;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;

namespace A1DMS.V1
{
    public class ParticipationViewHelper : IViewHelper<MonthlyReportItem>
    {
        private readonly Context db;
        private readonly HttpContext Context;
        private readonly UserService UserService;

        private List<Site> Sites;

        public TableView Table { get; set; }

        public ParticipationViewHelper(IHttpContextAccessor accessor, Context context, UserService userService)
        {
            this.Context = accessor.HttpContext;
            this.db = context;
            this.UserService = userService;

            this.Table = this.GetTable();
        }

        private TableView<MonthlyReportItem, MonthlyReportItem> GetTable()
        {
            var table = new TableView<MonthlyReportItem, MonthlyReportItem>();

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

        public void ParseProperties(List<string> sites, List<string> companies, List<string> departments, int year, int month)
        {
            var siteNames = this.UserService.GetSiteIds().Select(id => this.Sites.Find(s => s.Id == id).Name).ToList();

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

            return query.SelectMany(a =>
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
                case "Code": query = sortType == SortType.Ascending ? query.OrderBy(a => a.Code) : query.OrderByDescending(a => a.Code); break;
                case "Name": query = sortType == SortType.Ascending ? query.OrderBy(a => a.Name) : query.OrderByDescending(a => a.Name); break;
                case "Company": query = sortType == SortType.Ascending ? query.OrderBy(a => a.Company) : query.OrderByDescending(a => a.Company); break;
                case "Department": query = sortType == SortType.Ascending ? query.OrderBy(a => a.Department) : query.OrderByDescending(a => a.Department); break;
                case "Site": query = sortType == SortType.Ascending ? query.OrderBy(a => a.Site) : query.OrderByDescending(a => a.Site); break;
                case "TotalCards": query = sortType == SortType.Ascending ? query.OrderBy(a => a.TotalCards) : query.OrderByDescending(a => a.TotalCards); break;
                case "D1": query = sortType == SortType.Ascending ? query.OrderBy(a => a.D1) : query.OrderByDescending(a => a.D1); break;
                case "D2": query = sortType == SortType.Ascending ? query.OrderBy(a => a.D2) : query.OrderByDescending(a => a.D2); break;
                case "D3": query = sortType == SortType.Ascending ? query.OrderBy(a => a.D3) : query.OrderByDescending(a => a.D3); break;
                case "D4": query = sortType == SortType.Ascending ? query.OrderBy(a => a.D4) : query.OrderByDescending(a => a.D4); break;
                case "D5": query = sortType == SortType.Ascending ? query.OrderBy(a => a.D5) : query.OrderByDescending(a => a.D5); break;
                case "D6": query = sortType == SortType.Ascending ? query.OrderBy(a => a.D6) : query.OrderByDescending(a => a.D6); break;
                case "D7": query = sortType == SortType.Ascending ? query.OrderBy(a => a.D7) : query.OrderByDescending(a => a.D7); break;
                case "D8": query = sortType == SortType.Ascending ? query.OrderBy(a => a.D8) : query.OrderByDescending(a => a.D8); break;
                case "D9": query = sortType == SortType.Ascending ? query.OrderBy(a => a.D9) : query.OrderByDescending(a => a.D9); break;
                case "D10": query = sortType == SortType.Ascending ? query.OrderBy(a => a.D10) : query.OrderByDescending(a => a.D10); break;
                case "D11": query = sortType == SortType.Ascending ? query.OrderBy(a => a.D11) : query.OrderByDescending(a => a.D11); break;
                case "D12": query = sortType == SortType.Ascending ? query.OrderBy(a => a.D12) : query.OrderByDescending(a => a.D12); break;
                case "D13": query = sortType == SortType.Ascending ? query.OrderBy(a => a.D13) : query.OrderByDescending(a => a.D13); break;
                case "D14": query = sortType == SortType.Ascending ? query.OrderBy(a => a.D14) : query.OrderByDescending(a => a.D14); break;
                case "D15": query = sortType == SortType.Ascending ? query.OrderBy(a => a.D15) : query.OrderByDescending(a => a.D15); break;
                case "D16": query = sortType == SortType.Ascending ? query.OrderBy(a => a.D16) : query.OrderByDescending(a => a.D16); break;
                case "D17": query = sortType == SortType.Ascending ? query.OrderBy(a => a.D17) : query.OrderByDescending(a => a.D17); break;
                case "D18": query = sortType == SortType.Ascending ? query.OrderBy(a => a.D18) : query.OrderByDescending(a => a.D18); break;
                case "D19": query = sortType == SortType.Ascending ? query.OrderBy(a => a.D19) : query.OrderByDescending(a => a.D19); break;
                case "D20": query = sortType == SortType.Ascending ? query.OrderBy(a => a.D20) : query.OrderByDescending(a => a.D20); break;
                case "D21": query = sortType == SortType.Ascending ? query.OrderBy(a => a.D21) : query.OrderByDescending(a => a.D21); break;
                case "D22": query = sortType == SortType.Ascending ? query.OrderBy(a => a.D22) : query.OrderByDescending(a => a.D22); break;
                case "D23": query = sortType == SortType.Ascending ? query.OrderBy(a => a.D23) : query.OrderByDescending(a => a.D23); break;
                case "D24": query = sortType == SortType.Ascending ? query.OrderBy(a => a.D24) : query.OrderByDescending(a => a.D24); break;
                case "D25": query = sortType == SortType.Ascending ? query.OrderBy(a => a.D25) : query.OrderByDescending(a => a.D25); break;
                case "D26": query = sortType == SortType.Ascending ? query.OrderBy(a => a.D26) : query.OrderByDescending(a => a.D26); break;
                case "D27": query = sortType == SortType.Ascending ? query.OrderBy(a => a.D27) : query.OrderByDescending(a => a.D27); break;
                case "D28": query = sortType == SortType.Ascending ? query.OrderBy(a => a.D28) : query.OrderByDescending(a => a.D28); break;
                case "D29": query = sortType == SortType.Ascending ? query.OrderBy(a => a.D29) : query.OrderByDescending(a => a.D29); break;
                case "D30": query = sortType == SortType.Ascending ? query.OrderBy(a => a.D30) : query.OrderByDescending(a => a.D30); break;
                case "D31": query = sortType == SortType.Ascending ? query.OrderBy(a => a.D31) : query.OrderByDescending(a => a.D31); break;
            }

            return query;
        }

        private IQueryable<MonthlyReportItem> Filter(IQueryable<MonthlyReportItem> query, string name, List<string> choices)
        {
            switch (name)
            {
                case "Code": query = query.Where(e => choices.Contains(e.Code.ToString())); break;
                case "Name": query = query.Where(e => choices.Contains(e.Name)); break;
                case "Company": query = query.Where(e => choices.Contains(e.Company)); break;
                case "Department": query = query.Where(e => choices.Contains(e.Department)); break;
                case "Site": query = query.Where(e => choices.Contains(e.Site)); break;
                case "TotalCards": query = query.Where(e => choices.Contains(e.TotalCards.ToString())); break;
                case "D1": query = query.Where(e => choices.Contains(e.D1.ToString())); break;
                case "D2": query = query.Where(e => choices.Contains(e.D2.ToString())); break;
                case "D3": query = query.Where(e => choices.Contains(e.D3.ToString())); break;
                case "D4": query = query.Where(e => choices.Contains(e.D4.ToString())); break;
                case "D5": query = query.Where(e => choices.Contains(e.D5.ToString())); break;
                case "D6": query = query.Where(e => choices.Contains(e.D6.ToString())); break;
                case "D7": query = query.Where(e => choices.Contains(e.D7.ToString())); break;
                case "D8": query = query.Where(e => choices.Contains(e.D8.ToString())); break;
                case "D9": query = query.Where(e => choices.Contains(e.D9.ToString())); break;
                case "D10": query = query.Where(e => choices.Contains(e.D10.ToString())); break;
                case "D11": query = query.Where(e => choices.Contains(e.D11.ToString())); break;
                case "D12": query = query.Where(e => choices.Contains(e.D12.ToString())); break;
                case "D13": query = query.Where(e => choices.Contains(e.D13.ToString())); break;
                case "D14": query = query.Where(e => choices.Contains(e.D14.ToString())); break;
                case "D15": query = query.Where(e => choices.Contains(e.D15.ToString())); break;
                case "D16": query = query.Where(e => choices.Contains(e.D16.ToString())); break;
                case "D17": query = query.Where(e => choices.Contains(e.D17.ToString())); break;
                case "D18": query = query.Where(e => choices.Contains(e.D18.ToString())); break;
                case "D19": query = query.Where(e => choices.Contains(e.D19.ToString())); break;
                case "D20": query = query.Where(e => choices.Contains(e.D20.ToString())); break;
                case "D21": query = query.Where(e => choices.Contains(e.D21.ToString())); break;
                case "D22": query = query.Where(e => choices.Contains(e.D22.ToString())); break;
                case "D23": query = query.Where(e => choices.Contains(e.D23.ToString())); break;
                case "D24": query = query.Where(e => choices.Contains(e.D24.ToString())); break;
                case "D25": query = query.Where(e => choices.Contains(e.D25.ToString())); break;
                case "D26": query = query.Where(e => choices.Contains(e.D26.ToString())); break;
                case "D27": query = query.Where(e => choices.Contains(e.D27.ToString())); break;
                case "D28": query = query.Where(e => choices.Contains(e.D28.ToString())); break;
                case "D29": query = query.Where(e => choices.Contains(e.D29.ToString())); break;
                case "D30": query = query.Where(e => choices.Contains(e.D30.ToString())); break;
                case "D31": query = query.Where(e => choices.Contains(e.D31.ToString())); break;
            }

            return query;
        }

        private IQueryable<MonthlyReportItem> Search(IQueryable<MonthlyReportItem> query, string searchString)
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

        private List<TotalItem> GetTotals(List<MonthlyReportItem> list)
        {
            var totals = new List<TotalItem>();

            totals.Add(new TotalItem() { Field = "TotalCards", Total = list.Select(i => i.TotalCards).Sum().ToString() });
            totals.Add(new TotalItem() { Field = "D1", Total = list.Select(i => i.D1).Sum().ToString() });
            totals.Add(new TotalItem() { Field = "D2", Total = list.Select(i => i.D2).Sum().ToString() });
            totals.Add(new TotalItem() { Field = "D3", Total = list.Select(i => i.D3).Sum().ToString() });
            totals.Add(new TotalItem() { Field = "D4", Total = list.Select(i => i.D4).Sum().ToString() });
            totals.Add(new TotalItem() { Field = "D5", Total = list.Select(i => i.D5).Sum().ToString() });
            totals.Add(new TotalItem() { Field = "D6", Total = list.Select(i => i.D6).Sum().ToString() });
            totals.Add(new TotalItem() { Field = "D7", Total = list.Select(i => i.D7).Sum().ToString() });
            totals.Add(new TotalItem() { Field = "D8", Total = list.Select(i => i.D8).Sum().ToString() });
            totals.Add(new TotalItem() { Field = "D9", Total = list.Select(i => i.D9).Sum().ToString() });
            totals.Add(new TotalItem() { Field = "D10", Total = list.Select(i => i.D10).Sum().ToString() });
            totals.Add(new TotalItem() { Field = "D11", Total = list.Select(i => i.D11).Sum().ToString() });
            totals.Add(new TotalItem() { Field = "D12", Total = list.Select(i => i.D12).Sum().ToString() });
            totals.Add(new TotalItem() { Field = "D13", Total = list.Select(i => i.D13).Sum().ToString() });
            totals.Add(new TotalItem() { Field = "D14", Total = list.Select(i => i.D14).Sum().ToString() });
            totals.Add(new TotalItem() { Field = "D15", Total = list.Select(i => i.D15).Sum().ToString() });
            totals.Add(new TotalItem() { Field = "D16", Total = list.Select(i => i.D16).Sum().ToString() });
            totals.Add(new TotalItem() { Field = "D17", Total = list.Select(i => i.D17).Sum().ToString() });
            totals.Add(new TotalItem() { Field = "D18", Total = list.Select(i => i.D18).Sum().ToString() });
            totals.Add(new TotalItem() { Field = "D19", Total = list.Select(i => i.D19).Sum().ToString() });
            totals.Add(new TotalItem() { Field = "D20", Total = list.Select(i => i.D20).Sum().ToString() });
            totals.Add(new TotalItem() { Field = "D21", Total = list.Select(i => i.D21).Sum().ToString() });
            totals.Add(new TotalItem() { Field = "D22", Total = list.Select(i => i.D22).Sum().ToString() });
            totals.Add(new TotalItem() { Field = "D23", Total = list.Select(i => i.D23).Sum().ToString() });
            totals.Add(new TotalItem() { Field = "D24", Total = list.Select(i => i.D24).Sum().ToString() });
            totals.Add(new TotalItem() { Field = "D25", Total = list.Select(i => i.D25).Sum().ToString() });
            totals.Add(new TotalItem() { Field = "D26", Total = list.Select(i => i.D26).Sum().ToString() });
            totals.Add(new TotalItem() { Field = "D27", Total = list.Select(i => i.D27).Sum().ToString() });
            totals.Add(new TotalItem() { Field = "D28", Total = list.Select(i => i.D28).Sum().ToString() });
            totals.Add(new TotalItem() { Field = "D29", Total = list.Select(i => i.D29).Sum().ToString() });
            totals.Add(new TotalItem() { Field = "D30", Total = list.Select(i => i.D30).Sum().ToString() });
            totals.Add(new TotalItem() { Field = "D31", Total = list.Select(i => i.D31).Sum().ToString() });

            return totals;
        }

        private List<FilteringItem> GetFilteringValues(PropertyItemCollection properties)
        {
            var collection = this.GetBaseQuery(properties).ToList();

            var list = new List<FilteringItem>();

            list.Add(new FilteringItem() { Field = "Code", Choices = collection.Select(i => i.Code).Distinct().OrderBy(i => i).Cast<object>().ToList() });
            list.Add(new FilteringItem() { Field = "Name", Choices = collection.Select(i => i.Name).Distinct().OrderBy(i => i).Cast<object>().ToList() });
            list.Add(new FilteringItem() { Field = "Site", Choices = collection.Select(i => i.Site).Distinct().OrderBy(i => i).Cast<object>().ToList() });
            list.Add(new FilteringItem() { Field = "Company", Choices = collection.Select(i => i.Company).Distinct().OrderBy(i => i).Cast<object>().ToList() });
            list.Add(new FilteringItem() { Field = "Department", Choices = collection.Select(i => i.Department).Distinct().OrderBy(i => i).Cast<object>().ToList() });
            list.Add(new FilteringItem() { Field = "TotalCards", Choices = collection.Select(i => i.TotalCards).Distinct().OrderBy(i => i).Cast<object>().ToList() });
            list.Add(new FilteringItem() { Field = "D1", Choices = collection.Select(i => i.D1).Distinct().OrderBy(i => i).Cast<object>().ToList() });
            list.Add(new FilteringItem() { Field = "D2", Choices = collection.Select(i => i.D2).Distinct().OrderBy(i => i).Cast<object>().ToList() });
            list.Add(new FilteringItem() { Field = "D3", Choices = collection.Select(i => i.D3).Distinct().OrderBy(i => i).Cast<object>().ToList() });
            list.Add(new FilteringItem() { Field = "D4", Choices = collection.Select(i => i.D4).Distinct().OrderBy(i => i).Cast<object>().ToList() });
            list.Add(new FilteringItem() { Field = "D5", Choices = collection.Select(i => i.D5).Distinct().OrderBy(i => i).Cast<object>().ToList() });
            list.Add(new FilteringItem() { Field = "D6", Choices = collection.Select(i => i.D6).Distinct().OrderBy(i => i).Cast<object>().ToList() });
            list.Add(new FilteringItem() { Field = "D7", Choices = collection.Select(i => i.D7).Distinct().OrderBy(i => i).Cast<object>().ToList() });
            list.Add(new FilteringItem() { Field = "D8", Choices = collection.Select(i => i.D8).Distinct().OrderBy(i => i).Cast<object>().ToList() });
            list.Add(new FilteringItem() { Field = "D9", Choices = collection.Select(i => i.D9).Distinct().OrderBy(i => i).Cast<object>().ToList() });
            list.Add(new FilteringItem() { Field = "D10", Choices = collection.Select(i => i.D10).Distinct().OrderBy(i => i).Cast<object>().ToList() });
            list.Add(new FilteringItem() { Field = "D11", Choices = collection.Select(i => i.D11).Distinct().OrderBy(i => i).Cast<object>().ToList() });
            list.Add(new FilteringItem() { Field = "D12", Choices = collection.Select(i => i.D12).Distinct().OrderBy(i => i).Cast<object>().ToList() });
            list.Add(new FilteringItem() { Field = "D13", Choices = collection.Select(i => i.D13).Distinct().OrderBy(i => i).Cast<object>().ToList() });
            list.Add(new FilteringItem() { Field = "D14", Choices = collection.Select(i => i.D14).Distinct().OrderBy(i => i).Cast<object>().ToList() });
            list.Add(new FilteringItem() { Field = "D15", Choices = collection.Select(i => i.D15).Distinct().OrderBy(i => i).Cast<object>().ToList() });
            list.Add(new FilteringItem() { Field = "D16", Choices = collection.Select(i => i.D16).Distinct().OrderBy(i => i).Cast<object>().ToList() });
            list.Add(new FilteringItem() { Field = "D17", Choices = collection.Select(i => i.D17).Distinct().OrderBy(i => i).Cast<object>().ToList() });
            list.Add(new FilteringItem() { Field = "D18", Choices = collection.Select(i => i.D18).Distinct().OrderBy(i => i).Cast<object>().ToList() });
            list.Add(new FilteringItem() { Field = "D19", Choices = collection.Select(i => i.D19).Distinct().OrderBy(i => i).Cast<object>().ToList() });
            list.Add(new FilteringItem() { Field = "D20", Choices = collection.Select(i => i.D20).Distinct().OrderBy(i => i).Cast<object>().ToList() });
            list.Add(new FilteringItem() { Field = "D21", Choices = collection.Select(i => i.D21).Distinct().OrderBy(i => i).Cast<object>().ToList() });
            list.Add(new FilteringItem() { Field = "D22", Choices = collection.Select(i => i.D22).Distinct().OrderBy(i => i).Cast<object>().ToList() });
            list.Add(new FilteringItem() { Field = "D23", Choices = collection.Select(i => i.D23).Distinct().OrderBy(i => i).Cast<object>().ToList() });
            list.Add(new FilteringItem() { Field = "D24", Choices = collection.Select(i => i.D24).Distinct().OrderBy(i => i).Cast<object>().ToList() });
            list.Add(new FilteringItem() { Field = "D25", Choices = collection.Select(i => i.D25).Distinct().OrderBy(i => i).Cast<object>().ToList() });
            list.Add(new FilteringItem() { Field = "D26", Choices = collection.Select(i => i.D26).Distinct().OrderBy(i => i).Cast<object>().ToList() });
            list.Add(new FilteringItem() { Field = "D27", Choices = collection.Select(i => i.D27).Distinct().OrderBy(i => i).Cast<object>().ToList() });
            list.Add(new FilteringItem() { Field = "D28", Choices = collection.Select(i => i.D28).Distinct().OrderBy(i => i).Cast<object>().ToList() });
            list.Add(new FilteringItem() { Field = "D29", Choices = collection.Select(i => i.D29).Distinct().OrderBy(i => i).Cast<object>().ToList() });
            list.Add(new FilteringItem() { Field = "D30", Choices = collection.Select(i => i.D30).Distinct().OrderBy(i => i).Cast<object>().ToList() });
            list.Add(new FilteringItem() { Field = "D31", Choices = collection.Select(i => i.D31).Distinct().OrderBy(i => i).Cast<object>().ToList() });

            return list;
        }

        public TableViewResponse<MonthlyReportItem> GetData()
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

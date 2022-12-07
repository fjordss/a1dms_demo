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
    public class NominatedCardsViewHelper : IViewHelper<NGHCardResult>
    {
        public TableView<NGHCard, NGHCardResult> Table { get; set; }

        private readonly HttpContext Context;
        private readonly Context db;
        private readonly UserService UserService;

        private List<Site> Sites;

        public NominatedCardsViewHelper(IHttpContextAccessor accessor, Context context, UserService userService)
        {
            this.Context = accessor.HttpContext;
            this.db = context;
            this.UserService = userService;

            this.GetTable();
        }

        public TableViewResponse<NGHCardResult> GetData()
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

        public IEnumerable<NGHCardResult> Export()
        {
            this.Table.Proceed(false);

            return this.Table.Response.Rows;
        }

        private void GetTable()
        {
            this.Table = new TableView<NGHCard, NGHCardResult>();
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

        public void ParseProperties(List<string> sites, List<string> companies, List<string> departments, List<string> categories, DateTime? from, DateTime? to)
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

            if (categories != null && categories.Count > 0)
                this.Table.Properties.SetValue("Categories", categories);

            if (from.HasValue)
                this.Table.Properties.SetValue("From", from.Value);

            if (to.HasValue)
                this.Table.Properties.SetValue("To", to.Value.AddDays(1).AddSeconds(-1));
        }

        private IQueryable<NGHCard> GetBaseQuery(PropertyItemCollection properties)
        {
            var query = this.db
                .NGHCards
                .Where(c => c.NominationCategory != null)
                .AsQueryable();

            if (properties.ContainsKey("Sites"))
                query = query.Where(a => properties.GetValue<List<string>>("Sites").Contains(a.Site));

            if (properties.ContainsKey("Companies"))
                query = query.Where(a => properties.GetValue<List<string>>("Companies").Contains(a.Company));

            if (properties.ContainsKey("Departments"))
                query = query.Where(a => properties.GetValue<List<string>>("Departments").Contains(a.Department));

            if (properties.ContainsKey("Categories"))
                query = query.Where(a => properties.GetValue<List<string>>("Categories").Contains(a.NominationCategory));

            if (properties.ContainsKey("From"))
                query = query.Where(a => a.Date >= properties.GetValue<DateTime>("From"));

            if (properties.ContainsKey("To"))
                query = query.Where(a => a.Date <= properties.GetValue<DateTime>("To"));

            query = query.OrderByDescending(s => s.Id);

            return query;
        }

        private IQueryable<NGHCard> Sort(IQueryable<NGHCard> query, string name, SortType sortType)
        {
            switch (name)
            {
                case "id": query = sortType == SortType.Ascending ? query.OrderBy(a => a.Id) : query.OrderByDescending(a => a.Id); break;
                case "date": query = sortType == SortType.Ascending ? query.OrderBy(a => a.Date) : query.OrderByDescending(a => a.Date); break;
                case "employee": query = sortType == SortType.Ascending ? query.OrderBy(a => (a.LastName != null ? a.LastName + ", " : "") + (a.FirstName != null ? a.FirstName : "")) : query.OrderByDescending(a => a.Employee); break;
                case "site": query = sortType == SortType.Ascending ? query.OrderBy(a => a.Site) : query.OrderByDescending(a => a.Site); break;
                case "company": query = sortType == SortType.Ascending ? query.OrderBy(a => a.Company) : query.OrderByDescending(a => a.Company); break;
                case "department": query = sortType == SortType.Ascending ? query.OrderBy(a => a.Department) : query.OrderByDescending(a => a.Department); break;
                case "reportType": query = sortType == SortType.Ascending ? query.OrderBy(a => a.ReportType) : query.OrderByDescending(a => a.ReportType); break;
                case "lifeSavingActions": query = sortType == SortType.Ascending ? query.OrderBy(a => a.LifeSavingActions) : query.OrderByDescending(a => a.LifeSavingActions); break;
                case "nominationCategory": query = sortType == SortType.Ascending ? query.OrderBy(a => a.NominationCategory) : query.OrderByDescending(a => a.NominationCategory); break;
            }

            return query;
        }

        private IQueryable<NGHCard> Filter(IQueryable<NGHCard> query, string name, List<string> choices)
        {
            var list = (List<NGHCard>)null;
            switch (name)
            {
                case "id": query = query.Where(e => choices.Contains(e.Id.ToString())); break;
                case "date": list = query.ToList().Where(e => choices.Contains(e.Date.ToString("MM/dd/yyyy", CultureInfo.InvariantCulture))).ToList(); break;
                case "employee": query = query.Where(a => choices.Contains((a.LastName != null ? a.LastName + ", " : "") + (a.FirstName != null ? a.FirstName : ""))); break;
                case "site": query = query.Where(e => choices.Contains(e.Site)); break;
                case "company": query = query.Where(e => choices.Contains(e.Company)); break;
                case "department": query = query.Where(e => choices.Contains(e.Department)); break;
                case "reportType": query = query.Where(e => choices.Contains(e.ReportType)); break;
                case "lifeSavingActions": query = query.Where(e => choices.Contains(e.LifeSavingActions)); break;
                case "hazardID": list = query.ToList().Where(a => a.HazardIdentification.Any(i => choices.Contains(i))).ToList(); break;
                case "safeChoice": list = query.ToList().Where(a => a.SafeChoice != null && a.SafeChoice.Any(i => choices.Contains(i))).ToList(); break;
                case "nominationCategory": query = query.Where(e => (choices.Contains("") && e.NominationCategory == null) || choices.Contains(e.NominationCategory)); break;
            }

            if (list != null)
                query = list.AsQueryable();

            return query;
        }

        private IQueryable<NGHCard> Search(IQueryable<NGHCard> query, string name, string text)
        {
            var s = text.ToLower();

            switch (name)
            {
                case "id": query = query.Where(e => e.Id.ToString().ToLower().Contains(s)); break;
                case "employee": query = query.Where(e => e.FirstName.ToLower().Contains(s) || e.LastName.ToLower().Contains(s)); break;
                case "site": query = query.Where(e => e.Site.ToLower().Contains(s)); break;
                case "company": query = query.Where(e => e.Company.ToLower().Contains(s)); break;
                case "department": query = query.Where(e => e.Department.ToLower().Contains(s)); break;
                case "reportType": query = query.Where(e => e.ReportType.ToLower().Contains(s)); break;
                case "lifeSavingActions": query = query.Where(e => e.LifeSavingActions.ToLower().Contains(s)); break;
                case "hazardID": query = query.AsEnumerable().Where(e => e.HazardIdentification.Any(h => h.ToLower().Contains(s))).AsQueryable(); break;
                case "safeChoice": query = query.AsEnumerable().Where(e => e.SafeChoice.Any(h => h.ToLower().Contains(s))).AsQueryable(); break;
                case "description": query = query.Where(e => e.Description.ToLower().Contains(s)); break;
                case "actionsTaken": query = query.Where(e => e.ActionsTaken.ToLower().Contains(s)); break;
                case "location": query = query.Where(e => e.SpecificLocation.ToLower().Contains(s)); break;
                case "furtherActions": query = query.Where(e => e.SuggestedFurtherActions.ToLower().Contains(s)); break;
                case "nominatedBy": query = query.Where(e => e.Nominations.OrderBy(n => n.Id).Last().Author.Name.ToLower().Contains(s)); break;
            }

            return query;
        }

        private IQueryable<NGHCard> SearchEverywhere(IQueryable<NGHCard> query, string searchString)
        {
            var s = searchString.ToLower();
            return query.Where(e => e.Id.ToString().ToLower().Contains(s) ||
                                    e.FirstName.ToLower().Contains(s) ||
                                    e.LastName.ToLower().Contains(s) ||
                                    e.Site.ToLower().Contains(s) ||
                                    e.Department.ToLower().Contains(s) ||
                                    e.Company.ToLower().Contains(s) ||
                                    e.ReportType.ToLower().Contains(s) ||
                                    e.LifeSavingActions.ToLower().Contains(s) ||
                                    e.Description.ToLower().Contains(s) || e.DescriptionRus.ToLower().Contains(s) ||
                                    e.ActionsTaken.ToLower().Contains(s) || e.ActionsTakenRus.ToLower().Contains(s) ||
                                    e.SpecificLocation.ToLower().Contains(s) || e.SpecificLocationRus.ToLower().Contains(s) ||
                                    e.SuggestedFurtherActions.ToLower().Contains(s) || e.SuggestedFurtherActionsRus.ToLower().Contains(s) ||
                                    e.NominationCategory.ToLower().Contains(s));
        }

        private List<NGHCardResult> GetResult(IQueryable<NGHCard> query)
        {
            return query.Select(a => new NGHCardResult()
            {
                Id = a.Id,
                ActionItem = a.ActionItemId,
                ActionsTaken = a.ActionsTaken + "{-DELIM-}" + a.ActionsTakenRus,
                Company = a.Company,
                Date = a.Date,
                Department = a.Department,
                Description = a.Description + "{-DELIM-}" + a.DescriptionRus,
                Employee = (a.LastName != null ? a.LastName + ", " : "") + (a.FirstName != null ? a.FirstName : ""),
                FurtherActions = a.SuggestedFurtherActions + "{-DELIM-}" + a.SuggestedFurtherActionsRus,
                HazardID = a.HazardIdentification,
                LifeSavingActions = a.LifeSavingActions,
                Location = a.SpecificLocation + "{-DELIM-}" + a.SpecificLocationRus,
                ReportType = a.ReportType,
                SafeChoice = a.SafeChoice,
                Site = a.Site,
                NominationCategory = a.NominationCategory
            }).ToList();
        }

        private List<FilteringItem> GetFilteringValues(IEnumerable<NGHCardResult> collection)
        {
            var list = new List<FilteringItem>();

            list.Add(new FilteringItem() { Field = "id", Choices = collection.Select(i => i.Id).Distinct().OrderBy(i => i).Select(i => i.ToString()) });
            list.Add(new FilteringItem() { Field = "date", Choices = collection.Select(i => i.Date).OrderBy(i => i).Select(d => d.ToString("MM/dd/yyyy", CultureInfo.InvariantCulture)).Distinct() });
            list.Add(new FilteringItem() { Field = "employee", Choices = collection.Select(a => a.Employee).Distinct().OrderBy(i => i) });
            list.Add(new FilteringItem() { Field = "site", Choices = collection.Select(i => i.Site).Distinct().OrderBy(i => i) });
            list.Add(new FilteringItem() { Field = "company", Choices = collection.Select(i => i.Company).Distinct().OrderBy(i => i) });
            list.Add(new FilteringItem() { Field = "department", Choices = collection.Select(i => i.Department).Distinct().OrderBy(i => i) });
            list.Add(new FilteringItem() { Field = "reportType", Choices = collection.Select(i => i.ReportType).Distinct().OrderBy(i => i) });
            list.Add(new FilteringItem() { Field = "lifeSavingActions", Choices = collection.Select(i => i.LifeSavingActions).Distinct().OrderBy(i => i) });
            list.Add(new FilteringItem() { Field = "nominationCategory", Choices = collection.Select(i => i.NominationCategory != null ? i.NominationCategory : "").Distinct().OrderBy(i => i) });

            var hazardIDChocies = new List<string>
            {
                "PPE",
                "Tools Equipment",
                "Chemicals",
                "Warning Signs / Barricades",
                "Hygiene",
                "Ergonomics",
                "Manual Lifting / Handling",
                "\"Line of Fire\"",
                "Pinch Points",
                "Hands Safety",
                "Stress / Rush / Fatigue / Distraction",
                "Communication",
                "Policies Procedures",
                "Process Safety",
                "Environmental",
                "Security",
                "Electrical Safety",
                "Fire Safety",
                "Transport Safety",
                "Slips Trips Falls",
                "Contact With Object",
                "Dropped Objects",
                "Work Environmental / Design",
                "Housekeeping",
                "Weather Conditions",
                "Off the Site",
                "Well Control",
                "Other",
                "COVID-19"
            };
            hazardIDChocies.Sort();
            list.Add(new FilteringItem() { Field = "hazardID", Choices = hazardIDChocies });

            var safeChoiceChoices = new List<string>()
            {
                "Head before Hands (Fast / Slow thinking)",
                "Stay focused (Present motivation)",
                "LMRA / 6 Steps in safe decision making",
                "Biases",
                "Safety Traps",
                "Not Applicable"
            };
            safeChoiceChoices.Sort();
            list.Add(new FilteringItem() { Field = "safeChoice", Choices = safeChoiceChoices });


            return list;
        }
    }
}

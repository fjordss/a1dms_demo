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
    public class NominatedCardsViewHelper : IViewHelper<NGHCardResult>
    {
        public TableView Table { get; set; }

        private readonly HttpContext Context;
        private readonly Context db;
        private readonly UserService UserService;

        private List<Site> Sites;

        public NominatedCardsViewHelper(IHttpContextAccessor accessor, Context context, UserService userService)
        {
            this.Context = accessor.HttpContext;
            this.db = context;
            this.UserService = userService;

            this.Table = this.GetTable();
        }

        private TableView<NGHCard, NGHCardResult> GetTable()
        {
            var table = new TableView<NGHCard, NGHCardResult>();
            table.ServerSide = true;
            table.PageSize = 30;
            table.Request = this.Context.Request;

            table.GetBaseQuery = this.GetBaseQuery;

            table.Sort = this.Sort;
            table.Filter = this.Filter;
            table.Search = this.Search;

            table.GetFilteringValues = this.GetFilteringValues;

            table.GetResult = this.GetResult;

            return table;
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

        public (List<Site>, List<Company>, List<Department>) GetFields()
        {
            var siteIds = this.UserService.GetSiteIds();
            var query = this.db.Sites.OrderBy(a => a.Name).AsQueryable();
            if (siteIds.Count > 0)
                query = query.Where(s => siteIds.Contains(s.Id));

            var sites = query.ToList();
            var companies = this.db.Companies.OrderBy(a => a.Name).ToList();
            var departments = this.db.Departments.OrderBy(a => a.Name).ToList();

            return (sites, companies, departments);
        }

        private IQueryable<NGHCard> GetBaseQuery(PropertyItemCollection properties)
        {
            var Query = this.db
                .NGHCards
                .Where(c => c.NominationCategory != null)
                .AsQueryable();

            if (properties.ContainsKey("Sites"))
                Query = Query.Where(a => properties.GetValue<List<string>>("Sites").Contains(a.Site));

            if (properties.ContainsKey("Companies"))
                Query = Query.Where(a => properties.GetValue<List<string>>("Companies").Contains(a.Company));

            if (properties.ContainsKey("Departments"))
                Query = Query.Where(a => properties.GetValue<List<string>>("Departments").Contains(a.Department));

            if (properties.ContainsKey("Categories"))
                Query = Query.Where(a => properties.GetValue<List<string>>("Categories").Contains(a.NominationCategory));

            if (properties.ContainsKey("From"))
                Query = Query.Where(a => a.Date >= properties.GetValue<DateTime>("From"));

            if (properties.ContainsKey("To"))
                Query = Query.Where(a => a.Date <= properties.GetValue<DateTime>("To"));

            Query = Query.OrderByDescending(s => s.Id);

            return Query;
        }

        private IQueryable<NGHCard> Sort(IQueryable<NGHCard> Query, string Name, SortType SortType)
        {
            switch (Name)
            {
                case "Id": Query = SortType == SortType.Ascending ? Query.OrderBy(a => a.Id) : Query.OrderByDescending(a => a.Id); break;
                case "Date": Query = SortType == SortType.Ascending ? Query.OrderBy(a => a.Date) : Query.OrderByDescending(a => a.Date); break;
                case "Employee": Query = SortType == SortType.Ascending ? Query.OrderBy(a => (a.LastName != null ? a.LastName + ", " : "") + (a.FirstName != null ? a.FirstName : "")) : Query.OrderByDescending(a => a.Employee); break;
                case "Site": Query = SortType == SortType.Ascending ? Query.OrderBy(a => a.Site) : Query.OrderByDescending(a => a.Site); break;
                case "Company": Query = SortType == SortType.Ascending ? Query.OrderBy(a => a.Company) : Query.OrderByDescending(a => a.Company); break;
                case "Department": Query = SortType == SortType.Ascending ? Query.OrderBy(a => a.Department) : Query.OrderByDescending(a => a.Department); break;
                case "ReportType": Query = SortType == SortType.Ascending ? Query.OrderBy(a => a.ReportType) : Query.OrderByDescending(a => a.ReportType); break;
                case "LifeSavingActions": Query = SortType == SortType.Ascending ? Query.OrderBy(a => a.LifeSavingActions) : Query.OrderByDescending(a => a.LifeSavingActions); break;
                case "NominationCategory": Query = SortType == SortType.Ascending ? Query.OrderBy(a => a.NominationCategory) : Query.OrderByDescending(a => a.NominationCategory); break;
            }

            return Query;
        }

        private IQueryable<NGHCard> Filter(IQueryable<NGHCard> Query, string Name, List<string> Choices)
        {
            var List = (List<NGHCard>)null;
            switch (Name)
            {
                case "Id": Query = Query.Where(e => Choices.Contains(e.Id.ToString())); break;
                case "Date": List = Query.ToList().Where(e => Choices.Contains(e.Date.ToString("MM/dd/yyyy", CultureInfo.InvariantCulture))).ToList(); break;
                case "Employee": Query = Query.Where(a => Choices.Contains((a.LastName != null ? a.LastName + ", " : "") + (a.FirstName != null ? a.FirstName : ""))); break;
                case "Site": Query = Query.Where(e => Choices.Contains(e.Site)); break;
                case "Company": Query = Query.Where(e => Choices.Contains(e.Company)); break;
                case "Department": Query = Query.Where(e => Choices.Contains(e.Department)); break;
                case "ReportType": Query = Query.Where(e => Choices.Contains(e.ReportType)); break;
                case "LifeSavingActions": Query = Query.Where(e => Choices.Contains(e.LifeSavingActions)); break;
                case "HazardID": List = Query.ToList().Where(a => a.HazardIdentification.Any(i => Choices.Contains(i))).ToList(); break;
                case "SafeChoice": List = Query.ToList().Where(a => a.SafeChoice != null && a.SafeChoice.Any(i => Choices.Contains(i))).ToList(); break;
                case "NominationCategory": Query = Query.Where(e => (Choices.Contains("") && e.NominationCategory == null) || Choices.Contains(e.NominationCategory)); break;
            }

            if (List != null)
                Query = List.AsQueryable();

            return Query;
        }

        private IQueryable<NGHCard> Search(IQueryable<NGHCard> Query, string SearchString)
        {
            var s = SearchString.ToLower();
            return Query.Where(e => e.Id.ToString().ToLower().Contains(s) ||
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

        private List<NGHCardResult> GetResult(IQueryable<NGHCard> Query)
        {
            return Query.Select(a => new NGHCardResult()
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

        private List<FilteringItem> GetFilteringValues(PropertyItemCollection properties)
        {
            var Collection = this.GetBaseQuery(properties).ToList();

            var List = new List<FilteringItem>();

            List.Add(new FilteringItem() { Field = "Id", Choices = Collection.Select(i => i.Id).Distinct().OrderBy(i => i).Select(i => i.ToString()).Cast<object>().ToList() });
            List.Add(new FilteringItem() { Field = "Date", Choices = Collection.Select(i => i.Date).Distinct().OrderBy(i => i).Select(d => d.ToString("MM/dd/yyyy", CultureInfo.InvariantCulture)).Cast<object>().ToList() });
            List.Add(new FilteringItem() { Field = "Employee", Choices = Collection.Select(a => (a.LastName != null ? a.LastName + ", " : "") + (a.FirstName != null ? a.FirstName : "")).Distinct().OrderBy(i => i).Cast<object>().ToList() });
            List.Add(new FilteringItem() { Field = "Site", Choices = Collection.Select(i => i.Site).Distinct().OrderBy(i => i).Cast<object>().ToList() });
            List.Add(new FilteringItem() { Field = "Company", Choices = Collection.Select(i => i.Company).Distinct().OrderBy(i => i).Cast<object>().ToList() });
            List.Add(new FilteringItem() { Field = "Department", Choices = Collection.Select(i => i.Department).Distinct().OrderBy(i => i).Cast<object>().ToList() });
            List.Add(new FilteringItem() { Field = "ReportType", Choices = Collection.Select(i => i.ReportType).Distinct().OrderBy(i => i).Cast<object>().ToList() });
            List.Add(new FilteringItem() { Field = "LifeSavingActions", Choices = Collection.Select(i => i.LifeSavingActions).Distinct().OrderBy(i => i).Cast<object>().ToList() });
            List.Add(new FilteringItem() { Field = "NominationCategory", Choices = Collection.Select(i => i.NominationCategory != null ? i.NominationCategory : "").Distinct().OrderBy(i => i).Cast<object>().ToList() });

            var HazardIDChocies = new List<object>
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
            HazardIDChocies.Sort();
            List.Add(new FilteringItem() { Field = "HazardID", Choices = HazardIDChocies });

            var SafeChoiceChoices = new List<object>()
            {
                "Head before Hands (Fast / Slow thinking)",
                "Stay focused (Present motivation)",
                "LMRA / 6 Steps in safe decision making",
                "Biases",
                "Safety Traps",
                "Not Applicable"
            };
            SafeChoiceChoices.Sort();
            List.Add(new FilteringItem() { Field = "SafeChoice", Choices = SafeChoiceChoices });


            return List;
        }

        public TableViewResponse<NGHCardResult> GetData()
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
}

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
    public class CardsViewHelper : IViewHelper<NGHCardResult>
    {
        public TableView Table { get; set; }

        private readonly HttpContext Context;
        private readonly Context db;
        private readonly UserService UserService;

        private List<Site> Sites;

        public CardsViewHelper(IHttpContextAccessor accessor, Context context, UserService userService)
        {
            this.Context = accessor.HttpContext;
            this.db = context;
            this.UserService = userService;

            this.Table = this.GetTable();
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

        public (bool, DateTime?, DateTime?) IsNominationPermitted(int cardId)
        {
            var card = this.db.NGHCards.FirstOrDefault(c => c.Id == cardId);
            if (card != null)
            {
                var Report = this.db.NominationReports.FirstOrDefault(n => n.From <= card.Date && card.Date <= n.To.AddDays(1).AddSeconds(-1) && n.Site.Name == card.Site);
                if (Report == default || Report.Stage == 1)
                    return (true, null, null);
                else
                    return (false, Report.From, Report.To);
            }
            else
                return (false, null, null);
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

        private TableView<NGHCardResult, NGHCardResult> GetTable()
        {
            var table = new TableView<NGHCardResult, NGHCardResult>();
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

        private IQueryable<NGHCardResult> GetBaseQuery(PropertyItemCollection properties)
        {
            var query = this.db
                .NGHCards
                .Include(a => a.CardAttachments)
                .Include(a => a.Nominations)
                    .ThenInclude(n => n.Author)
                .Include(a => a.Employee)
                .AsQueryable();

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

            query = query.OrderByDescending(s => s.Date);

            return query.Select(a => new NGHCardResult()
            {
                Id = a.Id,
                Photos = a.CardAttachments.Select(c => new NGHCardFile()
                {
                    FileId = c.Id,
                    FileName = c.FileName
                }),
                ActionItem = a.ActionItemId,
                ActionsTaken = a.ActionsTaken + "{-DELIM-}" + a.ActionsTakenRus,
                Company = a.Company,
                Date = a.Date,
                Department = a.Department,
                Description = a.Description + "{-DELIM-}" + a.DescriptionRus,
                Employee = (a.LastName != null ? a.LastName + ", " : "") + (a.FirstName != null ? a.FirstName : ""),
                NGHNumber = a.Employee.Code,
                FurtherActions = a.SuggestedFurtherActions + "{-DELIM-}" + a.SuggestedFurtherActionsRus,
                HazardID = a.HazardIdentification,
                LifeSavingActions = a.LifeSavingActions,
                Location = a.SpecificLocation + "{-DELIM-}" + a.SpecificLocationRus,
                ReportType = a.ReportType,
                SafeChoice = a.SafeChoice,
                Site = a.Site,
                NominationCategory = a.Nominations.OrderBy(n => n.Id).Last().Category,//a.Nominations.Where(n => n.AuthorId == this.HttpContext.Session.GetInt32("UserId").Value).First().Category,
                NominatedBy = a.Nominations.OrderBy(n => n.Id).Last().Author.Name,
                UniqueId = a.UniqueId
            });
        }

        private IQueryable<NGHCardResult> Sort(IQueryable<NGHCardResult> query, string name, SortType sortType)
        {
            switch (name)
            {
                case "Id": query = sortType == SortType.Ascending ? query.OrderBy(a => a.Id) : query.OrderByDescending(a => a.Id); break;
                case "Date": query = sortType == SortType.Ascending ? query.OrderBy(a => a.Date) : query.OrderByDescending(a => a.Date); break;
                case "Employee": query = sortType == SortType.Ascending ? query.OrderBy(a => a.Employee) : query.OrderByDescending(a => a.Employee); break;
                case "Site": query = sortType == SortType.Ascending ? query.OrderBy(a => a.Site) : query.OrderByDescending(a => a.Site); break;
                case "Company": query = sortType == SortType.Ascending ? query.OrderBy(a => a.Company) : query.OrderByDescending(a => a.Company); break;
                case "Department": query = sortType == SortType.Ascending ? query.OrderBy(a => a.Department) : query.OrderByDescending(a => a.Department); break;
                case "ReportType": query = sortType == SortType.Ascending ? query.OrderBy(a => a.ReportType) : query.OrderByDescending(a => a.ReportType); break;
                case "LifeSavingActions": query = sortType == SortType.Ascending ? query.OrderBy(a => a.LifeSavingActions) : query.OrderByDescending(a => a.LifeSavingActions); break;
                case "NominationCategory": query = sortType == SortType.Ascending ? query.OrderBy(a => a.NominationCategory) : query.OrderByDescending(a => a.NominationCategory); break;
                case "NominatedBy": query = sortType == SortType.Ascending ? query.OrderBy(a => a.NominatedBy) : query.OrderByDescending(a => a.NominatedBy); break;
            }

            return query;
        }

        private IQueryable<NGHCardResult> Filter(IQueryable<NGHCardResult> query, string name, List<string> choices)
        {
            var list = (List<NGHCardResult>)null;
            switch (name)
            {
                case "Id": query = query.Where(e => choices.Contains(e.Id.ToString())); break;
                case "Date": list = query.ToList().Where(e => choices.Contains(e.Date.ToString("MM/dd/yyyy", CultureInfo.InvariantCulture))).ToList(); break;
                case "Employee": query = query.Where(a => choices.Contains(a.Employee)); break;
                case "Site": query = query.Where(e => choices.Contains(e.Site)); break;
                case "Company": query = query.Where(e => choices.Contains(e.Company)); break;
                case "Department": query = query.Where(e => choices.Contains(e.Department)); break;
                case "ReportType": query = query.Where(e => choices.Contains(e.ReportType)); break;
                case "LifeSavingActions": query = query.Where(e => choices.Contains(e.LifeSavingActions)); break;
                case "HazardID": list = query.ToList().Where(a => a.HazardID.Any(i => choices.Contains(i))).ToList(); break;
                case "SafeChoice": list = query.ToList().Where(a => a.SafeChoice != null && a.SafeChoice.Any(i => choices.Contains(i))).ToList(); break;
                case "NominatedBy": query = query.Where(a => choices.Contains(a.NominatedBy)); break;
                case "NominationCategory":
                    for (var i = 0; i < choices.Count; i++)
                    {
                        if (choices[i] == "")
                            choices[i] = null;
                    }

                    query = query.Where(e => e.NominationCategory != "" ? choices.Contains(e.NominationCategory) : e.NominationCategory == null);
                    break;
            }

            if (list != null)
                query = list.AsQueryable();

            return query;
        }

        private IQueryable<NGHCardResult> Search(IQueryable<NGHCardResult> query, string searchString)
        {
            var searchInt = 0;
            if (Regex.IsMatch(searchString.Trim(), @"^\d{3}\s?\d{3}\s?\d{3}$"))
                searchInt = int.Parse(searchString.Replace(" ", ""));

            var s = searchString.ToLower();
            return query.Where(e => e.Id.ToString().ToLower().Contains(s) ||
                                    e.Employee.ToLower().Contains(s) ||
                                    e.Site.ToLower().Contains(s) ||
                                    e.Department.ToLower().Contains(s) ||
                                    e.Company.ToLower().Contains(s) ||
                                    e.ReportType.ToLower().Contains(s) ||
                                    e.LifeSavingActions.ToLower().Contains(s) ||
                                    e.Description.ToLower().Contains(s) ||
                                    e.ActionsTaken.ToLower().Contains(s) ||
                                    e.Location.ToLower().Contains(s) ||
                                    e.FurtherActions.ToLower().Contains(s) ||
                                    e.NominationCategory.ToLower().Contains(s) ||
                                    e.NominatedBy.ToLower().Contains(s) ||
                                    (searchInt != 0 && e.UniqueId == searchInt));
        }

        private List<NGHCardResult> GetResult(IQueryable<NGHCardResult> Query)
        {
            return Query.ToList();
        }

        private List<FilteringItem> GetFilteringValues(PropertyItemCollection properties)
        {
            var collection = this.GetBaseQuery(properties).ToList();

            var list = new List<FilteringItem>();

            list.Add(new FilteringItem() { Field = "Id", Choices = collection.Select(i => i.Id).Distinct().OrderBy(i => i).Select(i => i.ToString()).Cast<object>().ToList() });
            list.Add(new FilteringItem() { Field = "Date", Choices = collection.Select(i => i.Date).OrderBy(i => i).Select(d => d.ToString("MM/dd/yyyy", CultureInfo.InvariantCulture)).Distinct().Cast<object>().ToList() });
            list.Add(new FilteringItem() { Field = "Employee", Choices = collection.Select(a => a.Employee).Distinct().OrderBy(i => i).Cast<object>().ToList() });
            list.Add(new FilteringItem() { Field = "Site", Choices = collection.Select(i => i.Site).Distinct().OrderBy(i => i).Cast<object>().ToList() });
            list.Add(new FilteringItem() { Field = "Company", Choices = collection.Select(i => i.Company).Distinct().OrderBy(i => i).Cast<object>().ToList() });
            list.Add(new FilteringItem() { Field = "Department", Choices = collection.Select(i => i.Department).Distinct().OrderBy(i => i).Cast<object>().ToList() });
            list.Add(new FilteringItem() { Field = "ReportType", Choices = collection.Select(i => i.ReportType).Distinct().OrderBy(i => i).Cast<object>().ToList() });
            list.Add(new FilteringItem() { Field = "LifeSavingActions", Choices = collection.Select(i => i.LifeSavingActions).Distinct().OrderBy(i => i).Cast<object>().ToList() });
            list.Add(new FilteringItem() { Field = "NominationCategory", Choices = collection.Select(i => i.NominationCategory != null ? i.NominationCategory : "").Distinct().OrderBy(i => i).Cast<object>().ToList() });
            list.Add(new FilteringItem() { Field = "NominatedBy", Choices = collection.Select(i => i.NominatedBy != null ? i.NominatedBy : "").Distinct().OrderBy(i => i).Cast<object>().ToList() });

            var hazardIDChocies = new List<object>
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
            list.Add(new FilteringItem() { Field = "HazardID", Choices = hazardIDChocies });

            var safeChoiceChoices = new List<object>()
            {
                "Head before Hands (Fast / Slow thinking)",
                "Stay focused (Present motivation)",
                "LMRA / 6 Steps in safe decision making",
                "Biases",
                "Safety Traps",
                "Not Applicable"
            };
            safeChoiceChoices.Sort();
            list.Add(new FilteringItem() { Field = "SafeChoice", Choices = safeChoiceChoices });


            return list;
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

    public class NGHCardFile
    {
        public int FileId { get; set; }
        public string FileName { get; set; }
    }

    public class NGHCardResult
    {
        public int Id { get; set; }
        public IEnumerable<NGHCardFile> Photos { get; set; }
        public DateTime Date { get; set; }
        public string Employee { get; set; }
        public int NGHNumber { get; set; }
        public string Site { get; set; }
        public string Company { get; set; }
        public string Department { get; set; }
        public string ReportType { get; set; }
        public string Description { get; set; }
        public string ActionsTaken { get; set; }
        public string FurtherActions { get; set; }
        public string LifeSavingActions { get; set; }
        public List<string> HazardID { get; set; }
        public List<string> SafeChoice { get; set; }
        public string Location { get; set; }
        public int? ActionItem { get; set; }
        public string NominationCategory { get; set; }
        public string NominatedBy { get; set; }
        public int? UniqueId { get; set; }
    }
}

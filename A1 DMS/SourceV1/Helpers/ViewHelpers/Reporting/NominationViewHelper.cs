using System;
using System.Globalization;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;

namespace A1DMS.V1
{
    public class NominationViewHelper : IViewHelper<NominationReportItem>
    {
        private static object locker = new object();

        private readonly Context db;
        private readonly HttpContext Context;
        private readonly UserService UserService;

        private List<Site> Sites;

        public static string TBA = "TBA (To be advised)";

        public TableView Table { get; set; }

        public NominationViewHelper(IHttpContextAccessor accessor, Context context, UserService userService)
        {
            this.Context = accessor.HttpContext;
            this.db = context;
            this.UserService = userService;
            this.Table = this.GetTable();
        }

        private TableView<NGHCard, NominationReportItem> GetTable()
        {
            var table = new TableView<NGHCard, NominationReportItem>();

            table.ServerSide = true;
            table.PageSize = 30;
            table.Request = this.Context.Request;

            table.GetBaseQuery = this.GetBaseQuery;

            table.Sort = this.Sort;
            table.Filter = this.Filter;
            table.Search = this.Search;

            table.GetFilteringValues = this.GetFilteringValues;

            table.GetResult = this.GetResult;

            table.UpdateObject = this.UpdateObject;

            return table;
        }

        public List<Site> GetSites()
        {
            var siteIds = this.UserService.GetSiteIds();
            var query = this.db.Sites.OrderBy(a => a.Name).AsQueryable();
            if (siteIds.Count > 0)
                query = query.Where(s => siteIds.Contains(s.Id));

            this.Sites = query.ToList();

            return this.Sites;
        }

        public void ParseProperties(string site, string category, DateRange period)
        {
            this.Table.Properties.SetValue("Site", site);

            if (!string.IsNullOrEmpty(category))
                this.Table.Properties.SetValue("Category", category);

            this.Table.Properties.SetValue("Report", this.GetNominationReport(site, period.From.Value, period.To.Value));
        }

        public DateRange GetPeriod(string siteName)
        {
            var today = DateTime.Today;
            var currentDay = today.DayOfWeek == DayOfWeek.Sunday ? 7 : (int)today.DayOfWeek;

            var from = (DateTime?)null;
            var to = (DateTime?)null;

            if (this.UserService.HasRole(UserRole.Administrator | UserRole.SSHEUser))
            {
                var site = this.Sites != null ? this.Sites.Find(s => s.Name == siteName) : this.db.Sites.FirstOrDefault(s => s.Name == siteName);
                var firstDay = site.NominationReportFirstDay.HasValue ? site.NominationReportFirstDay.Value : 6;

                var lastDay = firstDay - 1;
                if (lastDay == 0)
                    lastDay = 7;

                to = today.AddDays(currentDay > lastDay ? lastDay - currentDay : lastDay - currentDay - 7);
                from = to.Value.AddDays(-6);
            }
            else if (this.UserService.HasRole(UserRole.VotingUser))
            {
                var report = this.db.NominationReports.Where(n => n.Site.Name == siteName && n.Stage >= 3).OrderByDescending(n => n.To).FirstOrDefault();
                if (report != null)
                {
                    from = report.From;
                    to = report.To;
                }
            }

            return new DateRange(from, to);
        }

        public NominationReport GetNominationReport(string siteName, DateTime from, DateTime to)
        {
            lock (locker)
            {
                var site = this.db.Sites.FirstOrDefault(s => s.Name == siteName);

                var report = this.db.NominationReports.FirstOrDefault(n => n.To == to && n.From == from && n.SiteId == site.Id);
                if (report == null)
                {
                    report = new NominationReport();
                    report.From = from;
                    report.To = to;
                    report.Site = site;
                    report.Stage = 1;

                    this.db.Add(report);
                    this.db.SaveChanges();
                }

                return report;
            }
        }

        public bool ValidateCategories(int reportId)
        {
            var report = this.db.NominationReports.Include(n => n.Site).FirstOrDefault(n => n.Id == reportId);
            if (report != null)
            {
                var cards = this.db.NGHCards.Where(c =>
                                report.From <= c.Date &&
                                c.Date <= report.To &&
                                c.Site == report.Site.Name &&
                                c.Nominations.Count() > 0 &&
                                (c.NominationCategory == null || c.NominationCategory == TBA)).ToList();

                var result = cards.Count == 0;
                if (!result && report.ExcludeIds != null)
                {
                    var allExcluded = true;
                    foreach (var card in cards)
                    {
                        if (!report.ExcludeIds.Contains(card.Id))
                        {
                            allExcluded = false;
                            break;
                        }
                    }

                    result = allExcluded;
                }

                return result;
            }

            return false;
        }

        private object UpdateObject(object obj)
        {
            var report = this.Table.Properties.GetValue<NominationReport>("Report");

            var dict = (Dictionary<string, object>)obj;
            dict["stage"] = report.Stage;
            dict["reportId"] = report.Id;
            dict["from"] = report.From.ToString("MM/dd/yyyy", CultureInfo.InvariantCulture);
            dict["to"] = report.To.ToString("MM/dd/yyyy", CultureInfo.InvariantCulture);

            return dict;
        }

        private IQueryable<NGHCard> GetBaseQuery(PropertyItemCollection properties)
        {
            var report = this.Table.Properties.GetValue<NominationReport>("Report");

            var Query = this.db
                .NGHCards
                .Include(a => a.Nominations)
                .AsQueryable();

            Query = Query.Where(a => a.Site == properties.GetValue<string>("Site") && a.Nominations.Count() > 0);

            if (properties.ContainsKey("Category"))
                Query = Query.Where(a => a.NominationCategory == properties.GetValue<string>("Category"));

            Query = Query.Where(a => a.Date >= report.From && a.Date <= report.To.AddDays(1).AddSeconds(-1)).OrderByDescending(s => s.Id);

            return Query;
        }

        private IQueryable<NGHCard> Sort(IQueryable<NGHCard> Query, string Name, SortType SortType)
        {
            switch (Name)
            {
                case "Id": Query = SortType == SortType.Ascending ? Query.OrderBy(a => a.Id) : Query.OrderByDescending(a => a.Id); break;
                case "NominationCategory": Query = SortType == SortType.Ascending ? Query.OrderBy(a => a.NominationCategory) : Query.OrderByDescending(a => a.NominationCategory); break;
                case "VotesNumberStage1": Query = SortType == SortType.Ascending ? Query.OrderBy(a => a.Nominations.Where(n => n.Stage == 1).Count()) : Query.OrderByDescending(a => a.Nominations.Where(n => n.Stage == 1).Count()); break;
                case "VotesNumberStage3": Query = SortType == SortType.Ascending ? Query.OrderBy(a => a.Nominations.Where(n => n.Stage == 3).Count()) : Query.OrderByDescending(a => a.Nominations.Where(n => n.Stage == 3).Count()); break;
            }

            return Query;
        }

        private IQueryable<NGHCard> Filter(IQueryable<NGHCard> Query, string Name, List<string> Choices)
        {
            var List = (List<NGHCard>)null;
            switch (Name)
            {
                case "Id": Query = Query.Where(e => Choices.Contains(e.Id.ToString())); break;
                case "NominationCategory": Query = Query.Where(e => (Choices.Contains("") && e.NominationCategory == null) || Choices.Contains(e.NominationCategory)); break;
                case "VotesNumberStage1": List = Query.ToList().Where(i => Choices.Contains(i.Nominations.Where(n => n.Stage == 1).Count().ToString())).ToList(); break;
                case "VotesNumberStage3": List = Query.ToList().Where(i => Choices.Contains(i.Nominations.Where(n => n.Stage == 3).Count().ToString())).ToList(); break;
            }

            if (List != null)
                Query = List.AsQueryable();

            return Query;
        }

        private IQueryable<NGHCard> Search(IQueryable<NGHCard> Query, string SearchString)
        {
            var s = SearchString.ToLower();
            return Query.Where(e => e.Id.ToString().ToLower().Contains(s) ||
                                    e.Description.ToLower().Contains(s) || e.DescriptionRus.ToLower().Contains(s) ||
                                    e.ActionsTaken.ToLower().Contains(s) || e.ActionsTakenRus.ToLower().Contains(s) ||
                                    e.SpecificLocation.ToLower().Contains(s) || e.SpecificLocationRus.ToLower().Contains(s) ||
                                    e.SuggestedFurtherActions.ToLower().Contains(s) || e.SuggestedFurtherActionsRus.ToLower().Contains(s) ||
                                    e.NominationCategory.ToLower().Contains(s));
        }

        private List<NominationReportItem> GetResult(IQueryable<NGHCard> Query)
        {
            var report = this.Table.Properties.GetValue<NominationReport>("Report");

            var NewQuery = Query
                .Select(a => new NominationReportItem()
                {
                    Id = a.Id,

                    Employee = (!string.IsNullOrEmpty(a.LastName) ? a.LastName + ", " : "") + (!string.IsNullOrEmpty(a.FirstName) ? a.FirstName : ""),
                    Company = a.Company,
                    Department = a.Department,
                    ActionsTaken = a.ActionsTaken,
                    ActionsTakenRus = a.ActionsTakenRus,
                    Description = a.Description,
                    DescriptionRus = a.DescriptionRus,
                    FurtherActions = a.SuggestedFurtherActions,
                    FurtherActionsRus = a.SuggestedFurtherActionsRus,
                    Location = a.SpecificLocation,
                    LocationRus = a.SpecificLocationRus,
                    NominationCategory = a.NominationCategory,
                    VotesNumberStage1 = a.Nominations.Where(n => n.Stage == 1).Count(),
                    VotesNumberStage3 = a.Nominations.Where(n => n.Stage == 3).Count() + a.NominationVoteOffset,
                    Stage3VoteMade = a.Nominations.Where(n => n.Stage == 3 && n.AuthorId == this.UserService.GetUserId()).Count() > 0,
                    IsWinner = a.Nominations.Where(n => n.Stage == 4).Count() > 0
                });


            if (!this.Table.CustomSorting)
            {
                if (report.Stage <= 2)
                    NewQuery = NewQuery.OrderByDescending(r => r.VotesNumberStage1);
                else if (report.Stage == 3)
                {
                    var OrderQuery = NewQuery.OrderBy(r => r.NominationCategory);
                    if (this.UserService.HasRole(UserRole.Administrator | UserRole.SSHEUser))
                        NewQuery = OrderQuery.ThenByDescending(r => r.VotesNumberStage3).ThenByDescending(r => r.VotesNumberStage1);
                    else
                        NewQuery = OrderQuery.ThenByDescending(r => r.VotesNumberStage1);
                }
                else
                    NewQuery = NewQuery
                                    .OrderByDescending(r => r.IsWinner)
                                    .ThenBy(r => r.NominationCategory)
                                    .ThenByDescending(r => r.VotesNumberStage3)
                                    .ThenByDescending(r => r.VotesNumberStage1);
            }

            var List = NewQuery.ToList();

            var NewList = new List<NominationReportItem>();
            if (report.ExcludeIds != null)
            {
                foreach (var Item in List)
                {
                    if (!report.ExcludeIds.Contains(Item.Id))
                        NewList.Add(Item);
                }
            }
            else
                NewList = List;

            return NewList;
        }

        private List<FilteringItem> GetFilteringValues(PropertyItemCollection properties)
        {
            var Collection = this.GetBaseQuery(properties).ToList();

            var List = new List<FilteringItem>();

            List.Add(new FilteringItem() { Field = "Id", Choices = Collection.Select(i => i.Id).Distinct().OrderBy(i => i).Select(i => i.ToString()).Cast<object>().ToList() });
            List.Add(new FilteringItem() { Field = "NominationCategory", Choices = Collection.Select(i => i.NominationCategory != null ? i.NominationCategory : "").Distinct().OrderBy(i => i).Cast<object>().ToList() });
            List.Add(new FilteringItem() { Field = "VotesNumberStage1", Choices = Collection.Select(i => i.Nominations.Where(n => n.Stage == 1).Count()).Distinct().OrderBy(i => i).Select(i => i.ToString()).Cast<object>().ToList() });
            List.Add(new FilteringItem() { Field = "VotesNumberStage3", Choices = Collection.Select(i => i.Nominations.Where(n => n.Stage == 3).Count()).Distinct().OrderBy(i => i).Select(i => i.ToString()).Cast<object>().ToList() });

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

        public TableViewResponse<NominationReportItem> GetData()
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

    public class NominationReportItem
    {
        public int Id { get; set; }
        public string Employee { get; set; }
        public string Company { get; set; }
        public string Department { get; set; }
        public string Description { get; set; }
        public string DescriptionRus { get; set; }
        public string ActionsTaken { get; set; }
        public string ActionsTakenRus { get; set; }
        public string FurtherActions { get; set; }
        public string FurtherActionsRus { get; set; }
        public string Location { get; set; }
        public string LocationRus { get; set; }
        public string NominationCategory { get; set; }
        public int VotesNumberStage1 { get; set; }
        public int VotesNumberStage3 { get; set; }
        public bool Stage3VoteMade { get; set; }
        public bool IsWinner { get; set; }
    }
}

using System;
using System.Collections.Generic;
using System.Linq;
using System.Text.RegularExpressions;
using System.Reflection;
using System.Globalization;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Mvc;
using A1DMS.API;

namespace A1DMS.V2
{
    public class NominationsViewHelper
    {
        private static object locker = new object();

        private readonly Context db;
        private readonly UserService UserService;
        private readonly HttpContext Context;

        public TableView<NGHCard, NominationReportItem> Table;

        private List<Site> Sites;

        public const string TBA = "TBA (To be advised)";

        public NominationsViewHelper(IHttpContextAccessor accessor, Context context, UserService userService)
        {
            this.Context = accessor.HttpContext;
            this.db = context;
            this.UserService = userService;

            this.Sites = this.db.Sites.ToList();

            this.GetTable();
        }

        public TableViewResponse<NominationReportItem> GetData()
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

        public IEnumerable<NominationReportItem> Export()
        {
            this.Table.Proceed(false);

            return this.Table.Response.Rows;
        }

        private void GetTable()
        {
            this.Table = new TableView<NGHCard, NominationReportItem>();
            this.Table.PageSize = 30;
            this.Table.Request = this.Context.Request;

            this.Table.GetBaseQuery = this.GetBaseQuery;
            this.Table.UpdateObject = this.UpdateObject;

            this.Table.Sort = this.Sort;
            this.Table.Filter = this.Filter;
            this.Table.Search = this.Search;
            this.Table.SearchEverywhere = this.SearchEverywhere;

            this.Table.GetFilteringValues = this.GetFilteringValues;

            this.Table.GetResult = this.GetResult;
        }

        public void ParseProperties(string site, string category, DateTime from, DateTime to)
        {
            this.Table.Properties.SetValue("Site", site);

            if (!string.IsNullOrEmpty(category))
                this.Table.Properties.SetValue("Category", category);

            this.Table.Properties.SetValue("Report", this.GetNominationReport(site, from, to));
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

        public (DateTime?, DateTime?) GetPeriod(string siteName)
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

            return (from, to);
        }

        private IQueryable<NGHCard> GetBaseQuery(PropertyItemCollection properties)
        {
            var report = this.Table.Properties.GetValue<NominationReport>("Report");

            var query = this.db
                .NGHCards
                .Include(a => a.Nominations)
                .AsQueryable();

            query = query.Where(a => a.Site == properties.GetValue<string>("Site") && a.Nominations.Count() > 0);

            if (properties.ContainsKey("Category"))
                query = query.Where(a => a.NominationCategory == properties.GetValue<string>("Category"));

            query = query.Where(a => a.Date >= report.From && a.Date <= report.To.AddDays(1).AddSeconds(-1)).OrderByDescending(s => s.Id);

            return query;
        }

        private IQueryable<NGHCard> Sort(IQueryable<NGHCard> query, string name, SortType sortType)
        {
            switch (name)
            {
                case "nominationCategory": query = sortType == SortType.Ascending ? query.OrderBy(a => a.NominationCategory) : query.OrderByDescending(a => a.NominationCategory); break;
                case "votesNumberStage1": query = sortType == SortType.Ascending ? query.OrderBy(a => a.Nominations.Where(n => n.Stage == 1).Count()) : query.OrderByDescending(a => a.Nominations.Where(n => n.Stage == 1).Count()); break;
                case "votesNumberStage3": query = sortType == SortType.Ascending ? query.OrderBy(a => a.Nominations.Where(n => n.Stage == 3).Count() + a.NominationVoteOffset) : query.OrderByDescending(a => a.Nominations.Where(n => n.Stage == 3).Count() + a.NominationVoteOffset); break;
            }

            return query;
        }

        private IQueryable<NGHCard> Filter(IQueryable<NGHCard> query, string name, List<string> choices)
        {
            var list = (List<NGHCard>)null;
            switch (name)
            {
                case "nominationCategory": query = query.Where(e => (choices.Contains("") && e.NominationCategory == null) || choices.Contains(e.NominationCategory)); break;
                case "votesNumberStage1": list = query.ToList().Where(i => choices.Contains(i.Nominations.Where(n => n.Stage == 1).Count().ToString())).ToList(); break;
                case "votesNumberStage3": list = query.ToList().Where(i => choices.Contains((i.Nominations.Where(n => n.Stage == 3).Count() + i.NominationVoteOffset).ToString())).ToList(); break;
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
                case "description": query = query.Where(e => e.Description.ToLower().Contains(s)); break;
                case "descriptionRus": query = query.Where(e => e.DescriptionRus.ToLower().Contains(s)); break;
                case "actionsTaken": query = query.Where(e => e.ActionsTaken.ToLower().Contains(s)); break;
                case "actionsTakenRus": query = query.Where(e => e.ActionsTakenRus.ToLower().Contains(s)); break;
                case "specificLocation": query = query.Where(e => e.SpecificLocation.ToLower().Contains(s)); break;
                case "specificLocationRus": query = query.Where(e => e.SpecificLocationRus.ToLower().Contains(s)); break;
                case "suggestedActions": query = query.Where(e => e.SuggestedFurtherActions.ToLower().Contains(s)); break;
                case "suggestedActionsRus": query = query.Where(e => e.SuggestedFurtherActionsRus.ToLower().Contains(s)); break;
                case "nominationCategory": query = query.Where(e => e.NominationCategory.ToLower().Contains(s)); break;
                case "votesNumberStage1": query = query.Where(e => e.Nominations.Where(n => n.Stage == 1).Count().ToString().ToLower().Contains(s)); break;
                case "votesNumberStage3": query = query.Where(e => (e.Nominations.Where(n => n.Stage == 3).Count() + e.NominationVoteOffset).ToString().ToLower().Contains(s)); break;
            }

            return query;
        }

        private IQueryable<NGHCard> SearchEverywhere(IQueryable<NGHCard> query, string searchString)
        {
            var s = searchString.ToLower();
            return query.Where(e => e.Id.ToString().ToLower().Contains(s) ||
                                    e.Description.ToLower().Contains(s) || e.DescriptionRus.ToLower().Contains(s) ||
                                    e.ActionsTaken.ToLower().Contains(s) || e.ActionsTakenRus.ToLower().Contains(s) ||
                                    e.SpecificLocation.ToLower().Contains(s) || e.SpecificLocationRus.ToLower().Contains(s) ||
                                    e.SuggestedFurtherActions.ToLower().Contains(s) || e.SuggestedFurtherActionsRus.ToLower().Contains(s) ||
                                    e.NominationCategory.ToLower().Contains(s));
        }

        private List<NominationReportItem> GetResult(IQueryable<NGHCard> query)
        {
            var newQuery = query
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

            var report = this.Table.Properties.GetValue<NominationReport>("Report");

            if (!this.Table.CustomSorting)
            {
                if (report.Stage <= 2)
                    newQuery = newQuery.OrderByDescending(r => r.VotesNumberStage1);
                else if (report.Stage == 3)
                {
                    var orderQuery = newQuery.OrderBy(r => r.NominationCategory);
                    if (this.UserService.HasRole(UserRole.Administrator | UserRole.SSHEUser))
                        newQuery = orderQuery.ThenByDescending(r => r.VotesNumberStage3).ThenByDescending(r => r.VotesNumberStage1);
                    else
                        newQuery = orderQuery.ThenByDescending(r => r.VotesNumberStage1);
                }
                else
                    newQuery = newQuery
                                    .OrderByDescending(r => r.IsWinner)
                                    .ThenBy(r => r.NominationCategory)
                                    .ThenByDescending(r => r.VotesNumberStage3)
                                    .ThenByDescending(r => r.VotesNumberStage1);
            }

            var list = newQuery.ToList();
            var newList = new List<NominationReportItem>();
            if (report.ExcludeIds != null)
            {
                foreach (var item in list)
                {
                    if (!report.ExcludeIds.Contains(item.Id))
                        newList.Add(item);
                }
            }
            else
                newList = list;

            return newList;
        }

        private TableViewResponse<NominationReportItem> UpdateObject(TableViewResponse<NominationReportItem> response)
        {
            var report = this.Table.Properties.GetValue<NominationReport>("Report");

            var newResponse = new NominationReportResponse();

            newResponse.Rows = response.Rows;
            newResponse.RowsPerPage = response.RowsPerPage;
            newResponse.TotalRows = response.TotalRows;
            newResponse.Stage = report.Stage;
            newResponse.ReportId = report.Id;
            newResponse.From = report.From;
            newResponse.To = report.To;

            return newResponse;
        }

        private List<FilteringItem> GetFilteringValues(IEnumerable<NominationReportItem> collection)
        {
            var list = new List<FilteringItem>();

            list.Add(new FilteringItem() { Field = "nominationCategory", Choices = collection.Select(i => i.NominationCategory != null ? i.NominationCategory : "").Distinct().OrderBy(i => i) });
            list.Add(new FilteringItem() { Field = "votesNumberStage1", Choices = collection.Select(i => i.VotesNumberStage1).Distinct().OrderBy(i => i).Select(i => i.ToString()) });
            list.Add(new FilteringItem() { Field = "votesNumberStage3", Choices = collection.Select(i => i.VotesNumberStage3).Distinct().OrderBy(i => i).Select(i => i.ToString()) });

            return list;
        }

        public (bool, DateTime?, DateTime?) IsNominationAllowed(int cardId)
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

        public ApiResponse SetNomination(int cardId, string category)
        {
            var authorId = this.UserService.GetUserId();
            category = !string.IsNullOrEmpty(category) ? category : null;

            (var result, var from, var to) = this.IsNominationAllowed(cardId);
            if (!result)
                return new ApiResponse(new List<ApiResponseError>() { new ApiResponseError(from.HasValue && to.HasValue ? "Voting for the period is already completed" : "Card not found") });

            var existing = this.db.Nominations.FirstOrDefault(n => n.NGHCardId == cardId && n.AuthorId == authorId);
            if (existing != null)
            {
                if (category != null)
                {
                    existing.Category = category;

                    this.db.Attach(existing).State = EntityState.Modified;
                }
                else
                    this.db.Remove(existing);
            }
            else
            {
                var Nomination = new Nomination();
                Nomination.Date = DateTime.Now;
                Nomination.NGHCardId = cardId;
                Nomination.AuthorId = authorId;
                Nomination.Category = category;
                Nomination.Stage = 1;

                this.db.Add(Nomination);
            }

            var card = this.db.NGHCards.FirstOrDefault(c => c.Id == cardId);
            card.NominationCategory = category;

            this.db.Attach(card).State = EntityState.Modified;
            this.db.SaveChanges();

            return new ApiResponse();
        }
    }

    public class NominationReportResponse : TableViewResponse<NominationReportItem>
    {
        public int Stage { get; set; }
        public int ReportId { get; set; }
        public DateTime? From { get; set; }
        public DateTime? To { get; set; }
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

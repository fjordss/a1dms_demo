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
    public class CloseoutViewHelper : IViewHelper<ActionItemResult>
    {
        public TableView<ActionItemResult, ActionItemResult> Table { get; set; }

        private readonly HttpContext Context;
        private readonly Context db;
        private readonly UserService UserService;

        public CloseoutViewHelper(IHttpContextAccessor accessor, Context context, UserService userService)
        {
            this.Context = accessor.HttpContext;
            this.db = context;
            this.UserService = userService;

            this.GetTable();
        }

        public TableViewResponse<ActionItemResult> GetData()
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

        public IEnumerable<ActionItemResult> Export()
        {
            this.Table.Proceed(false);

            return this.Table.Response.Rows;
        }

        public void ParseProperties(List<string> sites, List<string> companies, List<string> departments, DateTime? from, DateTime? to)
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

            if (from.HasValue)
                this.Table.Properties.SetValue("From", from.Value);

            if (to.HasValue)
                this.Table.Properties.SetValue("To", to.Value.AddDays(1).AddSeconds(-1));
        }

        private void GetTable()
        {
            this.Table = new TableView<ActionItemResult, ActionItemResult>();
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

        private IQueryable<ActionItemResult> GetBaseQuery(PropertyItemCollection properties)
        {
            var query = this.db
                .ActionItems
                .Include(a => a.NGHCard)
                .Include(a => a.Responsible)
                .AsQueryable();

            if (!properties.ContainsKey("Id"))
            {
                if (properties.ContainsKey("Sites"))
                    query = query.Where(a => properties.GetValue<List<string>>("Sites").Contains(a.NGHCard.Site));

                if (properties.ContainsKey("Companies"))
                    query = query.Where(a => properties.GetValue<List<string>>("Companies").Contains(a.NGHCard.Company));

                if (properties.ContainsKey("Departments"))
                    query = query.Where(a => properties.GetValue<List<string>>("Departments").Contains(a.NGHCard.Department));

                if (properties.ContainsKey("From"))
                    query = query.Where(a => a.NGHCard.Date >= properties.GetValue<DateTime>("From"));

                if (properties.ContainsKey("To"))
                    query = query.Where(a => a.NGHCard.Date <= properties.GetValue<DateTime>("To"));
            }
            else
                query = query.Where(a => a.Id == properties.GetValue<int>("Id"));

            return query
                .OrderBy(a => a.Status)
                .ThenByDescending(a => a.Id)
                .Select(a => new ActionItemResult()
                {
                    Id = a.Id,
                    CardId = a.NGHCard.Id,
                    Date = a.NGHCard.Date,
                    Name = (!string.IsNullOrEmpty(a.NGHCard.LastName) ? a.NGHCard.LastName + ", " : "") + (!string.IsNullOrEmpty(a.NGHCard.FirstName) ? a.NGHCard.FirstName : ""),
                    Site = a.NGHCard.Site,
                    Company = a.NGHCard.Company,
                    Department = a.NGHCard.Department,

                    Description = a.NGHCard.Description + "{-DELIM-}" + a.NGHCard.DescriptionRus,
                    ActionsTaken = a.NGHCard.ActionsTaken + "{-DELIM-}" + a.NGHCard.ActionsTakenRus,
                    Location = a.NGHCard.SpecificLocation + "{-DELIM-}" + a.NGHCard.SpecificLocationRus,
                    SuggestedFurtherActions = a.NGHCard.SuggestedFurtherActions + "{-DELIM-}" + a.NGHCard.SuggestedFurtherActionsRus,

                    DescriptionEng = a.NGHCard.Description,
                    ActionsTakenEng = a.NGHCard.ActionsTaken,
                    LocationEng = a.NGHCard.SpecificLocation,
                    SuggestedFurtherActionsEng = a.NGHCard.SuggestedFurtherActions,

                    DescriptionRus = a.NGHCard.DescriptionRus,
                    ActionsTakenRus = a.NGHCard.ActionsTakenRus,
                    LocationRus = a.NGHCard.SpecificLocationRus,
                    SuggestedFurtherActionsRus = a.NGHCard.SuggestedFurtherActionsRus,

                    Status = a.Status != ActionItemStatus.InProgress ? a.Status.ToString() : "In progress",
                    FurtherActions = a.FurtherActions != null ? a.FurtherActions : "",
                    Responsible = a.Responsible != null ? a.Responsible.Name : (a.OtherResponsible != null ? a.OtherResponsible : ""),
                    TargetDate = a.TargetDate,
                    CloseoutComments = a.Comments != null ? a.Comments : "",
                    ClosedBy = a.ClosedBy != null ? a.ClosedBy.Name : "",
                    ClosureDate = a.ClosureDate,
                });
        }

        private IQueryable<ActionItemResult> Sort(IQueryable<ActionItemResult> query, string name, SortType sortType)
        {
            List<ActionItemResult> list = null;
            switch (name)
            {
                case "site": query = sortType == SortType.Ascending ? query.OrderBy(a => a.Site) : query.OrderByDescending(a => a.Site); break;
                case "date": query = sortType == SortType.Ascending ? query.OrderBy(a => a.Date) : query.OrderByDescending(a => a.Date); break;
                case "name": query = sortType == SortType.Ascending ? query.OrderBy(a => a.Name) : query.OrderByDescending(a => a.Name); break;
                case "company": query = sortType == SortType.Ascending ? query.OrderBy(a => a.Company) : query.OrderByDescending(a => a.Company); break;
                case "department": query = sortType == SortType.Ascending ? query.OrderBy(a => a.Department) : query.OrderByDescending(a => a.Department); break;
                case "status": list = (sortType == SortType.Ascending ? query.ToList().OrderBy(a => a.Status) : query.ToList().OrderByDescending(a => a.Status)).ToList(); break;
                case "responsible": query = sortType == SortType.Ascending ? query.OrderBy(a => a.Responsible) : query.OrderByDescending(a => a.Responsible); break;
                case "targetDate": query = sortType == SortType.Ascending ? query.OrderBy(a => a.TargetDate) : query.OrderByDescending(a => a.TargetDate); break;
                case "closedBy": query = sortType == SortType.Ascending ? query.OrderBy(a => a.ClosedBy) : query.OrderByDescending(a => a.ClosedBy); break;
                case "closureDate": query = sortType == SortType.Ascending ? query.OrderBy(a => a.ClosureDate) : query.OrderByDescending(a => a.ClosureDate); break;
            }

            if (list != null)
                query = list.AsQueryable();

            return query;
        }

        private IQueryable<ActionItemResult> Filter(IQueryable<ActionItemResult> query, string name, List<string> choices)
        {
            List<ActionItemResult> list = null;
            switch (name)
            {
                case "site": query = query.Where(e => choices.Contains(e.Site)); break;
                case "date": list = query.ToList().Where(e => choices.Contains(e.Date.ToString("MM/dd/yyyy", CultureInfo.InvariantCulture))).ToList(); break;
                case "name": query = query.Where(e => choices.Contains(e.Name)); break;
                case "company": query = query.Where(e => choices.Contains(e.Company)); break;
                case "department": query = query.Where(e => choices.Contains(e.Department)); break;
                case "status": list = query.ToList().Where(e => choices.Contains(e.Status)).ToList(); break;
                case "responsible": query = query.Where(e => choices.Contains(e.Responsible != null ? e.Responsible : "")); break;
                case "targetDate": list = query.ToList().Where(e => choices.Contains(e.TargetDate.HasValue ? e.TargetDate.Value.ToString("MM/dd/yyyy", CultureInfo.InvariantCulture) : "")).ToList(); break;
                case "closedBy": query = query.Where(e => choices.Contains(e.ClosedBy != null ? e.ClosedBy : "")); break;
                case "closureDate": list = query.ToList().Where(e => choices.Contains(e.ClosureDate.HasValue ? e.ClosureDate.Value.ToString("MM/dd/yyyy", CultureInfo.InvariantCulture) : "")).ToList(); break;
            }

            if (list != null)
                query = list.AsQueryable();

            return query;
        }

        private IQueryable<ActionItemResult> Search(IQueryable<ActionItemResult> query, string name, string text)
        {
            var s = text.ToLower();

            switch (name)
            {
                case "site": query = query.Where(e => e.Site.ToLower().Contains(s)); break;
                case "name": query = query.Where(e => e.Name.ToLower().Contains(s)); break;
                case "company": query = query.Where(e => e.Company.ToLower().Contains(s)); break;
                case "department": query = query.Where(e => e.Department.ToLower().Contains(s)); break;
                case "description": query = query.Where(e => e.Description.ToLower().Contains(s)); break;
                case "actionsTaken": query = query.Where(e => e.ActionsTaken.ToLower().Contains(s)); break;
                case "location": query = query.Where(e => e.Location.ToLower().Contains(s)); break;
                case "suggestedFurtherActions": query = query.Where(e => e.SuggestedFurtherActions.ToLower().Contains(s)); break;
                case "status": query = query.AsEnumerable().Where(e => e.Status.ToLower().Contains(s)).AsQueryable(); break;
                case "furtherActions": query = query.Where(e => e.FurtherActions.ToLower().Contains(s)); break;
                case "responsible": query = query.Where(e => e.Responsible.ToLower().Contains(s)); break;
                case "closeoutComments": query = query.Where(e => e.CloseoutComments.ToLower().Contains(s)); break;
                case "closedBy": query = query.Where(e => e.ClosedBy.ToLower().Contains(s)); break;
            }

            return query;
        }

        private IQueryable<ActionItemResult> SearchEverywhere(IQueryable<ActionItemResult> query, string searchString)
        {
            var s = searchString.ToLower();
            query = query.Where(e => e.CardId.ToString().ToLower().Contains(s) ||
                                     e.ActionsTaken.ToLower().Contains(s) ||
                                     e.Description.ToLower().Contains(s) ||
                                     e.Location.ToLower().Contains(s) ||
                                     e.SuggestedFurtherActions.ToLower().Contains(s) ||
                                     e.Company.ToLower().Contains(s) ||
                                     e.Department.ToLower().Contains(s) ||
                                     e.Site.ToLower().Contains(s) ||
                                     e.Name.ToLower().Contains(s) ||
                                     e.ClosedBy.ToLower().Contains(s) ||
                                     e.Responsible.ToLower().Contains(s) ||
                                     e.FurtherActions.ToLower().Contains(s) ||
                                     e.CloseoutComments.ToLower().Contains(s));

            return query;
        }

        private List<ActionItemResult> GetResult(IQueryable<ActionItemResult> query)
        {
            return query.ToList();
        }

        private List<FilteringItem> GetFilteringValues(IEnumerable<ActionItemResult> collection)
        {
            var list = new List<FilteringItem>();

            list.Add(new FilteringItem() { Field = "site", Choices = collection.Select(i => i.Site).Distinct().OrderBy(i => i) });
            list.Add(new FilteringItem() { Field = "date", Choices = collection.Select(i => i.Date).Distinct().OrderBy(i => i).Select(d => d.ToString("MM/dd/yyyy", CultureInfo.InvariantCulture)) });
            list.Add(new FilteringItem() { Field = "name", Choices = collection.Select(i => i.Name).Distinct().OrderBy(i => i) });
            list.Add(new FilteringItem() { Field = "company", Choices = collection.Select(i => i.Company).Distinct().OrderBy(i => i) });
            list.Add(new FilteringItem() { Field = "department", Choices = collection.Select(i => i.Department).Distinct().OrderBy(i => i) });
            list.Add(new FilteringItem() { Field = "status", Choices = collection.Select(i => i.Status).Distinct().OrderBy(i => i) });
            list.Add(new FilteringItem() { Field = "responsible", Choices = collection.Select(i => i.Responsible).Distinct().OrderBy(i => i) });
            list.Add(new FilteringItem() { Field = "targetDate", Choices = collection.Select(i => i.TargetDate).Distinct().OrderBy(i => i).Select(d => d != null ? d.Value.ToString("MM/dd/yyyy", CultureInfo.InvariantCulture) : "") });
            list.Add(new FilteringItem() { Field = "closedBy", Choices = collection.Select(i => i.ClosedBy).Distinct().OrderBy(i => i) });
            list.Add(new FilteringItem() { Field = "closureDate", Choices = collection.Select(i => i.ClosureDate).Distinct().OrderBy(i => i).Select(d => d != null ? d.Value.ToString("MM/dd/yyyy", CultureInfo.InvariantCulture) : "") });

            return list;
        }
    }

    public class ActionItemResult
    {
        public int Id { get; set; }
        public int CardId { get; set; }
        public DateTime Date { get; set; }
        public string Name { get; set; }
        public string Site { get; set; }
        public string Company { get; set; }
        public string Department { get; set; }

        public string Description { get; set; }
        public string ActionsTaken { get; set; }
        public string Location { get; set; }
        public string SuggestedFurtherActions { get; set; }

        public string DescriptionEng { get; set; }
        public string ActionsTakenEng { get; set; }
        public string LocationEng { get; set; }
        public string SuggestedFurtherActionsEng { get; set; }

        public string DescriptionRus { get; set; }
        public string ActionsTakenRus { get; set; }
        public string LocationRus { get; set; }
        public string SuggestedFurtherActionsRus { get; set; }

        public string Status { get; set; }
        public string FurtherActions { get; set; }
        public string Responsible { get; set; }
        public DateTime? TargetDate { get; set; }
        public string CloseoutComments { get; set; }
        public string ClosedBy { get; set; }
        public DateTime? ClosureDate { get; set; }
    }
}

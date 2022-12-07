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
    public class CloseoutViewHelper : IViewHelper<ActionItemResult>
    {
        public TableView Table { get; set; }

        private readonly HttpContext Context;
        private readonly Context db;
        private readonly UserService UserService;

        private List<Site> Sites;

        public CloseoutViewHelper(IHttpContextAccessor accessor, Context context, UserService userService)
        {
            this.Context = accessor.HttpContext;
            this.db = context;
            this.UserService = userService;

            this.Table = this.GetTable();
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

        public object UpdateObject(object obj)
        {
            var dict = (Dictionary<string, object>)obj;

            var list = (List<ActionItemResult>)dict["rows"];

            var counts = new List<int>();
            counts.Add(list.Where(l => l.Status == "Open").Count());
            counts.Add(list.Where(l => l.Status == "In progress").Count());
            counts.Add(list.Where(l => l.Status == "Closed").Count());
            counts.Add(list.Where(l => l.Status != "Closed" ? l.TargetDate != null && l.TargetDate.Value < DateTime.Today : (l.TargetDate != null && l.ClosureDate != null && l.TargetDate.Value < l.ClosureDate.Value)).Count());

            dict["counts"] = counts;

            return dict;
        }

        private TableView<ActionItemResult, ActionItemResult> GetTable()
        {
            var table = new TableView<ActionItemResult, ActionItemResult>();
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
                case "Date": query = sortType == SortType.Ascending ? query.OrderBy(a => a.Date) : query.OrderByDescending(a => a.Date); break;
                case "Name": query = sortType == SortType.Ascending ? query.OrderBy(a => a.Name) : query.OrderByDescending(a => a.Name); break;
                case "Site": query = sortType == SortType.Ascending ? query.OrderBy(a => a.Site) : query.OrderByDescending(a => a.Site); break;
                case "Company": query = sortType == SortType.Ascending ? query.OrderBy(a => a.Company) : query.OrderByDescending(a => a.Company); break;
                case "Department": query = sortType == SortType.Ascending ? query.OrderBy(a => a.Department) : query.OrderByDescending(a => a.Department); break;
                case "Status": list = (sortType == SortType.Ascending ? query.ToList().OrderBy(a => a.Status) : query.ToList().OrderByDescending(a => a.Status)).ToList(); break;
                case "Responsible": query = sortType == SortType.Ascending ? query.OrderBy(a => a.Responsible) : query.OrderByDescending(a => a.Responsible); break;
                case "TargetDate": query = sortType == SortType.Ascending ? query.OrderBy(a => a.TargetDate) : query.OrderByDescending(a => a.TargetDate); break;
                case "ClosedBy": query = sortType == SortType.Ascending ? query.OrderBy(a => a.ClosedBy) : query.OrderByDescending(a => a.ClosedBy); break;
                case "ClosureDate": query = sortType == SortType.Ascending ? query.OrderBy(a => a.ClosureDate) : query.OrderByDescending(a => a.ClosureDate); break;
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
                case "Date": list = query.ToList().Where(e => choices.Contains(e.Date.ToString("MM/dd/yyyy", CultureInfo.InvariantCulture))).ToList(); break;
                case "Name": query = query.Where(e => choices.Contains(e.Name)); break;
                case "Site": query = query.Where(e => choices.Contains(e.Site)); break;
                case "Company": query = query.Where(e => choices.Contains(e.Company)); break;
                case "Department": query = query.Where(e => choices.Contains(e.Department)); break;
                case "Status": list = query.ToList().Where(e => choices.Contains(e.Status)).ToList(); break;
                case "Responsible": query = query.Where(e => choices.Contains(e.Responsible != null ? e.Responsible : "")); break;
                case "TargetDate": list = query.ToList().Where(e => choices.Contains(e.TargetDate.HasValue ? e.TargetDate.Value.ToString("MM/dd/yyyy", CultureInfo.InvariantCulture) : "")).ToList(); break;
                case "ClosedBy": query = query.Where(e => choices.Contains(e.ClosedBy != null ? e.ClosedBy : "")); break;
                case "ClosureDate": list = query.ToList().Where(e => choices.Contains(e.ClosureDate.HasValue ? e.ClosureDate.Value.ToString("MM/dd/yyyy", CultureInfo.InvariantCulture) : "")).ToList(); break;
            }

            if (list != null)
                query = list.AsQueryable();

            return query;
        }

        private IQueryable<ActionItemResult> Search(IQueryable<ActionItemResult> query, string searchString)
        {
            var s = searchString.ToLower();
            query = query.Where(e => e.CardId.ToString().ToLower().Contains(s) ||
                                     e.ActionsTaken.ToLower().Contains(s) || e.ActionsTakenRus.ToLower().Contains(s) ||
                                     e.Description.ToLower().Contains(s) || e.DescriptionRus.ToLower().Contains(s) ||
                                     e.Location.ToLower().Contains(s) || e.LocationRus.ToLower().Contains(s) ||
                                     e.SuggestedFurtherActions.ToLower().Contains(s) || e.SuggestedFurtherActionsRus.ToLower().Contains(s) ||
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

        private List<FilteringItem> GetFilteringValues(PropertyItemCollection properties)
        {
            var query = this.db
                .ActionItems
                .Include(a => a.NGHCard)
                .Include(a => a.Responsible)
                .Include(a => a.ClosedBy)
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

            var collection = query.ToList();

            var list = new List<FilteringItem>();

            list.Add(new FilteringItem() { Field = "Date", Choices = collection.Select(i => i.NGHCard.Date).Distinct().OrderBy(i => i).Select(d => d.ToString("MM/dd/yyyy", CultureInfo.InvariantCulture)).Cast<object>().ToList() });
            list.Add(new FilteringItem()
            {
                Field = "Name",
                Choices = collection
                  .Select(a => (!string.IsNullOrEmpty(a.NGHCard.LastName) ? a.NGHCard.LastName + ", " : "") + (!string.IsNullOrEmpty(a.NGHCard.FirstName) ? a.NGHCard.FirstName : ""))
                  .Distinct()
                  .OrderBy(i => i)
                  .Cast<object>()
                  .ToList()
            });

            list.Add(new FilteringItem() { Field = "Site", Choices = collection.Select(i => i.NGHCard.Site).Distinct().OrderBy(i => i).Cast<object>().ToList() });
            list.Add(new FilteringItem() { Field = "Company", Choices = collection.Select(i => i.NGHCard.Company).Distinct().OrderBy(i => i).Cast<object>().ToList() });
            list.Add(new FilteringItem() { Field = "Department", Choices = collection.Select(i => i.NGHCard.Department).Distinct().OrderBy(i => i).Cast<object>().ToList() });
            list.Add(new FilteringItem() { Field = "Status", Choices = collection.Select(i => i.Status == ActionItemStatus.InProgress ? "In progress" : i.Status.ToString()).Distinct().OrderBy(i => i).Cast<object>().ToList() });
            list.Add(new FilteringItem() { Field = "Responsible", Choices = collection.Select(i => i.Responsible != null ? i.Responsible.Name : "").Distinct().OrderBy(i => i).Cast<object>().ToList() });
            list.Add(new FilteringItem() { Field = "TargetDate", Choices = collection.Select(i => i.TargetDate).Distinct().OrderBy(i => i).Select(d => d != null ? d.Value.ToString("MM/dd/yyyy", CultureInfo.InvariantCulture) : "").Cast<object>().ToList() });
            list.Add(new FilteringItem() { Field = "ClosedBy", Choices = collection.Select(i => i.ClosedBy != null ? i.ClosedBy.Name : "").Distinct().OrderBy(i => i).Cast<object>().ToList() });
            list.Add(new FilteringItem() { Field = "ClosureDate", Choices = collection.Select(i => i.ClosureDate).Distinct().OrderBy(i => i).Select(d => d != null ? d.Value.ToString("MM/dd/yyyy", CultureInfo.InvariantCulture) : "").Cast<object>().ToList() });

            return list;
        }

        public TableViewResponse<ActionItemResult> GetData()
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

using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using Microsoft.EntityFrameworkCore;
using A1DMS.Pages.mgmt;
using Microsoft.CodeAnalysis.CSharp.Syntax;

namespace A1DMS.V2
{
    public class TableColumn
    {
        public string Label { get; set; }
        public string InternalName { get; set; }
    }

    public class TableViewResponse<T>
    {
        public int TotalRows { get; set; }
        public int RowsPerPage { get; set; }
        public IEnumerable<T> Rows { get; set; }
    }

    public class FilteringItem
    {
        public string Field { get; set; }
        public IEnumerable<string> Choices { get; set; }
    }

    public class TotalItem
    {
        public string Field { get; set; }
        public string Total { get; set; }
    }

    public class PropertyItem
    {
        public string Name { get; set; }
        public object Value { get; set; }
    }

    public class PropertyItemCollection : List<PropertyItem>
    {
        public bool ContainsKey(string name)
        {
            return this.Exists(i => i.Name == name);
        }

        public T GetValue<T>(string name)
        {
            if (this.ContainsKey(name))
                return (T)(object)this.Find(i => i.Name == name).Value;
            else 
                throw new KeyNotFoundException();
        }

        public void SetValue(string name, object value)
        {
            var item = this.Find(i => i.Name == name);
            if (item == null)
            {
                item = new PropertyItem();
                item.Name = name;

                this.Add(item);
            }

            item.Value = value;
        }
    }

    public enum SortType
    {
        Ascending,
        Descending
    }

    public class TableView<TEntity, TResult>
    {
        private JArray Filtering { get; set; }
        private JObject Sorting { get; set; }
        private JArray Searching { get; set; }
        public string SearchEverywhereString { get; private set; }

        public int PageSize { get; set; }
        public int PageNumber { get; private set; } = 1;

        public PropertyItemCollection Properties { get; private set; } = new PropertyItemCollection();

        public bool CustomSorting { get; private set; }

        public HttpRequest Request { get; set; }

        public Func<PropertyItemCollection, IQueryable<TEntity>> GetBaseQuery { get; set; }

        public Func<IQueryable<TEntity>, string, SortType, IQueryable<TEntity>> Sort { get; set; }
        public Func<IQueryable<TEntity>, string, List<string>, IQueryable<TEntity>> Filter { get; set; }
        public Func<IQueryable<TEntity>, string, string, IQueryable<TEntity>> Search { get; set; }
        public Func<IQueryable<TEntity>, string, IQueryable<TEntity>> SearchEverywhere { get; set; }

        public Func<IQueryable<TEntity>, List<TResult>> GetResult { get; set; }

        public Func<IEnumerable<TResult>, List<TotalItem>> GetTotals { get; set; }
        public Func<IEnumerable<TResult>, IEnumerable<FilteringItem>> GetFilteringValues { get; set; }

        public Func<TableViewResponse<TResult>, TableViewResponse<TResult>> UpdateObject { get; set; }

        public TableViewResponse<TResult> Response { get; private set; }

        public void Proceed(bool trimToPage)
        {
            if (this.GetBaseQuery == null || this.GetResult == null)
                return;

            this.ParseParameters();

            var query = this.GetBaseQuery(this.Properties);

            query = this.ApplyModifiers(query);

            var list = this.GetResult(query);
            var totalCount = list.Count;

            if (trimToPage)
                list = this.ApplyPagination(list);

            this.Response = this.GetResponse(list, totalCount);

            if (this.UpdateObject != null)
                this.Response = this.UpdateObject(this.Response);
        }

        private TableViewResponse<TResult> GetResponse(List<TResult> list, int totalCount)
        {
            var response = new TableViewResponse<TResult>();
            response.TotalRows = totalCount;
            response.RowsPerPage = this.PageSize;
            response.Rows = list;

            return response;
        }

        private IQueryable<TEntity> ApplyModifiers(IQueryable<TEntity> query)
        {
            if (this.Filtering != null && this.Filtering.Count > 0 && this.Filter != null)
                query = this.ApplyFiltering(query);

            if (this.Searching != null && this.Searching.Count > 0 && this.Search != null)
                query = this.ApplySearching(query);

            if (!string.IsNullOrEmpty(this.SearchEverywhereString) && this.SearchEverywhere != null)
                query = this.ApplySearchEverywhere(query);

            if (this.Sorting != null && this.Sorting.Count > 0 && this.Sort != null)
                query = this.ApplySorting(query);

            return query;
        }

        private IQueryable<TEntity> ApplyFiltering(IQueryable<TEntity> query)
        {
            foreach (var filteringField in this.Filtering)
            {
                var name = (string)filteringField["field"];
                var choices = ((JArray)filteringField["choices"]).ToObject<List<string>>();

                query = this.Filter(query, name, choices);
            }

            return query;
        }

        private IQueryable<TEntity> ApplySearching(IQueryable<TEntity> query)
        {
            foreach (var searchingField in this.Searching)
            {
                var name = (string)searchingField["field"];
                var text = (string)searchingField["text"];

                query = this.Search(query, name, text);
            }

            return query;
        }

        private IQueryable<TEntity> ApplySearchEverywhere(IQueryable<TEntity> query)
        {
            return this.SearchEverywhere(query, this.SearchEverywhereString);
        }

        private IQueryable<TEntity> ApplySorting(IQueryable<TEntity> query)
        {
            var name = (string)this.Sorting["field"];
            var type = (string)this.Sorting["order"] == "0" ? SortType.Ascending : SortType.Descending;

            this.CustomSorting = true;

            return this.Sort(query, name, type); ;
        }

        private List<TResult> ApplyPagination(List<TResult> list)
        {
            return list.Skip((this.PageNumber - 1) * this.PageSize).Take(this.PageSize).ToList();
        }

        private void ParseParameters()
        {
            this.Filtering = this.GetFiltering();
            this.Sorting = this.GetSorting();
            this.Searching = this.GetSearching();
            this.SearchEverywhereString = this.GetSearchEverywhereString();

            this.SetPageProperties();
        }

        private JArray GetFiltering()
        {
            var fieldName = "filtering";

            if (this.Request.Query.ContainsKey(fieldName) && !string.IsNullOrEmpty(this.Request.Query[fieldName].First()))
                return (JArray)JsonConvert.DeserializeObject(this.Request.Query[fieldName].First());

            return null;
        }

        private JObject GetSorting()
        {
            var fieldName = "sort";

            if (this.Request.Query.ContainsKey(fieldName) && !string.IsNullOrEmpty(this.Request.Query[fieldName].First()))
                return (JObject)JsonConvert.DeserializeObject(this.Request.Query[fieldName].First());

            return null;
        }

        private JArray GetSearching()
        {
            var fieldName = "search";

            if (this.Request.Query.ContainsKey(fieldName) && !string.IsNullOrEmpty(this.Request.Query[fieldName].First()))
                return (JArray)JsonConvert.DeserializeObject(this.Request.Query[fieldName].First());

            return null;
        }

        private string GetSearchEverywhereString()
        {
            var fieldName = "searchEverywhere";

            if (this.Request.Query.ContainsKey(fieldName) && !string.IsNullOrEmpty(this.Request.Query[fieldName].First()))
                return this.Request.Query[fieldName].First();

            return null;
        }

        private void SetPageProperties()
        {
            var fieldName = "page";


            if (this.Request.Query.ContainsKey(fieldName) && !string.IsNullOrEmpty(this.Request.Query[fieldName].First()))
                this.PageNumber = Convert.ToInt32(this.Request.Query[fieldName].First());

            fieldName = "rowsPerPage";

            if (this.Request.Query.ContainsKey(fieldName) && !string.IsNullOrEmpty(this.Request.Query[fieldName].First()))
                this.PageSize = Convert.ToInt32(this.Request.Query[fieldName].First());
        }
    }
}

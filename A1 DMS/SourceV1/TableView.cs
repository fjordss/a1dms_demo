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

namespace A1DMS.V1
{
    public class FilteringItem
    {
        public string Field { get; set; }
        public string Name { get; set; }
        public List<object> Choices { get; set; }
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

    public abstract class TableView
    {
        public bool ServerSide { get; set; }

        public JArray Filtering { get; set; }
        public JObject Sorting { get; set; }

        public int PageSize { get; set; }
        public int PageOffset { get; set; }

        public string SearchString { get; set; }

        public Func<PropertyItemCollection, List<FilteringItem>> GetFilteringValues { get; set; }
        public Func<PropertyItemCollection, List<FilteringItem>> GetApiFilteringValues { get; set; }

        public object Object { get; set; }
        public string Result { get; set; }

        public string Json { get; set; }

        public PropertyItemCollection Properties { get; set; } = new PropertyItemCollection();

        public bool CustomSorting { get; protected set; }

        public abstract void Proceed(bool apiCall = false);
        public abstract string GetData();
        public abstract string GetFilteringData();
    }

    public class TableView<TEntity, TResult> : TableView
    {
        public HttpRequest Request { get; set; }

        public Func<PropertyItemCollection, IQueryable<TEntity>> GetBaseQuery { get; set; }

        public Func<IQueryable<TEntity>, string, SortType, IQueryable<TEntity>> Sort { get; set; }
        public Func<IQueryable<TEntity>, string, List<string>, IQueryable<TEntity>> Filter { get; set; }
        public Func<IQueryable<TEntity>, string, IQueryable<TEntity>> Search { get; set; }

        public Func<IQueryable<TEntity>, List<TResult>> GetResult { get; set; }

        public Func<List<TResult>, List<TotalItem>> GetTotals { get; set; }

        public Func<object, object> UpdateObject { get; set; }
        public Func<TableViewResponse<TResult>, TableViewResponse<TResult>> UpdateApiObject { get; set; }

        public TableViewResponse<TResult> ApiResponse { get; set; }

        public override void Proceed(bool apiCall = false)
        {
            if (this.GetBaseQuery == null || this.GetResult == null)
                return;

            this.ParseParameters();

            var query = this.GetBaseQuery(this.Properties);

            query = this.ApplyModifiers(query);

            var list = this.GetResult(query);

            var totals = (List<TotalItem>)null;
            if (this.ServerSide && this.GetTotals != default)
                totals = this.GetTotals(list);

            var totalCount = list.Count;

            if (this.ServerSide)
                list = this.ApplyPagination(list);

            if (!apiCall)
            {
                this.Object = this.GetObject(list, totals, totalCount);

                if (this.UpdateObject != null)
                    this.Object = this.UpdateObject(this.Object);

                this.Result = JsonConvert.SerializeObject(this.Object);
            }
            else
            {
                this.ApiResponse = this.GetApiResponse(list, totals, totalCount);

                if (this.UpdateApiObject != null)
                    this.ApiResponse = this.UpdateApiObject(this.ApiResponse);
            }
        }

        public override string GetData()
        {
            if (string.IsNullOrEmpty(this.Result))
                this.Proceed();

            return this.Result;
        }

        public override string GetFilteringData()
        {
            if (this.GetFilteringValues == null)
                return null;

            return JsonConvert.SerializeObject(this.GetFilteringValues(this.Properties));
        }

        private TableViewResponse<TResult> GetApiResponse(List<TResult> list, List<TotalItem> totals, int totalCount)
        {
            var response = new TableViewResponse<TResult>();
            response.Total = totalCount;
            response.Rows = list;
            response.Totals = totals;

            return response;
        }

        private object GetObject(List<TResult> list, List<TotalItem> totals, int totalCount)
        {
            if (this.ServerSide)
            {
                var obj = new Dictionary<string, object>();
                obj["rows"] = list;
                obj["total"] = totalCount;
                obj["totalNotFiltered"] = totalCount;

                if (totals != null)
                    obj["totals"] = totals;

                return obj;
            }

            return list;
        }

        private IQueryable<TEntity> ApplyModifiers(IQueryable<TEntity> query)
        {
            if (this.Filtering != null && this.Filtering.Count > 0 && this.Filter != null)
                query = this.ApplyFiltering(query);

            if (this.ServerSide && !string.IsNullOrEmpty(this.SearchString) && this.Search != null)
                query = this.ApplySearch(query);

            if (this.Sorting != null && this.Sorting.Count > 0 && this.Sort != null)
                query = this.ApplySorting(query);

            return query;
        }

        private IQueryable<TEntity> ApplyFiltering(IQueryable<TEntity> query)
        {
            foreach (var filteringField in this.Filtering)
            {
                var name = (string)filteringField["name"];
                var choices = ((JArray)filteringField["choices"]).ToObject<List<string>>();

                query = this.Filter(query, name, choices);
            }

            return query;
        }

        private IQueryable<TEntity> ApplySearch(IQueryable<TEntity> query)
        {
            return this.Search(query, this.SearchString);
        }

        private IQueryable<TEntity> ApplySorting(IQueryable<TEntity> query)
        {
            var name = (string)this.Sorting["name"];
            var type = (string)this.Sorting["type"] == "asc" ? SortType.Ascending : SortType.Descending;

            this.CustomSorting = true;

            return this.Sort(query, name, type); ;
        }

        private List<TResult> ApplyPagination(List<TResult> list)
        {
            return list.Skip(this.PageOffset).Take(this.PageSize).ToList();
        }

        private void ParseParameters()
        {
            this.Filtering = this.GetFiltering();
            this.Sorting = this.GetSorting();

            this.SearchString = this.GetSearchString();

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
            var fieldName = "sorting";

            if (this.Request.Query.ContainsKey(fieldName) && !string.IsNullOrEmpty(this.Request.Query[fieldName].First()))
                return (JObject)JsonConvert.DeserializeObject(this.Request.Query[fieldName].First());

            return null;
        }

        private string GetSearchString()
        {
            var fieldName = "search";

            if (this.Request.Query.ContainsKey(fieldName) && !string.IsNullOrEmpty(this.Request.Query[fieldName].First()))
                return this.Request.Query[fieldName].First();

            return null;
        }

        private void SetPageProperties()
        {
            var fieldName = "offset";

            if (this.Request.Query.ContainsKey(fieldName) && !string.IsNullOrEmpty(this.Request.Query[fieldName].First()))
                this.PageOffset = Convert.ToInt32(this.Request.Query[fieldName].First());

            fieldName = "limit";

            if (this.Request.Query.ContainsKey(fieldName) && !string.IsNullOrEmpty(this.Request.Query[fieldName].First()))
                this.PageSize = Convert.ToInt32(this.Request.Query[fieldName].First());
        }
    }
}

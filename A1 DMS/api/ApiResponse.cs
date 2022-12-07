using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace A1DMS.API
{
    public enum ApiResponseStatus
    {
        Ok,
        Error
    }

    public class ApiResponseError
    {
        public string Field { get; set; }
        public string Text { get; set; }

        public ApiResponseError(string text, string field = null)
        {
            this.Text = text;
            this.Field = field;
        }
    }

    public class ApiResponse
    {
        public const string FieldRequiredError = "This field is required";
        public const string UnknownError = "Unknown error occured, please try again";

        public string Status { get; set; }
        
        public List<ApiResponseError> Errors { get; set; } = new List<ApiResponseError>();

        public ApiResponse()
        {
            this.Status = ApiResponseStatus.Ok.ToString().ToLower();
        }
        public ApiResponse(List<ApiResponseError> errors)
        {
            this.Status = ApiResponseStatus.Error.ToString().ToLower();
            this.Errors = errors;
        }
    }

    public class ApiResponse<T> : ApiResponse
    {
        public T Data { get; set; }

        public ApiResponse(T data) : base()
        {
            this.Data = data;
        }

        public ApiResponse(List<ApiResponseError> errors) : base(errors)
        {

        }
    }
}

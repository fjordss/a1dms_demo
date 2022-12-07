using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.EntityFrameworkCore;
using A1DMS.V2;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace A1DMS.API
{
    [Route("/api/[controller]")]
    [ApiController]
    [Authorize]
    public class NominationsController : ControllerBase
    {
        private readonly NominationsViewHelper Helper;

        public NominationsController(CallViewHelper callViewHelper)
        {
            this.Helper = (NominationsViewHelper)callViewHelper(ViewHelpers.NominationReport);
        }

        [HttpGet("allowed/{cardId:int}")]
        public ApiResponse<bool?> GetNominationAllowed(int cardId)
        {
            (var result, var from, var to) = this.Helper.IsNominationAllowed(cardId);

            var error = "";
            if (!result)
                error = from.HasValue && to.HasValue ? "Voting for period " + this.getPeriod(from.Value, to.Value) + " is already completed" : "Card not found";

            return string.IsNullOrEmpty(error) ? new ApiResponse<bool?>(true) : new ApiResponse<bool?>(new List<ApiResponseError>() { new ApiResponseError(error) });
        }

        [HttpGet("categories")]
        public ApiResponse<List<string>> GetCategories()
        {
            return new ApiResponse<List<string>>(new List<string>() 
            {
                "TBA (To be advised)",
                "Best Safe Act",
                "Unsafe Behavior with Approaching",
                "HID",
                "Process Safety",
                "Life Saving Action",
                "SHE Observation (Security, Health, Environment, Housekeeping)",
                "Off-the-job"
            });
        }

        [HttpPost]
        public ApiResponse Post([FromForm] int cardId, [FromForm] string category)
        {
            return this.Helper.SetNomination(cardId, category);
        }

        private string getPeriod(DateTime from, DateTime to)
        {
            return from.ToString("MM/dd/yyyy") + " - " + to.ToString("MM/dd/yyyy");
        }
    }
}

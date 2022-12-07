using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.EntityFrameworkCore;
using A1DMS.V2;

namespace A1DMS.API
{
    [Route("/api/[controller]")]
    [ApiController]
    [Authorize]
    public class ActionItemsController : ControllerBase
    {
        private readonly Context db;
        private readonly UserService UserService;

        public ActionItemsController(Context context, UserService userService)
        {
            this.db = context;
            this.UserService = userService;
        }

        [HttpGet("{id:int}")]
        public ApiResponse<ActionItem> Get(int id)
        {
            var actionItem = this.db.ActionItems
                .Include(a => a.Responsible)
                .Include(a => a.ClosedBy)
                .Include(a => a.NGHCard)
                .FirstOrDefault(s => s.Id == id);

            if (actionItem != null)
                return new ApiResponse<ActionItem>(actionItem);
            else
                return new ApiResponse<ActionItem>(new List<ApiResponseError>() { new ApiResponseError("Action item not found") });
        }

        [HttpPut("{id:int}")]
        public ApiResponse<ActionItem> Put(int id, [FromForm] ActionItem actionItem)
        {
            (var validated, var errors) = this.Validate(actionItem);
            if (validated)
            {
                var existing = this.db.ActionItems.FirstOrDefault(a => a.Id == id);
                if (existing == null)
                    errors.Add(new ApiResponseError("Action item not found"));
                else
                {
                    if (existing.Status != ActionItemStatus.Closed && actionItem.Status == ActionItemStatus.Closed)
                    {
                        existing.ClosedById = this.UserService.GetUserId();
                        existing.ClosureDate = DateTime.Now;
                    }
                    else if (actionItem.Status != ActionItemStatus.Closed)
                    {
                        existing.ClosedById = null;
                        existing.ClosureDate = null;
                    }

                    existing.Status = actionItem.Status;
                    existing.ResponsibleId = actionItem.ResponsibleId;
                    existing.OtherResponsible = actionItem.OtherResponsible;
                    existing.FurtherActions = actionItem.FurtherActions;
                    existing.TargetDate = actionItem.TargetDate;
                    existing.Comments = actionItem.Comments;

                    try
                    {
                        this.db.Update(existing);
                        this.db.SaveChanges();

                        return new ApiResponse<ActionItem>(existing);
                    }
                    catch (Exception e)
                    {
                        errors.Add(new ApiResponseError(ApiResponse.UnknownError));
                    }
                }
            }
            

            return new ApiResponse<ActionItem>(errors);
        }

        private (bool, List<ApiResponseError>) Validate(ActionItem actionItem)
        {
            var errors = new List<ApiResponseError>();

            actionItem.OtherResponsible = this.HandleString(actionItem.OtherResponsible);
            actionItem.FurtherActions = this.HandleString(actionItem.FurtherActions);
            actionItem.Comments = this.HandleString(actionItem.Comments);

            if (actionItem.Status == ActionItemStatus.InProgress || actionItem.Status == ActionItemStatus.Closed)
            {
                if ((!actionItem.ResponsibleId.HasValue || actionItem.ResponsibleId.Value == 0) && string.IsNullOrEmpty(actionItem.OtherResponsible))
                    errors.Add(new ApiResponseError(ApiResponse.FieldRequiredError, "responsible"));

                if (actionItem.ResponsibleId.HasValue && actionItem.ResponsibleId.Value != 0)
                {
                    var responsible = this.db.Departments.FirstOrDefault(d => d.Id == actionItem.ResponsibleId.Value);
                    if (responsible == null)
                        errors.Add(new ApiResponseError("Department not found", "responsible"));
                }

                if (string.IsNullOrEmpty(actionItem.FurtherActions))
                    errors.Add(new ApiResponseError(ApiResponse.FieldRequiredError, "furtherActions"));

                if (!actionItem.TargetDate.HasValue)
                    errors.Add(new ApiResponseError(ApiResponse.FieldRequiredError, "targetDate"));
                else if (actionItem.TargetDate.Value.Date < DateTime.Today)
                    errors.Add(new ApiResponseError("Target date cannot be less than today", "targetDate"));
            }

            return (errors.Count == 0, errors);
        }

        private string HandleString(string str)
        {
            return str != null ? str.Trim() : null;
        }
    }
}

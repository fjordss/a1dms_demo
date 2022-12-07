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
    public class CardsController : ControllerBase
    {
        private readonly Queue Queue;
        private readonly UserService UserService;
        private readonly CardsViewHelper Helper;
        private readonly Context db;

        public CardsController(CallQueue callQueue, UserService userService, CallViewHelper callHelper, Context context)
        {
            this.Queue = callQueue(QueueType.Card);
            this.UserService = userService;
            this.Helper = (CardsViewHelper)callHelper(ViewHelpers.Cards);
            this.db = context;
        }

        [HttpGet("test")]
        public ApiResponse<List<NGHCard>> Get()
        {
            return new ApiResponse<List<NGHCard>>(this.db.NGHCards.Take(10).ToList());
        }

        [Authorize]
        [HttpGet]
        public ApiResponse<TableViewResponse<NGHCardResult>> Get([FromQuery] List<string> sites,
                                                    [FromQuery] List<string> companies, 
                                                    [FromQuery] List<string> departments,
                                                    [FromQuery] DateTime? from,
                                                    [FromQuery] DateTime? to)
        {
            this.Helper.ParseProperties(sites, companies, departments, from, to);

            return new ApiResponse<TableViewResponse<NGHCardResult>>(this.Helper.GetData());
        }

        [Authorize]
        [HttpGet("filterings")]
        public ApiResponse<IEnumerable<FilteringItem>> GetFilterings([FromQuery] List<string> sites,
                                                        [FromQuery] List<string> companies,
                                                        [FromQuery] List<string> departments,
                                                        [FromQuery] DateTime? from,
                                                        [FromQuery] DateTime? to)
        {
            this.Helper.ParseProperties(sites, companies, departments, from, to);

            return new ApiResponse<IEnumerable<FilteringItem>>(this.Helper.GetFilterings());
        }

        [Authorize]
        [HttpGet("{id:int}")]
        public ApiResponse<NGHCard> Get(int id)
        {
            var card = this.db.NGHCards.FirstOrDefault(s => s.Id == id);
            if (card != null)
                return new ApiResponse<NGHCard>(card);
            else
                return new ApiResponse<NGHCard>(new List<ApiResponseError>() { new ApiResponseError("Card not found") });
        }

        [HttpGet("participation/{code:int}")]
        public ApiResponse<int> GetParticipation(int code, DateTime? from, DateTime? to)
        {
            var query = this.db.NGHCards.Where(c => c.Employee.Code == code);
            if (from.HasValue)
                query = query.Where(c => c.Date >= from.Value);

            if (to.HasValue)
                query = query.Where(c => c.Date <= to.Value.AddDays(1).AddSeconds(-1));

            var count = query.Count();

            return new ApiResponse<int>(count);
        }

        [HttpPost]
        public ApiResponse<int> Post([FromForm, Bind("Site", "FirstName", "LastName", "Company", "Department", "ReportType", "LifeSavingActions", "HazardIdentification", "Description", "ActionsTaken", "SafeChoice", "FurtherActionsRequired", "SpecificLocation", "SuggestedFurtherActions")] NGHCard card)
        {
            (var validated, var errors) = this.ValidateSession();
            if (!validated)
                return new ApiResponse<int>(errors);

            var kiosk = this.UserService.Get<string>("card-kiosk");
            var employee = this.db.Employees.Include(e => e.Company).Include(e => e.Department).FirstOrDefault(e => e.Code == this.UserService.Get<int>("card-code"));

            (validated, errors) = this.ValidateCard(card, employee);
            if (!validated)
                return new ApiResponse<int>(errors);

            card.Date = DateTime.Now;
            card.EmployeeId = employee.Id;
            card.FirstName = !string.IsNullOrEmpty(employee.FirstName) ? employee.FirstName : card.FirstName;
            card.LastName = !string.IsNullOrEmpty(employee.LastName) ? employee.LastName : card.LastName;
            card.Company = employee.Company.Name;
            card.Department = employee.Department.Name;

            card.IPAddress = this.Request.Headers.ContainsKey("Cf-Connecting-Ip") ? this.Request.Headers["Cf-Connecting-Ip"].ToString() : this.HttpContext.Connection.RemoteIpAddress.ToString();
            card.UserAgent = this.Request.Headers["User-Agent"].ToString();

            card.Kiosk = string.IsNullOrEmpty(kiosk) ? kiosk : null;

            var ms = card.Date.ToString("ffffff");
            for (var i = ms.Length; i < 6; i++)
                ms = "0" + ms;

            card.UniqueId = int.Parse(new Random().Next(100, 999) + ms);

            this.Queue.Initialize();
            if (this.Queue.IsValid)
                this.Queue.SendMessage(card);
            else
            {
                errors.Add(new ApiResponseError(ApiResponse.UnknownError));

                return new ApiResponse<int>(errors);
            }

            this.UserService.Remove("card-code");
            this.UserService.Remove("card-kiosk");

            return new ApiResponse<int>(card.UniqueId.Value);
        }


        private (bool, List<ApiResponseError>) ValidateCard(NGHCard card, Employee employee)
        {
            var errors = new List<ApiResponseError>();

            if (employee == null)
                errors.Add(new ApiResponseError("Employee not found", "employee"));

            if (string.IsNullOrEmpty(card.Site))
                errors.Add(new ApiResponseError(ApiResponse.FieldRequiredError, "site"));
            else if (this.db.Sites.FirstOrDefault(s => s.Name == card.Site) == null)
                errors.Add(new ApiResponseError("Site not found", "site"));

            if (employee != null && string.IsNullOrEmpty(employee.FirstName) && string.IsNullOrEmpty(card.FirstName))
                errors.Add(new ApiResponseError(ApiResponse.FieldRequiredError, "firstName"));

            if (employee != null && string.IsNullOrEmpty(employee.LastName) && string.IsNullOrEmpty(card.LastName))
                errors.Add(new ApiResponseError(ApiResponse.FieldRequiredError, "lastName"));

            if (string.IsNullOrEmpty(card.ReportType))
                errors.Add(new ApiResponseError(ApiResponse.FieldRequiredError, "reportType"));

            if (string.IsNullOrEmpty(card.LifeSavingActions))
                errors.Add(new ApiResponseError(ApiResponse.FieldRequiredError, "LSA"));

            if (card.ReportType == "Hazard ID")
                card.LifeSavingActions = "Not Applicable";

            if (card.HazardIdentification == null || card.HazardIdentification.Count == 0)
                errors.Add(new ApiResponseError(ApiResponse.FieldRequiredError, "HID"));

            if (string.IsNullOrEmpty(card.Description))
                errors.Add(new ApiResponseError(ApiResponse.FieldRequiredError, "description"));

            if (string.IsNullOrEmpty(card.ActionsTaken))
                errors.Add(new ApiResponseError(ApiResponse.FieldRequiredError, "actionsTaken"));

            if (card.SafeChoice == null || card.SafeChoice.Count == 0)
            {
                if (card.ReportType == "Safe Behavior")
                    errors.Add(new ApiResponseError(ApiResponse.FieldRequiredError, "safeChoice"));
                else
                    card.SafeChoice = new List<string>() { "Not Applicable" };
            }
            else if (card.SafeChoice.Count > 1 && card.SafeChoice.Exists(s => s == "Not Applicable"))
                errors.Add(new ApiResponseError("Incorrect value", "safeChoice"));

            if (card.ReportType == "Hazard ID")
                card.SafeChoice = new List<string>() { "Not Applicable" };

            if (card.ReportType == "Safe Behavior" || (card.HazardIdentification != null && card.HazardIdentification.Contains("Off the Site")))
            {
                card.FurtherActionsRequired = false;
                card.SpecificLocation = null;
                card.SuggestedFurtherActions = null;
            }
            else
            {
                if (card.FurtherActionsRequired)
                {
                    if (string.IsNullOrEmpty(card.SpecificLocation))
                        errors.Add(new ApiResponseError(ApiResponse.FieldRequiredError, "location"));

                    if (string.IsNullOrEmpty(card.SuggestedFurtherActions))
                        errors.Add(new ApiResponseError(ApiResponse.FieldRequiredError, "suggestedFurtherActions"));
                }
                else
                {
                    card.SpecificLocation = null;
                    card.SuggestedFurtherActions = null;
                }
            }

            return (errors.Count == 0, errors);
        }

        private (bool, List<ApiResponseError>) ValidateSession()
        {
            var errors = new List<ApiResponseError>();

            if (!this.UserService.Contains("card-code") || !this.UserService.Contains("card-kiosk"))
                errors.Add(new ApiResponseError("User is not authenticated"));

            return (errors.Count == 0, errors);
        }
    }
}

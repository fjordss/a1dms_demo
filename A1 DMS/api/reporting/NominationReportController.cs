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
    [Route("/api/reporting/[controller]")]
    [ApiController]
    [Authorize(Policy = "Nomination")]
    public class NominationController : ControllerBase
    {
        private readonly UserService UserService;
        private readonly Context db;
        private readonly NominationsViewHelper Helper;

        public NominationController(UserService userService, Context context, CallViewHelper callViewHelper)
        {
            this.UserService = userService;
            this.db = context;
            this.Helper = (NominationsViewHelper)callViewHelper(ViewHelpers.NominationReport);
        }

        [HttpGet]
        public ApiResponse<NominationReportResponse> Get([FromQuery] string site, [FromQuery] string category)
        {
            (var from, var to) = this.Helper.GetPeriod(site);
            if (!from.HasValue || !to.HasValue)
                return new ApiResponse<NominationReportResponse>(new List<ApiResponseError>() { new ApiResponseError("No report found for selected site") });

            this.Helper.ParseProperties(site, category, from.Value, to.Value);

            return new ApiResponse<NominationReportResponse>((NominationReportResponse)this.Helper.GetData());
        }

        [HttpGet("filterings")]
        public ApiResponse<IEnumerable<FilteringItem>> GetFilterings([FromQuery] string site, [FromQuery] string category)
        {
            (var from, var to) = this.Helper.GetPeriod(site);
            if (!from.HasValue || !to.HasValue)
                return new ApiResponse<IEnumerable<FilteringItem>>(new List<ApiResponseError>() { new ApiResponseError("No report found for selected site") });

            this.Helper.ParseProperties(site, category, from.Value, to.Value);

            return new ApiResponse<IEnumerable<FilteringItem>>(this.Helper.GetFilterings());
        }

        [Authorize(Policy = "NominationSSHEUser")]
        [HttpPut("{reportId:int}/offsetvote/{cardId:int}")]
        public ApiResponse SetWinner(int reportId, int cardId, [FromForm] int offset)
        {
            var report = this.db.NominationReports.FirstOrDefault(r => r.Id == reportId);
            if (report == null)
                return new ApiResponse(new List<ApiResponseError>() { new ApiResponseError("Nomination report not found") });

            if (report.Stage != 4)
                return new ApiResponse(new List<ApiResponseError>() { new ApiResponseError("Operation is not allowed at this stage of report") });

            var card = this.db.NGHCards.Include(c => c.Nominations).FirstOrDefault(c => c.Id == cardId);
            if (card == null)
                return new ApiResponse(new List<ApiResponseError>() { new ApiResponseError("Card not found") });

            card.NominationVoteOffset += offset;

            var currentVotes = card.Nominations.Where(n => n.Stage == 3).Count();
            if (currentVotes + card.NominationVoteOffset < 0)
                card.NominationVoteOffset = -currentVotes;

            try
            {
                this.db.Attach(card).State = EntityState.Modified;
                this.db.SaveChanges();
            }
            catch (Exception e)
            {
                return new ApiResponse(new List<ApiResponseError>() { new ApiResponseError(ApiResponse.UnknownError) });
            }

            return new ApiResponse();
        }

        [Authorize(Policy = "NominationSSHEUser")]
        [HttpPut("{reportId:int}/setwinner/{cardId:int}")]
        public ApiResponse SetWinner(int reportId, int cardId)
        {
            var report = this.db.NominationReports.FirstOrDefault(r => r.Id == reportId);
            if (report == null)
                return new ApiResponse(new List<ApiResponseError>() { new ApiResponseError("Nomination report not found") });

            if (report.Stage != 4)
                return new ApiResponse(new List<ApiResponseError>() { new ApiResponseError("Operation is not allowed at this stage of report") });

            var card = this.db.NGHCards.Where(a => a.Id == cardId).FirstOrDefault();
            if (card == null)
                return new ApiResponse(new List<ApiResponseError>() { new ApiResponseError("Card not found") });

            var existing = this.db.Nominations.FirstOrDefault(n => n.Stage == 4 && n.Category == card.NominationCategory);
            if (existing != null)
                this.db.Remove(existing);

            var nomination = new Nomination();
            nomination.Date = DateTime.Now;
            nomination.NGHCardId = cardId;
            nomination.AuthorId = this.UserService.GetUserId();
            nomination.Category = card.NominationCategory;
            nomination.Stage = 4;

            try
            {
                this.db.Add(nomination);
                this.db.SaveChanges();
            }
            catch (Exception e)
            {
                return new ApiResponse(new List<ApiResponseError>() { new ApiResponseError(ApiResponse.UnknownError) });
            }

            return new ApiResponse();
        }

        [Authorize(Policy = "NominationSSHEUser")]
        [HttpPut("{reportId:int}/unsetwinner/{cardId:int}")]
        public ApiResponse UnsetWinner(int reportId, int cardId)
        {
            var report = this.db.NominationReports.FirstOrDefault(r => r.Id == reportId);
            if (report == null)
                return new ApiResponse(new List<ApiResponseError>() { new ApiResponseError("Nomination report not found") });

            var card = this.db.NGHCards.Where(a => a.Id == cardId).FirstOrDefault();
            if (card == null)
                return new ApiResponse(new List<ApiResponseError>() { new ApiResponseError("Card not found") });

            if (report.Stage != 4)
                return new ApiResponse(new List<ApiResponseError>() { new ApiResponseError("Operation is not allowed at this stage of report") });

            var nomination = this.db.Nominations.FirstOrDefault(n => n.NGHCardId == cardId && n.Stage == 4);

            try
            {
                this.db.Remove(nomination);
                this.db.SaveChanges();
            }
            catch (Exception e)
            {
                return new ApiResponse(new List<ApiResponseError>() { new ApiResponseError(ApiResponse.UnknownError) });
            }

            return new ApiResponse();
        }

        [Authorize(Policy = "NominationVotingUser")]
        [HttpPut("{reportId:int}/setvote/{cardId:int}")]
        public ApiResponse SetVote(int reportId, int cardId)
        {
            var report = this.db.NominationReports.FirstOrDefault(r => r.Id == reportId);
            if (report == null)
                return new ApiResponse(new List<ApiResponseError>() { new ApiResponseError("Nomination report not found") });

            if (report.Stage != 3)
                return new ApiResponse(new List<ApiResponseError>() { new ApiResponseError("Operation is not allowed at this stage of report") });

            var card = this.db.NGHCards.Where(a => a.Id == cardId).FirstOrDefault();
            if (card == null)
                return new ApiResponse(new List<ApiResponseError>() { new ApiResponseError("Card not found") });

            var nomination = new Nomination();
            nomination.Date = DateTime.Now;
            nomination.NGHCardId = cardId;
            nomination.AuthorId = this.UserService.GetUserId();
            nomination.Category = null;
            nomination.Stage = 3;

            try
            {
                this.db.Add(nomination);
                this.db.SaveChanges();
            }
            catch (Exception e)
            {
                return new ApiResponse(new List<ApiResponseError>() { new ApiResponseError(ApiResponse.UnknownError) });
            }

            return new ApiResponse();
        }

        [Authorize(Policy = "NominationVotingUser")]
        [HttpPut("{reportId:int}/unsetvote/{cardId:int}")]
        public ApiResponse UnsetVote(int reportId, int cardId)
        {
            var report = this.db.NominationReports.FirstOrDefault(r => r.Id == reportId);
            if (report == null)
                return new ApiResponse(new List<ApiResponseError>() { new ApiResponseError("Nomination report not found") });

            if (report.Stage != 3)
                return new ApiResponse(new List<ApiResponseError>() { new ApiResponseError("Operation is not allowed at this stage of report") });

            var card = this.db.NGHCards.Where(a => a.Id == cardId).FirstOrDefault();
            if (card == null)
                return new ApiResponse(new List<ApiResponseError>() { new ApiResponseError("Card not found") });

            var authorId = this.UserService.GetUserId();

            var nomination = this.db.Nominations.FirstOrDefault(n => n.NGHCardId == cardId && n.Stage == 3 && n.AuthorId == authorId);

            try
            {
                this.db.Remove(nomination);
                this.db.SaveChanges();
            }
            catch (Exception e)
            {
                return new ApiResponse(new List<ApiResponseError>() { new ApiResponseError(ApiResponse.UnknownError) });
            }

            return new ApiResponse();
        }

        [Authorize(Policy = "NominationSSHEUser")]
        [HttpPut("{reportId:int}/setcategory/{cardId:int}")]
        public ApiResponse SetCategory(int reportId, int cardId, [FromForm] string category)
        {
            var report = this.db.NominationReports.FirstOrDefault(r => r.Id == reportId);
            if (report == null)
                return new ApiResponse(new List<ApiResponseError>() { new ApiResponseError("Nomination report not found") });

            if (report.Stage != 1 && report.Stage != 2)
                return new ApiResponse(new List<ApiResponseError>() { new ApiResponseError("Operation is not allowed at this stage of report") });

            var card = this.db.NGHCards.Where(a => a.Id == cardId).FirstOrDefault();
            if (card == null)
                return new ApiResponse(new List<ApiResponseError>() { new ApiResponseError("Card not found") });

            card.NominationCategory = category;

            try
            {
                this.db.Attach(card).State = EntityState.Modified;
                this.db.SaveChanges();
            }
            catch (Exception e)
            {
                return new ApiResponse(new List<ApiResponseError>() { new ApiResponseError(ApiResponse.UnknownError) });
            }

            return new ApiResponse();
        }

        [Authorize(Policy = "NominationSSHEUser")]
        [HttpPut("{reportId:int}/changestage")]
        public ApiResponse ChangeStage(int reportId, [FromForm] int stage)
        {
            var report = this.db.NominationReports.FirstOrDefault(r => r.Id == reportId);
            if (report == null)
                return new ApiResponse(new List<ApiResponseError>() { new ApiResponseError("Nomination report not found") });

            var currentStage = report.Stage;

            var update = false;
            if ((currentStage == 1 || currentStage == 2) && stage == 3)
            {
                var validated = this.Helper.ValidateCategories(report.Id);
                if (!validated)
                    return new ApiResponse(new List<ApiResponseError>() { new ApiResponseError("The report contains cards which have no nomination category selected") });
                else
                    update = true;
            }
            else if (stage < currentStage || stage == currentStage + 1)
                update = true;

            if (!update)
                return new ApiResponse(new List<ApiResponseError>() { new ApiResponseError($"Stage cannot be changed from {currentStage} to {stage}") });

            report.Stage = stage;

            try
            {
                this.db.Attach(report).State = EntityState.Modified;
                this.db.SaveChanges();
            }
            catch(Exception e)
            {
                return new ApiResponse(new List<ApiResponseError>() { new ApiResponseError(ApiResponse.UnknownError) });
            }

            return new ApiResponse();
        }

        [Authorize(Policy = "NominationSSHEUser")]
        [HttpDelete("{reportId:int}/exclude")]
        public ApiResponse ExcludeFromReport(int reportId, [FromForm] List<int> cardIds)
        {
            var report = this.db.NominationReports.Include(r => r.Site).FirstOrDefault(r => r.Id == reportId);
            if (report == null)
                return new ApiResponse(new List<ApiResponseError>() { new ApiResponseError("Nomination report not found") });

            if (report.Stage != 1 && report.Stage != 2)
                return new ApiResponse(new List<ApiResponseError>() { new ApiResponseError("Operation is not allowed at this stage of report") });

            if (report.ExcludeIds != null)
            {
                report.ExcludeIds.AddRange(cardIds);
                report.ExcludeIds = report.ExcludeIds.Distinct().ToList();
            }
            else
                report.ExcludeIds = cardIds;

            try
            {
                this.db.Attach(report).State = EntityState.Modified;
                this.db.SaveChanges();
            }
            catch (Exception e)
            {
                return new ApiResponse(new List<ApiResponseError>() { new ApiResponseError(ApiResponse.UnknownError) });
            }

            return new ApiResponse();
        }
    }
}

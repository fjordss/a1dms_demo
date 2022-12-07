using System;
using System.Text.Json.Serialization;
using System.Collections.Generic;
using System.Linq;
using System.ComponentModel.DataAnnotations;
using System.Threading.Tasks;

namespace A1DMS
{
    public class NGHCard
    {
        public int Id { get; set; }
        public DateTime Date { get; set; }
        public string Site { get; set; }
        public string Company { get; set; }
        public string Department { get; set; }

        [Display(Name = "First Name")]
        public string FirstName { get; set; }

        [Display(Name = "Last Name")]
        public string LastName { get; set; }
        public int EmployeeId { get; set; }

        [Display(Name = "Report Type")]
        public string ReportType { get; set; }

        [Display(Name = "Life Saving Actions")]
        public string LifeSavingActions { get; set; }

        [Display(Name = "Hazard Identification")]
        [JsonPropertyName("hazardID")]
        public List<string> HazardIdentification { get; set; }

        public string Description { get; set; }

        [Display(Name = "Description (RUS)")]
        public string DescriptionRus { get; set; }

        [JsonIgnore]
        public string DescriptionOriginal { get; set; }

        [JsonIgnore]
        public Language? DescriptionOriginalLang { get; set; }


        [Display(Name = "Actions Taken")]
        public string ActionsTaken { get; set; }

        [Display(Name = "Actions Taken (RUS)")]
        public string ActionsTakenRus { get; set; }

        [JsonIgnore]
        public string ActionsTakenOriginal { get; set; }

        [JsonIgnore]
        public Language? ActionsTakenOriginalLang { get; set; }


        [Display(Name = "Safe Choice")]
        public List<string> SafeChoice { get; set; }

        [Display(Name = "Further Actions Required")]
        public bool FurtherActionsRequired { get; set; }


        [JsonPropertyName("location")]
        [Display(Name = "Specific Location")]
        public string SpecificLocation { get; set; }

        [JsonPropertyName("locationRus")]
        [Display(Name = "Specific Location (RUS)")]
        public string SpecificLocationRus { get; set; }

        [JsonIgnore]
        public string SpecificLocationOriginal { get; set; }

        [JsonIgnore]
        public Language? SpecificLocationOriginalLang { get; set; }


        [JsonPropertyName("furtherActions")]
        [Display(Name = "Suggested Further Actions")]
        public string SuggestedFurtherActions { get; set; }

        [JsonPropertyName("furtherActionsRus")]
        [Display(Name = "Suggested Further Actions (RUS)")]
        public string SuggestedFurtherActionsRus { get; set; }

        [JsonIgnore]
        public string SuggestedFurtherActionsOriginal { get; set; }

        [JsonIgnore]
        public Language? SuggestedFurtherActionsOriginalLang { get; set; }

        public string NominationCategory { get; set; }

        [JsonIgnore]
        public int NominationVoteOffset { get; set; } = 0;

        public int? ActionItemId { get; set; }

        [JsonIgnore]
        public string IPAddress { get; set; }

        [JsonIgnore]
        public string UserAgent { get; set; }

        public string Kiosk { get; set; }
        public int? UniqueId { get; set; }

        [JsonIgnore]
        public int? BatchId { get; set; }

        [JsonIgnore]
        public virtual Employee Employee { get; set; }

        [JsonIgnore]
        [Display(Name = "Action Item")]
        public virtual ActionItem ActionItem { get; set; }

        [JsonIgnore]
        public virtual ICollection<CardAttachment> CardAttachments { get; set; }

        [JsonIgnore]
        public virtual ICollection<Nomination> Nominations { get; set; }
    }
}

using System;
using System.Text.Json.Serialization;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Security.Cryptography.Xml;
using System.Threading.Tasks;

namespace A1DMS
{
    public enum ActionItemStatus
    {
        Open = 0,
        InProgress = 1,
        Closed = 2
    }

    public class ActionItem
    {
        public int Id { get; set; }

        [Required]
        public ActionItemStatus Status { get; set; }

        [Display(Name = "Further Actions")]
        public string FurtherActions { get; set; }

        [JsonIgnore]
        public int? ResponsibleId { get; set; }

        public string OtherResponsible { get; set; }

        [Display(Name = "Target Date")]
        [DataType(DataType.Date)]
        public DateTime? TargetDate { get; set; }

        [Display(Name = "Closure Date")]
        [DataType(DataType.Date)]
        public DateTime? ClosureDate { get; set; }

        [JsonIgnore]
        [Display(Name = "Closed by")]
        public int? ClosedById { get; set; }

        public string Comments { get; set; }

        [JsonIgnore]
        public int? NGHCardId { get; set; }
       
        [JsonPropertyName("card")]
        [Display(Name = "NGH Card")]
        public virtual NGHCard NGHCard { get; set; }

        public virtual Department Responsible { get; set; }

        public virtual Administrator ClosedBy { get; set; }
    }
}

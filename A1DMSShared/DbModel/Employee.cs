using System;
using System.Text.Json.Serialization;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace A1DMS
{
    public class Employee
    {
        public int Id { get; set; }

        [Display(Name = "NGH #")]
        public int Code { get; set; }

        [Display(Name = "Created")]
        public DateTime Date { get; set; }

        [Display(Name = "First Name")]
        public string FirstName { get; set; }

        [Display(Name = "Last Name")]
        public string LastName { get; set; }
        public string Name { get; set; }

        [Required]
        [Range(1, int.MaxValue)]
        public int SiteId { get; set; }

        [Required]
        [Range(1, int.MaxValue)]
        public int CompanyId { get; set; }

        [Required]
        [Range(1, int.MaxValue)]
        public int DepartmentId { get; set; }

        [Display(Name = "PTS #")]
        public string PTSNumber { get; set; }

        [Display(Name = "Additional Information")]
        public string AdditionalInfo { get; set; }

        public bool Inactive { get; set; }

        [JsonIgnore]
        public virtual Site Site { get; set; }

        [JsonIgnore]
        public virtual Company Company { get; set; }

        [JsonIgnore]
        public virtual Department Department { get; set; }

        [JsonIgnore]
        public virtual ICollection<NGHCard> NGHCards { get; set; }

        public string GetDisplayName()
        {
            var firstNameEmpty = string.IsNullOrEmpty(this.FirstName);
            var lastNameEmpty = string.IsNullOrEmpty(this.LastName);
            if (!firstNameEmpty || !lastNameEmpty)
                return (!lastNameEmpty ? this.LastName : "") + (!lastNameEmpty && !firstNameEmpty ? ", " : "") + (!firstNameEmpty ? this.FirstName : "");
            else
                return string.Empty;
        }
    }
}

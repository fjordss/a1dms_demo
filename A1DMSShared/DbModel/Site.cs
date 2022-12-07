using System;
using System.Text.Json.Serialization;
using System.Runtime.Serialization;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace A1DMS
{
    public class Site
    {
        public int Id { get; set; }

        [Required]
        public string Name { get; set; }

        public bool Inactive { get; set; }

        [JsonIgnore]
        public int? NominationReportFirstDay { get; set; }

        [JsonIgnore]
        public virtual ICollection<Employee> Employees { get; set; }

        [JsonIgnore]
        public virtual ICollection<NominationReport> NominationReports { get; set; }
    }
}

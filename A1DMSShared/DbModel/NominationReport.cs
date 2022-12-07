using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace A1DMS
{
    public class NominationReport
    {
        public int Id { get; set; }
        public int SiteId { get; set; }
        public DateTime From { get; set; }
        public DateTime To { get; set; }
        public int Stage { get; set; }
        public List<int> ExcludeIds { get; set; }

        public virtual Site Site { get; set; }
    }
}

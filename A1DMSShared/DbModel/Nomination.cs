using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace A1DMS
{
    public class Nomination
    {
        public int Id { get; set; }

        public DateTime Date { get; set; }

        public int AuthorId { get; set; }

        public int NGHCardId { get; set; }

        public string Category { get; set; }

        public int Stage { get; set; }

        public virtual Administrator Author { get; set; }
        public virtual NGHCard NGHCard { get; set; }
    }
}

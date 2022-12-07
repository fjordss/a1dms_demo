using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace A1DMS
{
    public class CardAttachment
    {
        public int Id { get; set; }
        public int? NGHCardId { get; set; }
        public string FileName { get; set; }
        public string MediaType { get; set; }
        public byte[] Binary { get; set; }
        public string TempId { get; set; }

        public virtual NGHCard NGHCard { get; set; }
    }
}

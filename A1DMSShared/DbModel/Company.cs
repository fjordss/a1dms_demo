using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace A1DMS
{
    public class Company
    {
        public int Id { get; set; }

        [Required]
        public string Name { get; set; }

        public bool Inactive { get; set; }

        public virtual ICollection<Employee> Employees { get; set; }
    }
}

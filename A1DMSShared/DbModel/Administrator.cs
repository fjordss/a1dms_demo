using System;
using System.Collections.Generic;
using System.Linq;
using System.Text.Json.Serialization;
using System.Threading.Tasks;
using System.Security.Cryptography;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Security.Principal;

namespace A1DMS
{
    public enum UserRole
    {
        Administrator = 1,

        [Display(Name = "Site Administrator")]
        SiteAdministrator = 2,

        Supervisor = 4,

        [Display(Name = "SSHE User")]
        SSHEUser = 8,

        [Display(Name = "Voting User")]
        VotingUser = 16
    }

    public class Administrator
    {
        public int Id { get; set; }

        public string FirstName { get; set; }
        public string LastName { get; set; }

        [Required]
        public string Name { get; set; }

        [Required]
        public UserRole Role { get; set; }

        [Required]
        public int? CompanyId { get; set; }

        [Required]
        public string EMail { get; set; }

        [Display(Name = "Sites")]
        public List<int> SiteIds { get; set; }

        [Display(Name = "Logon Name")]
        [Required]
        public string LogonName { get; set; }

        [JsonIgnore]
        public string Password { get; set; }

        [Display(Name = "Created by")]
        public int CreatedById { get; set; }

        [JsonIgnore]
        public bool ChangePasswordAtNextLogon { get; set; }

        [JsonIgnore]
        public bool Hidden { get; set; }

        [JsonIgnore]
        public string EntryCode { get; set; }

        [JsonIgnore]
        public DateTime? EntryCodeDate { get; set; }

        [JsonIgnore]
        public string RestoreCode { get; set; }

        [JsonIgnore]
        public virtual Company Company { get; set; }

        [JsonIgnore]
        public virtual Administrator CreatedBy { get; set; }

        [JsonIgnore]
        public virtual ICollection<Nomination> Nominations { get; set; }

        [JsonIgnore]
        public virtual ICollection<Administrator> CreatedUsers { get; set; }

        public string GetDisplayName()
        {
            var firstNameEmpty = string.IsNullOrEmpty(this.FirstName);
            var lastNameEmpty = string.IsNullOrEmpty(this.LastName);
            if (firstNameEmpty && lastNameEmpty)
                return this.LogonName;
            else
                return (!lastNameEmpty ? this.LastName : "") + (!lastNameEmpty && !firstNameEmpty ? ", " : "") + (!firstNameEmpty ? this.FirstName : "");
        }
    }
}

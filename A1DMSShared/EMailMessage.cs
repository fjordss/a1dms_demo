using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace A1DMS
{
    public class EMailMessage
    {
        public List<string> Recepients { get; set; } = new List<string>();
        public string Subject { get; set; }
        public string Body { get; set; }

        public bool Validate()
        {
            var isError = false;
            if (this.Recepients == null || this.Recepients.Count == 0 || this.Recepients.Any(r => string.IsNullOrEmpty(r)))
                isError = true;
            else if (string.IsNullOrEmpty(this.Subject))
                isError = true;
            else if (string.IsNullOrEmpty(this.Body))
                isError = true;

            return !isError;
        }
    }
}

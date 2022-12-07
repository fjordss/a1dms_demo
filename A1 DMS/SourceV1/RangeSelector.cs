using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;

namespace A1DMS
{
    public class DateRangeSelector
    {
        public DateRange Today { get; set; }
        public DateRange Yesterday { get; set; }
        public DateRange CurrentWeek { get; set; }
        public DateRange PreviousWeek { get; set; }
        public DateRange CurrentMonth { get; set; }
        public DateRange PreviousMonth { get; set; }

        public DateRangeSelector()
        {
            var now = DateTime.Today;
            var monthStart = now.AddDays(-now.Day + 1);

            //var Monday = Now.AddDays(-((int)Now.DayOfWeek == 0 ? 7 : (int)Now.DayOfWeek) + 1);
            var sunday = now.AddDays(-((int)now.DayOfWeek == 0 ? 0 : (int)now.DayOfWeek));

            this.CurrentMonth = new DateRange(monthStart);
            this.PreviousMonth = new DateRange(monthStart.AddMonths(-1), monthStart.AddDays(-1));

            this.CurrentWeek = new DateRange(sunday);
            this.PreviousWeek = new DateRange(sunday.AddDays(-7), sunday.AddDays(-1));

            this.Today = new DateRange(now, now);
            this.Yesterday = new DateRange(now.AddDays(-1), now.AddDays(-1));
        }
    }

    public class DateRange
    {
        public DateTime? From { get; set; }
        public DateTime? To { get; set; }

        public DateRange(DateTime? from, DateTime? to = null)
        {
            this.From = from;
            this.To = to;
        }
    }
}

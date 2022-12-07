using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace A1DMS.V2
{
    public enum ViewHelpers
    {
        Employees,
        Sites,
        Companies,
        Departments,
        Users,
        Cards,
        CordReport,
        CloseoutReport,
        ObserverReport,
        OIMSReport,
        ParticipationReport,
        NominatedCardsReport,
        NominationReport
    }

    public delegate object CallViewHelper(ViewHelpers Type);

    public interface IViewHelper<T>
    {
        TableViewResponse<T> GetData();
        IEnumerable<FilteringItem> GetFilterings();
        IEnumerable<TotalItem> GetTotals();
        IEnumerable<T> Export();
    }
}

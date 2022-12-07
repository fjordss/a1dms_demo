using System;
using System.Globalization;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;

namespace A1DMS.V1
{
    public class GraphicsViewHelper
    {
        private readonly Context db;
        private readonly HttpContext Context;
        private readonly UserService UserService;

        private List<Site> Sites;

        public GraphicsViewHelper(IHttpContextAccessor accessor, Context context, UserService userService)
        {
            this.Context = accessor.HttpContext;
            this.db = context;
            this.UserService = userService;
        }

        public (List<Site>, List<Company>, List<Department>) GetFields()
        {
            var siteIds = this.UserService.GetSiteIds();
            var query = this.db.Sites.OrderBy(a => a.Name).AsQueryable();
            if (siteIds.Count > 0)
                query = query.Where(s => siteIds.Contains(s.Id));

            this.Sites = query.ToList();
            var companies = this.db.Companies.OrderBy(a => a.Name).ToList();
            var departments = this.db.Departments.OrderBy(a => a.Name).ToList();

            return (this.Sites, companies, departments);
        }

        public Dictionary<string, object> GetData(List<string> sites, List<string> companies, List<string> departments, DateTime? from, DateTime? to)
        {
            var properties = this.ParseProperties(sites, companies, departments, from, to);

            var data = new Dictionary<string, object>();
            data["base"] = this.GetBaseAsync(this.GetBaseQuery(properties));
            data["byCompany"] = this.GetByCompany(this.GetBaseQuery(properties));
            data["byDepartment"] = this.GetByDepartment(this.GetBaseQuery(properties));
            data["byENLDepartment"] = this.GetByDepartment(this.GetBaseQuery(properties).Where(c => c.Company == "ENL"));

            return data;
        }

        private PropertyItemCollection ParseProperties(List<string> sites, List<string> companies, List<string> departments, DateTime? from, DateTime? to)
        {
            if (this.Sites == null)
                this.Sites = this.db.Sites.ToList();

            var siteNames = this.UserService.GetSiteIds().Select(id => this.Sites.Find(s => s.Id == id).Name).ToList();

            var properties = new PropertyItemCollection();

            if (sites != null && sites.Count > 0)
                properties.SetValue("Sites", sites);
            else if (siteNames.Count > 0)
                properties.SetValue("Sites", siteNames);

            if (companies != null && companies.Count > 0)
                properties.SetValue("Companies", companies);

            if (departments != null && departments.Count > 0)
                properties.SetValue("Departments", departments);

            if (from.HasValue)
                properties.SetValue("From", from.Value);

            if (to.HasValue)
                properties.SetValue("To", to.Value.AddDays(1).AddSeconds(-1));

            return properties;
        }

        private IQueryable<NGHCard> GetBaseQuery(PropertyItemCollection properties)
        {
            var query = this.db.NGHCards.AsQueryable();

            if (properties.ContainsKey("Sites"))
                query = query.Where(a => properties.GetValue<List<string>>("Sites").Contains(a.Site));

            if (properties.ContainsKey("Companies"))
                query = query.Where(a => properties.GetValue<List<string>>("Companies").Contains(a.Company));

            if (properties.ContainsKey("Departments"))
                query = query.Where(a => properties.GetValue<List<string>>("Departments").Contains(a.Department));

            if (properties.ContainsKey("From"))
                query = query.Where(a => a.Date >= properties.GetValue<DateTime>("From"));

            if (properties.ContainsKey("To"))
                query = query.Where(a => a.Date <= properties.GetValue<DateTime>("To"));

            return query;
        }

        private object GetByCompany(IQueryable<NGHCard> baseQuery)
        {
            var query = baseQuery
                .GroupBy(c => c.Company)
                .Select(g => new
                {
                    Company = g.Key,
                    Count = g.Count()
                })
                .OrderByDescending(i => i.Count);

            return query.ToList();
        }

        private object GetByDepartment(IQueryable<NGHCard> baseQuery)
        {
            var query = baseQuery
                .GroupBy(c => c.Department)
                .Select(g => new
                {
                    Department = g.Key,
                    Count = g.Count()
                })
                .OrderByDescending(i => i.Count);

            return query.ToList();
        }

        private object GetBaseAsync(IQueryable<NGHCard> baseQuery)
        {
            var query = baseQuery
                .GroupBy(c => new { })
                .Select(g => new
                {
                    SafeBehavior = g.Where(c => c.ReportType == "Safe Behavior").Count(),
                    UnsafeBehavior = g.Where(c => c.ReportType == "Unsafe Behavior").Count(),
                    HazardID = g.Where(c => c.ReportType == "Hazard ID").Count(),
                    TotalBehavior = g.Where(c => c.ReportType == "Safe Behavior" || c.ReportType == "Unsafe Behavior").Count(),
                    TotalUnsafe = g.Where(c => c.ReportType == "Unsafe Behavior" || c.ReportType == "Hazard ID").Count(),
                    Total = g.Count(),
                    StayFocused = g.Where(c => c.SafeChoice.Contains("Stay focused (Present motivation)")).Count(),
                    Biases = g.Where(c => c.SafeChoice.Contains("Biases")).Count(),
                    SafetyTraps = g.Where(c => c.SafeChoice.Contains("Safety Traps")).Count(),
                    HeadBeforeHands = g.Where(c => c.SafeChoice.Contains("Head before Hands (Fast / Slow thinking)")).Count(),
                    LMRA = g.Where(c => c.SafeChoice.Contains("LMRA / 6 Steps in safe decision making")).Count(),
                    NotApplicable = g.Where(c => c.SafeChoice.Contains("Not Applicable")).Count(),
                    SafeLSA = g.Where(c => c.ReportType == "Safe Behavior" && c.LifeSavingActions != "Not Applicable").Count(),
                    UnsafeLSA = g.Where(c => c.ReportType == "Unsafe Behavior" && c.LifeSavingActions != "Not Applicable").Count(),
                    NonLSA = g.Where(c => c.LifeSavingActions == "Not Applicable").Count(),

                    SafeLiftingAndHoisting = g.Where(c => c.ReportType == "Safe Behavior" && c.LifeSavingActions == "Lifting and Hoisting").Count(),
                    SafeMobileEquipment = g.Where(c => c.ReportType == "Safe Behavior" && c.LifeSavingActions == "Mobile Equipment").Count(),
                    SafeRotatingEquipment = g.Where(c => c.ReportType == "Safe Behavior" && c.LifeSavingActions == "Rotating Equipment").Count(),
                    SafeBreakingContainment = g.Where(c => c.ReportType == "Safe Behavior" && c.LifeSavingActions == "Breaking Containment").Count(),
                    SafeWorkingAtHeight = g.Where(c => c.ReportType == "Safe Behavior" && c.LifeSavingActions == "Working at Height").Count(),
                    SafeHotWork = g.Where(c => c.ReportType == "Safe Behavior" && c.LifeSavingActions == "Hot Work").Count(),
                    SafeConfinedSpaceEntry = g.Where(c => c.ReportType == "Safe Behavior" && c.LifeSavingActions == "Confined Space Entry").Count(),
                    SafeEnergyIsolation = g.Where(c => c.ReportType == "Safe Behavior" && c.LifeSavingActions == "Energy Isolation").Count(),
                    SafeWorkAuthorization = g.Where(c => c.ReportType == "Safe Behavior" && c.LifeSavingActions == "Work Authorization").Count(),
                    SafeCriticalDevices = g.Where(c => c.ReportType == "Safe Behavior" && c.LifeSavingActions == "Critical Devices").Count(),
                    SafeCriticalProcedures = g.Where(c => c.ReportType == "Safe Behavior" && c.LifeSavingActions == "Critical Procedures").Count(),

                    UnsafeLiftingAndHoisting = g.Where(c => (c.ReportType == "Unsafe Behavior" || c.ReportType == "Hazard ID") && c.LifeSavingActions == "Lifting and Hoisting").Count(),
                    UnsafeMobileEquipment = g.Where(c => (c.ReportType == "Unsafe Behavior" || c.ReportType == "Hazard ID") && c.LifeSavingActions == "Mobile Equipment").Count(),
                    UnsafeRotatingEquipment = g.Where(c => (c.ReportType == "Unsafe Behavior" || c.ReportType == "Hazard ID") && c.LifeSavingActions == "Rotating Equipment").Count(),
                    UnsafeBreakingContainment = g.Where(c => (c.ReportType == "Unsafe Behavior" || c.ReportType == "Hazard ID") && c.LifeSavingActions == "Breaking Containment").Count(),
                    UnsafeWorkingAtHeight = g.Where(c => (c.ReportType == "Unsafe Behavior" || c.ReportType == "Hazard ID") && c.LifeSavingActions == "Working at Height").Count(),
                    UnsafeHotWork = g.Where(c => (c.ReportType == "Unsafe Behavior" || c.ReportType == "Hazard ID") && c.LifeSavingActions == "Hot Work").Count(),
                    UnsafeConfinedSpaceEntry = g.Where(c => (c.ReportType == "Unsafe Behavior" || c.ReportType == "Hazard ID") && c.LifeSavingActions == "Confined Space Entry").Count(),
                    UnsafeEnergyIsolation = g.Where(c => (c.ReportType == "Unsafe Behavior" || c.ReportType == "Hazard ID") && c.LifeSavingActions == "Energy Isolation").Count(),
                    UnsafeWorkAuthorization = g.Where(c => (c.ReportType == "Unsafe Behavior" || c.ReportType == "Hazard ID") && c.LifeSavingActions == "Work Authorization").Count(),
                    UnsafeCriticalDevices = g.Where(c => (c.ReportType == "Unsafe Behavior" || c.ReportType == "Hazard ID") && c.LifeSavingActions == "Critical Devices").Count(),
                    UnsafeCriticalProcedures = g.Where(c => (c.ReportType == "Unsafe Behavior" || c.ReportType == "Hazard ID") && c.LifeSavingActions == "Critical Procedures").Count(),

                    SafePPE = g.Where(c => c.ReportType == "Safe Behavior" && c.HazardIdentification.Contains("PPE")).Count(),
                    UnsafePPE = g.Where(c => c.ReportType == "Unsafe Behavior" && c.HazardIdentification.Contains("PPE")).Count(),
                    HIDPPE = g.Where(c => c.ReportType == "Hazard ID" && c.HazardIdentification.Contains("PPE")).Count(),

                    SafePinchPoints = g.Where(c => c.ReportType == "Safe Behavior" && c.HazardIdentification.Contains("Pinch Points")).Count(),
                    UnsafePinchPoints = g.Where(c => c.ReportType == "Unsafe Behavior" && c.HazardIdentification.Contains("Pinch Points")).Count(),
                    HIDPinchPoints = g.Where(c => c.ReportType == "Hazard ID" && c.HazardIdentification.Contains("Pinch Points")).Count(),

                    SafeContactWithObject = g.Where(c => c.ReportType == "Safe Behavior" && c.HazardIdentification.Contains("Contact With Object")).Count(),
                    UnsafeContactWithObject = g.Where(c => c.ReportType == "Unsafe Behavior" && c.HazardIdentification.Contains("Contact With Object")).Count(),
                    HIDContactWithObject = g.Where(c => c.ReportType == "Hazard ID" && c.HazardIdentification.Contains("Contact With Object")).Count(),

                    SafeHandsSafety = g.Where(c => c.ReportType == "Safe Behavior" && c.HazardIdentification.Contains("Hands Safety")).Count(),
                    UnsafeHandsSafety = g.Where(c => c.ReportType == "Unsafe Behavior" && c.HazardIdentification.Contains("Hands Safety")).Count(),
                    HIDHandsSafety = g.Where(c => c.ReportType == "Hazard ID" && c.HazardIdentification.Contains("Hands Safety")).Count(),

                    SafeHousekeeping = g.Where(c => c.ReportType == "Safe Behavior" && c.HazardIdentification.Contains("Housekeeping")).Count(),
                    UnsafeHousekeeping = g.Where(c => c.ReportType == "Unsafe Behavior" && c.HazardIdentification.Contains("Housekeeping")).Count(),
                    HIDHousekeeping = g.Where(c => c.ReportType == "Hazard ID" && c.HazardIdentification.Contains("Housekeeping")).Count(),

                    SafeOffTheSite = g.Where(c => c.ReportType == "Safe Behavior" && c.HazardIdentification.Contains("Off the Site")).Count(),
                    UnsafeOffTheSite = g.Where(c => c.ReportType == "Unsafe Behavior" && c.HazardIdentification.Contains("Off the Site")).Count(),
                    HIDOffTheSite = g.Where(c => c.ReportType == "Hazard ID" && c.HazardIdentification.Contains("Off the Site")).Count(),

                    SafeWeatherConditions = g.Where(c => c.ReportType == "Safe Behavior" && c.HazardIdentification.Contains("Weather Conditions")).Count(),
                    UnsafeWeatherConditions = g.Where(c => c.ReportType == "Unsafe Behavior" && c.HazardIdentification.Contains("Weather Conditions")).Count(),
                    HIDWeatherConditions = g.Where(c => c.ReportType == "Hazard ID" && c.HazardIdentification.Contains("Weather Conditions")).Count(),

                    SafeCOVID19 = g.Where(c => c.ReportType == "Safe Behavior" && c.HazardIdentification.Contains("COVID-19")).Count(),
                    UnsafeCOVID19 = g.Where(c => c.ReportType == "Unsafe Behavior" && c.HazardIdentification.Contains("COVID-19")).Count(),
                    HIDCOVID19 = g.Where(c => c.ReportType == "Hazard ID" && c.HazardIdentification.Contains("COVID-19")).Count(),

                    SafeWarningSigns = g.Where(c => c.ReportType == "Safe Behavior" && c.HazardIdentification.Contains("Warning Signs / Barricades")).Count(),
                    UnsafeWarningSigns = g.Where(c => c.ReportType == "Unsafe Behavior" && c.HazardIdentification.Contains("Warning Signs / Barricades")).Count(),
                    HIDWarningSigns = g.Where(c => c.ReportType == "Hazard ID" && c.HazardIdentification.Contains("Warning Signs / Barricades")).Count(),

                    SafeErgonomics = g.Where(c => c.ReportType == "Safe Behavior" && c.HazardIdentification.Contains("Ergonomics")).Count(),
                    UnsafeErgonomics = g.Where(c => c.ReportType == "Unsafe Behavior" && c.HazardIdentification.Contains("Ergonomics")).Count(),
                    HIDErgonomics = g.Where(c => c.ReportType == "Hazard ID" && c.HazardIdentification.Contains("Ergonomics")).Count(),

                    SafeToolsEquipment = g.Where(c => c.ReportType == "Safe Behavior" && c.HazardIdentification.Contains("Tools Equipment")).Count(),
                    UnsafeToolsEquipment = g.Where(c => c.ReportType == "Unsafe Behavior" && c.HazardIdentification.Contains("Tools Equipment")).Count(),
                    HIDToolsEquipment = g.Where(c => c.ReportType == "Hazard ID" && c.HazardIdentification.Contains("Tools Equipment")).Count(),

                    SafeWellControl = g.Where(c => c.ReportType == "Safe Behavior" && c.HazardIdentification.Contains("Well Control")).Count(),
                    UnsafeWellControl = g.Where(c => c.ReportType == "Unsafe Behavior" && c.HazardIdentification.Contains("Well Control")).Count(),
                    HIDWellControl = g.Where(c => c.ReportType == "Hazard ID" && c.HazardIdentification.Contains("Well Control")).Count(),

                    SafePoliciesProcedures = g.Where(c => c.ReportType == "Safe Behavior" && c.HazardIdentification.Contains("Policies / Procedures")).Count(),
                    UnsafePoliciesProcedures = g.Where(c => c.ReportType == "Unsafe Behavior" && c.HazardIdentification.Contains("Policies / Procedures")).Count(),
                    HIDPoliciesProcedures = g.Where(c => c.ReportType == "Hazard ID" && c.HazardIdentification.Contains("Policies / Procedures")).Count(),

                    SafeSecurity = g.Where(c => c.ReportType == "Safe Behavior" && c.HazardIdentification.Contains("Security")).Count(),
                    UnsafeSecurity = g.Where(c => c.ReportType == "Unsafe Behavior" && c.HazardIdentification.Contains("Security")).Count(),
                    HIDSecurity = g.Where(c => c.ReportType == "Hazard ID" && c.HazardIdentification.Contains("Security")).Count(),

                    SafeWorkEnvironmental = g.Where(c => c.ReportType == "Safe Behavior" && c.HazardIdentification.Contains("Work Environmental / Design")).Count(),
                    UnsafeWorkEnvironmental = g.Where(c => c.ReportType == "Unsafe Behavior" && c.HazardIdentification.Contains("Work Environmental / Design")).Count(),
                    HIDWorkEnvironmental = g.Where(c => c.ReportType == "Hazard ID" && c.HazardIdentification.Contains("Work Environmental / Design")).Count(),

                    SafeManualLifting = g.Where(c => c.ReportType == "Safe Behavior" && c.HazardIdentification.Contains("Manual Lifting / Handling")).Count(),
                    UnsafeManualLifting = g.Where(c => c.ReportType == "Unsafe Behavior" && c.HazardIdentification.Contains("Manual Lifting / Handling")).Count(),
                    HIDManualLifting = g.Where(c => c.ReportType == "Hazard ID" && c.HazardIdentification.Contains("Manual Lifting / Handling")).Count(),

                    SafeProcessSafety = g.Where(c => c.ReportType == "Safe Behavior" && c.HazardIdentification.Contains("Process Safety")).Count(),
                    UnsafeProcessSafety = g.Where(c => c.ReportType == "Unsafe Behavior" && c.HazardIdentification.Contains("Process Safety")).Count(),
                    HIDProcessSafety = g.Where(c => c.ReportType == "Hazard ID" && c.HazardIdentification.Contains("Process Safety")).Count(),

                    SafeEnvironmental = g.Where(c => c.ReportType == "Safe Behavior" && c.HazardIdentification.Contains("Environmental")).Count(),
                    UnsafeEnvironmental = g.Where(c => c.ReportType == "Unsafe Behavior" && c.HazardIdentification.Contains("Environmental")).Count(),
                    HIDEnvironmental = g.Where(c => c.ReportType == "Hazard ID" && c.HazardIdentification.Contains("Environmental")).Count(),

                    SafeChemicals = g.Where(c => c.ReportType == "Safe Behavior" && c.HazardIdentification.Contains("Chemicals")).Count(),
                    UnsafeChemicals = g.Where(c => c.ReportType == "Unsafe Behavior" && c.HazardIdentification.Contains("Chemicals")).Count(),
                    HIDChemicals = g.Where(c => c.ReportType == "Hazard ID" && c.HazardIdentification.Contains("Chemicals")).Count(),

                    SafeLineOfFire = g.Where(c => c.ReportType == "Safe Behavior" && c.HazardIdentification.Contains("\"Line of Fire\"")).Count(),
                    UnsafeLineOfFire = g.Where(c => c.ReportType == "Unsafe Behavior" && c.HazardIdentification.Contains("\"Line of Fire\"")).Count(),
                    HIDLineOfFire = g.Where(c => c.ReportType == "Hazard ID" && c.HazardIdentification.Contains("\"Line of Fire\"")).Count(),

                    SafeOther = g.Where(c => c.ReportType == "Safe Behavior" && c.HazardIdentification.Contains("Other")).Count(),
                    UnsafeOther = g.Where(c => c.ReportType == "Unsafe Behavior" && c.HazardIdentification.Contains("Other")).Count(),
                    HIDOther = g.Where(c => c.ReportType == "Hazard ID" && c.HazardIdentification.Contains("Other")).Count(),

                    SafeTransportSafety = g.Where(c => c.ReportType == "Safe Behavior" && c.HazardIdentification.Contains("Transport Safety")).Count(),
                    UnsafeTransportSafety = g.Where(c => c.ReportType == "Unsafe Behavior" && c.HazardIdentification.Contains("Transport Safety")).Count(),
                    HIDTransportSafety = g.Where(c => c.ReportType == "Hazard ID" && c.HazardIdentification.Contains("Transport Safety")).Count(),

                    SafeStressRush = g.Where(c => c.ReportType == "Safe Behavior" && c.HazardIdentification.Contains("Stress / Rush / Fatique / Distraction")).Count(),
                    UnsafeStressRush = g.Where(c => c.ReportType == "Unsafe Behavior" && c.HazardIdentification.Contains("Stress / Rush / Fatique / Distraction")).Count(),
                    HIDStressRush = g.Where(c => c.ReportType == "Hazard ID" && c.HazardIdentification.Contains("Stress / Rush / Fatique / Distraction")).Count(),

                    SafeElectricalSafety = g.Where(c => c.ReportType == "Safe Behavior" && c.HazardIdentification.Contains("Electrical Safety")).Count(),
                    UnsafeElectricalSafety = g.Where(c => c.ReportType == "Unsafe Behavior" && c.HazardIdentification.Contains("Electrical Safety")).Count(),
                    HIDElectricalSafety = g.Where(c => c.ReportType == "Hazard ID" && c.HazardIdentification.Contains("Electrical Safety")).Count(),

                    SafeSlipsTripsFalls = g.Where(c => c.ReportType == "Safe Behavior" && c.HazardIdentification.Contains("Slips Trips Falls")).Count(),
                    UnsafeSlipsTripsFalls = g.Where(c => c.ReportType == "Unsafe Behavior" && c.HazardIdentification.Contains("Slips Trips Falls")).Count(),
                    HIDSlipsTripsFalls = g.Where(c => c.ReportType == "Hazard ID" && c.HazardIdentification.Contains("Slips Trips Falls")).Count(),

                    SafeFireSafety = g.Where(c => c.ReportType == "Safe Behavior" && c.HazardIdentification.Contains("Fire Safety")).Count(),
                    UnsafeFireSafety = g.Where(c => c.ReportType == "Unsafe Behavior" && c.HazardIdentification.Contains("Fire Safety")).Count(),
                    HIDFireSafety = g.Where(c => c.ReportType == "Hazard ID" && c.HazardIdentification.Contains("Fire Safety")).Count(),

                    SafeCommunication = g.Where(c => c.ReportType == "Safe Behavior" && c.HazardIdentification.Contains("Communication")).Count(),
                    UnsafeCommunication = g.Where(c => c.ReportType == "Unsafe Behavior" && c.HazardIdentification.Contains("Communication")).Count(),
                    HIDCommunication = g.Where(c => c.ReportType == "Hazard ID" && c.HazardIdentification.Contains("Communication")).Count(),

                    SafeHygiene = g.Where(c => c.ReportType == "Safe Behavior" && c.HazardIdentification.Contains("Hygiene")).Count(),
                    UnsafeHygiene = g.Where(c => c.ReportType == "Unsafe Behavior" && c.HazardIdentification.Contains("Hygiene")).Count(),
                    HIDHygiene = g.Where(c => c.ReportType == "Hazard ID" && c.HazardIdentification.Contains("Hygiene")).Count(),

                    SafeDroppedObjects = g.Where(c => c.ReportType == "Safe Behavior" && c.HazardIdentification.Contains("Dropped Objects")).Count(),
                    UnsafeDroppedObjects = g.Where(c => c.ReportType == "Unsafe Behavior" && c.HazardIdentification.Contains("Dropped Objects")).Count(),
                    HIDDroppedObjects = g.Where(c => c.ReportType == "Hazard ID" && c.HazardIdentification.Contains("Dropped Objects")).Count(),
                });

            return query.FirstOrDefault();
        }
    }
}

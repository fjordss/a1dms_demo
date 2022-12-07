using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Security.Claims;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.TestHost;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.Extensions.Configuration;
using Moq;
using A1DMS;
using A1DMS.V1;

namespace T
{
    class ServiceHelper
    {
        private const string TestDBConnectionString = "Host=localhost;Database=a1;Username=postgres;Password=123qwe$$";

        public ServiceHelper()
        {

        }

        public UserService GetUserService(PageContext context)
        {
            return new UserService(this.GetDbContext(), this.GetHttpContextAccessor(context));
        }

        public Context GetDbContext()
        {
            return new Context(TestDBConnectionString);
        }

        public CallQueue GetQueue()
        {
            return new CallQueue(type =>
            {
                var name = "";
                if (type == QueueType.Card)
                    name = "CardsQueueDev";
                else if (type == QueueType.Mail)
                    name = "MailQueueDev";

                return new Queue(type, "https://sqs.eu-central-1.amazonaws.com/415801490544/" + name, "AKIAWBT5THRYAUC4VEE6", "G/ZdMx83yi4oz0/0sLm5ia07C+cPNdKt0fHpbXya");
            });
        }

        public CallViewHelper GetViewHelper(PageContext context)
        {
            return new CallViewHelper(type =>
            {
                var httpContextAccessor = this.GetHttpContextAccessor(context);
                var dbContext = this.GetDbContext();
                var userService = this.GetUserService(context);

                var helper = (object)null;
                switch (type)
                {
                    case ViewHelpers.Employees: helper = new EmployeesViewHelper(httpContextAccessor, dbContext, userService); break;
                    case ViewHelpers.Sites: helper = new SitesViewHelper(httpContextAccessor, dbContext); break;
                    case ViewHelpers.Departments: helper = new DepartmentsViewHelper(httpContextAccessor, dbContext); break;
                    case ViewHelpers.Companies: helper = new CompaniesViewHelper(httpContextAccessor, dbContext); break;
                    case ViewHelpers.Users: helper = new UsersViewHelper(httpContextAccessor, dbContext); break;
                    case ViewHelpers.Cards: helper = new CardsViewHelper(httpContextAccessor, dbContext, userService); break;
                    case ViewHelpers.CordReport: helper = new CordViewHelper(httpContextAccessor, dbContext, userService); break;
                    case ViewHelpers.CloseoutReport: helper = new CloseoutViewHelper(httpContextAccessor, dbContext, userService); break;
                    case ViewHelpers.ObserverReport: helper = new ObserverViewHelper(httpContextAccessor, dbContext, userService); break;
                    case ViewHelpers.OIMSReport: helper = new OIMSViewHelper(httpContextAccessor, dbContext, userService); break;
                    case ViewHelpers.ParticipationReport: helper = new ParticipationViewHelper(httpContextAccessor, dbContext, userService); break;
                    case ViewHelpers.NominatedCardsReport: helper = new NominatedCardsViewHelper(httpContextAccessor, dbContext, userService); break;
                    case ViewHelpers.NominationReport: helper = new NominationViewHelper(httpContextAccessor, dbContext, userService); break;
                }

                return helper;
            });
        }

        public IConfiguration GetConfiguration()
        {
            var mock = new Mock<IConfiguration>();
            mock.Setup(m => m["Host"]).Returns("localhost:44374");

            return mock.Object;
        }

        public IHttpContextAccessor GetHttpContextAccessor(PageContext context)
        {
            var mock = new Mock<IHttpContextAccessor>();
            mock.Setup(m => m.HttpContext).Returns(context.HttpContext);

            return mock.Object;
        }
    }
}

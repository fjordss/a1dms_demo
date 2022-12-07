import React from 'react'
import ReactDOM from 'react-dom'
import { FetchDataProps, Header, HeaderMenuItem, IManagementApp, IUser, ManagementApp, ManagementAppRoute, Notification, SelectOption } from 'a1dms-front'
import Users, { UserRole, UserService } from './users/Users';
import Cards from './Cards';
import Sites from './sites/Sites';
import SitesEditForm from './sites/SitesEditForm';
import SitesNewForm from './sites/SitesNewForm';
import Departments from './departments/Departments';
import DepartmentsEditForm from './departments/DepartmentsEditForm';
import DepartmentsNewForm from './departments/DepartmentsNewForm';
import Companies from './companies/Companies';
import CompaniesEditForm from './companies/CompaniesEditForm';
import CompaniesNewForm from './companies/CompaniesNewForm';
import UsersEditForm from './users/UsersEditForm';
import UsersNewForm from './users/UsersNewForm';
import Employees from './employees/Employees';
import EmployeesNewForm from './employees/EmployeesNewForm';
import EmployeesEditForm from './employees/EmployeesEditForm';
import Graphics from './reporting/Graphics';
import Participation from './reporting/Participation';
import OIMS from './reporting/OIMS';
import Observer from './reporting/Observer';
import Cord from './reporting/Cord';
import Closeout from './reporting/Closeout';
import Nomination from './reporting/Nomination';
import NominatedCards from './reporting/NominatedCards';

class ManagementAppSettings implements IManagementApp {
    public accessDeniedUrl: string = "/v2/mgmt/accessdenied";

    public header: Header;
    public notification: Notification;

    public accessPolicies: Map<string, () => boolean>;
    public routes: Array<ManagementAppRoute>;
    public fetch: Array<FetchDataProps>;

    public currentUser: IUser;
    public currentUserPromise: Promise<IUser>;

    public sites: Array<SelectOption>;
    public sitesPromise: Promise<Array<SelectOption>>;

    public companies: Array<SelectOption>;
    public companiesPromise: Promise<Array<SelectOption>>;

    public departments: Array<SelectOption>;
    public departmentsPromise: Promise<Array<SelectOption>>;

    public nominationCategories: Array<string>;
    public nominationCategoriesPromise: Promise<Array<string>>;

    public fillProps() {
        this.accessPolicies = this.getAccessPolicies();
        this.fetch = this.getFetch();
        this.routes = this.getRoutes();
    }

    public getMenu(): Array<HeaderMenuItem> {
        let items: Array<HeaderMenuItem> = [];

        if (UserService.correspondsPolicy("administrator"))
            items.push({ label: "Lists", children: this.getLists() });
        else
            items.push({ label: "Employees (NGH)", link: "/v2/mgmt/employees" });

        items.push({ label: "NGH Cards", link: "/v2/mgmt/cards" });
        items.push({ label: "Reporting", children: this.getReports() });
        items.push({ label: "Manuals" });

        return items;
    }

    private getAccessPolicies(): Map<string, () => boolean> {
        let policies = new Map<string, () => boolean>();

        policies.set("administrator", () => UserService.hasRole(UserRole.administrator));
        policies.set("siteAdministrator", () => UserService.hasRole(UserRole.administrator | UserRole.siteAdministrator));
        policies.set("nomination", () => UserService.hasRole(UserRole.administrator | UserRole.SSHEUser | UserRole.votingUser));
        policies.set("nominationSSHEUser", () => UserService.hasRole(UserRole.administrator | UserRole.SSHEUser));
        policies.set("nominationVotingUser", () => UserService.hasRole(UserRole.administrator | UserRole.votingUser));

        return policies;
    }

    private getLists(): Array<HeaderMenuItem> {
        let lists: Array<HeaderMenuItem> = [];

        lists.push({ label: "Portal Users", link: "/v2/mgmt/users" });
        lists.push({ label: "Employees (NGH)", link: "/v2/mgmt/employees" });
        lists.push({ label: "Companies", link: "/v2/mgmt/companies" });
        lists.push({ label: "Departments", link: "/v2/mgmt/departments" });
        lists.push({ label: "Sites", link: "/v2/mgmt/sites" });

        return lists;
    }

    private getReports(): Array<HeaderMenuItem> {
        let reports: Array<HeaderMenuItem> = [];

        reports.push({ label: "Nomination report (Nominated cards)", link: "/v2/mgmt/reporting/nominatedcards" });

        if (UserService.correspondsPolicy("nomination"))
            reports.push({ label: "Nomination report (Voting)", link: "/v2/mgmt/reporting/nomination" });

        reports.push({ label: "Close-out report (action items data)", link: "/v2/mgmt/reporting/closeout" });
        reports.push({ label: "User report (company or department participation)", link: "/v2/mgmt/reporting/cord" });
        reports.push({ label: "User report (by Observer)", link: "/v2/mgmt/reporting/observer" });
        reports.push({ label: "Participation report", link: "/v2/mgmt/reporting/participation" });
        reports.push({ label: "OIMS System 5-4 KPIs Data", link: "/v2/mgmt/reporting/oims" });
        reports.push({ label: "Graphics", link: "/v2/mgmt/reporting/graphics" });

        return reports;
    }

    private getRoutes(): Array<ManagementAppRoute> {
        return [
            { path: "/v2/mgmt/cards", component: <Cards app={this} />, exact: true },
            { path: "/v2/mgmt/sites", component: <Sites app={this} />, exact: true },
            { path: "/v2/mgmt/sites/edit/:id", component: <SitesEditForm />, exact: false },
            { path: "/v2/mgmt/sites/new", component: <SitesNewForm />, exact: false },
            { path: "/v2/mgmt/departments", component: <Departments app={this} />, exact: true },
            { path: "/v2/mgmt/departments/edit/:id", component: <DepartmentsEditForm />, exact: false },
            { path: "/v2/mgmt/departments/new", component: <DepartmentsNewForm />, exact: false },
            { path: "/v2/mgmt/companies", component: <Companies app={this} />, exact: true },
            { path: "/v2/mgmt/companies/edit/:id", component: <CompaniesEditForm />, exact: false },
            { path: "/v2/mgmt/companies/new", component: <CompaniesNewForm />, exact: false },
            { path: "/v2/mgmt/users", component: <Users app={this} />, exact: true },
            { path: "/v2/mgmt/users/edit/:id", component: <UsersEditForm />, exact: false },
            { path: "/v2/mgmt/users/new", component: <UsersNewForm />, exact: false },
            { path: "/v2/mgmt/employees", component: <Employees app={this} />, exact: true },
            { path: "/v2/mgmt/employees/edit/:id", component: <EmployeesEditForm />, exact: false },
            { path: "/v2/mgmt/employees/new", component: <EmployeesNewForm />, exact: false },
            { path: "/v2/mgmt/reporting/nominatedcards", component: <NominatedCards app={this} />, exact: true },
            { path: "/v2/mgmt/reporting/nomination", component: <Nomination app={this} />, exact: true },
            { path: "/v2/mgmt/reporting/closeout", component: <Closeout app={this} />, exact: true },
            { path: "/v2/mgmt/reporting/cord", component: <Cord app={this} />, exact: true },
            { path: "/v2/mgmt/reporting/observer", component: <Observer app={this} />, exact: true },
            { path: "/v2/mgmt/reporting/oims", component: <OIMS app={this} />, exact: true },
            { path: "/v2/mgmt/reporting/participation", component: <Participation app={this} />, exact: true },
            { path: "/v2/mgmt/reporting/graphics", component: <Graphics />, exact: true }
        ];
    }

    private getFetch() {
        return [
            {
                url: "/api/sites?rowsPerPage=1000",
                prop: "sitesPromise",
                map: r => this.fetchOptions(r.data.rows),
                after: () => this.sitesPromise.then(s => this.sites = s)
            },
            {
                url: "/api/companies?rowsPerPage=1000",
                prop: "companiesPromise",
                map: r => this.fetchOptions(r.data.rows),
                after: () => this.companiesPromise.then(c => this.companies = c)
            },
            {
                url: "/api/departments?rowsPerPage=1000",
                prop: "departmentsPromise",
                map: r => this.fetchOptions(r.data.rows),
                after: () => this.departmentsPromise.then(d => this.departments = d)
            },
            {
                url: "/api/users/current",
                prop: "currentUserPromise",
                map: r => r.data,
                after: () => this.currentUserPromise.then(u => this.currentUser = u)
            },
            {
                url: "/api/nominations/categories?rowsPerPage=1000",
                prop: "nominationCategoriesPromise",
                map: r => r.data,
                after: () => this.nominationCategoriesPromise.then(n => this.nominationCategories = n)
            }
        ];
    }

    private fetchOptions = (rows: Array<any>) => rows.map(row => ({ value: row.id, text: row.name } as SelectOption));
}


export let app = new ManagementAppSettings();
app.fillProps();

ReactDOM.render(<ManagementApp app={app} />, document.body);
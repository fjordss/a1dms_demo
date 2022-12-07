import React from 'react';
import ReactDOM from 'react-dom';
import Header from './../../components/pages/mgmt/master/Header';
import Footer from './../../components/pages/mgmt/master/Footer';
import Main from './../../components/pages/mgmt/master/Main';
import { AppSettings } from '../../source/AppSettings';
import { BrowserRouter } from 'react-router-dom';
import FetchData from '../../components/FetchData';
import Form from '../../components/Form';
import Notification from '../../components/Notification';
import { UserRole, UserService } from './users/Users';
import Modal from '../../components/Modal';
import ModalError from '../../components/ModalError';
class ManagementAppOld extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: true,
            error: false
        };
    }
    render() {
        return (React.createElement(BrowserRouter, null,
            React.createElement("div", { className: "wrapper" },
                React.createElement(Modal, { loading: true, visible: this.state.loading }),
                React.createElement(ModalError, { errors: [Form.unknownError], visible: this.state.error }),
                this.state.loading ?
                    React.createElement(React.Fragment, null,
                        React.createElement(FetchData, { url: "/api/sites?rowsPerPage=1000", obj: app, prop: "sitesPromise", map: res => this.fetchOptions(res.data.rows), after: () => app.setSites() }),
                        React.createElement(FetchData, { url: "/api/companies?rowsPerPage=1000", obj: app, prop: "companiesPromise", map: res => this.fetchOptions(res.data.rows), after: () => app.setCompanies() }),
                        React.createElement(FetchData, { url: "/api/departments?rowsPerPage=1000", obj: app, prop: "departmentsPromise", map: res => this.fetchOptions(res.data.rows), after: () => app.setDepartments() }),
                        React.createElement(FetchData, { url: "/api/nominations/categories?rowsPerPage=1000", obj: app, prop: "nominationCategoriesPromise", map: res => res.data, after: () => app.setNominationCategories() }),
                        React.createElement(FetchData, { url: "/api/users/current", obj: app, prop: "currentUserPromise", map: res => res.data, after: () => app.setCurrentUser() })) :
                    React.createElement(React.Fragment, null,
                        React.createElement(Notification, null),
                        React.createElement(Header, { menuItems: this.getMenu() }),
                        React.createElement(Main, null),
                        React.createElement(Footer, null)))));
    }
    componentDidMount() {
        let promises = [
            app.currentUserPromise,
            app.sitesPromise,
            app.companiesPromise,
            app.departmentsPromise,
            app.nominationCategoriesPromise
        ];
        Promise.all(promises)
            .then(() => this.setState({ loading: false }))
            .catch(() => this.setState({ error: true }));
    }
    fetchOptions(rows) {
        return rows.map(row => ({ value: row.id, text: row.name }));
    }
    getMenu() {
        let items = [];
        if (UserService.correspondsPolicy("administrator"))
            items.push({ label: "Lists", children: this.getLists() });
        else
            items.push({ label: "Employees (NGH)", link: "/v2/mgmt/employees" });
        items.push({ label: "NGH Cards", link: "/v2/mgmt/cards" });
        items.push({ label: "Reporting", children: this.getReports() });
        items.push({ label: "Manuals" });
        return items;
    }
    getLists() {
        let lists = [];
        lists.push({ label: "Portal Users", link: "/v2/mgmt/users" });
        lists.push({ label: "Employees (NGH)", link: "/v2/mgmt/employees" });
        lists.push({ label: "Companies", link: "/v2/mgmt/companies" });
        lists.push({ label: "Departments", link: "/v2/mgmt/departments" });
        lists.push({ label: "Sites", link: "/v2/mgmt/sites" });
        return lists;
    }
    getReports() {
        let reports = [];
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
}
export let app = new AppSettings();
export let policies = new Map();
policies.set("administrator", () => UserService.hasRole(UserRole.administrator));
policies.set("siteAdministrator", () => UserService.hasRole(UserRole.administrator | UserRole.siteAdministrator));
policies.set("nomination", () => UserService.hasRole(UserRole.administrator | UserRole.SSHEUser | UserRole.votingUser));
policies.set("nominationSSHEUser", () => UserService.hasRole(UserRole.administrator | UserRole.SSHEUser));
policies.set("nominationVotingUser", () => UserService.hasRole(UserRole.administrator | UserRole.votingUser));
ReactDOM.render(React.createElement(ManagementAppOld, null), document.body);
//# sourceMappingURL=ManagementAppOld.js.map
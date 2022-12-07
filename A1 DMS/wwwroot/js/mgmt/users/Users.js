import React from 'react';
import { Link } from 'react-router-dom';
import { Access, Form, Modal, ModalError, Table, TableContainer, TableInfo, TablePaginator, TableSearch } from 'a1dms-front';
import { app } from '../ManagementApp';
export var UserRole;
(function (UserRole) {
    UserRole[UserRole["administrator"] = 1] = "administrator";
    UserRole[UserRole["siteAdministrator"] = 2] = "siteAdministrator";
    UserRole[UserRole["supervisor"] = 4] = "supervisor";
    UserRole[UserRole["SSHEUser"] = 8] = "SSHEUser";
    UserRole[UserRole["votingUser"] = 16] = "votingUser";
})(UserRole || (UserRole = {}));
export class UserService {
    static hasRole(role) {
        let roles = (Array.isArray(app.currentUser.role) ? app.currentUser.role : [app.currentUser.role]).reduce((n1, n2) => n1 | n2);
        return (roles & role) != 0;
    }
    static correspondsPolicy(policyName) {
        let policy = app.accessPolicies.get(policyName);
        if (policy == null)
            throw new Error("Policy '" + policyName + "' not found");
        return policy();
    }
}
export default class Users extends TableContainer {
    constructor(props) {
        super(props);
        this.getContextMenu = (row) => {
            return [
                {
                    label: "Edit",
                    icon: React.createElement("i", { className: "fas fa-info-circle" }),
                    route: "/v2/mgmt/users/edit/" + row.id
                },
                {
                    label: "Delete",
                    icon: React.createElement("i", { className: "fas fa-edit" }),
                    action: () => this.delete(row)
                }
            ];
        };
        let state = this.state;
        state.pageTitle = "Users";
        state.loading = false;
        state.errors = [];
    }
    render() {
        return (React.createElement(React.Fragment, null,
            React.createElement(Access, { app: app, policy: "administrator" }),
            React.createElement(Modal, { loading: true, visible: this.state.loading }),
            React.createElement(ModalError, { visible: this.state.errors.length > 0, errors: this.state.errors, backUrl: "/v2/mgmt/users", backLabel: "Back to Users" }),
            React.createElement("div", { className: "users-container" },
                React.createElement("div", { className: "report-search-area" },
                    React.createElement("div", { className: "report-search-left" },
                        React.createElement(Link, { to: "/v2/mgmt/users/new" }, "Create New")),
                    React.createElement("div", { className: "report-search-space" }),
                    React.createElement("div", { className: "report-search-right" },
                        React.createElement(TableSearch, { parent: this })),
                    React.createElement("div", { className: "report-search-right" },
                        React.createElement("button", { className: "tv-button", onClick: () => location.href = "/api/users/export" },
                            React.createElement("i", { className: "fa fa-table", "aria-hidden": "true" })))),
                React.createElement("div", { className: "pagination-area" + (this.state.totalRows == 0 ? " hidden" : "") },
                    React.createElement("div", { className: "pagination-info" },
                        React.createElement(TableInfo, { rowsPerPage: this.state.rowsPerPage, page: this.state.page, totalRows: this.state.totalRows })),
                    React.createElement("div", null,
                        React.createElement(TablePaginator, { rowsPerPage: this.state.rowsPerPage, totalRows: this.state.totalRows, page: this.state.page, onChange: page => this.changePage(page) }))),
                React.createElement(Table, { parent: this, apiUrl: "/api/users", columns: this.getColumns(), className: "users", getContextMenu: this.getContextMenu }),
                React.createElement("div", { className: "pagination-area" + (this.state.totalRows == 0 ? " hidden" : "") },
                    React.createElement("div", { className: "pagination-info" },
                        React.createElement(TableInfo, { rowsPerPage: this.state.rowsPerPage, page: this.state.page, totalRows: this.state.totalRows })),
                    React.createElement("div", null,
                        React.createElement(TablePaginator, { rowsPerPage: this.state.rowsPerPage, totalRows: this.state.totalRows, page: this.state.page, onChange: page => this.changePage(page) }))))));
    }
    changePage(page) {
        this.setState({
            page,
            updateTable: true
        });
    }
    delete(row) {
        if (confirm("Do you want to delete this user?")) {
            this.setState({ loading: true });
            Form.sendRequest("DELETE", "/api/users/" + row.id).then(res => this.onDeleted(res), () => this.setState({
                errors: [Form.unknownError],
                loading: false
            }));
        }
    }
    onDeleted(res) {
        if (res.status == "ok")
            app.notification.show(React.createElement("div", null,
                "User ",
                res.data.name,
                " successfully deleted"));
        this.setState({
            updateTable: true,
            errors: res.status == "error" ? res.errors.map(error => error.text) : [],
            loading: false
        });
    }
    getColumns() {
        let getColumn = (label, internalName = null, sortable = false, filterable = false, searchable = false, map = null) => {
            if (!internalName)
                internalName = label;
            return {
                label,
                internalName,
                sortable,
                filterable,
                searchable,
                map
            };
        };
        let convertId = (row) => React.createElement(React.Fragment, null,
            React.createElement(Link, { to: "/v2/mgmt/users/edit/" + row.id }, "edit"),
            " | ",
            React.createElement("span", { className: "a", onClick: () => this.delete(row) }, "delete"));
        return [
            getColumn("Name", "name", true, true, true),
            getColumn("Logon Name", "logonName", true, true, true),
            getColumn("EMail", "eMail", true, true, true),
            getColumn("Role", "role", false, true),
            getColumn("Company", "company", true, true, true),
            getColumn("Sites", "sites", false, true),
            getColumn("Created by", "createdBy", true, true, true),
            getColumn("", "id", false, false, false, convertId)
        ];
    }
}
//# sourceMappingURL=Users.js.map
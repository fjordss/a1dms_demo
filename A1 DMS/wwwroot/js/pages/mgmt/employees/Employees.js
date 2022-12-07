import React from 'react';
import Table from '../../../components/Table';
import TableContainer from '../../../components/TableContainer';
import TableSearch from '../../../components/TableSearch';
import TableInfo from '../../../components/TableInfo';
import TablePaginartor from '../../../components/TablePaginator';
import { Link } from 'react-router-dom';
import { CommonHelper } from '../../../source/CommonHelper';
import ModalError from '../../../components/ModalError';
import Form from '../../../components/Form';
import { app } from '../ManagementApp';
import Modal from '../../../components/Modal';
import { UserService } from '../users/Users';
export default class Employees extends TableContainer {
    constructor(props) {
        super(props);
        this.getContextMenu = (row) => {
            let items = [];
            if (UserService.correspondsPolicy("siteAdministrator")) {
                items.push({
                    label: "Edit",
                    icon: React.createElement("i", { className: "fas fa-info-circle" }),
                    route: "/v2/mgmt/employees/edit/" + row.id
                });
            }
            if (UserService.correspondsPolicy("administrator")) {
                items.push({
                    label: "Edit",
                    icon: React.createElement("i", { className: "fas fa-info-circle" }),
                    route: "/v2/mgmt/employees/edit/" + row.id
                });
            }
            return items;
        };
        let state = this.state;
        state.pageTitle = "Employees (NGH)";
        state.loading = false;
        state.errors = [];
    }
    render() {
        let isSiteAdministrator = UserService.correspondsPolicy("siteAdministrator");
        let hasContextMenu = UserService.correspondsPolicy("administrator") || isSiteAdministrator;
        return (React.createElement(React.Fragment, null,
            React.createElement(Modal, { loading: true, visible: this.state.loading }),
            React.createElement(ModalError, { visible: this.state.errors.length > 0, errors: this.state.errors, backUrl: "/v2/mgmt/employees", backLabel: "Back to Employees" }),
            React.createElement("div", { className: "employees-container" },
                React.createElement("div", { className: "report-search-area" },
                    React.createElement("div", { className: "report-search-left" }, isSiteAdministrator ? React.createElement(Link, { to: "/v2/mgmt/employees/new" }, "Create New") : React.createElement(React.Fragment, null)),
                    React.createElement("div", { className: "report-search-space" }),
                    React.createElement("div", { className: "report-search-right" },
                        React.createElement(TableSearch, { parent: this })),
                    React.createElement("div", { className: "report-search-right" },
                        React.createElement("button", { className: "tv-button", onClick: () => location.href = "/api/employees/export" },
                            React.createElement("i", { className: "fa fa-table", "aria-hidden": "true" })))),
                React.createElement("div", { className: "pagination-area" + (this.state.totalRows == 0 ? " hidden" : "") },
                    React.createElement("div", { className: "pagination-info" },
                        React.createElement(TableInfo, { rowsPerPage: this.state.rowsPerPage, page: this.state.page, totalRows: this.state.totalRows })),
                    React.createElement("div", null,
                        React.createElement(TablePaginartor, { rowsPerPage: this.state.rowsPerPage, totalRows: this.state.totalRows, page: this.state.page, onChange: page => this.changePage(page) }))),
                React.createElement(Table, { parent: this, apiUrl: "/api/employees", columns: this.getColumns(), className: "employees", getContextMenu: hasContextMenu ? this.getContextMenu : null }),
                React.createElement("div", { className: "pagination-area" + (this.state.totalRows == 0 ? " hidden" : "") },
                    React.createElement("div", { className: "pagination-info" },
                        React.createElement(TableInfo, { rowsPerPage: this.state.rowsPerPage, page: this.state.page, totalRows: this.state.totalRows })),
                    React.createElement("div", null,
                        React.createElement(TablePaginartor, { rowsPerPage: this.state.rowsPerPage, totalRows: this.state.totalRows, page: this.state.page, onChange: page => this.changePage(page) }))))));
    }
    changePage(page) {
        this.setState({
            page,
            updateTable: true
        });
    }
    delete(row) {
        if (confirm("Do you want to delete this employee?")) {
            this.setState({ loading: true });
            Form.sendRequest("DELETE", "/api/employees/" + row.id).then(res => this.onDeleted(res), () => this.setState({
                errors: [Form.unknownError],
                loading: false
            }));
        }
    }
    onDeleted(res) {
        if (res.status == "ok")
            app.notification.show(React.createElement("div", null,
                "Employee",
                res.data.name ? " " + res.data.name + "," : "",
                " NGH # ",
                res.data.code,
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
        let isAdministrator = UserService.correspondsPolicy("administrator");
        let isSiteAdministrator = UserService.correspondsPolicy("siteAdministrator");
        let convertInactive = (row) => React.createElement("input", { type: "checkbox", disabled: true, checked: row.inactive });
        let convertId = (row) => {
            let links = [];
            if (isSiteAdministrator)
                links.push(React.createElement(Link, { to: "/v2/mgmt/employees/edit/" + row.id }, "edit"));
            if (isAdministrator) {
                if (links.length > 0)
                    links.push(React.createElement("span", null, " | "));
                links.push(React.createElement("span", { className: "a", onClick: () => this.delete(row) }, "delete"));
            }
            return React.createElement(React.Fragment, null, links);
        };
        let columns = [
            getColumn("NGH #", "code", true, false, true),
            getColumn("First Name", "firstName", true, false, true),
            getColumn("Last Name", "lastName", true, false, true),
            getColumn("Site", "site", true, true, true),
            getColumn("Company", "company", true, true, true),
            getColumn("Department", "department", true, true, true),
            getColumn("PTS #", "ptsNumber", false, false, true),
            getColumn("Additional Information", "additionalInfo", false, false, true),
            getColumn("Created", "date", true, true, false, row => React.createElement("span", null, CommonHelper.convertDate(row.date))),
            getColumn("Inactive", "inactive", false, true, false, convertInactive)
        ];
        if (isAdministrator || isSiteAdministrator)
            columns.push(getColumn("", "id", false, false, false, convertId));
        return columns;
    }
}
//# sourceMappingURL=Employees.js.map
import React from 'react';
import Table from '../../../components/Table';
import TableContainer from '../../../components/TableContainer';
import TableInfo from '../../../components/TableInfo';
import TablePaginartor from '../../../components/TablePaginator';
import TableSearch from '../../../components/TableSearch';
import { Link } from 'react-router-dom';
import ModalError from '../../../components/ModalError';
import Form from '../../../components/Form';
import { app } from '../ManagementApp';
import Modal from '../../../components/Modal';
import Access from '../../../components/Access';
export default class Companies extends TableContainer {
    constructor(props) {
        super(props);
        this.getContextMenu = (row) => {
            return [
                {
                    label: "Edit",
                    icon: React.createElement("i", { className: "fas fa-info-circle" }),
                    route: "/v2/mgmt/companies/edit/" + row.id
                },
                {
                    label: "Delete",
                    icon: React.createElement("i", { className: "fas fa-edit" }),
                    action: () => this.delete(row)
                }
            ];
        };
        let state = this.state;
        state.pageTitle = "Companies";
        state.loading = false;
        state.errors = [];
    }
    render() {
        return (React.createElement(React.Fragment, null,
            React.createElement(Access, { policy: "administrator" }),
            React.createElement(Modal, { loading: true, visible: this.state.loading }),
            React.createElement(ModalError, { visible: this.state.errors.length > 0, errors: this.state.errors, backUrl: "/v2/mgmt/companies", backLabel: "Back to Companies" }),
            React.createElement("div", { className: "small-container" },
                React.createElement("div", { className: "report-search-area" },
                    React.createElement("div", { className: "report-search-left" },
                        React.createElement(Link, { to: "/v2/mgmt/companies/new" }, "Create New")),
                    React.createElement("div", { className: "report-search-space" }),
                    React.createElement("div", { className: "report-search-right" },
                        React.createElement(TableSearch, { parent: this })),
                    React.createElement("div", { className: "report-search-right" },
                        React.createElement("button", { className: "tv-button", onClick: () => location.href = "/api/companies/export" },
                            React.createElement("i", { className: "fa fa-table", "aria-hidden": "true" })))),
                React.createElement("div", { className: "pagination-area" + (this.state.totalRows == 0 ? " hidden" : "") },
                    React.createElement("div", { className: "pagination-info" },
                        React.createElement(TableInfo, { rowsPerPage: this.state.rowsPerPage, page: this.state.page, totalRows: this.state.totalRows })),
                    React.createElement("div", null,
                        React.createElement(TablePaginartor, { rowsPerPage: this.state.rowsPerPage, totalRows: this.state.totalRows, page: this.state.page, onChange: page => this.changePage(page) }))),
                React.createElement(Table, { parent: this, apiUrl: "/api/companies", columns: this.getColumns(), className: "small", getContextMenu: this.getContextMenu }),
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
        if (confirm("Do you want to delete this company?")) {
            this.setState({ loading: true });
            Form.sendRequest("DELETE", "/api/companies/" + row.id).then(res => this.onDeleted(res), () => this.setState({
                errors: [Form.unknownError],
                loading: false
            }));
        }
    }
    onDeleted(res) {
        if (res.status == "ok")
            app.notification.show(React.createElement("div", null,
                "Company ",
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
        let convertInactive = (row) => React.createElement("input", { type: "checkbox", disabled: true, checked: row.inactive });
        let convertId = (row) => React.createElement(React.Fragment, null,
            React.createElement(Link, { to: "/v2/mgmt/companies/edit/" + row.id }, "edit"),
            " | ",
            React.createElement("span", { className: "a", onClick: () => this.delete(row) }, "delete"));
        return [
            getColumn("Name", "name", true, true, true),
            getColumn("Inactive", "inactive", false, true, false, convertInactive),
            getColumn("", "id", false, false, false, convertId)
        ];
    }
}
//# sourceMappingURL=Companies.js.map
import React from 'react';
import Table from '../../components/Table';
import TableContainer from '../../components/TableContainer';
import TableSearch from '../../components/TableSearch';
import TableInfo from '../../components/TableInfo';
import TablePaginartor from '../../components/TablePaginator';
import { Link } from 'react-router-dom';
import { CommonHelper } from '../../source/CommonHelper';
export default class Employees extends TableContainer {
    constructor(props) {
        super(props);
        let state = this.state;
        state.pageTitle = "Employees (NGH)";
    }
    render() {
        return (React.createElement("div", { className: "employees-container" },
            React.createElement("div", { className: "report-search-area" },
                React.createElement("div", { className: "report-search-left" },
                    React.createElement(Link, { to: "/v2/mgmt/employees/new" }, "Create New")),
                React.createElement("div", { className: "report-search-space" }),
                React.createElement("div", { className: "report-search-right" },
                    React.createElement(TableSearch, { parent: this }))),
            React.createElement("div", { className: "pagination-area" + (this.state.totalRows == 0 ? " hidden" : "") },
                React.createElement("div", { className: "pagination-info" },
                    React.createElement(TableInfo, { rowsPerPage: this.state.rowsPerPage, page: this.state.page, totalRows: this.state.totalRows })),
                React.createElement("div", null,
                    React.createElement(TablePaginartor, { rowsPerPage: this.state.rowsPerPage, totalRows: this.state.totalRows, page: this.state.page, onChange: page => this.changePage(page) }))),
            React.createElement(Table, { parent: this, apiUrl: "/api/employees", columns: this.getColumns(), className: "employees", getContextMenu: this.getContextMenu }),
            React.createElement("div", { className: "pagination-area" + (this.state.totalRows == 0 ? " hidden" : "") },
                React.createElement("div", { className: "pagination-info" },
                    React.createElement(TableInfo, { rowsPerPage: this.state.rowsPerPage, page: this.state.page, totalRows: this.state.totalRows })),
                React.createElement("div", null,
                    React.createElement(TablePaginartor, { rowsPerPage: this.state.rowsPerPage, totalRows: this.state.totalRows, page: this.state.page, onChange: page => this.changePage(page) })))));
    }
    changePage(page) {
        this.setState({
            page,
            updateTable: true
        });
    }
    getContextMenu(row) {
        return [
            {
                label: "Edit",
                icon: React.createElement("i", { className: "fas fa-edit" }),
                route: "/v2/mgmt/employees/edit/" + row.id
            },
            {
                label: "Delete",
                icon: React.createElement("i", { className: "far fa-trash-alt" }),
                action: () => confirm("Do you really want to delete this item?")
            }
        ];
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
        return [
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
    }
}
//# sourceMappingURL=Employees.js.map
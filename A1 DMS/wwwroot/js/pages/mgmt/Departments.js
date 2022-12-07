import React from 'react';
import Table from '../../components/Table';
import TableContainer from '../../components/TableContainer';
import TableInfo from '../../components/TableInfo';
import TablePaginartor from '../../components/TablePaginator';
import TableSearch from '../../components/TableSearch';
import { Link } from 'react-router-dom';
export default class Departments extends TableContainer {
    constructor(props) {
        super(props);
        let state = this.state;
        state.pageTitle = "Departments";
    }
    render() {
        return (React.createElement(React.Fragment, null,
            React.createElement("div", { className: "small-container" },
                React.createElement("div", { className: "report-search-area" },
                    React.createElement("div", { className: "report-search-left" },
                        React.createElement(Link, { to: "/v2/mgmt/departments/new" }, "Create New")),
                    React.createElement("div", { className: "report-search-space" }),
                    React.createElement("div", { className: "report-search-right" },
                        React.createElement(TableSearch, { parent: this }))),
                React.createElement("div", { className: "pagination-area" + (this.state.totalRows == 0 ? " hidden" : "") },
                    React.createElement("div", { className: "pagination-info" },
                        React.createElement(TableInfo, { rowsPerPage: this.state.rowsPerPage, page: this.state.page, totalRows: this.state.totalRows })),
                    React.createElement("div", null,
                        React.createElement(TablePaginartor, { rowsPerPage: this.state.rowsPerPage, totalRows: this.state.totalRows, page: this.state.page, onChange: page => this.changePage(page) }))),
                React.createElement(Table, { parent: this, apiUrl: "/api/departments", columns: this.getColumns(), className: "small" }),
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
            getColumn("Name", "name", true, true, true),
            getColumn("Inactive", "inactive", false, true, false, convertInactive)
        ];
    }
}
//# sourceMappingURL=Departments.js.map
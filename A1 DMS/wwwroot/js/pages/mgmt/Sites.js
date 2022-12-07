import React from 'react';
import Table from '../../components/Table';
import TableContainer from '../../components/TableContainer';
import TableInfo from '../../components/TableInfo';
import TablePaginartor from '../../components/TablePaginator';
import TableSearch from '../../components/TableSearch';
import ModalError from '../../components/ModalError';
import ModalPreloader from '../../components/ModalPreloader';
import { Link } from 'react-router-dom';
import Form from '../../components/Form';
export default class Sites extends TableContainer {
    constructor(props) {
        super(props);
        this.getContextMenu = (row) => {
            return [
                {
                    label: "Edit",
                    icon: React.createElement("i", { className: "fas fa-info-circle" }),
                    route: "/v2/mgmt/sites/edit/" + row.id
                },
                {
                    label: "Delete",
                    icon: React.createElement("i", { className: "fas fa-edit" }),
                    action: () => this.delete(row)
                }
            ];
        };
        let state = this.state;
        state.pageTitle = "Sites";
        state.loading = false;
        state.errors = [];
    }
    render() {
        return (React.createElement(React.Fragment, null,
            React.createElement(ModalPreloader, { visible: this.state.loading }),
            React.createElement(ModalError, { visible: this.state.errors.length > 0, errors: this.state.errors, backUrl: "/v2/mgmt/sites", backLabel: "Back to Sites" }),
            React.createElement("div", { className: "small-container" },
                React.createElement("div", { className: "report-search-area" },
                    React.createElement("div", { className: "report-search-left" },
                        React.createElement(Link, { to: "/v2/mgmt/sites/new" }, "Create New")),
                    React.createElement("div", { className: "report-search-space" }),
                    React.createElement("div", { className: "report-search-right" },
                        React.createElement(TableSearch, { parent: this }))),
                React.createElement("div", { className: "pagination-area" + (this.state.totalRows == 0 ? " hidden" : "") },
                    React.createElement("div", { className: "pagination-info" },
                        React.createElement(TableInfo, { rowsPerPage: this.state.rowsPerPage, page: this.state.page, totalRows: this.state.totalRows })),
                    React.createElement("div", null,
                        React.createElement(TablePaginartor, { rowsPerPage: this.state.rowsPerPage, totalRows: this.state.totalRows, page: this.state.page, onChange: page => this.changePage(page) }))),
                React.createElement(Table, { parent: this, apiUrl: "/api/sites", columns: this.getColumns(), className: "small", getContextMenu: this.getContextMenu }),
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
        if (confirm("Do you want to delete this site?")) {
            this.setState({ loading: true });
            Form.sendRequest("DELETE", "/api/sites/" + row.id).then(data => this.setState({
                updateTable: true,
                errors: data.status == "error" ? data.errors.map(error => error.text) : [],
                loading: false
            }), error => this.setState({
                errors: [Form.unknownError],
                loading: false
            }));
        }
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
            React.createElement(Link, { to: "/v2/mgmt/sites/edit/" + row.id }, "edit"),
            " | ",
            React.createElement("span", { className: "a", onClick: () => this.delete(row) }, "delete"));
        return [
            getColumn("Name", "name", true, true, true),
            getColumn("Inactive", "inactive", false, true, false, convertInactive),
            getColumn("", "id", false, false, false, convertId)
        ];
    }
}
//# sourceMappingURL=Sites.js.map
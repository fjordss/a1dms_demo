import { Select, Table, TableContainer, TableDefaultHeader, TableInfo, TablePaginator, TableSearch } from 'a1dms-front';
import React from 'react';
import { app } from '../ManagementApp';
export default class Participation extends TableContainer {
    constructor(props) {
        super(props);
        this.onYearChanged = (e) => {
            let value = e.currentTarget.value;
            this.setState({ year: parseInt(e.currentTarget.value) });
            this.onFieldValueChanged("year", [value]);
        };
        let state = this.state;
        state.pageTitle = "Participation report";
        state.month = new Date().getMonth() + 1;
        state.year = new Date().getFullYear();
        this.onFieldValueChanged("month", [this.state.month.toString()]);
        this.onFieldValueChanged("year", [this.state.year.toString()]);
    }
    render() {
        return (React.createElement("div", null,
            React.createElement("div", { className: "report-search-area" },
                React.createElement("div", { className: "report-search-left" },
                    React.createElement(Select, { options: app.sites.map(s => s.text), multiple: true, placeholder: "Select sites...", width: 200, onChange: v => this.onFieldValueChanged("sites", v) })),
                React.createElement("div", { className: "report-search-left" },
                    React.createElement(Select, { options: app.companies.map(s => s.text), multiple: true, placeholder: "Select companies...", width: 200, onChange: v => this.onFieldValueChanged("companies", v) })),
                React.createElement("div", { className: "report-search-left" },
                    React.createElement(Select, { options: app.departments.map(s => s.text), multiple: true, placeholder: "Select departments...", width: 200, onChange: v => this.onFieldValueChanged("departments", v) })),
                React.createElement("div", { className: "report-search-left" },
                    React.createElement(Select, { options: this.getMonths(), width: 200, values: [this.state.month.toString()], onChange: (values) => {
                            this.setState({ month: parseInt(values[0]) });
                            this.onFieldValueChanged("month", values);
                        } })),
                React.createElement("div", { className: "report-search-left" },
                    React.createElement("input", { type: "number", value: this.state.year, onChange: this.onYearChanged })),
                React.createElement("div", { className: "report-search-left" },
                    React.createElement("button", { onClick: () => this.getReport() }, "Get Report")),
                React.createElement("div", { className: "report-search-space" }),
                React.createElement("div", { className: "report-search-right" },
                    React.createElement(TableSearch, { parent: this }))),
            React.createElement("div", { className: "pagination-area" + (this.state.totalRows == 0 ? " hidden" : "") },
                React.createElement("div", { className: "pagination-info" },
                    React.createElement(TableInfo, { rowsPerPage: this.state.rowsPerPage, page: this.state.page, totalRows: this.state.totalRows })),
                React.createElement("div", null,
                    React.createElement(TablePaginator, { rowsPerPage: this.state.rowsPerPage, totalRows: this.state.totalRows, page: this.state.page, onChange: page => this.changePage(page) }))),
            this.columns ?
                React.createElement(Table, { parent: this, className: "participation", apiUrl: "/api/reporting/participation", columns: this.columns },
                    React.createElement("div", { className: "participation-top-cell-left" }, "By observer"),
                    this.daysInMonth > 0 ?
                        React.createElement("div", { className: "participation-top-cell-right", style: { gridColumn: "span " + this.daysInMonth } }, this.getMonths().find(m => m.value == this.state.month.toString()).text) :
                        React.createElement(React.Fragment, null),
                    React.createElement(TableDefaultHeader, null)) :
                React.createElement(React.Fragment, null),
            React.createElement("div", { className: "pagination-area" + (this.state.totalRows == 0 ? " hidden" : "") },
                React.createElement("div", { className: "pagination-info" },
                    React.createElement(TableInfo, { rowsPerPage: this.state.rowsPerPage, page: this.state.page, totalRows: this.state.totalRows })),
                React.createElement("div", null,
                    React.createElement(TablePaginator, { rowsPerPage: this.state.rowsPerPage, totalRows: this.state.totalRows, page: this.state.page, onChange: page => this.changePage(page) })))));
    }
    componentDidMount() {
        this.getReport();
    }
    getMonths() {
        return [
            { value: "1", text: "January" },
            { value: "2", text: "February" },
            { value: "3", text: "March" },
            { value: "4", text: "April" },
            { value: "5", text: "May" },
            { value: "6", text: "June" },
            { value: "7", text: "July" },
            { value: "8", text: "August" },
            { value: "9", text: "September" },
            { value: "10", text: "October" },
            { value: "11", text: "November" },
            { value: "12", text: "December" }
        ];
    }
    changePage(page) {
        this.setState({
            page,
            updateTable: true
        });
    }
    getReport() {
        this.columns = this.getColumns();
        this.setState({
            updateTable: true,
            query: this.state.query
        });
    }
    onFieldValueChanged(field, values) {
        this.state.query.set(field, values);
    }
    getColumns() {
        let getColumn = (label, internalName, headerCellClass = null, getAdditionalCellClass = null) => {
            return {
                label,
                internalName,
                sortable: true,
                filterable: ["code", "name"].indexOf(internalName) == -1,
                searchable: true,
                hasTotal: ["code", "name", "company", "department", "site"].indexOf(internalName) == -1,
                headerCellClass,
                getAdditionalCellClass
            };
        };
        let columns = [
            getColumn("NGH #", "code"),
            getColumn("Name", "name"),
            getColumn("Company", "company"),
            getColumn("Department", "department"),
            getColumn("Site", "site"),
            getColumn("Total Cards", "totalCards"),
        ];
        let currentDate = new Date();
        let currentMonth = currentDate.getMonth() + 1;
        let currentYear = currentDate.getFullYear();
        this.daysInMonth = currentMonth == this.state.month && currentYear == this.state.year ? currentDate.getDate() : new Date(this.state.year, this.state.month, 0).getDate();
        if (this.state.year > currentYear || (this.state.year == currentYear && this.state.month > currentMonth))
            this.daysInMonth = 0;
        for (let i = 1; i <= this.daysInMonth; i++)
            columns.push(getColumn((i <= 9 ? "0" : "") + i, "d" + i, "participation-header-cell-date", (row, column) => {
                let count = parseInt(row[column]);
                return count > 0 ? (count == 1 ? "participation-cell-one" : "participation-cell-many") : "participation-cell-any";
            }));
        return columns;
    }
}
//# sourceMappingURL=Participation.js.map
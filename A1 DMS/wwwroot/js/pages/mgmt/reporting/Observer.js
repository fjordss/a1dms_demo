import React from 'react';
import DateRangePicker from '../../../components/DateRangePicker';
import Modal from '../../../components/Modal';
import Select from '../../../components/Select';
import Table from '../../../components/Table';
import TableContainer from '../../../components/TableContainer';
import TableDefaultHeader from '../../../components/TableDefaultHeader';
import TableInfo from '../../../components/TableInfo';
import TablePaginartor from '../../../components/TablePaginator';
import TableSearch from '../../../components/TableSearch';
import { app } from '../ManagementApp';
export default class Observer extends TableContainer {
    constructor(props) {
        super(props);
        let state = this.state;
        state.showDatePicker = false;
        state.dateFrom = DateRangePicker.getRange("cm")[0];
        state.pageTitle = "User report (by Observer)";
        this.onFieldValueChanged("from", [this.state.dateFrom]);
    }
    render() {
        return (React.createElement("div", null,
            React.createElement(Modal, { height: 270, header: "Select range", visible: this.state.showDatePicker, onClose: () => this.setState({ showDatePicker: false }) },
                React.createElement(DateRangePicker, { onChange: (from, to) => this.dateRangeSelected(from, to) })),
            React.createElement("div", { className: "report-search-area" },
                React.createElement("div", { className: "report-search-left" },
                    React.createElement(Select, { options: app.sites.map(s => s.text), multiple: true, placeholder: "Select sites...", width: 200, onChange: v => this.onFieldValueChanged("sites", v) })),
                React.createElement("div", { className: "report-search-left" },
                    React.createElement(Select, { options: app.companies.map(s => s.text), multiple: true, placeholder: "Select companies...", width: 200, onChange: v => this.onFieldValueChanged("companies", v) })),
                React.createElement("div", { className: "report-search-left" },
                    React.createElement(Select, { options: app.departments.map(s => s.text), multiple: true, placeholder: "Select departments...", width: 200, onChange: v => this.onFieldValueChanged("departments", v) })),
                React.createElement("div", { className: "report-search-left nopadding" },
                    React.createElement("input", { type: "date", placeholder: "From...", value: this.state.dateFrom, onChange: e => this.onDateChanged(e.currentTarget.value, "from") }),
                    "\u00A0-\u00A0",
                    React.createElement("input", { type: "date", placeholder: "To...", value: this.state.dateTo, onChange: e => this.onDateChanged(e.currentTarget.value, "to") }),
                    " \u00A0"),
                React.createElement("div", { className: "report-search-left" },
                    React.createElement("button", { className: "date-picker-button", onClick: () => this.setState({ showDatePicker: true }) }, "...")),
                React.createElement("div", { className: "report-search-left" },
                    React.createElement("button", { onClick: () => this.getReport() }, "Get Report")),
                React.createElement("div", { className: "report-search-space" }),
                React.createElement("div", { className: "report-search-right" },
                    React.createElement(TableSearch, { parent: this }))),
            React.createElement("div", { className: "pagination-area" + (this.state.totalRows == 0 ? " hidden" : "") },
                React.createElement("div", { className: "pagination-info" },
                    React.createElement(TableInfo, { rowsPerPage: this.state.rowsPerPage, page: this.state.page, totalRows: this.state.totalRows })),
                React.createElement("div", null,
                    React.createElement(TablePaginartor, { rowsPerPage: this.state.rowsPerPage, totalRows: this.state.totalRows, page: this.state.page, onChange: page => this.changePage(page) }))),
            React.createElement(Table, { parent: this, className: "observer", apiUrl: "/api/reporting/observer", columns: this.getColumns() },
                React.createElement("div", { className: "observer-top-cell-left" }, "By Observer"),
                React.createElement("div", { className: "observer-top-cell-right" }, "Cards Submitted by Month"),
                React.createElement(TableDefaultHeader, null)),
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
    getReport() {
        this.setState({
            updateTable: true,
            query: this.state.query
        });
    }
    onDateChanged(value, field) {
        if (field == "from")
            this.setState({ dateFrom: value });
        else if (field == "to")
            this.setState({ dateTo: value });
        this.onFieldValueChanged(field, [value]);
    }
    onFieldValueChanged(field, values) {
        this.state.query.set(field, values);
    }
    dateRangeSelected(from, to) {
        this.onFieldValueChanged("from", [from]);
        if (to)
            this.onFieldValueChanged("to", [to]);
        this.setState({
            dateFrom: from,
            dateTo: to,
            showDatePicker: false
        });
    }
    getColumns() {
        let months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        let getColumn = (label, internalName = null, sortable = false, filterable = false, searchable = false, hasTotal = false, map = null) => {
            if (!internalName)
                internalName = label;
            let column = {
                label,
                internalName,
                sortable,
                filterable,
                searchable,
                hasTotal,
                map
            };
            let light = ["offTheSite", "security", "environmental"];
            column.headerCellClass = light.indexOf(internalName) != -1 ? "observer-header-cell2" : (months.indexOf(label) != -1 ? "observer-header-cell3" : "observer-header-cell1");
            return column;
        };
        let columns = [
            getColumn("Name", "name", true, true, true),
            getColumn("Company", "company", true, true, true),
            getColumn("Department", "department", true, true, true),
            getColumn("Site", "site", true, true, true),
            getColumn("Total Cards", "totalCards", true, true, true, true),
            getColumn("HID", "hid", true, true, true, true),
            getColumn("Safe Behavior", "safeBehavior", true, true, true, true),
            getColumn("Unsafe Behavior", "unsafeBehavior", true, true, true, true),
            getColumn("Off-the-Site", "offTheSite", true, true, true, true),
            getColumn("Security", "security", true, true, true, true),
            getColumn("Environmental", "environmental", true, true, true, true)
        ];
        months.forEach(m => columns.push(getColumn(m, m.toLowerCase(), true, true, true, true)));
        return columns;
    }
}
//# sourceMappingURL=Observer.js.map
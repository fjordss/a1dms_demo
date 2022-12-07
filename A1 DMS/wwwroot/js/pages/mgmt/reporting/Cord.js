import React from 'react';
import DateRangePicker from '../../../components/DateRangePicker';
import Modal from '../../../components/Modal';
import Select from '../../../components/Select';
import Table from '../../../components/Table';
import TableContainer from '../../../components/TableContainer';
import TableDefaultHeader from '../../../components/TableDefaultHeader';
import TableSearch from '../../../components/TableSearch';
import { app } from '../ManagementApp';
export default class Cord extends TableContainer {
    constructor(props) {
        super(props);
        let state = this.state;
        state.showDatePicker = false;
        state.dateFrom = DateRangePicker.getRange("cm")[0];
        state.pageTitle = "User report (company or department participation)";
        this.onFieldValueChanged("from", [this.state.dateFrom]);
    }
    render() {
        return (React.createElement("div", { className: "cord-container" },
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
            React.createElement("br", null),
            React.createElement("br", null),
            React.createElement(Table, { parent: this, className: "cordcompany", apiUrl: "/api/reporting/cord/byCompany", columns: this.getColumns("byCompany") },
                React.createElement("div", { className: "cord-top-cell-company" }, "Participation by Company"),
                React.createElement(TableDefaultHeader, null)),
            React.createElement("br", null),
            React.createElement("br", null),
            React.createElement(Table, { parent: this, className: "corddept", apiUrl: "/api/reporting/cord/byDepartment", columns: this.getColumns("byDepartment") },
                React.createElement("div", { className: "cord-top-cell-dept" }, "Participation by Department"),
                React.createElement(TableDefaultHeader, null)),
            React.createElement("br", null),
            React.createElement("br", null),
            React.createElement(Table, { parent: this, className: "cordenldept", apiUrl: "/api/reporting/cord/byENLDepartment", columns: this.getColumns("byENLDepartment") },
                React.createElement("div", { className: "cord-top-cell-enldept" }, "Participation by ENL Department"),
                React.createElement(TableDefaultHeader, null))));
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
    getColumns(type) {
        let getColumn = (label, internalName = null, sortable = false, filterable = false, searchable = false, map = null) => {
            if (!internalName)
                internalName = label;
            let column = {
                label,
                internalName,
                sortable,
                filterable,
                searchable,
                map
            };
            column.headerCellClass = type == "byCompany" ? "cord-header-cell-company" : (type == "byDepartment" ? "cord-header-cell-dept" : "cord-header-cell-enldept");
            if (internalName == "offTheSite" || internalName == "security" || internalName == "environmental")
                column.headerCellClass += "-light";
            if (internalName != "cord")
                column.hasTotal = true;
            return column;
        };
        let getCordFieldName = (type) => type == "byCompany" ? "Company" : (type == "byDepartment" ? "Department" : "ENL Department");
        return [
            getColumn(getCordFieldName(type), "cord", true, true, true),
            getColumn("Total Cards Submitted for the Period", "totalCards", true, true, true),
            getColumn("HID", "hid", true, true, true),
            getColumn("Safe Behavior", "safeBehavior", true, true, true),
            getColumn("Unsafe Behavior", "unsafeBehavior", true, true, true),
            getColumn("Off-The-Site", "offTheSite", true, true, true),
            getColumn("Security", "security", true, true, true),
            getColumn("Environmental", "environmental", true, true, true),
        ];
    }
}
//# sourceMappingURL=Cord.js.map
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
import TableHeaderCell from '../../../components/TableHeaderCell';
export default class OIMS extends TableContainer {
    constructor(props) {
        super(props);
        let state = this.state;
        state.showDatePicker = false;
        state.dateFrom = DateRangePicker.getRange("cm")[0];
        state.pageTitle = "OIMS System 5-4 KPIs Data";
        this.onFieldValueChanged("from", [this.state.dateFrom]);
    }
    render() {
        let columns = this.getColumns();
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
            React.createElement(Table, { parent: this, className: "oims", apiUrl: "/api/reporting/oims", columns: columns },
                React.createElement(TableDefaultHeader, null,
                    React.createElement("div", { className: "oims-top-cell" }, "Participation by Site"),
                    React.createElement(TableHeaderCell, { column: columns.find(c => c.internalName == "site"), additionalClass: "oims-rowspan2" }),
                    React.createElement(TableHeaderCell, { column: columns.find(c => c.internalName == "totalCards"), additionalClass: "oims-rowspan2" }),
                    React.createElement(TableHeaderCell, { column: columns.find(c => c.internalName == "hid"), additionalClass: "oims-rowspan2" }),
                    React.createElement("div", { className: "oims-colspan3" }, "BBO"),
                    React.createElement(TableHeaderCell, { column: columns.find(c => c.internalName == "hidPercent"), additionalClass: "oims-rowspan2" }),
                    React.createElement("div", { className: "oims-colspan3" }, "BBO%"),
                    React.createElement(TableHeaderCell, { column: columns.find(c => c.internalName == "openActionItems"), additionalClass: "oims-rowspan2" }),
                    React.createElement(TableHeaderCell, { column: columns.find(c => c.internalName == "expiredActionItems"), additionalClass: "oims-rowspan2" }),
                    React.createElement(TableHeaderCell, { column: columns.find(c => c.internalName == "actionItemsWithoutDates"), additionalClass: "oims-rowspan2" }),
                    React.createElement(TableHeaderCell, { column: columns.find(c => c.internalName == "safeBehavior") }),
                    React.createElement(TableHeaderCell, { column: columns.find(c => c.internalName == "unsafeBehavior") }),
                    React.createElement(TableHeaderCell, { column: columns.find(c => c.internalName == "safeUnsafeTotal") }),
                    React.createElement(TableHeaderCell, { column: columns.find(c => c.internalName == "safeBehaviorPercent") }),
                    React.createElement(TableHeaderCell, { column: columns.find(c => c.internalName == "unsafeBehaviorPercent") }),
                    React.createElement(TableHeaderCell, { column: columns.find(c => c.internalName == "safeUnsafeTotalPercent") }))),
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
        let getColumn = (label, internalName) => {
            return {
                label,
                internalName,
                sortable: true,
                filterable: true,
                searchable: true,
                hasTotal: internalName != "site",
            };
        };
        let columns = [
            getColumn("Site", "site"),
            getColumn("Total Number of Reports", "totalCards"),
            getColumn("HID", "hid"),
            getColumn("Safe Behavior", "safeBehavior"),
            getColumn("Unsafe Behavior", "unsafeBehavior"),
            getColumn("Total", "safeUnsafeTotal"),
            getColumn("HID%", "hidPercent"),
            getColumn("Safe", "safeBehaviorPercent"),
            getColumn("Unsafe", "unsafeBehaviorPercent"),
            getColumn("Total", "safeUnsafeTotalPercent"),
            getColumn("Open + In Progress Action Items", "openActionItems"),
            getColumn("Open + In Progress Action Items With Expired Target Date", "expiredActionItems"),
            getColumn("Open + In Progress Action Items Without Assigned Target Date", "actionItemsWithoutDates")
        ];
        return columns;
    }
}
//# sourceMappingURL=OIMS.js.map
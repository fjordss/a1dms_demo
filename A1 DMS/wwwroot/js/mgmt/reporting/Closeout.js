import React from 'react';
import Switch from 'react-switch';
import { app } from '../ManagementApp';
import { Language } from '../CardDetails';
import ActionItemForm from './ActionItemForm';
import { DateRangePicker, Form, http, Modal, ModalError, Select, Table, TableContainer, TableDefaultHeader, TableInfo, TablePaginator, TableSearch, utility } from 'a1dms-front';
export var ActionItemStatus;
(function (ActionItemStatus) {
    ActionItemStatus[ActionItemStatus["open"] = 0] = "open";
    ActionItemStatus[ActionItemStatus["inProgress"] = 1] = "inProgress";
    ActionItemStatus[ActionItemStatus["closed"] = 2] = "closed";
})(ActionItemStatus || (ActionItemStatus = {}));
export default class Closeout extends TableContainer {
    constructor(props) {
        super(props);
        this.getContextMenu = (row) => {
            return [
                {
                    label: "Edit",
                    icon: React.createElement("i", { className: "fas fa-edit" }),
                    action: () => this.showEdit(row)
                }
            ];
        };
        let state = this.state;
        state.showDatePicker = false;
        state.dateFrom = DateRangePicker.getRange("cm")[0];
        state.pageTitle = "Close-out report (action items data)";
        this.onFieldValueChanged("from", [this.state.dateFrom]);
    }
    render() {
        return (React.createElement("div", null,
            React.createElement(Modal, { height: 270, header: "Select range", visible: this.state.showDatePicker, onClose: () => this.setState({ showDatePicker: false }) },
                React.createElement(DateRangePicker, { onChange: (from, to) => this.dateRangeSelected(from, to) })),
            React.createElement(Modal, { visible: this.state.editFormVisible, loading: this.state.editFormLoading, width: 1060, onClose: () => {
                    ActionItemForm.clear();
                    this.setState({ editFormVisible: false });
                } },
                React.createElement(ActionItemForm, { actionItem: this.state.actionItem, currentDate: this.state.currentDate, onClose: () => {
                        ActionItemForm.clear();
                        this.setState({ editFormVisible: false });
                    }, onSend: () => this.setState({ editFormLoading: true }), onSuccess: res => {
                        ActionItemForm.clear();
                        this.setState({
                            editFormVisible: false,
                            updateTable: true
                        });
                    }, onError: res => {
                        if (res.errors.filter(e => !!e.field).length > 0) {
                            this.setState({
                                editFormLoading: false
                            });
                        }
                        else {
                            this.setState({
                                editFormVisible: false,
                                errorVisible: true,
                                errorMessage: res && res.errors.length > 0 ? res.errors[0].text : Form.unknownError
                            });
                        }
                    } })),
            React.createElement(ModalError, { visible: this.state.errorVisible, errors: [this.state.errorMessage], onClose: () => this.setState({ errorVisible: false }) }),
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
                    React.createElement(TablePaginator, { rowsPerPage: this.state.rowsPerPage, totalRows: this.state.totalRows, page: this.state.page, onChange: page => this.changePage(page) }))),
            React.createElement(Table, { parent: this, className: "closeout", apiUrl: "/api/reporting/closeout", columns: this.getColumns(), getContextMenu: this.getContextMenu, getAdditionalRowClass: row => row.status == "Open" ? "closeout-cell-open" : (row.status == "Closed" ? "closeout-cell-closed" : "closeout-cell-inprogress"), getAdditionalRowClassHover: row => row.status == "Open" ? "closeout-cell-open-hover" : (row.status == "Closed" ? "closeout-cell-closed-hover" : "closeout-cell-inprogress-hover") },
                React.createElement("div", { className: "closeout-top-cell" },
                    React.createElement(Switch, { onChange: () => this.toggleLang(), checked: this.state.lang == Language.rus, uncheckedIcon: React.createElement("div", { className: "switch-label" }, "eng"), checkedIcon: React.createElement("div", { className: "switch-label" }, "rus"), height: 25, width: 60 })),
                React.createElement(TableDefaultHeader, null)),
            React.createElement("div", { className: "pagination-area" + (this.state.totalRows == 0 ? " hidden" : "") },
                React.createElement("div", { className: "pagination-info" },
                    React.createElement(TableInfo, { rowsPerPage: this.state.rowsPerPage, page: this.state.page, totalRows: this.state.totalRows })),
                React.createElement("div", null,
                    React.createElement(TablePaginator, { rowsPerPage: this.state.rowsPerPage, totalRows: this.state.totalRows, page: this.state.page, onChange: page => this.changePage(page) })))));
    }
    showEdit(row) {
        this.setState({
            editFormLoading: true,
            editFormVisible: true
        });
        let handleError = () => {
            this.setState({
                editFormLoading: false,
                editFormVisible: false,
                errorVisible: true,
                errorMessage: "Failed to retrieve card data"
            });
        };
        http.fetch("/api/date")
            .then(res => {
            if (res.status == "ok") {
                let date = res.data.split("T")[0];
                http.fetch("/api/actionitems/" + row.id)
                    .then(res => {
                    if (res.status == "ok") {
                        this.setState({
                            editFormLoading: false,
                            actionItem: res.data,
                            currentDate: date
                        });
                    }
                    else
                        handleError();
                })
                    .catch(() => handleError());
            }
            else
                handleError();
        })
            .catch(() => handleError());
    }
    toggleLang() {
        let lang = Language.rus;
        if (this.state.lang == Language.rus)
            lang = Language.eng;
        this.setState({ lang });
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
        let getColumn = (label, internalName = null, sortable = false, filterable = false, searchable = false, map = null, headerCellClass = null) => {
            if (!internalName)
                internalName = label;
            let column = {
                label,
                internalName,
                sortable,
                filterable,
                searchable,
                map,
                headerCellClass
            };
            column.onDoubleClick = row => this.showEdit(row);
            return column;
        };
        let getStringByLang = (text, lang) => React.createElement(React.Fragment, null, text ? text.split("{-DELIM-}")[lang == Language.rus ? 1 : 0] : "");
        return [
            getColumn("Site", "site", true, true, true),
            getColumn("Date", "date", true, true, false, row => React.createElement("span", null, utility.convertDate(row.date))),
            getColumn("Observer Name", "name", true, true, true),
            getColumn("Company", "company", true, true, true),
            getColumn("Observer Department", "department", true, true, true),
            getColumn("Description", "description", false, false, true, row => getStringByLang(row.description, this.state.lang)),
            getColumn("Actions Taken", "actionsTaken", false, false, true, row => getStringByLang(row.actionsTaken, this.state.lang)),
            getColumn("Specific Location", "location", false, false, true, row => getStringByLang(row.location, this.state.lang)),
            getColumn("Actions Suggested", "suggestedFurtherActions", false, false, true, row => getStringByLang(row.suggestedFurtherActions, this.state.lang)),
            getColumn("Status", "status", true, true, true, null, "closeout-header-cell"),
            getColumn("Further Actions", "furtherActions", false, false, true, null, "closeout-header-cell"),
            getColumn("Responsible Party", "responsible", true, true, true, null, "closeout-header-cell"),
            getColumn("Target Date", "targetDate", true, true, false, row => React.createElement("span", null, utility.convertDate(row.targetDate)), "closeout-header-cell"),
            getColumn("Closeout Comments", "closeoutComments", false, false, true, null, "closeout-header-cell"),
            getColumn("Closed by", "closedBy", true, true, true, null, "closeout-header-cell"),
            getColumn("Date of Closure", "closureDate", true, true, false, row => React.createElement("span", null, utility.convertDate(row.closureDate)), "closeout-header-cell")
        ];
    }
}
//# sourceMappingURL=Closeout.js.map
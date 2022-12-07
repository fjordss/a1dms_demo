import React from 'react';
import { app } from './ManagementApp';
import Switch from 'react-switch';
import CardDetails, { Language } from './CardDetails';
import { DateRangePicker, Form, http, Modal, ModalError, Select, Table, TableContainer, TableDefaultHeader, TableInfo, TablePaginator, TableSearch, utility } from 'a1dms-front';
import { HttpMethod } from 'a1dms-front';
export default class Cards extends TableContainer {
    constructor(props) {
        super(props);
        this.getContextMenu = (row) => {
            return [
                {
                    label: "Nominate",
                    icon: React.createElement("i", { className: "fas fa-vote-yea" }),
                    action: () => this.showNominationSelector(row)
                },
                {
                    label: "Details",
                    icon: React.createElement("i", { className: "fas fa-info-circle" }),
                    action: () => this.showDetails(row)
                },
                {
                    label: "Edit",
                    icon: React.createElement("i", { className: "fas fa-edit" }),
                    action: () => location.href = "/index?id=" + row.id
                }
            ];
        };
        let state = this.state;
        state.showDatePicker = false;
        state.dateFrom = DateRangePicker.getRange("cm")[0];
        state.pageTitle = "NGH Cards";
        state.detailsVisible = false;
        state.detailsLoading = false;
        state.nominationSelectorVisible = false;
        state.nominationLoading = false;
        state.errorVisible = false;
        this.onFieldValueChanged("from", [this.state.dateFrom]);
    }
    render() {
        return (React.createElement("div", null,
            React.createElement(Modal, { header: "Select range", height: 270, visible: this.state.showDatePicker, onClose: () => this.setState({ showDatePicker: false }) },
                React.createElement(DateRangePicker, { onChange: (from, to) => this.dateRangeSelected(from, to) })),
            React.createElement(Modal, { visible: this.state.detailsVisible, loading: this.state.detailsLoading, width: 900, onClose: () => this.setState({ detailsVisible: false }) },
                React.createElement(CardDetails, { card: this.state.details })),
            React.createElement(Modal, { visible: this.state.nominationSelectorVisible, loading: this.state.nominationLoading, width: 400, height: 240, header: "Select category", onClose: () => this.setState({ nominationSelectorVisible: false }) },
                React.createElement(Select, { options: app.nominationCategories, onChange: values => this.categorySelected(values[0]), dropdownWidth: "500px", values: this.state.nominationCategory ? [this.state.nominationCategory] : null })),
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
            React.createElement(Table, { parent: this, className: "cards", apiUrl: "/api/cards", columns: this.getColumns(), getContextMenu: this.getContextMenu },
                React.createElement("div", { className: "cards-top-cell" },
                    React.createElement(Switch, { onChange: () => this.toggleLang(), checked: this.state.lang == Language.rus, uncheckedIcon: React.createElement("div", { className: "switch-label" }, "eng"), checkedIcon: React.createElement("div", { className: "switch-label" }, "rus"), height: 25, width: 60 })),
                React.createElement(TableDefaultHeader, null)),
            React.createElement("div", { className: "pagination-area" + (this.state.totalRows == 0 ? " hidden" : "") },
                React.createElement("div", { className: "pagination-info" },
                    React.createElement(TableInfo, { rowsPerPage: this.state.rowsPerPage, page: this.state.page, totalRows: this.state.totalRows })),
                React.createElement("div", null,
                    React.createElement(TablePaginator, { rowsPerPage: this.state.rowsPerPage, totalRows: this.state.totalRows, page: this.state.page, onChange: page => this.changePage(page) })))));
    }
    categorySelected(category) {
        this.setState({ nominationLoading: true });
        let handleError = (error = null) => {
            this.setState({
                nominationLoading: false,
                nominationSelectorVisible: false,
                errorVisible: true,
                errorMessage: error ? error : Form.unknownError
            });
        };
        let body = new Map();
        body.set("cardId", this.state.nominationCardId.toString());
        body.set("category", category);
        http.fetch("/api/nominations", HttpMethod.post, body)
            .then(res => {
            if (res.status == "ok") {
                this.setState({
                    nominationLoading: false,
                    nominationSelectorVisible: false,
                    updateTable: true
                });
            }
            else
                handleError(res.errors[0].text);
        })
            .catch(() => handleError());
    }
    showDetails(row) {
        this.setState({
            detailsLoading: true,
            detailsVisible: true
        });
        let handleError = () => {
            this.setState({
                detailsLoading: false,
                detailsVisible: false,
                errorVisible: true,
                errorMessage: "Failed to retrieve card data"
            });
        };
        http.fetch("/api/cards/" + row.id)
            .then(res => {
            if (res.status == "ok") {
                this.setState({
                    detailsLoading: false,
                    details: res.data
                });
            }
            else
                handleError();
        })
            .catch(() => handleError());
    }
    showNominationSelector(row) {
        this.setState({
            nominationSelectorVisible: true,
            nominationLoading: true,
            nominationCardId: row.id,
            nominationCategory: row.nominationCategory
        });
        let handleError = (error = null) => {
            this.setState({
                nominationLoading: false,
                nominationSelectorVisible: false,
                errorVisible: true,
                errorMessage: error ? error : Form.unknownError
            });
        };
        fetch("/api/nominations/allowed/" + row.id)
            .then(res => res.ok ? res.json() : new Error())
            .then((res) => {
            if (res.status == "ok")
                this.setState({ nominationLoading: false });
            else
                handleError(res.errors[0].text);
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
        let getColumn = (label, internalName = null, sortable = false, filterable = false, searchable = false, map = null) => {
            if (!internalName)
                internalName = label;
            return {
                label,
                internalName,
                sortable,
                filterable,
                searchable,
                map,
                onDoubleClick: row => this.showDetails(row)
            };
        };
        let convertStringList = (items) => {
            let list = [];
            for (let i = 0; i < items.length; i++) {
                list.push(React.createElement(React.Fragment, null,
                    items[i],
                    ";"));
                if (i != items.length - 1)
                    list.push(React.createElement("br", null));
            }
            return list;
        };
        let getStringByLang = (text, lang) => React.createElement(React.Fragment, null, text ? text.split("{-DELIM-}")[lang == Language.rus ? 1 : 0] : "");
        let getAdditionalCellClass = (row) => row.nominationCategory || row.nominatedBy ? "tv-cell-nominated-card" : "";
        let nomination = getColumn("Nomination", "nominationCategory", true, true, true);
        nomination.getAdditionalCellClass = getAdditionalCellClass;
        nomination.onDoubleClick = row => this.showNominationSelector(row);
        let nominatedBy = getColumn("Nominated by", "nominatedBy", true, true, true);
        nominatedBy.getAdditionalCellClass = getAdditionalCellClass;
        nominatedBy.onDoubleClick = row => this.showNominationSelector(row);
        return [
            getColumn("Card #", "id", true, false, true),
            getColumn("Date", "date", true, true, false, row => React.createElement("span", null, utility.convertDate(row.date, true))),
            getColumn("Site", "site", true, true, true),
            getColumn("Company", "company", true, true, true),
            getColumn("Department", "department", true, true, true),
            getColumn("Name", "employee", true, false, true),
            getColumn("Report Type", "reportType", true, true, true),
            getColumn("Life Saving Actions", "lifeSavingActions", true, true, true),
            getColumn("Categories", "hazardID", false, true, true, row => convertStringList(row.hazardID)),
            getColumn("Safe Choice Categories", "safeChoice", false, true, true, row => convertStringList(row.safeChoice)),
            getColumn("Description", "description", false, false, true, row => getStringByLang(row.description, this.state.lang)),
            getColumn("Actions Taken", "actionsTaken", false, false, true, row => getStringByLang(row.actionsTaken, this.state.lang)),
            getColumn("Location", "location", false, false, true, row => getStringByLang(row.location, this.state.lang)),
            getColumn("Suggested Actions", "furtherActions", false, false, true, row => getStringByLang(row.furtherActions, this.state.lang)),
            nomination,
            nominatedBy
        ];
    }
}
//# sourceMappingURL=Cards.js.map
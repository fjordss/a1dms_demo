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
import Switch from 'react-switch';
import { CommonHelper, Language } from '../../../source/CommonHelper';
import { app } from '../ManagementApp';
import CardDetails from '../CardDetails';
import ModalError from '../../../components/ModalError';
export default class NominatedCards extends TableContainer {
    constructor(props) {
        super(props);
        this.getContextMenu = (row) => {
            return [
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
        state.pageTitle = "Nomination report (Nominated cards)";
        this.onFieldValueChanged("from", [this.state.dateFrom]);
    }
    render() {
        return (React.createElement("div", null,
            React.createElement(Modal, { height: 270, header: "Select range", visible: this.state.showDatePicker, onClose: () => this.setState({ showDatePicker: false }) },
                React.createElement(DateRangePicker, { onChange: (from, to) => this.dateRangeSelected(from, to) })),
            React.createElement(Modal, { visible: this.state.detailsVisible, loading: this.state.detailsLoading, width: 900, onClose: () => this.setState({ detailsVisible: false }) },
                React.createElement(CardDetails, { card: this.state.details })),
            React.createElement(ModalError, { visible: this.state.errorVisible, errors: [this.state.errorMessage], onClose: () => this.setState({ errorVisible: false }) }),
            React.createElement("div", { className: "report-search-area" },
                React.createElement("div", { className: "report-search-left" },
                    React.createElement(Select, { options: app.sites.map(s => s.text), multiple: true, placeholder: "Select sites...", width: 200, onChange: v => this.onFieldValueChanged("sites", v) })),
                React.createElement("div", { className: "report-search-left" },
                    React.createElement(Select, { options: app.companies.map(s => s.text), multiple: true, placeholder: "Select companies...", width: 200, onChange: v => this.onFieldValueChanged("companies", v) })),
                React.createElement("div", { className: "report-search-left" },
                    React.createElement(Select, { options: app.departments.map(s => s.text), multiple: true, placeholder: "Select departments...", width: 200, onChange: v => this.onFieldValueChanged("departments", v) })),
                React.createElement("div", { className: "report-search-left" },
                    React.createElement(Select, { options: app.nominationCategories, multiple: true, placeholder: "Select categories...", width: 200, dropdownWidth: "500px", onChange: v => this.onFieldValueChanged("categories", v) })),
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
            React.createElement(Table, { parent: this, className: "nominatedcards", apiUrl: "/api/reporting/nominatedcards", columns: this.getColumns(), getContextMenu: this.getContextMenu },
                React.createElement("div", { className: "nominatedcards-top-cell" },
                    React.createElement(Switch, { onChange: () => this.toggleLang(), checked: this.state.lang == Language.rus, uncheckedIcon: React.createElement("div", { className: "switch-label" }, "eng"), checkedIcon: React.createElement("div", { className: "switch-label" }, "rus"), height: 25, width: 60 })),
                React.createElement(TableDefaultHeader, null)),
            React.createElement("div", { className: "pagination-area" + (this.state.totalRows == 0 ? " hidden" : "") },
                React.createElement("div", { className: "pagination-info" },
                    React.createElement(TableInfo, { rowsPerPage: this.state.rowsPerPage, page: this.state.page, totalRows: this.state.totalRows })),
                React.createElement("div", null,
                    React.createElement(TablePaginartor, { rowsPerPage: this.state.rowsPerPage, totalRows: this.state.totalRows, page: this.state.page, onChange: page => this.changePage(page) })))));
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
        CommonHelper.fetch("/api/cards/" + row.id)
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
            let column = {
                label,
                internalName,
                sortable,
                filterable,
                searchable,
                map
            };
            column.onDoubleClick = row => this.showDetails(row);
            return column;
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
        let nomination = getColumn("Nomination", "nominationCategory", true, true, true);
        nomination.getAdditionalCellClass = (row) => row.nominationCategory ? "tv-cell-nominated-card" : "";
        return [
            getColumn("Card #", "id", true, false, true),
            getColumn("Date", "date", true, true, false, row => React.createElement("span", null, CommonHelper.convertDate(row.date, true))),
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
            nomination
        ];
    }
}
//# sourceMappingURL=NominatedCards.js.map
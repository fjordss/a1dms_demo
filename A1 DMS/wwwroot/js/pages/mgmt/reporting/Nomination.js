import React from 'react';
import Access from '../../../components/Access';
import Form from '../../../components/Form';
import Modal from '../../../components/Modal';
import ModalError from '../../../components/ModalError';
import Select from '../../../components/Select';
import Table from '../../../components/Table';
import TableContainer from '../../../components/TableContainer';
import TableDefaultHeader from '../../../components/TableDefaultHeader';
import TableInfo from '../../../components/TableInfo';
import TablePaginartor from '../../../components/TablePaginator';
import TableSearch from '../../../components/TableSearch';
import { CommonHelper, HttpMethod } from '../../../source/CommonHelper';
import CardDetails from '../CardDetails';
import { app } from '../ManagementApp';
import { UserService } from '../users/Users';
export default class Nomination extends TableContainer {
    constructor(props) {
        super(props);
        this.columns = [];
        this.getContextMenu = (row) => {
            let items = [];
            items.push({
                label: "Details",
                icon: React.createElement("i", { className: "fas fa-info-circle" }),
                action: () => this.showDetails(row)
            });
            if (this.state.stage == 1 || this.state.stage == 2) {
                items.push({
                    label: "Change category",
                    icon: React.createElement("i", { className: "fas fa-vote-yea" }),
                    action: () => this.showNominationSelector(row)
                });
                items.push({
                    label: "Exclude from Report",
                    icon: React.createElement("i", { className: "fas fa-trash-alt" }),
                    action: () => this.excludeCards(row.id)
                });
            }
            else if (this.state.stage == 3 && this.isVotingUser) {
                items.push({
                    label: row.stage3VoteMade ? "Down Vote" : "Up Vote",
                    icon: React.createElement("i", { className: "fas fa-vote-yea" }),
                    action: () => row.stage3VoteMade ? this.unsetVote(row) : this.setVote(row)
                });
            }
            else if (this.state.stage == 4 && this.isSSHEUser) {
                if (row.isWinner) {
                    items.push({
                        label: "Remove Winner Status",
                        icon: React.createElement("i", { className: "fas fa-trash-alt" }),
                        action: () => this.unsetWinner(row)
                    });
                }
                else {
                    items.push({
                        label: "Set as a Winner",
                        icon: React.createElement("i", { className: "fas fa-trophy" }),
                        action: () => this.setWinner(row)
                    });
                    items.push({
                        label: "Up Vote",
                        icon: React.createElement("i", { className: "fas fa-vote-yea" }),
                        action: () => this.offsetVote(row, 1)
                    });
                    items.push({
                        label: "Down Vote",
                        icon: React.createElement("i", { className: "fas fa-vote-yea" }),
                        action: () => this.offsetVote(row, -1)
                    });
                }
            }
            return items;
        };
        this.setVote = row => this.vote(row, true);
        this.unsetVote = (row) => this.vote(row, false);
        this.setWinner = row => this.winner(row, true);
        this.unsetWinner = (row) => this.winner(row, false);
        this.changeStage = () => {
            if (this.state.selectedStage && this.state.selectedStage != this.state.stage) {
                let params = new Map();
                params.set("stage", this.state.selectedStage.toString());
                CommonHelper.fetch("/api/reporting/nomination/" + this.state.reportId + "/changestage", HttpMethod.put, params)
                    .then(res => {
                    if (res.status == "ok")
                        this.setState({ updateTable: true });
                    else
                        this.handleError(res.errors[0].text);
                })
                    .catch(() => this.handleError());
            }
        };
        this.excludeCards = (cardId = null) => {
            let selected = this.state.rows.filter(row => row.selected);
            if ((selected.length > 0 || cardId != null) && confirm("Do you want to exclude selected cards from the report?")) {
                let params = new Map();
                params.set("cardIds", cardId != null ? [cardId.toString()] : this.state.rows.filter(row => row.selected).map(row => row.id.toString()));
                CommonHelper.fetch("/api/reporting/nomination/" + this.state.reportId + "/exclude", HttpMethod.delete, params)
                    .then(res => {
                    if (res.status == "ok")
                        this.setState({ updateTable: true });
                    else
                        this.handleError();
                })
                    .catch(() => this.handleError());
            }
        };
        this.setReportData = (res) => {
            if (res.status == "ok") {
                if (res.data.from && res.data.to) {
                    this.setState({
                        reportId: res.data.reportId,
                        rows: res.data.rows,
                        from: this.convertDate(res.data.from),
                        to: this.convertDate(res.data.to),
                        stage: res.data.stage,
                        selectedStage: 0
                    });
                }
                else {
                }
            }
        };
        this.isSSHEUser = UserService.correspondsPolicy("nominationSSHEUser");
        this.isVotingUser = UserService.correspondsPolicy("nominationVotingUser");
    }
    render() {
        this.columns = this.getColumns();
        if (!this.state.query.has("site"))
            this.onFieldValueChanged("site", [app.sites[0].text]);
        let categories = ["All"];
        categories = categories.concat(app.nominationCategories);
        return (React.createElement("div", null,
            React.createElement(Access, { policy: "nomination" }),
            React.createElement(Modal, { visible: this.state.detailsVisible, loading: this.state.detailsLoading, width: 900, onClose: () => this.setState({ detailsVisible: false }) },
                React.createElement(CardDetails, { card: this.state.details })),
            React.createElement(Modal, { visible: this.state.nominationSelectorVisible, loading: this.state.nominationLoading, width: 400, height: 240, header: "Select category", onClose: () => this.setState({ nominationSelectorVisible: false }) },
                React.createElement(Select, { options: app.nominationCategories, dropdownWidth: "500px", onChange: values => this.categorySelected(values[0]), values: this.state.nominationCategory ? [this.state.nominationCategory] : null })),
            React.createElement(ModalError, { visible: this.state.errorVisible, errors: [this.state.errorMessage], onClose: () => this.setState({ errorVisible: false }) }),
            React.createElement("div", { className: "report-search-area" },
                React.createElement("div", { className: "report-search-left nomination-date-range" },
                    React.createElement("span", null, (this.state.from && this.state.to) ? this.state.from + " - " + this.state.to : "")),
                React.createElement("div", { className: "report-search-left" },
                    React.createElement(Select, { options: app.sites.map(s => s.text), selectFirst: true, placeholder: "Select site...", width: 200, onChange: v => this.onFieldValueChanged("site", v) })),
                React.createElement("div", { className: "report-search-left" },
                    React.createElement(Select, { options: categories, selectFirst: true, placeholder: "Select category...", width: 200, dropdownWidth: "500px", onChange: v => v[0] != "All" ? this.onFieldValueChanged("category", v) : this.state.query.delete("category") })),
                React.createElement("div", { className: "report-search-left" },
                    React.createElement("button", { onClick: () => this.getReport() }, "Get Report")),
                React.createElement("div", { className: "report-search-space" }),
                React.createElement("div", { className: "report-search-right" },
                    React.createElement(TableSearch, { parent: this }))),
            React.createElement("div", { className: "pagination-area" + (this.state.totalRows == 0 ? " hidden" : "") },
                React.createElement("div", { className: "pagination-info" },
                    React.createElement(TableInfo, { rowsPerPage: this.state.rowsPerPage, page: this.state.page, totalRows: this.state.totalRows })),
                React.createElement("div", { className: "nomination-top-paginator" },
                    this.isSSHEUser ?
                        React.createElement(React.Fragment, null,
                            React.createElement(Select, { onChange: values => this.setState({ selectedStage: parseInt(values[0]) }), values: this.state.selectedStage ? [this.state.selectedStage.toString()] : (this.state.stage ? [this.state.stage.toString()] : null), options: this.getStages(), selectFirst: true, width: 200 }),
                            React.createElement("button", { onClick: this.changeStage }, "Save")) :
                        React.createElement(React.Fragment, null),
                    React.createElement(TablePaginartor, { rowsPerPage: this.state.rowsPerPage, totalRows: this.state.totalRows, page: this.state.page, onChange: page => this.changePage(page) }))),
            React.createElement(Table, { onDataLoaded: this.setReportData, parent: this, className: this.getClass(), apiUrl: "/api/reporting/nomination", columns: this.columns, getContextMenu: this.getContextMenu },
                this.state.stage == 1 || this.state.stage == 2 ?
                    React.createElement("div", { className: "nomination-top-cell" },
                        React.createElement("i", { className: "fas fa-trash-alt", onClick: () => this.excludeCards() })) :
                    React.createElement(React.Fragment, null),
                React.createElement(TableDefaultHeader, null)),
            React.createElement("div", { className: "pagination-area" + (this.state.totalRows == 0 ? " hidden" : "") },
                React.createElement("div", { className: "pagination-info" },
                    React.createElement(TableInfo, { rowsPerPage: this.state.rowsPerPage, page: this.state.page, totalRows: this.state.totalRows })),
                React.createElement("div", null,
                    React.createElement(TablePaginartor, { rowsPerPage: this.state.rowsPerPage, totalRows: this.state.totalRows, page: this.state.page, onChange: page => this.changePage(page) })))));
    }
    offsetVote(row, offset) {
        let params = new Map();
        params.set("offset", offset.toString());
        CommonHelper.fetch("/api/reporting/nomination/" + this.state.reportId + "/offsetvote/" + row.id, HttpMethod.put, params)
            .then(res => {
            if (res.status == "ok")
                this.setState({ updateTable: true });
            else
                this.handleError(res.errors[0].text);
        })
            .catch(() => this.handleError());
    }
    vote(row, set) {
        CommonHelper.fetch("/api/reporting/nomination/" + this.state.reportId + "/" + (set ? "set" : "unset") + "vote/" + row.id, HttpMethod.put)
            .then(res => {
            if (res.status == "ok")
                this.setState({ updateTable: true });
            else
                this.handleError(res.errors[0].text);
        })
            .catch(() => this.handleError());
    }
    winner(row, set) {
        CommonHelper.fetch("/api/reporting/nomination/" + this.state.reportId + "/" + (set ? "set" : "unset") + "winner/" + row.id, HttpMethod.put)
            .then(res => {
            if (res.status == "ok")
                this.setState({ updateTable: true });
            else
                this.handleError(res.errors[0].text);
        })
            .catch(() => this.handleError());
    }
    categorySelected(category) {
        let handleError = () => {
            this.setState({
                nominationSelectorVisible: false,
                errorVisible: true,
                errorMessage: Form.unknownError
            });
        };
        let params = new Map();
        params.set("category", category);
        CommonHelper.fetch("/api/reporting/nomination/" + this.state.reportId + "/setcategory/" + this.state.nominationCardId, HttpMethod.put, params)
            .then(res => {
            if (res.status == "ok") {
                this.setState({
                    nominationSelectorVisible: false,
                    updateTable: true
                });
            }
            else
                handleError();
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
    showNominationSelector(row) {
        this.setState({
            nominationSelectorVisible: true,
            nominationLoading: true,
            nominationCardId: row.id
        });
        let handleError = () => {
            this.setState({
                nominationLoading: false,
                nominationSelectorVisible: false,
                errorVisible: true,
                errorMessage: Form.unknownError
            });
        };
        CommonHelper.fetch("/api/cards/" + row.id)
            .then(res => {
            if (res.status == "ok")
                this.setState({
                    nominationLoading: false,
                    nominationCategory: res.data.nominationCategory
                });
            else
                handleError();
        })
            .catch(() => handleError());
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
    onFieldValueChanged(field, values) {
        this.state.query.set(field, values);
    }
    convertDate(date) {
        let parts = date.split("T")[0].split("-");
        return parts[1] + "/" + parts[2] + "/" + parts[0];
    }
    getStages() {
        return [
            { value: "1", text: "Stage 1" },
            { value: "2", text: "Stage 2" },
            { value: "3", text: "Stage 3" },
            { value: "4", text: "Stage 4", disabled: this.state.stage == 1 || this.state.stage == 2 },
            { value: "5", text: "Closed", disabled: this.state.stage == 1 || this.state.stage == 2 || this.state.stage == 3 }
        ];
    }
    getClass() {
        if (this.state.stage == 1 || this.state.stage == 2)
            return "nomination12";
        else if (this.state.stage == 3)
            return "nomination3";
        return "nomination";
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
            if (this.state.stage == 1 || this.state.stage == 2)
                column.onClick = row => row.selected = !row.selected;
            if (internalName == "nominationCategory") {
                if (this.state.stage == 3 && this.isVotingUser)
                    column.getAdditionalCellClass = row => row.stage3VoteMade ? "nomination-category-cell-voted" : "nomination-category-cell";
                else if (this.state.stage == 4 || this.state.stage == 5)
                    column.getAdditionalCellClass = row => row.isWinner ? "nomination-category-cell-winner" : "nomination-category-cell";
                else
                    column.getAdditionalCellClass = () => "nomination-category-cell";
                if (this.state.stage == 1 || this.state.stage == 2)
                    column.onDoubleClick = row => this.showNominationSelector(row);
                else if (this.state.stage == 3 && this.isVotingUser)
                    column.onDoubleClick = row => row.stage3VoteMade ? this.unsetVote(row) : this.setVote(row);
                else if (this.state.stage == 4 && this.isSSHEUser)
                    column.onDoubleClick = row => row.isWinner ? this.unsetWinner(row) : this.setWinner(row);
                else
                    column.onDoubleClick = row => this.showDetails(row);
            }
            else {
                column.getAdditionalCellClass = row => row.selected ? "nomination-cell-selected" : "";
                column.onDoubleClick = row => this.showDetails(row);
            }
            return column;
        };
        let columns = [
            getColumn("Description", "description", false, false, true),
            getColumn("Actions Taken", "actionsTaken", false, false, true),
            getColumn("Suggested Actions", "furtherActions", false, false, true),
            getColumn("Description (rus)", "descriptionRus", false, false, true),
            getColumn("Actions Taken (rus)", "actionsTakenRus", false, false, true),
            getColumn("Suggested Actions (rus)", "furtherActionsRus", false, false, true),
            getColumn("Nomination's Category", "nominationCategory", true, true, true)
        ];
        if (this.state.stage == 1 || this.state.stage == 2) {
            let column = getColumn("", "id");
            column.map = row => React.createElement("input", { type: "checkbox", checked: !!row.selected });
            columns.unshift(column);
        }
        else if ((this.state.stage == 3 && this.isSSHEUser) || this.state.stage == 4) {
            let column = getColumn("Votes S2", "votesNumberStage3", true, true, true);
            column.getAdditionalCellClass = row => (this.state.stage == 4 && row.isWinner) ? "nomination-category-cell-winner" : "nomination-category-cell";
            columns.push(column);
        }
        return columns;
    }
    handleError(error = null) {
        this.setState({
            errorVisible: true,
            errorMessage: error ? error : Form.unknownError
        });
    }
}
//# sourceMappingURL=Nomination.js.map
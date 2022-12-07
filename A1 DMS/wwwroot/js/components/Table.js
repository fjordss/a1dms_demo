import React from 'react';
import { Redirect } from 'react-router-dom';
import TableContextMenu from './TableContextMenu';
import TableDefaultHeader from './TableDefaultHeader';
export var TableSortType;
(function (TableSortType) {
    TableSortType[TableSortType["asc"] = 0] = "asc";
    TableSortType[TableSortType["desc"] = 1] = "desc";
})(TableSortType || (TableSortType = {}));
export default class Table extends React.Component {
    constructor(props) {
        super(props);
        this.tableState = 0;
        this.rows = [];
        this.contextMenuCalled = false;
        this.closeContextMenu = () => {
            if (this.contextMenuCalled) {
                this.contextMenuCalled = false;
                return;
            }
            this.rows.forEach(row => row.contextMenuVisible = false);
            this.setState({});
        };
        this.onFilterApply = (field, choices) => {
            let filtering = this.state.filtering;
            let existing = filtering.find(f => f.field == field);
            if (!existing) {
                filtering.push({
                    field,
                    choices
                });
            }
            else
                existing.choices = choices;
            this.tableState = 1;
            this.setState({ filtering });
        };
        this.onFilterReset = (field) => {
            let filtering = this.state.filtering.filter(f => f.field != field);
            this.tableState = 1;
            this.setState({ filtering });
        };
        this.onSortApply = (field, order) => {
            this.tableState = 1;
            this.setState({
                sort: {
                    field,
                    order
                }
            });
        };
        this.onSearchApply = (field, text) => {
            let search = this.state.search;
            if (text != null && typeof (text) != "undefined")
                text = text.trim();
            if (text) {
                let existing = search.find(f => f.field == field);
                if (!existing) {
                    search.push({
                        field,
                        text
                    });
                }
                else
                    existing.text = text;
            }
            else {
                search = search.filter(s => s.field != field);
            }
            this.tableState = 1;
            this.setState({ search });
        };
        this.rowHover = (e, remove = false) => {
            let element = e.currentTarget;
            let className = element.classList.contains("tv-even") ? "tv-even" : "tv-uneven";
            let elements = [element];
            let current = element.nextElementSibling;
            while (current && current.classList.contains(className)) {
                elements.push(current);
                current = current.nextElementSibling;
            }
            current = element.previousElementSibling;
            while (current && current.classList.contains(className)) {
                elements.push(current);
                current = current.previousElementSibling;
            }
            let hoverClass = "tv-row-hover";
            if (this.props.getAdditionalRowClassHover) {
                let id = parseInt(elements[elements.length - 1].querySelector("input[type=hidden]").value);
                let row = this.rows.find(r => r.id == id);
                if (row)
                    hoverClass = this.props.getAdditionalRowClassHover(row);
            }
            for (let element of elements)
                !remove ? element.classList.add(hoverClass) : element.classList.remove(hoverClass);
        };
        this.rows = [];
        this.tableState = this.props.apiUrl ? 1 : 0;
        this.state = {
            filterChoices: [],
            totals: [],
            filtering: [],
            search: [],
            sort: null,
            redirectUrl: null
        };
    }
    render() {
        if (this.props.parent && this.props.parent.state.updateTable) {
            this.tableState = 1;
            this.props.parent.setState({ updateTable: false });
        }
        if (this.props.apiUrl && this.tableState == 1)
            this.getData();
        let css = { gridTemplateColumns: (this.props.getContextMenu ? "auto 7px " : "") + "repeat(" + (this.props.columns.length + (this.props.getContextMenu ? -1 : 0)) + ", auto)" };
        let prealoaderCss = this.getPrealoaderCss();
        this.elementRef = React.createRef();
        let header = [];
        let children = [];
        if (this.props.children) {
            if (Array.isArray(this.props.children))
                children = this.props.children.map(c => c);
            else
                children.push(this.props.children);
            children.forEach(child => {
                if (typeof (child.type) === "string")
                    header.push(child);
                else if (child.type.name == "TableDefaultHeader")
                    header.push(this.getDefaultHeader(child.props));
            });
        }
        else
            header.push(this.getDefaultHeader());
        return (React.createElement("div", { style: css, className: this.getClassName(), ref: this.elementRef },
            this.state.redirectUrl != null ? React.createElement(Redirect, { to: this.state.redirectUrl }) : React.createElement(React.Fragment, null),
            header,
            this.tableState == 1 ?
                React.createElement("div", { className: this.getClassName("loading-cell"), style: prealoaderCss }, "Loading, please wait...") :
                this.rows.map((row, i) => this.getCells(row, i % 2 == 0)),
            this.state.totals.length > 0 ?
                this.getTotals() :
                React.createElement(React.Fragment, null)));
    }
    componentDidMount() {
        document.body.addEventListener("click", this.closeContextMenu);
    }
    componentWillUnmount() {
        document.body.removeEventListener("click", this.closeContextMenu);
    }
    getContextMenu(row) {
        return React.createElement(TableContextMenu, { items: this.props.getContextMenu(row), className: this.props.className, onRedirect: redirectUrl => this.setState({ redirectUrl }) });
    }
    getDefaultHeader(props = null) {
        return React.createElement(TableDefaultHeader, { className: this.props.className, hasContextMenu: !!this.props.getContextMenu, columns: this.props.columns, filtersLoaded: this.tableState == 3, filterChoices: this.state.filterChoices, filtering: this.state.filtering, sort: this.state.sort, search: this.state.search, onFilterApply: this.onFilterApply, onFilterReset: this.onFilterReset, onSortApply: this.onSortApply, onSearchApply: this.onSearchApply }, props && props.children ? props.children : null);
    }
    getTotals() {
        return this.props.columns.map((col, i) => {
            let total = this.state.totals.find(t => t.field == col.internalName);
            let cellClass = col.headerCellClass;
            return React.createElement("div", { className: this.getClassName("total-cell") + (cellClass ? " " + cellClass : "") }, total ? total.total : "");
        });
    }
    getCells(row, even) {
        let cells = [];
        let rowClass = "";
        if (this.props.getAdditionalRowClass)
            rowClass = this.props.getAdditionalRowClass(row);
        this.props.columns.map((col, i) => {
            if (this.props.getContextMenu && i == 1) {
                cells.push(React.createElement("div", { className: this.getClassName("cell-menu") + (even ? " tv-even" : " tv-uneven") + (rowClass ? " " + rowClass : ""), onClick: () => this.callContextMenu(row) },
                    React.createElement("i", { className: "fas fa-ellipsis-v" }),
                    row.contextMenuVisible ? this.getContextMenu(row) : React.createElement(React.Fragment, null)));
            }
            let cellClass = "";
            if (col.getAdditionalCellClass)
                cellClass = col.getAdditionalCellClass(row, col.internalName);
            cells.push(React.createElement("div", { className: this.getClassName("cell") + (even ? " tv-even" : " tv-uneven") + (cellClass ? " " + cellClass : "") + (rowClass ? " " + rowClass : ""), onMouseEnter: e => this.rowHover(e), onMouseLeave: e => this.rowHover(e, true), onClick: col.onClick ? () => col.onClick(row) : null, onDoubleClick: col.onDoubleClick ? () => col.onDoubleClick(row) : null },
                i == 0 ? React.createElement("input", { type: "hidden", value: row.id }) : React.createElement(React.Fragment, null),
                col.map ? col.map(row) : row[col.internalName]));
        });
        return cells;
    }
    callContextMenu(row) {
        this.rows.forEach(row => row.contextMenuVisible = false);
        row.contextMenuVisible = true;
        this.contextMenuCalled = true;
        this.setState({});
    }
    getPrealoaderCss() {
        let preloaderCss = {};
        preloaderCss.gridColumn = "span " + (this.props.columns.length + (this.props.getContextMenu ? 1 : 0));
        if (this.tableState == 1 && this.elementRef && this.elementRef.current.children.length > 2) {
            let cells = this.elementRef.current.children;
            let first = cells[0];
            let last = cells[cells.length - 1];
            preloaderCss.height = (last.offsetTop + last.offsetHeight) - (first.offsetTop + first.offsetHeight) + "px";
        }
        return preloaderCss;
    }
    onDataLoaded(res) {
        if (this.props.onDataLoaded)
            this.props.onDataLoaded(res);
        let data = res.data;
        this.tableState = 2;
        this.rows = data.rows;
        if (this.props.parent) {
            this.props.parent.setState({
                totalRows: data.totalRows,
                rowsPerPage: data.rowsPerPage
            });
        }
        if (data.totalRows > 0 && data.rows.length == 0) {
            let pagesCount = ~~(data.totalRows / data.rowsPerPage) + (data.totalRows % data.rowsPerPage > 0 ? 1 : 0);
            if (this.props.parent) {
                this.props.parent.setState({
                    page: pagesCount,
                    updateTable: true
                });
            }
        }
        else if (this.tableState != 3) {
            let needFilterings = this.props.columns.filter(c => c.filterable).length > 0;
            let needTotals = this.props.columns.filter(c => c.hasTotal).length > 0;
            let filteringsResult = [];
            let totalsResult = [];
            let count = (needFilterings ? 1 : 0) + (needTotals ? 1 : 0);
            let counter = 0;
            let handleResult = () => {
                if (++counter == count) {
                    this.setState({
                        filterChoices: filteringsResult,
                        totals: totalsResult
                    });
                }
            };
            if (needFilterings) {
                let filteringsPromise = fetch(this.getUrl(this.props.apiUrl + "/filterings")).then(r => r.json());
                filteringsPromise.then(res => {
                    let filterChoices = res.data;
                    filterChoices.forEach(filtering => filtering.choices = filtering.choices.map(c => c != null && typeof (c) !== "undefined" ? c.toString() : ""));
                    filteringsResult = filterChoices;
                    handleResult();
                });
            }
            if (needTotals) {
                let totalsPromise = fetch(this.getUrl(this.props.apiUrl + "/totals")).then(r => r.json());
                totalsPromise.then(res => {
                    let totals = res.data;
                    totalsResult = totals;
                    handleResult();
                });
            }
        }
    }
    getData() {
        fetch(this.getUrl(this.props.apiUrl))
            .then(r => r.json())
            .then(data => this.onDataLoaded(data))
            .catch(e => console.error(e));
    }
    getUrl(base) {
        let add = [];
        if (this.state.filtering)
            add.push("filtering=" + encodeURIComponent(JSON.stringify(this.state.filtering)));
        if (this.state.sort)
            add.push("sort=" + encodeURIComponent(JSON.stringify(this.state.sort)));
        if (this.state.search)
            add.push("search=" + encodeURIComponent(JSON.stringify(this.state.search)));
        if (this.props.parent && this.props.parent.state.search)
            add.push("searchEverywhere=" + encodeURIComponent(this.props.parent.state.search));
        if (this.props.parent && this.props.parent.state.page)
            add.push("page=" + encodeURIComponent(this.props.parent.state.page));
        if (this.props.parent) {
            let query = this.props.parent.state.query;
            for (let key of query.keys()) {
                query.get(key).forEach(v => add.push(key + "=" + encodeURIComponent(v)));
            }
        }
        if (add.length > 0)
            base += (base.indexOf("?") == -1 ? "?" : "&") + add.join("&");
        return base;
    }
    getClassName(postfix = null) {
        let base = "tv" + (postfix ? "-" + postfix : "");
        return base + (this.props.className ? " " + base + "-" + this.props.className : "");
    }
}
//# sourceMappingURL=Table.js.map
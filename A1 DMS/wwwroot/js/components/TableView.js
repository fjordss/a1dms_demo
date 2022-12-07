import React from 'react';
import TableViewMenu from './TableViewMenu';
export var TableViewSortType;
(function (TableViewSortType) {
    TableViewSortType[TableViewSortType["asc"] = 0] = "asc";
    TableViewSortType[TableViewSortType["desc"] = 1] = "desc";
})(TableViewSortType || (TableViewSortType = {}));
export default class TableView extends React.Component {
    constructor(props) {
        super(props);
        this.tableState = 0;
        this.showFilter = (e, column) => {
            this.setState({ filterVisible: this.state.filterVisible != column.internalName ? column.internalName : null });
            e.stopPropagation();
            e.nativeEvent.stopImmediatePropagation();
        };
        this.closeFilters = () => {
            if (this.state.filterVisible)
                this.setState({ filterVisible: null });
        };
        this.props.columns.forEach(c => c.internalName = c.internalName ? c.internalName : c.label);
        this.state = {
            rows: this.props.rows ? this.props.rows : [],
            total: this.props.rows ? this.props.rows.length : 0
        };
        this.tableState = this.props.apiUrl ? 1 : 0;
    }
    render() {
        if (this.props.parent && this.props.parent.state.updateTable)
            this.tableState = 1;
        if (this.props.apiUrl && this.tableState == 1)
            this.getData();
        let css = {};
        if (!this.props.className)
            css.gridTemplateColumns = "repeat(" + this.props.columns.length + ", 1fr)";
        return (React.createElement("div", { style: css, className: this.getClassName() },
            this.props.columns.map(c => React.createElement("div", { className: this.getClassName("header-cell") },
                React.createElement("div", { className: this.getClassName("header-cell-inner") },
                    React.createElement("span", { className: this.getClassName("header-cell-label") }, c.label),
                    this.getFilterArrow(c)),
                this.state.filterVisible == c.internalName ?
                    React.createElement(TableViewMenu, { tableView: this, column: c }) :
                    React.createElement(React.Fragment, null))),
            this.tableState == 1 ?
                React.createElement("div", { className: this.getClassName("loading-cell"), style: { gridColumn: "span " + this.props.columns.length } }, "Loading, please wait...") :
                this.state.rows.map((row, i) => this.getCells(row, i % 2 == 0))));
    }
    componentDidMount() {
        document.body.addEventListener("click", this.closeFilters);
        this.unsetTableUpdate();
    }
    componentDidUpdate(a, b, c) {
        this.unsetTableUpdate();
    }
    componentWillUnmount() {
        document.body.removeEventListener("click", this.closeFilters);
    }
    unsetTableUpdate() {
        if (this.props.parent && this.props.parent.state.updateTable) {
            this.props.parent.setState({ updateTable: false });
        }
    }
    getFilterArrow(column) {
        let enlighted = this.state.filtering && this.state.filtering.filter(f => f.field == column.internalName).length > 0;
        return React.createElement("img", { src: "/images/arrowDown" + (enlighted ? "L" : "") + ".png", onClick: e => this.showFilter(e, column), className: this.getClassName("filter-arrow") + (this.tableState == 3 && (column.filterable || column.sortable) ? " tv-visible" : " tv-hidden") });
    }
    onDataLoaded(data) {
        this.tableState = 2;
        this.setState({
            rows: data.rows,
            total: data.total
        });
        if (this.props.columns.filter(c => c.filterable || c.sortable).length > 0 && this.tableState != 3) {
            let filteringsPromise = fetch(this.props.apiUrl + "/filterings").then(r => r.json());
            filteringsPromise.then(filterChoices => {
                filterChoices.forEach(filtering => {
                    filtering.choices = filtering.choices.map(c => c ? c.toString() : "");
                });
                this.tableState = 3;
                this.setState({ filterChoices });
            });
        }
    }
    getCells(row, even) {
        let cells = [];
        this.props.columns.map((col, i) => {
            cells.push(React.createElement("div", { className: this.getClassName("cell") + (even ? " tv-even" : " tv-uneven") }, row[col.internalName]));
        });
        return cells;
    }
    getData() {
        let url = this.props.apiUrl;
        let add = [];
        if (this.state.filtering)
            add.push("filtering=" + encodeURIComponent(JSON.stringify(this.state.filtering)));
        if (this.state.sort)
            add.push("sort=" + encodeURIComponent(JSON.stringify(this.state.sort)));
        if (this.props.parent && this.props.parent.state.search)
            add.push("search=" + encodeURIComponent(this.props.parent.state.search));
        if (add.length > 0)
            url += (url.indexOf("?") == -1 ? "?" : "&") + add.join("&");
        console.log(url);
        fetch(url)
            .then(r => r.json())
            .then(data => this.onDataLoaded(data))
            .catch(e => console.error(e));
    }
    getClassName(postfix = null) {
        let base = "tv" + (postfix ? "-" + postfix : "");
        return base + (this.props.className ? " " + base + "-" + this.props.className : "");
    }
}
//# sourceMappingURL=TableView.js.map
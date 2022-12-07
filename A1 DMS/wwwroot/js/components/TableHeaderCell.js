import React from 'react';
import TableMenu from './TableHeaderMenu';
export default class TableHeaderCell extends React.Component {
    constructor(props) {
        super(props);
        this.filterClicked = false;
        this.onFilterApply = (field, choices) => {
            this.setState({ showFilteringMenu: false });
            this.props.onFilterApply(field, choices);
        };
        this.onFilterReset = (field) => {
            this.setState({ showFilteringMenu: false });
            this.props.onFilterReset(field);
        };
        this.onSortApply = (field, sortType) => {
            this.setState({ showFilteringMenu: false });
            this.props.onSortApply(field, sortType);
        };
        this.onSearchApply = (field, search) => {
            this.setState({ showFilteringMenu: false });
            this.props.onSearchApply(field, search);
        };
        this.showFilter = (e, column) => {
            this.setState({ showFilteringMenu: true });
            this.filterClicked = true;
        };
        this.closeFilters = () => {
            if (this.filterClicked) {
                this.filterClicked = false;
                return;
            }
            if (this.state.showFilteringMenu)
                this.setState({ showFilteringMenu: false });
        };
        this.state = {
            showFilteringMenu: false
        };
    }
    render() {
        return (React.createElement(React.Fragment, null,
            React.createElement("div", { className: this.getClassName("header-cell") + (this.props.column.headerCellClass ? " " + this.props.column.headerCellClass : "") + (this.props.additionalClass ? " " + this.props.additionalClass : "") },
                React.createElement("div", { className: this.getClassName("header-cell-inner") },
                    React.createElement("div", { className: this.getClassName("header-cell-label") }, this.props.column.label),
                    this.getFilterArrow(this.props.column)),
                this.state.showFilteringMenu ?
                    React.createElement(TableMenu, { column: this.props.column, choices: this.props.choices, selected: this.props.selected, search: this.props.search, className: this.props.className, order: this.props.sort, filterApplied: this.props.filterApplied, onFilterApply: this.onFilterApply, onFilterReset: this.onFilterReset, onSortApply: this.onSortApply, onSearchApply: this.onSearchApply, last: this.props.last }) :
                    React.createElement(React.Fragment, null))));
    }
    componentDidMount() {
        document.body.addEventListener("click", this.closeFilters);
    }
    componentWillUnmount() {
        document.body.removeEventListener("click", this.closeFilters);
    }
    getFilterArrow(column) {
        let getClassName = () => {
            let name = this.getClassName("filter-icon");
            name += (this.props.filtersLoaded); // && (this.props.column.filterable || this.props.column.sortable || this.props.column.searchable) ? " tv-visible" : " tv-hidden");
            name += (this.props.filterApplied || this.props.searchApplied ? " tv-selected" : "");
            return name;
        };
        return (React.createElement("div", { className: getClassName() },
            React.createElement("i", { className: "fas fa-filter", onClick: e => this.showFilter(e, column) })));
    }
    getClassName(postfix = null) {
        let base = "tv" + (postfix ? "-" + postfix : "");
        return base + (this.props.className ? " " + base + "-" + this.props.className : "");
    }
}
//# sourceMappingURL=TableHeaderCell.js.map
import React from 'react';
import { TableSortType } from './Table';
import TableFlag from './TableFlag';
export default class TableHeaderMenu extends React.Component {
    constructor(props) {
        super(props);
        this.setSearchValue = (value, startSearch = false) => {
            this.setState({ search: value });
            if (startSearch) {
                this.props.onSearchApply(this.props.column.internalName, value);
            }
        };
        this.state = {
            allSelected: this.props.choices.length == this.props.selected.length || this.props.selected.length == 0,
            selected: this.props.selected,
            choices: this.props.choices,
            search: this.props.search,
            order: this.props.order,
            filterSearchString: null
        };
    }
    render() {
        let filterings = [];
        if (this.state.choices) {
            let search = this.state.filterSearchString ? this.state.filterSearchString.trim().toLowerCase() : "";
            for (let choice of this.state.choices) {
                if (search && choice.toLowerCase().indexOf(search) == -1)
                    continue;
                filterings.push(React.createElement(TableFlag, { label: choice, checked: this.state.allSelected || this.state.selected.indexOf(choice) != -1, onClick: e => this.onSelected(e) }));
            }
        }
        this.searchInputRef = React.createRef();
        return (React.createElement("div", { className: this.getClassName("filter-menu") + (this.props.last ? " last" : ""), onClick: this.stopPropagation },
            this.props.column.sortable ?
                React.createElement("div", { className: this.getClassName("filter-menu-sorting") },
                    React.createElement("div", null,
                        React.createElement("span", { onClick: () => this.applySort(TableSortType.asc), className: this.getClassName("sort-label") + (this.state.order == TableSortType.asc ? " selected" : "") },
                            React.createElement("i", { className: this.getClassName("sort-icon") + " fas fa-sort-alpha-down" }),
                            React.createElement("span", null, "A to Z"))),
                    React.createElement("div", null,
                        React.createElement("span", { onClick: () => this.applySort(TableSortType.desc), className: this.getClassName("sort-label") + (this.state.order == TableSortType.desc ? " selected" : "") },
                            React.createElement("i", { className: this.getClassName("sort-icon") + " fas fa-sort-alpha-down-alt" }),
                            React.createElement("span", null, "Z to A")))) :
                React.createElement(React.Fragment, null),
            this.props.column.sortable && (this.props.column.filterable || this.props.column.searchable) ?
                React.createElement("hr", { className: this.getClassName("line") }) :
                React.createElement(React.Fragment, null),
            this.props.column.searchable ?
                React.createElement("div", { className: this.getClassName("filter-menu-search-grid") },
                    React.createElement("input", { className: this.getClassName("filter-menu-search"), type: "text", placeholder: "Search in this column", onChange: e => this.setSearchValue(e.currentTarget.value), onKeyPress: e => e.key == "Enter" ? this.setSearchValue(e.currentTarget.value, true) : {}, value: this.state.search, ref: this.searchInputRef }),
                    React.createElement("button", { className: this.getClassName("filter-menu-search-button"), onClick: e => this.setSearchValue(this.searchInputRef.current.value, true) },
                        React.createElement("i", { className: "fas fa-angle-double-right" }))) :
                React.createElement(React.Fragment, null),
            this.props.column.searchable && this.props.column.filterable ?
                React.createElement("hr", { className: this.getClassName("line") }) :
                React.createElement(React.Fragment, null),
            this.props.column.filterable ?
                React.createElement(React.Fragment, null,
                    React.createElement("input", { type: "text", className: this.getClassName("filter-menu-filter-search"), onChange: e => this.searchFilters(e), value: this.state.filterSearchString }),
                    React.createElement(TableFlag, { id: "all", label: "All", onClick: () => this.onAllSelected(), checked: this.state.allSelected }),
                    React.createElement("div", { className: this.getClassName("filter-menu-filtering") }, filterings),
                    React.createElement("div", { className: this.getClassName("filter-apply") },
                        React.createElement("button", { className: this.getClassName("filter-apply-button") + (this.state.allSelected || this.state.selected.length == 0 ? " disabled" : ""), onClick: () => this.applyFilters() }, "Apply Filter"),
                        React.createElement("button", { className: this.getClassName("filter-reset-button") + (!this.props.filterApplied ? " hidden" : ""), onClick: () => this.resetFilter() }, "Reset Filter"))) :
                React.createElement(React.Fragment, null)));
    }
    searchFilters(e) {
        this.setState({ filterSearchString: e.currentTarget.value });
    }
    applySort(sortOrder) {
        this.props.onSortApply(this.props.column.internalName, sortOrder);
    }
    applyFilters() {
        if (this.state.selected.length == 0 || this.state.allSelected)
            return;
        this.props.onFilterApply(this.props.column.internalName, this.state.selected);
    }
    resetFilter() {
        this.props.onFilterReset(this.props.column.internalName);
    }
    onSelected(e) {
        let choice = e.currentTarget.parentElement.querySelector("label[for='" + e.currentTarget.id + "']").innerHTML;
        let allSelected = this.state.allSelected;
        let selected = this.state.selected;
        if (allSelected) {
            allSelected = false;
            selected = this.props.choices;
        }
        if (selected.indexOf(choice) != -1) {
            selected = selected.filter(c => c != choice);
            if (allSelected)
                allSelected = false;
        }
        else
            selected.push(choice);
        if (this.state.choices.length == selected.length)
            allSelected = true;
        this.setState({
            allSelected,
            selected
        });
    }
    onAllSelected() {
        this.setState({
            allSelected: !this.state.allSelected,
            selected: !this.state.allSelected ? this.state.choices : []
        });
    }
    getClassName(postfix = null) {
        let base = "tv" + (postfix ? "-" + postfix : "");
        return base + (this.props.className ? " " + base + "-" + this.props.className : "");
    }
    stopPropagation(e) {
        e.stopPropagation();
        e.nativeEvent.stopImmediatePropagation();
    }
}
//# sourceMappingURL=TableHeaderMenu.js.map
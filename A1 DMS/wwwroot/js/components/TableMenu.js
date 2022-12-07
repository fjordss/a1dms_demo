import React from 'react';
import { TableSortType } from './Table';
import TableFlag from './TableFlag';
export default class TableHeaderMenu extends React.Component {
    constructor(props) {
        super(props);
        /*let choices = this.props.table.state.filterChoices.find(f => f.field == this.props.column.internalName).choices;

        let sort = this.props.table.state.sort;
        let filtering = this.props.table.state.filtering;

        let selected: Array<string> = null;
        if (filtering) {
            let existing = filtering.find(f => f.field == this.props.column.internalName);
            if (existing)
                selected = existing.choices;
        }

        if (selected == null)
            selected = choices;

        let order: TableSortType = null;
        if (sort && sort.field == this.props.column.internalName)
            order = sort.order;

        this.state = {
            allSelected: choices.length == selected.length,
            selected,
            choices,
            order
        };*/
        this.state = {
            allSelected: this.props.choices.length == this.props.selected.length,
            selected: this.props.selected,
            choices: this.props.choices,
            order: this.props.order
        };
    }
    render() {
        let filterings = [];
        if (this.state.choices) {
            filterings = this.state.choices.map(choice => {
                return React.createElement(TableFlag, { label: choice, checked: this.state.allSelected || this.state.selected.indexOf(choice) != -1, onClick: e => this.onSelected(e) });
            });
        }
        return (React.createElement("div", { className: this.getClassName("filter-menu"), onClick: this.stopPropagation },
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
            this.props.column.filterable && this.props.column.sortable ?
                React.createElement("hr", { className: this.getClassName("line") }) :
                React.createElement(React.Fragment, null),
            this.props.column.filterable ?
                React.createElement(React.Fragment, null,
                    React.createElement("div", { className: this.getClassName("filter-menu-filtering") },
                        React.createElement(TableFlag, { id: "all", label: "All", onClick: () => this.onAllSelected(), checked: this.state.allSelected }),
                        filterings),
                    React.createElement("div", { className: this.getClassName("filter-apply") },
                        React.createElement("button", { className: this.getClassName("filter-button") + (this.state.selected.length == 0 ? " disabled" : ""), onClick: () => this.applyFilters() }, "Apply Filters"))) :
                React.createElement(React.Fragment, null)));
    }
    applySort(sortOrder) {
        this.props.onSortApply(this.props.column.internalName, sortOrder);
        /*this.props.table.setState({
            filterVisible: null,
            sort: {
                field: this.props.column.internalName,
                order: sortOrder
            }
        });

        this.props.table.tableState = 1;*/
    }
    applyFilters() {
        if (this.state.selected.length == 0)
            return;
        /*let filtering = this.props.table.state.filtering;
        if (!filtering)
            filtering = [];

        let existing = filtering.find(f => f.field == this.props.column.internalName);
        if (!existing) {
            if (!this.state.allSelected) {
                filtering.push({
                    field: this.props.column.internalName,
                    choices: this.state.selected
                });
            }
        }
        else {
            if (this.state.allSelected)
                filtering = filtering.filter(f => f.field != this.props.column.internalName);
            else
                existing.choices = this.state.selected;
        }*/
        this.props.onFilterApply(this.props.column.internalName, this.state.selected);
        /*this.props.table.setState({
            filterVisible: null,
            filtering
        });

        this.props.table.tableState = 1;*/
    }
    onSelected(e) {
        let choice = e.currentTarget.parentElement.querySelector("label[for='" + e.currentTarget.id + "']").innerHTML;
        let allSelected = this.state.allSelected;
        let selected = this.state.selected;
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
//# sourceMappingURL=TableMenu.js.map
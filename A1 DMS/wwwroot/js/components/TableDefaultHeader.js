import React from 'react';
import TableHeaderCell from './TableHeaderCell';
export default class TableDefaultHeader extends React.Component {
    constructor(props) {
        super(props);
        this.onFilterApply = (field, choices) => {
            this.props.onFilterApply(field, choices);
        };
        this.onFilterReset = (field) => {
            this.props.onFilterReset(field);
        };
        this.onSortApply = (field, sortType) => {
            this.props.onSortApply(field, sortType);
        };
        this.onSearchApply = (field, search) => {
            this.props.onSearchApply(field, search);
        };
        this.state = {
            filteringFieldName: null
        };
    }
    render() {
        let cells = [];
        let children = [];
        if (this.props.children) {
            if (Array.isArray(this.props.children))
                children = this.props.children.map(c => c);
            else
                children.push(this.props.children);
            children.forEach((child, i) => {
                if (typeof (child.type) === "string")
                    cells.push(child);
                else if (child.type.name == "TableHeaderCell")
                    cells.push(this.getHeaderCell(child.props.column, child.props.additionalClass, i == children.length - 1));
            });
        }
        else {
            for (let i = 0; i < this.props.columns.length; i++) {
                let column = this.props.columns[i];
                if (this.props.hasContextMenu && i == 1)
                    cells.push(React.createElement("div", { className: this.getClassName("header-cell") + " " + this.getClassName("header-cell-menu") }));
                cells.push(this.getHeaderCell(column, null, i == this.props.columns.length - 1));
            }
        }
        return (React.createElement(React.Fragment, null, cells));
    }
    getHeaderCell(column, additionalClass = null, last = false) {
        return React.createElement(TableHeaderCell, { column: column, className: this.props.className, additionalClass: additionalClass, choices: this.getChoices(column), selected: this.getSelected(column), sort: this.props.sort && this.props.sort.field == column.internalName ? this.props.sort.order : null, search: this.getSearch(column), searchApplied: this.isSearchApplied(column), filterApplied: this.isFilterApplied(column), filtersLoaded: this.props.filtersLoaded, onFilterApply: this.onFilterApply, onFilterReset: this.onFilterReset, onSortApply: this.onSortApply, onSearchApply: this.onSearchApply, last: last });
    }
    isFilterApplied(column) {
        return !!this.props.filtering.find(f => f.field == column.internalName);
    }
    isSearchApplied(column) {
        return !!this.props.search.find(s => s.field == column.internalName);
    }
    getSelected(column) {
        return this.getFilterings(this.props.filtering, column);
    }
    getChoices(column) {
        return this.getFilterings(this.props.filterChoices, column);
    }
    getSearch(column) {
        if (!this.props.search)
            return null;
        let search = this.props.search.find(s => s.field == column.internalName);
        return search ? search.text : null;
    }
    getFilterings(list, column) {
        var filter = list.find(f => f.field == column.internalName);
        if (filter)
            return filter.choices;
        return [];
    }
    getClassName(postfix = null) {
        let base = "tv" + (postfix ? "-" + postfix : "");
        return base + (this.props.className ? " " + base + "-" + this.props.className : "");
    }
}
//# sourceMappingURL=TableDefaultHeader.js.map
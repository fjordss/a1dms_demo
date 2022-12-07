import React from 'react';
export default class TablePaginartor extends React.Component {
    constructor(props) {
        super(props);
    }
    render() {
        var pages = this.getPages();
        return (pages.length > 1 ?
            this.props.totalRows != null ?
                React.createElement("div", { className: "paginator" },
                    React.createElement("div", { className: "paginator-item left", onClick: () => this.decrement() }, "<"),
                    pages.map(p => React.createElement("div", { className: "paginator-item" + (p == -1 ? " empty" : "") + (p == this.props.page ? " selected" : ""), onClick: () => this.onClick(p) }, p != -1 ? p : "...")),
                    React.createElement("div", { className: "paginator-item right", onClick: () => this.increment() }, ">")) :
                React.createElement(React.Fragment, null) :
            React.createElement(React.Fragment, null));
    }
    decrement() {
        let page = this.props.page - 1;
        if (page < 1)
            page = this.pagesCount;
        if (this.props.onChange)
            this.props.onChange(page);
    }
    increment() {
        let page = this.props.page + 1;
        if (page > this.pagesCount)
            page = 1;
        if (this.props.onChange)
            this.props.onChange(page);
    }
    onClick(page) {
        if (page == -1 || this.props.page == page)
            return;
        if (this.props.onChange)
            this.props.onChange(page);
    }
    getPages() {
        this.pagesCount = ~~(this.props.totalRows / this.props.rowsPerPage) + (this.props.totalRows % this.props.rowsPerPage > 0 ? 1 : 0);
        var pages = [];
        if (this.pagesCount <= 7) {
            for (var i = 1; i <= this.pagesCount; i++)
                pages.push(i);
        }
        else {
            if (this.props.page <= 4) {
                for (var i = 1; i <= 5; i++)
                    pages.push(i);
                pages.push(-1);
                pages.push(this.pagesCount);
            }
            else if (this.props.page > this.pagesCount - 4) {
                pages.push(1);
                pages.push(-1);
                for (var i = this.pagesCount - 4; i <= this.pagesCount; i++)
                    pages.push(i);
            }
            else {
                pages.push(1);
                pages.push(-1);
                pages.push(this.props.page - 1);
                pages.push(this.props.page);
                pages.push(this.props.page + 1);
                pages.push(-1);
                pages.push(this.pagesCount);
            }
        }
        return pages;
    }
}
//# sourceMappingURL=TablePaginator.js.map
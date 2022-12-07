import React from 'react';
export default class TableInfo extends React.Component {
    render() {
        let from = (this.props.page - 1) * this.props.rowsPerPage + 1;
        let to = from + this.props.rowsPerPage - 1;
        if (to > this.props.totalRows)
            to = this.props.totalRows;
        return (React.createElement("div", null,
            "Showing ",
            from,
            " to ",
            to,
            " of ",
            this.props.totalRows,
            " rows"));
    }
}
//# sourceMappingURL=TableInfo.js.map
import React from 'react';
import { app } from '../pages/mgmt/ManagementApp';
export default class TableContainer extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            pageTitle: "",
            search: "",
            updateTable: true,
            query: new Map(),
            rowsPerPage: null,
            totalRows: null,
            page: 1
        };
    }
    componentDidMount() {
        document.title = this.state.pageTitle;
        app.header.setState({ pageTitle: this.state.pageTitle });
    }
    shouldComponentUpdate(nextProps, nextState) {
        return !this.state.updateTable || nextState.updateTable;
    }
}
//# sourceMappingURL=TableContainer.js.map
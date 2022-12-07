import React from 'react';
export default class TableViewSearch extends React.Component {
    constructor(props) {
        super(props);
        this.timeout = 500;
        this.state = {
            value: this.props.value ? this.props.value : ""
        };
    }
    render() {
        return (React.createElement("input", { placeholder: "Try searching here...", onChange: e => this.setValue(e), value: this.state.value }));
    }
    setValue(e) {
        this.setState({
            value: e.currentTarget.value
        });
        let now = new Date();
        setTimeout((date) => {
            if (this.lastChangeDate.getTime() == date.getTime()) {
                this.props.parent.setState({
                    search: this.state.value,
                    updateTable: true
                });
            }
        }, this.timeout, now);
        this.lastChangeDate = now;
    }
}
//# sourceMappingURL=TableViewSearch.js.map
import React from 'react';
import { CommonHelper } from '../source/CommonHelper';
export default class TableFlag extends React.Component {
    render() {
        let id = this.props.id ? this.props.id : CommonHelper.createGuid();
        return (React.createElement("div", { className: this.props.className ? this.props.className : "" },
            React.createElement("input", { type: "checkbox", id: id, checked: this.props.checked, onClick: this.props.onClick }),
            " ",
            React.createElement("label", { htmlFor: id }, this.props.label)));
    }
}
//# sourceMappingURL=TableFlag.js.map
import { Link } from 'react-router-dom';
import React from 'react';
import Modal from './Modal';
export default class ModalError extends React.Component {
    constructor(props) {
        super(props);
    }
    render() {
        let errors = [];
        for (let i = 0; i < this.props.errors.length; i++) {
            errors.push(React.createElement("span", null, this.props.errors[i]));
            if (i != this.props.errors.length - 1)
                errors.push(React.createElement("br", null));
        }
        return (React.createElement(Modal, { className: "error", width: 295, height: 175, visible: this.props.visible, onClose: this.props.onClose },
            React.createElement("div", { className: "text" }, errors),
            this.props.backLabel && this.props.backUrl ?
                React.createElement("div", { className: "back" },
                    React.createElement(Link, { to: this.props.backUrl }, this.props.backLabel)) :
                React.createElement(React.Fragment, null)));
    }
}
//# sourceMappingURL=ModalError.js.map
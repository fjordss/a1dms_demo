import React from 'react';
export default class FormFieldLabel extends React.Component {
    constructor(props) {
        super(props);
        this.props.field.fieldLabelElement = this;
    }
    render() {
        return (React.createElement("label", { htmlFor: this.props.field.id },
            this.props.field.displayName ? this.props.field.displayName : this.props.field.name,
            this.props.field.required === true ? React.createElement("span", { className: "required" }, " *") : React.createElement(React.Fragment, null)));
    }
}
//# sourceMappingURL=FormFieldLabel.js.map
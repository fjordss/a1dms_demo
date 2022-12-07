import React from 'react';
export default class FormFieldError extends React.Component {
    constructor(props) {
        super(props);
        this.props.field.fieldErrorElement = this;
    }
    render() {
        return (React.createElement("span", null, this.props.field.error));
    }
}
//# sourceMappingURL=FormFieldError.js.map
import React from 'react';
import Form from './Form';
export default class FormSubmit extends React.Component {
    render() {
        return (React.createElement(React.Fragment, null, this.getSubmit(this.props.submit)));
    }
    getSubmit(submit) {
        return React.createElement("button", { id: submit.id, className: submit.className, onClick: Form.onSubmit }, submit.value);
    }
}
//# sourceMappingURL=FormSubmit.js.map
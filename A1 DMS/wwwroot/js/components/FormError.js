import React from 'react';
import Form from './Form';
export default class FormError extends React.Component {
    constructor(props) {
        super(props);
        Form.getInstance().errorElement = this;
        this.state = { errors: [] };
    }
    render() {
        let errors = [];
        for (let i = 0; i < this.state.errors.length; i++) {
            errors.push(React.createElement("span", null, this.state.errors[i]));
            if (i != this.state.errors.length - 1)
                errors.push(React.createElement("br", null));
        }
        return (React.createElement("span", null, errors));
    }
}
//# sourceMappingURL=FormError.js.map
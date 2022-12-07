import React from 'react';
import { Redirect } from 'react-router-dom';
import Form, { FormFieldType } from '../../components/Form';
import FormError from '../../components/FormError';
import FormField from '../../components/FormField';
import FormFieldError from '../../components/FormFieldError';
import FormFieldLabel from '../../components/FormFieldLabel';
import FormSubmit from '../../components/FormSubmit';
import ModalPreloader from '../../components/ModalPreloader';
export default class SitesForm extends React.Component {
    constructor(props) {
        super(props);
        this.valueSet = false;
        this.fields = this.getFields();
        this.state = {
            redirect: false,
            loading: false
        };
    }
    render() {
        if (this.props.value && !this.valueSet) {
            for (let field of this.fields)
                field.value = this.props.value[field.name];
            this.valueSet = true;
        }
        let submit = { value: this.props.submitLabel };
        let name = this.retrieve("name");
        let inactive = this.retrieve("inactive");
        return (React.createElement(React.Fragment, null,
            this.state.redirect ? React.createElement(Redirect, { to: this.props.redirectUrl }) : React.createElement(React.Fragment, null),
            React.createElement(ModalPreloader, { visible: this.state.loading }),
            React.createElement(Form, { method: this.props.method, url: this.props.url, submit: submit, fields: this.fields, className: "form", send: () => this.setState({ loading: true }), success: () => this.setState({
                    loading: false,
                    redirect: true
                }), error: () => this.setState({ loading: false }) },
                React.createElement("div", { className: "field" },
                    React.createElement("div", { className: "label" },
                        React.createElement(FormFieldLabel, { field: name })),
                    React.createElement("div", { className: "control" },
                        React.createElement(FormField, { field: name })),
                    React.createElement("div", { className: "error" },
                        React.createElement(FormFieldError, { field: name }))),
                React.createElement("div", { className: "field" },
                    React.createElement(FormField, { field: inactive }),
                    " ",
                    React.createElement(FormFieldLabel, { field: inactive })),
                React.createElement("div", { className: "submit" },
                    React.createElement(FormSubmit, { submit: submit })),
                React.createElement("div", { className: "form-error" },
                    React.createElement(FormError, null)))));
    }
    retrieve(name) {
        return this.fields.find(f => f.name == name);
    }
    getFields() {
        return [
            {
                displayName: "Name",
                name: "name",
                required: true,
                type: FormFieldType.text,
                validate: value => [!!(typeof (value) != "undefined" && value != null ? value.trim() : null), null]
            },
            {
                id: "inactive",
                displayName: "Inactive",
                name: "inactive",
                type: FormFieldType.checkbox
            },
        ];
    }
}
//# sourceMappingURL=SitesForm.js.map
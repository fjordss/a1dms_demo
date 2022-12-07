import { Access, Form, FormError, FormField, FormFieldError, FormFieldLabel, FormFieldType, FormSubmit, FormType, Modal } from 'a1dms-front';
import React from 'react';
import { Redirect, Link } from 'react-router-dom';
import { app } from '../ManagementApp';
export default class UsersForm extends React.Component {
    constructor(props) {
        super(props);
        this.valueSet = false;
        this.onChange = () => {
            let lastName = this.retrieve("lastName").value.trim();
            let firstName = this.retrieve("firstName").value.trim();
            let logonName = this.retrieve("logonName").value.trim();
            let value = "";
            if (lastName || firstName) {
                if (lastName && firstName)
                    value = lastName + ", " + firstName;
                else
                    value = lastName ? lastName : firstName;
            }
            else if (logonName)
                value = logonName;
            let nameField = this.retrieve("name");
            nameField.value = value;
            nameField.fieldElement.setState({});
        };
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
        let lastName = this.retrieve("lastName");
        let firstName = this.retrieve("firstName");
        let logonName = this.retrieve("logonName");
        let name = this.retrieve("name");
        let sites = this.retrieve("siteIds");
        let role = this.retrieve("role");
        let company = this.retrieve("companyId");
        let eMail = this.retrieve("eMail");
        return (React.createElement(React.Fragment, null,
            React.createElement(Access, { app: app, policy: "administrator" }),
            this.state.redirect ? React.createElement(Redirect, { to: this.props.redirectUrl }) : React.createElement(React.Fragment, null),
            React.createElement(Modal, { loading: true, visible: this.state.loading }),
            React.createElement(Form, { method: this.props.method, url: this.props.url, fields: this.fields, className: "form users", send: () => this.setState({ loading: true }), success: res => this.handleSuccess(res), error: () => this.setState({ loading: false }) },
                React.createElement("div", { className: "field" },
                    React.createElement("div", { className: "label" },
                        React.createElement(FormFieldLabel, { field: lastName })),
                    React.createElement("div", { className: "control" },
                        React.createElement(FormField, { field: lastName })),
                    React.createElement("div", { className: "error" },
                        React.createElement(FormFieldError, { field: lastName }))),
                React.createElement("div", { className: "field" },
                    React.createElement("div", { className: "label" },
                        React.createElement(FormFieldLabel, { field: firstName })),
                    React.createElement("div", { className: "control" },
                        React.createElement(FormField, { field: firstName })),
                    React.createElement("div", { className: "error" },
                        React.createElement(FormFieldError, { field: firstName }))),
                React.createElement("div", { className: "field" },
                    React.createElement("div", { className: "label" },
                        React.createElement(FormFieldLabel, { field: name })),
                    React.createElement("div", { className: "control" },
                        React.createElement(FormField, { field: name })),
                    React.createElement("div", { className: "error" },
                        React.createElement(FormFieldError, { field: name }))),
                React.createElement("div", { className: "field" },
                    React.createElement("div", { className: "label" },
                        React.createElement(FormFieldLabel, { field: role })),
                    React.createElement("div", { className: "control" },
                        React.createElement(FormField, { field: role })),
                    React.createElement("div", { className: "error" },
                        React.createElement(FormFieldError, { field: role }))),
                React.createElement("div", { className: "field" },
                    React.createElement("div", { className: "label" },
                        React.createElement(FormFieldLabel, { field: logonName })),
                    React.createElement("div", { className: "control" },
                        React.createElement(FormField, { field: logonName })),
                    React.createElement("div", { className: "error" },
                        React.createElement(FormFieldError, { field: logonName }))),
                React.createElement("div", { className: "field" },
                    React.createElement("div", { className: "label" },
                        React.createElement(FormFieldLabel, { field: eMail })),
                    React.createElement("div", { className: "control" },
                        React.createElement(FormField, { field: eMail })),
                    React.createElement("div", { className: "error" },
                        React.createElement(FormFieldError, { field: eMail }))),
                React.createElement("div", { className: "field" },
                    React.createElement("div", { className: "label" },
                        React.createElement(FormFieldLabel, { field: company })),
                    React.createElement("div", { className: "control" },
                        React.createElement(FormField, { field: company })),
                    React.createElement("div", { className: "error" },
                        React.createElement(FormFieldError, { field: company }))),
                React.createElement("div", { className: "field" },
                    React.createElement("div", { className: "label" },
                        React.createElement(FormFieldLabel, { field: sites })),
                    React.createElement("div", { className: "control" },
                        React.createElement(FormField, { field: sites })),
                    React.createElement("div", { className: "error" },
                        React.createElement(FormFieldError, { field: sites }))),
                React.createElement("div", { className: "submit" },
                    React.createElement(FormSubmit, { submit: submit })),
                React.createElement("div", null),
                React.createElement("div", { className: "form-error" },
                    React.createElement(FormError, null)),
                React.createElement("div", null),
                React.createElement(Link, { className: "form-back-link", to: "/v2/mgmt/users" }, "Back to Users"))));
    }
    handleSuccess(res) {
        app.notification.show(React.createElement("div", null,
            React.createElement("span", null, "User "),
            React.createElement(Link, { to: "/v2/mgmt/users/edit/" + res.data.id }, res.data.name),
            React.createElement("span", null,
                " successfully ",
                this.props.formType == FormType.new ? "created" : "updated"),
            this.props.formType == FormType.new ?
                React.createElement(React.Fragment, null,
                    React.createElement("br", null),
                    React.createElement("br", null),
                    React.createElement("span", null, "User have to check his e-mail to activate an account")) :
                React.createElement(React.Fragment, null)));
        this.setState({
            loading: false,
            redirect: true
        });
    }
    retrieve(name) {
        return this.fields.find(f => f.name == name);
    }
    getFields() {
        return [
            {
                displayName: "Last Name",
                name: "lastName",
                type: FormFieldType.singleline,
                onChange: this.onChange
            },
            {
                displayName: "First Name",
                name: "firstName",
                type: FormFieldType.singleline,
                onChange: this.onChange
            },
            {
                displayName: "Logon Name",
                name: "logonName",
                type: FormFieldType.singleline,
                onChange: this.onChange,
                required: true
            },
            {
                displayName: "Name",
                name: "name",
                type: FormFieldType.singleline,
                disabled: true,
                required: true
            },
            {
                displayName: "Sites",
                name: "siteIds",
                type: FormFieldType.multiselect,
                options: app.sites
            },
            {
                displayName: "Role",
                name: "role",
                type: FormFieldType.multiselect,
                options: [
                    { text: "Administrator", value: "1" },
                    { text: "Site Administrator", value: "2" },
                    { text: "Supervisor", value: "4" },
                    { text: "SSHE User", value: "8" },
                    { text: "Voting User", value: "16" }
                ],
                mapValue: (values) => values.reduce((v1, v2) => (parseInt(v1) | parseInt(v2)).toString()),
                required: true
            },
            {
                displayName: "Company",
                name: "companyId",
                type: FormFieldType.select,
                options: app.companies,
                required: true
            },
            {
                displayName: "EMail",
                name: "eMail",
                type: FormFieldType.singleline,
                required: true,
                validate: (value) => [/^[a-zA-Z\d]?[a-zA-Z\d\-_\.]*[a-zA-Z\d]{1}@[a-zA-Z\d]?[a-zA-Z\d\.\-]*[a-zA-Z\d]{1}\.[a-zA-Z]+$/.test(value), "Wrong e-mail format"]
            }
        ];
    }
}
//# sourceMappingURL=UsersForm.js.map
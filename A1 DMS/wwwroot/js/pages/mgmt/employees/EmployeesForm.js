import React from 'react';
import { Redirect, Link } from 'react-router-dom';
import Access from '../../../components/Access';
import Form, { FormFieldType, FormType } from '../../../components/Form';
import FormError from '../../../components/FormError';
import FormField from '../../../components/FormField';
import FormFieldError from '../../../components/FormFieldError';
import FormFieldLabel from '../../../components/FormFieldLabel';
import FormSubmit from '../../../components/FormSubmit';
import Modal from '../../../components/Modal';
import { app } from '../ManagementApp';
export default class EmployeesForm extends React.Component {
    constructor(props) {
        super(props);
        this.valueSet = false;
        this.onChange = () => {
            let lastName = this.retrieve("lastName").value.trim();
            let firstName = this.retrieve("firstName").value.trim();
            let value = "";
            if (lastName || firstName) {
                if (lastName && firstName)
                    value = lastName + ", " + firstName;
                else
                    value = lastName ? lastName : firstName;
            }
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
        let code = this.retrieve("code");
        let inactive = this.retrieve("inactive");
        let lastName = this.retrieve("lastName");
        let firstName = this.retrieve("firstName");
        let name = this.retrieve("name");
        let site = this.retrieve("siteId");
        let company = this.retrieve("companyId");
        let department = this.retrieve("departmentId");
        let ptsNumber = this.retrieve("ptsNumber");
        let additionalInfo = this.retrieve("additionalInfo");
        return (React.createElement(React.Fragment, null,
            React.createElement(Access, { policy: "siteAdministrator" }),
            this.state.redirect ? React.createElement(Redirect, { to: this.props.redirectUrl }) : React.createElement(React.Fragment, null),
            React.createElement(Modal, { loading: true, visible: this.state.loading }),
            React.createElement(Form, { method: this.props.method, url: this.props.url, fields: this.fields, className: "form employees", send: () => this.setState({ loading: true }), success: res => this.handleSuccess(res), error: () => this.setState({ loading: false }) },
                React.createElement("div", { className: "field" },
                    React.createElement("div", { className: "label" },
                        React.createElement(FormFieldLabel, { field: code })),
                    React.createElement("div", { className: "control" },
                        React.createElement(FormField, { field: code })),
                    React.createElement("div", { className: "error" },
                        React.createElement(FormFieldError, { field: code }))),
                React.createElement("div", { className: "field" },
                    React.createElement("div", { className: "label" },
                        React.createElement(FormFieldLabel, { field: name })),
                    React.createElement("div", { className: "control" },
                        React.createElement(FormField, { field: name })),
                    React.createElement("div", { className: "error" },
                        React.createElement(FormFieldError, { field: name }))),
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
                        React.createElement(FormFieldLabel, { field: site })),
                    React.createElement("div", { className: "control" },
                        React.createElement(FormField, { field: site })),
                    React.createElement("div", { className: "error" },
                        React.createElement(FormFieldError, { field: site }))),
                React.createElement("div", { className: "field" },
                    React.createElement("div", { className: "label" },
                        React.createElement(FormFieldLabel, { field: department })),
                    React.createElement("div", { className: "control" },
                        React.createElement(FormField, { field: department })),
                    React.createElement("div", { className: "error" },
                        React.createElement(FormFieldError, { field: department }))),
                React.createElement("div", { className: "field" },
                    React.createElement("div", { className: "label" },
                        React.createElement(FormFieldLabel, { field: company })),
                    React.createElement("div", { className: "control" },
                        React.createElement(FormField, { field: company })),
                    React.createElement("div", { className: "error" },
                        React.createElement(FormFieldError, { field: company }))),
                React.createElement("div", null),
                React.createElement("div", { className: "field" },
                    React.createElement("div", { className: "label" },
                        React.createElement(FormFieldLabel, { field: ptsNumber })),
                    React.createElement("div", { className: "control" },
                        React.createElement(FormField, { field: ptsNumber })),
                    React.createElement("div", { className: "error" },
                        React.createElement(FormFieldError, { field: ptsNumber }))),
                React.createElement("div", null),
                React.createElement("div", { className: "field" },
                    React.createElement("div", { className: "label" },
                        React.createElement(FormFieldLabel, { field: additionalInfo })),
                    React.createElement("div", { className: "control" },
                        React.createElement(FormField, { field: additionalInfo })),
                    React.createElement("div", { className: "error" },
                        React.createElement(FormFieldError, { field: additionalInfo }))),
                React.createElement("div", null),
                React.createElement("div", { className: "control" },
                    React.createElement(FormField, { field: inactive }),
                    " ",
                    React.createElement(FormFieldLabel, { field: inactive })),
                React.createElement("div", null),
                React.createElement("div", { className: "submit" },
                    React.createElement(FormSubmit, { submit: submit })),
                React.createElement("div", null),
                React.createElement("div", { className: "form-error" },
                    React.createElement(FormError, null)),
                React.createElement("div", null),
                React.createElement(Link, { className: "form-back-link", to: "/v2/mgmt/employees" }, "Back to Employees"))));
    }
    handleSuccess(res) {
        app.notification.show(React.createElement("div", null,
            React.createElement("span", null,
                "Employee",
                res.data.name ? " " + res.data.name + "," : "",
                " NGH # "),
            React.createElement(Link, { to: "/v2/mgmt/employees/edit/" + res.data.id }, res.data.code),
            React.createElement("span", null,
                " successfully ",
                this.props.formType == FormType.new ? "created" : "updated")));
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
                displayName: "NGH #",
                name: "code",
                type: FormFieldType.singleline,
                disabled: true
            },
            {
                displayName: "Inactive",
                name: "inactive",
                id: "inactive",
                type: FormFieldType.checkbox
            },
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
                displayName: "Name",
                name: "name",
                type: FormFieldType.singleline,
                disabled: true
            },
            {
                displayName: "Site",
                name: "siteId",
                type: FormFieldType.select,
                options: app.sites,
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
                displayName: "Department",
                name: "departmentId",
                type: FormFieldType.select,
                options: app.departments,
                required: true
            },
            {
                displayName: "PTS #",
                name: "ptsNumber",
                type: FormFieldType.singleline
            },
            {
                displayName: "Aditional Information",
                name: "additionalInfo",
                type: FormFieldType.multiline
            }
        ];
    }
}
//# sourceMappingURL=EmployeesForm.js.map
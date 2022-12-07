import { Access, Form, FormError, FormField, FormFieldDesc, FormFieldError, FormFieldLabel, FormFieldType, FormResponse, FormSubmit, FormSubmitDesc, FormType, Modal } from 'a1dms-front';
import { FORMERR } from 'dns';
import React from 'react'
import { Redirect, Link } from 'react-router-dom'
import { app } from '../ManagementApp';
import { User } from './Users'

export interface UsersFormState {
    redirect: boolean;
    loading: boolean;
}

export interface UsersFormProps {
    formType: FormType;
    value?: User;
    method: string;
    url: string;
    redirectUrl: string;
    submitLabel: string;
}

export default class UsersForm extends React.Component<UsersFormProps, UsersFormState> {
    private fields: Array<FormFieldDesc>;
    private valueSet = false;

    public constructor(props) {
        super(props);

        this.fields = this.getFields();

        this.state = {
            redirect: false,
            loading: false
        };
    }

    public render() {
        if (this.props.value && !this.valueSet) {
            for (let field of this.fields)
                field.value = this.props.value[field.name];

            this.valueSet = true;
        }

        let submit: FormSubmitDesc = { value: this.props.submitLabel };

        let lastName = this.retrieve("lastName");
        let firstName = this.retrieve("firstName");
        let logonName = this.retrieve("logonName");
        let name = this.retrieve("name");
        let sites = this.retrieve("siteIds");
        let role = this.retrieve("role");
        let company = this.retrieve("companyId");
        let eMail = this.retrieve("eMail");

        return (
            <>
                <Access app={app} policy="administrator" />

                {this.state.redirect ? <Redirect to={this.props.redirectUrl} /> : <></>}

                <Modal loading={true} visible={this.state.loading} />

                <Form<User> method={this.props.method} url={this.props.url} fields={this.fields} className="form users"
                    send={() => this.setState({ loading: true })}
                    success={res => this.handleSuccess(res)}
                    error={() => this.setState({ loading: false })}
                >
                    <div className="field">
                        <div className="label"><FormFieldLabel field={lastName} /></div>
                        <div className="control"><FormField field={lastName} /></div>
                        <div className="error"><FormFieldError field={lastName} /></div>
                    </div>

                    <div className="field">
                        <div className="label"><FormFieldLabel field={firstName} /></div>
                        <div className="control"><FormField field={firstName} /></div>
                        <div className="error"><FormFieldError field={firstName} /></div>
                    </div>

                    <div className="field">
                        <div className="label"><FormFieldLabel field={name} /></div>
                        <div className="control"><FormField field={name} /></div>
                        <div className="error"><FormFieldError field={name} /></div>
                    </div>

                    <div className="field">
                        <div className="label"><FormFieldLabel field={role} /></div>
                        <div className="control"><FormField field={role} /></div>
                        <div className="error"><FormFieldError field={role} /></div>
                    </div>

                    <div className="field">
                        <div className="label"><FormFieldLabel field={logonName} /></div>
                        <div className="control"><FormField field={logonName} /></div>
                        <div className="error"><FormFieldError field={logonName} /></div>
                    </div>

                    <div className="field">
                        <div className="label"><FormFieldLabel field={eMail} /></div>
                        <div className="control"><FormField field={eMail} /></div>
                        <div className="error"><FormFieldError field={eMail} /></div>
                    </div>

                    <div className="field">
                        <div className="label"><FormFieldLabel field={company} /></div>
                        <div className="control"><FormField field={company} /></div>
                        <div className="error"><FormFieldError field={company} /></div>
                    </div>

                    <div className="field">
                        <div className="label"><FormFieldLabel field={sites} /></div>
                        <div className="control"><FormField field={sites} /></div>
                        <div className="error"><FormFieldError field={sites} /></div>
                    </div>

                    <div className="submit"><FormSubmit submit={submit} /></div>

                    <div></div>

                    <div className="form-error"><FormError /></div>
                    <div></div>

                    <Link className="form-back-link" to="/v2/mgmt/users">Back to Users</Link>
                </Form>
            </>
        );
    }

    private handleSuccess(res: FormResponse<User>) {
        app.notification.show(
            <div>
                <span>User </span>
                <Link to={"/v2/mgmt/users/edit/" + res.data.id}>{res.data.name}</Link>
                <span> successfully {this.props.formType == FormType.new ? "created" : "updated"}</span>
                {this.props.formType == FormType.new ?
                    <>
                        <br /><br />
                        <span>User have to check his e-mail to activate an account</span>
                    </> : 
                    <></>
                }
            </div>
        );

        this.setState({
            loading: false,
            redirect: true
        })
    }

    private retrieve(name: string) {
        return this.fields.find(f => f.name == name);
    }

    public getFields(): Array<FormFieldDesc> {
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
                mapValue: (values: Array<string>) => values.reduce((v1, v2) => (parseInt(v1) | parseInt(v2)).toString()),
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
                validate: (value: string) => [/^[a-zA-Z\d]?[a-zA-Z\d\-_\.]*[a-zA-Z\d]{1}@[a-zA-Z\d]?[a-zA-Z\d\.\-]*[a-zA-Z\d]{1}\.[a-zA-Z]+$/.test(value), "Wrong e-mail format"]
            }
        ];
    }

    private onChange = () => {
        let lastName = (this.retrieve("lastName").value as string).trim();
        let firstName = (this.retrieve("firstName").value as string).trim();
        let logonName = (this.retrieve("logonName").value as string).trim();

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
    }
}
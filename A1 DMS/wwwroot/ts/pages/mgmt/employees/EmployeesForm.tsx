import { Access, Form, FormError, FormField, FormFieldDesc, FormFieldError, FormFieldLabel, FormFieldType, FormResponse, FormSubmit, FormSubmitDesc, FormType, Modal } from 'a1dms-front';
import React from 'react'
import { Redirect, Link } from 'react-router-dom'
import { app } from '../ManagementApp';
import { Employee } from './Employees'

export interface EmployeesFormState {
    redirect: boolean;
    loading: boolean;
}

export interface EmployeesFormProps {
    formType: FormType;
    value?: Employee;
    method: string;
    url: string;
    redirectUrl: string;
    submitLabel: string;
}

export default class EmployeesForm extends React.Component<EmployeesFormProps, EmployeesFormState> {
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

        return (
            <>
                <Access app={app} policy="siteAdministrator" />

                {this.state.redirect ? <Redirect to={this.props.redirectUrl} /> : <></>}

                <Modal loading={true} visible={this.state.loading} />

                <Form<Employee> method={this.props.method} url={this.props.url} fields={this.fields} className="form employees"
                    send={() => this.setState({ loading: true })}
                    success={res => this.handleSuccess(res)}
                    error={() => this.setState({ loading: false })}
                >
                    <div className="field">
                        <div className="label"><FormFieldLabel field={code} /></div>
                        <div className="control"><FormField field={code} /></div>
                        <div className="error"><FormFieldError field={code} /></div>
                    </div>

                    <div className="field">
                        <div className="label"><FormFieldLabel field={name} /></div>
                        <div className="control"><FormField field={name} /></div>
                        <div className="error"><FormFieldError field={name} /></div>
                    </div>

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
                        <div className="label"><FormFieldLabel field={site} /></div>
                        <div className="control"><FormField field={site} /></div>
                        <div className="error"><FormFieldError field={site} /></div>
                    </div>

                    <div className="field">
                        <div className="label"><FormFieldLabel field={department} /></div>
                        <div className="control"><FormField field={department} /></div>
                        <div className="error"><FormFieldError field={department} /></div>
                    </div>

                    <div className="field">
                        <div className="label"><FormFieldLabel field={company} /></div>
                        <div className="control"><FormField field={company} /></div>
                        <div className="error"><FormFieldError field={company} /></div>
                    </div>

                    <div></div>

                    <div className="field">
                        <div className="label"><FormFieldLabel field={ptsNumber} /></div>
                        <div className="control"><FormField field={ptsNumber} /></div>
                        <div className="error"><FormFieldError field={ptsNumber} /></div>
                    </div>

                    <div></div>

                    <div className="field">
                        <div className="label"><FormFieldLabel field={additionalInfo} /></div>
                        <div className="control"><FormField field={additionalInfo} /></div>
                        <div className="error"><FormFieldError field={additionalInfo} /></div>
                    </div>

                    <div></div>

                    <div className="control"><FormField field={inactive} /> <FormFieldLabel field={inactive} /></div>

                    <div></div>

                    <div className="submit"><FormSubmit submit={submit} /></div>

                    <div></div>

                    <div className="form-error"><FormError /></div>
                    <div></div>

                    <Link className="form-back-link" to="/v2/mgmt/employees">Back to Employees</Link>
                </Form>
            </>
        );
    }

    private handleSuccess(res: FormResponse<Employee>) {
        app.notification.show(
            <div>
                <span>Employee{res.data.name ? " " + res.data.name + "," : ""} NGH # </span>
                <Link to={"/v2/mgmt/employees/edit/" + res.data.id}>{res.data.code}</Link>
                <span> successfully {this.props.formType == FormType.new ? "created" : "updated"}</span>
            </div>);

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

    private onChange = () => {
        let lastName = (this.retrieve("lastName").value as string).trim();
        let firstName = (this.retrieve("firstName").value as string).trim();

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
    }
}
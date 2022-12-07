import { Access, Form, FormError, FormField, FormFieldDesc, FormFieldError, FormFieldLabel, FormFieldType, FormResponse, FormSubmit, FormSubmitDesc, FormType, Modal } from 'a1dms-front';
import { FORMERR } from 'dns';
import React from 'react'
import { Redirect, Link } from 'react-router-dom'
import { app } from '../ManagementApp';
import { Company } from './Companies'

export interface CompaniesFormState {
    redirect: boolean;
    loading: boolean;
}

export interface CompaniesFormProps {
    formType: FormType;
    value?: Company;
    method: string;
    url: string;
    redirectUrl: string;
    submitLabel: string;
}

export default class CompaniesForm extends React.Component<CompaniesFormProps, CompaniesFormState> {
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

        let name = this.retrieve("name");
        let inactive = this.retrieve("inactive");

        return (
            <>
                <Access app={app} policy="administrator" />

                {this.state.redirect ? <Redirect to={this.props.redirectUrl} /> : <></>}

                <Modal loading={true} visible={this.state.loading} />

                <Form<Company> method={this.props.method} url={this.props.url} fields={this.fields} className="form"
                    send={() => this.setState({ loading: true })}
                    success={res => this.handleSuccess(res)}
                    error={() => this.setState({ loading: false })}
                > 
                    <div className="field">
                        <div className="label"><FormFieldLabel field={name} /></div>
                        <div className="control"><FormField field={name} /></div>
                        <div className="error"><FormFieldError field={name} /></div>
                    </div>

                    <div className="field">
                        <FormField field={inactive} /> <FormFieldLabel field={inactive} />
                    </div>

                    <div className="submit"><FormSubmit submit={submit} /></div>

                    <div className="form-error"><FormError /></div>

                    <Link className="form-back-link" to="/v2/mgmt/companies">Back to Companies</Link>
                </Form>
            </>
        );
    }

    private handleSuccess(res: FormResponse<Company>) {
        app.notification.show(<div>Company <Link to={"/v2/mgmt/companies/edit/" + res.data.id}>{res.data.name}</Link> successfully {this.props.formType == FormType.new ? "created" : "updated"}</div>);

        this.setState({
            loading: false,
            redirect: true
        })
    }

    private retrieve(name: string) {
        return this.fields.find(f => f.name == name);
    }

    private getFields(): Array<FormFieldDesc> {
        return [
            {
                displayName: "Name",
                name: "name",
                required: true,
                type: FormFieldType.singleline,
                validate: value => [!!(typeof(value) != "undefined" && value != null ? value.trim() : null), null]
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
import { FetchData, Form, FormResponse, FormType, Modal, ModalError, RouteComponentProps } from 'a1dms-front';
import React from 'react'
import { Link } from 'react-router-dom'
import { Company } from './Companies';
import CompaniesForm from './CompaniesForm';

export interface CompaniesEditFormState {
    value: Company;
    errors: Array<string>;
}

export interface CompaniesEditFormParams {
    id: number;
}

export default class CompaniesEditForm extends React.Component<RouteComponentProps<CompaniesEditFormParams>, CompaniesEditFormState> {
    private company: Promise<FormResponse<Company>>;

    public constructor(props: RouteComponentProps<CompaniesEditFormParams>) {
        super(props);

        this.state = {
            value: null,
            errors: []
        };
    }

    public render() {
        return (
            <>
                {this.state.value == null ? <FetchData obj={this} prop="company" url={"/api/companies/" + this.props.match.params.id} /> : <></>}

                <Modal loading={true} visible={this.state.value == null} />
                <ModalError visible={this.state.errors.length > 0} errors={this.state.errors} backLabel="Back to Companies" backUrl="/v2/mgmt/companies" />

                <CompaniesForm formType={FormType.edit} submitLabel="Save" value={this.state.value} method="PUT" url={"/api/companies/" + this.props.match.params.id} redirectUrl="/v2/mgmt/companies" />
            </>
        );
    }

    public componentDidMount() {
        if (this.company) {
            this.company
                .then(
                    res => {
                        if (res.status == "ok")
                            this.setState({ value: res.data });
                        else 
                            this.setState({ errors: res.errors.map(e => e.text) })
                    },
                    error => this.setState({ errors: [Form.unknownErrorWithRefresh] })
                )
                .catch(error => this.setState({ errors: [Form.unknownErrorWithRefresh] }));
        }
    }
}
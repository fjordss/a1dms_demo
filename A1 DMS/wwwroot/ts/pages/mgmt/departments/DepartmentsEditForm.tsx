import { FetchData, Form, FormResponse, FormType, Modal, ModalError, RouteComponentProps } from 'a1dms-front';
import React from 'react'
import { Department } from './Departments';
import DepartmentsForm from './DepartmentsForm';

export interface DepartmentsEditFormState {
    value: Department;
    errors: Array<string>;
}

export interface DepartmentsEditFormParams {
    id: number;
}

export default class DepartmentsEditForm extends React.Component<RouteComponentProps<DepartmentsEditFormParams>, DepartmentsEditFormState> {
    private department: Promise<FormResponse<Department>>;

    public constructor(props: RouteComponentProps<DepartmentsEditFormParams>) {
        super(props);

        this.state = {
            value: null,
            errors: []
        };
    }

    public render() {
        return (
            <>
                {this.state.value == null ? <FetchData obj={this} prop="department" url={"/api/departments/" + this.props.match.params.id} /> : <></>}

                <Modal loading={true} visible={this.state.value == null} />
                <ModalError visible={this.state.errors.length > 0} errors={this.state.errors} backLabel="Back to Departments" backUrl="/v2/mgmt/departments" />

                <DepartmentsForm formType={FormType.edit} submitLabel="Save" value={this.state.value} method="PUT" url={"/api/departments/" + this.props.match.params.id} redirectUrl="/v2/mgmt/departments" />
            </>
        );
    }

    public componentDidMount() {
        if (this.department) {
            this.department
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
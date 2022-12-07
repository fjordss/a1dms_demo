import { FetchData, Form, FormResponse, FormType, Modal, ModalError, RouteComponentProps } from 'a1dms-front';
import React from 'react'
import { Employee } from './Employees';
import EmployeesForm from './EmployeesForm';

export interface EmployeesEditFormState {
    value: Employee;
    errors: Array<string>;
}

export interface EmployeesEditFormParams {
    id: number;
}

export default class EmployeesEditForm extends React.Component<RouteComponentProps<EmployeesEditFormParams>, EmployeesEditFormState> {
    private employee: Promise<FormResponse<Employee>>;

    public constructor(props: RouteComponentProps<EmployeesEditFormParams>) {
        super(props);

        this.state = {
            value: null,
            errors: []
        };
    }

    public render() {
        return (
            <>
                {this.state.value == null ? <FetchData<FormResponse<Employee>>
                    obj={this}
                    prop="employee"
                    url={"/api/employees/" + this.props.match.params.id}
                    map={res => this.mapEmployee(res)}
                /> : <></>}

                <Modal loading={true} visible={this.state.value == null} />
                <ModalError visible={this.state.errors.length > 0} errors={this.state.errors} backLabel="Back to Employees" backUrl="/v2/mgmt/employees" />

                <EmployeesForm formType={FormType.edit} submitLabel="Save" value={this.state.value} method="PUT" url={"/api/employees/" + this.props.match.params.id} redirectUrl="/v2/mgmt/employees" />
            </>
        );
    }

    private mapEmployee(res: FormResponse<Employee>): FormResponse<Employee> {
        return res;
    }

    public componentDidMount() {
        if (this.employee) {
            this.employee
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
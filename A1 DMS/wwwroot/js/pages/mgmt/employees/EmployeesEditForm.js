import React from 'react';
import FetchData from '../../../components/FetchData';
import Form, { FormType } from '../../../components/Form';
import Modal from '../../../components/Modal';
import ModalError from '../../../components/ModalError';
import EmployeesForm from './EmployeesForm';
export default class EmployeesEditForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            value: null,
            errors: []
        };
    }
    render() {
        return (React.createElement(React.Fragment, null,
            this.state.value == null ? React.createElement(FetchData, { obj: this, prop: "employee", url: "/api/employees/" + this.props.match.params.id, map: res => this.mapEmployee(res) }) : React.createElement(React.Fragment, null),
            React.createElement(Modal, { loading: true, visible: this.state.value == null }),
            React.createElement(ModalError, { visible: this.state.errors.length > 0, errors: this.state.errors, backLabel: "Back to Employees", backUrl: "/v2/mgmt/employees" }),
            React.createElement(EmployeesForm, { formType: FormType.edit, submitLabel: "Save", value: this.state.value, method: "PUT", url: "/api/employees/" + this.props.match.params.id, redirectUrl: "/v2/mgmt/employees" })));
    }
    mapEmployee(res) {
        return res;
    }
    componentDidMount() {
        if (this.employee) {
            this.employee
                .then(res => {
                if (res.status == "ok")
                    this.setState({ value: res.data });
                else
                    this.setState({ errors: res.errors.map(e => e.text) });
            }, error => this.setState({ errors: [Form.unknownErrorWithRefresh] }))
                .catch(error => this.setState({ errors: [Form.unknownErrorWithRefresh] }));
        }
    }
}
//# sourceMappingURL=EmployeesEditForm.js.map
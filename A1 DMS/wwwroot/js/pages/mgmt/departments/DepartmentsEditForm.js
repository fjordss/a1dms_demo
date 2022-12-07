import React from 'react';
import FetchData from '../../../components/FetchData';
import Form, { FormType } from '../../../components/Form';
import Modal from '../../../components/Modal';
import ModalError from '../../../components/ModalError';
import DepartmentsForm from './DepartmentsForm';
export default class DepartmentsEditForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            value: null,
            errors: []
        };
    }
    render() {
        return (React.createElement(React.Fragment, null,
            this.state.value == null ? React.createElement(FetchData, { obj: this, prop: "department", url: "/api/departments/" + this.props.match.params.id }) : React.createElement(React.Fragment, null),
            React.createElement(Modal, { loading: true, visible: this.state.value == null }),
            React.createElement(ModalError, { visible: this.state.errors.length > 0, errors: this.state.errors, backLabel: "Back to Departments", backUrl: "/v2/mgmt/departments" }),
            React.createElement(DepartmentsForm, { formType: FormType.edit, submitLabel: "Save", value: this.state.value, method: "PUT", url: "/api/departments/" + this.props.match.params.id, redirectUrl: "/v2/mgmt/departments" })));
    }
    componentDidMount() {
        if (this.department) {
            this.department
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
//# sourceMappingURL=DepartmentsEditForm.js.map
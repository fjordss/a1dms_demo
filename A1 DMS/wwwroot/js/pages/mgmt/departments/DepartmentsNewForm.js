import React from 'react';
import { FormType } from '../../../components/Form';
import DepartmentsForm from './DepartmentsForm';
export default class DepartmentsNewForm extends React.Component {
    render() {
        return (React.createElement(DepartmentsForm, { formType: FormType.new, submitLabel: "Create", method: "POST", url: "/api/departments", redirectUrl: "/v2/mgmt/departments" }));
    }
}
//# sourceMappingURL=DepartmentsNewForm.js.map
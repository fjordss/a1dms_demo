import { FormType } from 'a1dms-front';
import React from 'react';
import EmployeesForm from './EmployeesForm';
export default class EmployeesNewForm extends React.Component {
    render() {
        return (React.createElement(EmployeesForm, { formType: FormType.new, submitLabel: "Create", method: "POST", url: "/api/employees", redirectUrl: "/v2/mgmt/employees" }));
    }
}
//# sourceMappingURL=EmployeesNewForm.js.map
import React from 'react';
import { FormType } from '../../../components/Form';
import UsersForm from './UsersForm';
export default class UsersNewForm extends React.Component {
    render() {
        return (React.createElement(UsersForm, { formType: FormType.new, submitLabel: "Create", method: "POST", url: "/api/users", redirectUrl: "/v2/mgmt/users" }));
    }
}
//# sourceMappingURL=UsersNewForm.js.map
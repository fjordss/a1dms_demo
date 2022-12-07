import { FormType } from 'a1dms-front';
import React from 'react';
import UsersForm from './UsersForm';
export default class UsersNewForm extends React.Component {
    render() {
        return (React.createElement(UsersForm, { formType: FormType.new, submitLabel: "Create", method: "POST", url: "/api/users", redirectUrl: "/v2/mgmt/users" }));
    }
}
//# sourceMappingURL=UsersNewForm.js.map
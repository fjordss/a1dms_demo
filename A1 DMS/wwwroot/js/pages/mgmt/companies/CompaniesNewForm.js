import React from 'react';
import { FormType } from '../../../components/Form';
import CompaniesForm from './CompaniesForm';
export default class CompaniesNewForm extends React.Component {
    render() {
        return (React.createElement(CompaniesForm, { formType: FormType.new, submitLabel: "Create", method: "POST", url: "/api/companies", redirectUrl: "/v2/mgmt/companies" }));
    }
}
//# sourceMappingURL=CompaniesNewForm.js.map
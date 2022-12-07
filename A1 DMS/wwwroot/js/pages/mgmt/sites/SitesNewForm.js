import React from 'react';
import { FormType } from '../../../components/Form';
import SitesForm from './SitesForm';
export default class SitesNewForm extends React.Component {
    render() {
        return (React.createElement(SitesForm, { formType: FormType.new, submitLabel: "Create", method: "POST", url: "/api/sites", redirectUrl: "/v2/mgmt/sites" }));
    }
}
//# sourceMappingURL=SitesNewForm.js.map
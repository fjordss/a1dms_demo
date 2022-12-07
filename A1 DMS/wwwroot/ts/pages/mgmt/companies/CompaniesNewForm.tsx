import { FormType } from 'a1dms-front';
import React from 'react'
import CompaniesForm from './CompaniesForm';

export default class CompaniesNewForm extends React.Component {
    public render() {
        return (
            <CompaniesForm formType={FormType.new} submitLabel="Create" method="POST" url="/api/companies" redirectUrl="/v2/mgmt/companies" />
        );
    }
}
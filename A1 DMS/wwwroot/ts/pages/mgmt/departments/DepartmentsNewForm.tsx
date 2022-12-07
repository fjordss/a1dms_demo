import { FormType } from 'a1dms-front';
import React from 'react'
import DepartmentsForm from './DepartmentsForm';

export default class DepartmentsNewForm extends React.Component {
    public render() {
        return (
            <DepartmentsForm formType={FormType.new} submitLabel="Create" method="POST" url="/api/departments" redirectUrl="/v2/mgmt/departments" />
        );
    }
}
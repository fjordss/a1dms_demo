﻿import { FormType } from 'a1dms-front';
import React from 'react'
import SitesForm from './SitesForm'

export default class SitesNewForm extends React.Component {
    public render() {
        return (
            <SitesForm formType={FormType.new} submitLabel="Create" method="POST" url="/api/sites" redirectUrl="/v2/mgmt/sites" />
        );
    }
}
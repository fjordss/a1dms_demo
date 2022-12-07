import React from 'react';
import { Redirect } from 'react-router-dom';
import { policies } from '../pages/mgmt/ManagementApp';
export default class Access extends React.Component {
    constructor(props) {
        super(props);
    }
    render() {
        let policy = policies.get(this.props.policy);
        if (!policy())
            return React.createElement(Redirect, { to: "/v2/mgmt/accessdenied" });
        return (React.createElement(React.Fragment, null));
    }
}
//# sourceMappingURL=Access.js.map
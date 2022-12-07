import React from 'react';
import { Switch, Route } from 'react-router-dom';
import Users from '../../../pages/mgmt/Users';
import Employees from '../../../pages/mgmt/Employees';
import NotFound from '../../../pages/mgmt/NotFound';
export default class Main extends React.Component {
    render() {
        return (React.createElement("main", null,
            React.createElement(Switch, null,
                React.createElement(Route, { path: '/v2/mgmt/employees', component: Employees }),
                React.createElement(Route, { path: '/v2/mgmt/users', component: Users }),
                React.createElement(Route, { component: NotFound }))));
    }
}
//# sourceMappingURL=Main.js.map
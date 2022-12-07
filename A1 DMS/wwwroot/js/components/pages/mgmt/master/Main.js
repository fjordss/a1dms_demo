import React from 'react';
import { Switch, Route } from 'react-router-dom';
import Users from '../../../../pages/mgmt/users/Users';
import Employees from '../../../../pages/mgmt/employees/Employees';
import Cards from '../../../../pages/mgmt/Cards';
import NotFound from '../../../../pages/mgmt/NotFound';
import Sites from '../../../../pages/mgmt/sites/Sites';
import Companies from '../../../../pages/mgmt/companies/Companies';
import Departments from '../../../../pages/mgmt/departments/Departments';
import NominatedCards from '../../../../pages/mgmt/reporting/NominatedCards';
import Closeout from '../../../../pages/mgmt/reporting/Closeout';
import Cord from '../../../../pages/mgmt/reporting/Cord';
import SitesNewForm from '../../../../pages/mgmt/sites/SitesNewForm';
import SitesEditForm from '../../../../pages/mgmt/sites/SitesEditForm';
import DepartmentsEditForm from '../../../../pages/mgmt/departments/DepartmentsEditForm';
import DepartmentsNewForm from '../../../../pages/mgmt/departments/DepartmentsNewForm';
import CompaniesNewForm from '../../../../pages/mgmt/companies/CompaniesNewForm';
import CompaniesEditForm from '../../../../pages/mgmt/companies/CompaniesEditForm';
import UsersEditForm from '../../../../pages/mgmt/users/UsersEditForm';
import UsersNewForm from '../../../../pages/mgmt/users/UsersNewForm';
import EmployeesNewForm from '../../../../pages/mgmt/employees/EmployeesNewForm';
import EmployeesEditForm from '../../../../pages/mgmt/employees/EmployeesEditForm';
import Observer from '../../../../pages/mgmt/reporting/Observer';
import OIMS from '../../../../pages/mgmt/reporting/OIMS';
import Participation from '../../../../pages/mgmt/reporting/Participation';
import Graphics from '../../../../pages/mgmt/reporting/Graphics';
import Nomination from '../../../../pages/mgmt/reporting/Nomination';
import AccessDenied from '../../../../pages/mgmt/AccessDenied';
export default class Main extends React.Component {
    render() {
        return (React.createElement("main", null,
            React.createElement(Switch, null,
                React.createElement(Route, { path: '/v2/mgmt/cards', exact: true, component: Cards }),
                React.createElement(Route, { path: '/v2/mgmt/sites', exact: true, component: Sites }),
                React.createElement(Route, { path: '/v2/mgmt/sites/edit/:id', component: SitesEditForm }),
                React.createElement(Route, { path: '/v2/mgmt/sites/new', component: SitesNewForm }),
                React.createElement(Route, { path: '/v2/mgmt/departments', exact: true, component: Departments }),
                React.createElement(Route, { path: '/v2/mgmt/departments/edit/:id', component: DepartmentsEditForm }),
                React.createElement(Route, { path: '/v2/mgmt/departments/new', component: DepartmentsNewForm }),
                React.createElement(Route, { path: '/v2/mgmt/companies', exact: true, component: Companies }),
                React.createElement(Route, { path: '/v2/mgmt/companies/edit/:id', component: CompaniesEditForm }),
                React.createElement(Route, { path: '/v2/mgmt/companies/new', component: CompaniesNewForm }),
                React.createElement(Route, { path: '/v2/mgmt/users', exact: true, component: Users }),
                React.createElement(Route, { path: '/v2/mgmt/users/edit/:id', component: UsersEditForm }),
                React.createElement(Route, { path: '/v2/mgmt/users/new', component: UsersNewForm }),
                React.createElement(Route, { path: '/v2/mgmt/employees', exact: true, component: Employees }),
                React.createElement(Route, { path: '/v2/mgmt/employees/edit/:id', component: EmployeesEditForm }),
                React.createElement(Route, { path: '/v2/mgmt/employees/new', component: EmployeesNewForm }),
                React.createElement(Route, { path: '/v2/mgmt/reporting/nominatedcards', exact: true, component: NominatedCards }),
                React.createElement(Route, { path: '/v2/mgmt/reporting/nomination', exact: true, component: Nomination }),
                React.createElement(Route, { path: '/v2/mgmt/reporting/closeout', exact: true, component: Closeout }),
                React.createElement(Route, { path: '/v2/mgmt/reporting/cord', exact: true, component: Cord }),
                React.createElement(Route, { path: '/v2/mgmt/reporting/observer', exact: true, component: Observer }),
                React.createElement(Route, { path: '/v2/mgmt/reporting/oims', exact: true, component: OIMS }),
                React.createElement(Route, { path: '/v2/mgmt/reporting/participation', exact: true, component: Participation }),
                React.createElement(Route, { path: '/v2/mgmt/reporting/graphics', exact: true, component: Graphics }),
                React.createElement(Route, { path: '/v2/mgmt/accessdenied', exact: true, component: AccessDenied }),
                React.createElement(Route, { component: NotFound }))));
    }
}
//# sourceMappingURL=Main.js.map
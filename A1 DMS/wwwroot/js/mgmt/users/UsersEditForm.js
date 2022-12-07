import { FetchData, Form, FormType, Modal, ModalError } from 'a1dms-front';
import React from 'react';
import UsersForm from './UsersForm';
export default class UsersEditForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            value: null,
            errors: []
        };
    }
    render() {
        return (React.createElement(React.Fragment, null,
            this.state.value == null ? React.createElement(FetchData, { obj: this, prop: "user", url: "/api/users/" + this.props.match.params.id, map: res => this.mapUser(res) }) : React.createElement(React.Fragment, null),
            React.createElement(Modal, { loading: true, visible: this.state.value == null }),
            React.createElement(ModalError, { visible: this.state.errors.length > 0, errors: this.state.errors, backLabel: "Back to Users", backUrl: "/v2/mgmt/users" }),
            React.createElement(UsersForm, { formType: FormType.edit, submitLabel: "Save", value: this.state.value, method: "PUT", url: "/api/users/" + this.props.match.params.id, redirectUrl: "/v2/mgmt/users" })));
    }
    mapUser(res) {
        if (!Array.isArray(res.data.role)) {
            let count = new UsersForm(null).getFields().find(f => f.name == "role").options.length;
            let role = res.data.role;
            let roles = [];
            for (let i = 0; i < count; i++) {
                let current = Math.pow(2, i);
                if ((role & current) == current)
                    roles.push(current);
            }
            res.data.role = roles;
        }
        return res;
    }
    componentDidMount() {
        if (this.user) {
            this.user
                .then(res => {
                if (res.status == "ok")
                    this.setState({ value: res.data });
                else
                    this.setState({ errors: res.errors.map(e => e.text) });
            }, error => this.setState({ errors: [Form.unknownErrorWithRefresh] }))
                .catch(error => this.setState({ errors: [Form.unknownErrorWithRefresh] }));
        }
    }
}
//# sourceMappingURL=UsersEditForm.js.map
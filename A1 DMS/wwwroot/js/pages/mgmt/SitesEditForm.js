import React from 'react';
import FetchData from '../../components/FetchData';
import Form from '../../components/Form';
import ModalError from '../../components/ModalError';
import ModalPreloader from '../../components/ModalPreloader';
import SitesForm from './SitesForm';
export default class SitesEditForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            value: null,
            errors: []
        };
    }
    render() {
        return (React.createElement(React.Fragment, null,
            this.state.value == null ? React.createElement(FetchData, { obj: this, prop: "site", url: "/api/sites/" + this.props.match.params.id }) : React.createElement(React.Fragment, null),
            React.createElement(ModalPreloader, { visible: this.state.value == null }),
            React.createElement(ModalError, { visible: this.state.errors.length > 0, errors: this.state.errors, backLabel: "Back to Sites", backUrl: "/v2/mgmt/sites" }),
            React.createElement(SitesForm, { submitLabel: "Save", value: this.state.value, method: "PUT", url: "/api/sites/" + this.props.match.params.id, redirectUrl: "/v2/mgmt/sites" })));
    }
    componentDidMount() {
        if (this.site) {
            this.site
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
//# sourceMappingURL=SitesEditForm.js.map
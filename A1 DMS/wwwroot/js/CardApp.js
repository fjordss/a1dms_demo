import React from 'react';
import ReactDOM from 'react-dom';
import { FetchData, Form, Modal, ModalError } from 'a1dms-front';
import Auth from './Auth';
import Card, { Lang } from './Card';
import MyParticipation from './MyParticipation';
class CardApp extends React.Component {
    constructor(props = null) {
        super(props);
        this.state = {
            loadingSites: true,
            loading: true,
            authenticated: false,
            showError: false,
            showResult: false,
            myParticipation: false
        };
    }
    render() {
        if (!this.state.authenticated)
            document.title = "Nobody Gets Hurt - Login";
        else {
            document.title = "Nobody Gets Hurt" + (this.state.myParticipation ? " - My Participation" : "");
            for (let child of document.body.children) {
                if (child.tagName.toLowerCase() == "div" && !child.id)
                    child.remove();
            }
        }
        return (React.createElement(React.Fragment, null,
            React.createElement(Modal, { loading: true, visible: this.state.loading }),
            React.createElement(ModalError, { visible: this.state.showError, errors: [Form.unknownError], onClose: () => this.setState({ showError: false }) }),
            React.createElement(Modal, { visible: this.state.showResult, canBeClosed: true, width: 295, height: 175, onClose: () => location.reload() },
                React.createElement("span", { className: "card-unique-id" }, this.state.lang == Lang.english ? "Card #" + this.state.uniqueId + " submitted successfully" : "Карта #" + this.state.uniqueId + " успешно отправлена")),
            this.state.loadingSites ?
                React.createElement(FetchData, { url: "/api/sites?rowsPerPage=100", obj: this, prop: "sitesPromise", map: res => res.data.rows.map(s => s.name), after: () => this.sitesPromise.then(data => {
                        this.sites = data;
                        this.setState({
                            loadingSites: false,
                            loading: false
                        });
                    }) }) :
                React.createElement(React.Fragment, null, this.state.authenticated ?
                    (this.state.myParticipation ?
                        React.createElement(MyParticipation, { alertVisible: false, employee: this.state.employee, onError: () => this.setState({ showError: true }), onNewCardPressed: () => this.setState({ myParticipation: false }) }) :
                        React.createElement(Card, { sites: this.sites, lang: this.state.lang, site: this.state.site, employee: this.state.employee, onSend: () => this.setState({ loading: true }), onError: () => this.setState({
                                loading: false,
                                showError: true
                            }), onSubmit: uniqueId => this.setState({
                                loading: false,
                                showResult: true,
                                uniqueId
                            }) })) :
                    React.createElement(Auth, { alertVisible: false, sites: this.sites, onSend: () => this.setState({ loading: true }), onError: error => this.setState({
                            loading: false,
                            showError: !error.field
                        }), onAuth: (site, lang, employee, myParticipation) => this.setState({
                            loading: false,
                            site: site,
                            lang: lang,
                            employee: employee,
                            authenticated: true,
                            myParticipation: myParticipation
                        }) }))));
    }
}
ReactDOM.render(React.createElement(CardApp, null), document.getElementById("main"));
//# sourceMappingURL=CardApp.js.map
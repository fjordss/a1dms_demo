import React from 'react';
import Form from '../components/Form';
import { CommonHelper, HttpMethod } from '../source/CommonHelper';
import { Lang } from './Card';
export default class Auth extends React.Component {
    constructor(props) {
        super(props);
        this.onClick = (myParticipation) => {
            let siteError = false;
            if (!this.state.site)
                siteError = true;
            let codeError = false;
            if (!this.state.code)
                codeError = true;
            let langError = false;
            if (this.state.lang == null)
                langError = true;
            this.setState({
                siteError,
                codeError,
                langError
            });
            if (!siteError && !codeError && !langError)
                this.auth(myParticipation);
        };
        this.state = {
            selectPlaceholderVisible: true,
            site: "",
            code: null,
            lang: null,
            kiosk: typeof (kiosk) !== "undefined" ? kiosk : ""
        };
    }
    render() {
        return (React.createElement("div", { className: "auth-main" },
            React.createElement("img", { src: "/images/exxonlogo.png", className: "auth-logo" }),
            React.createElement("div", { className: "auth-alert" + (!this.props.alertVisible ? " hidden" : "") }, "Attention! This NGH Portal version is for educational purpose only"),
            React.createElement("div", { className: "auth-fields" },
                React.createElement("div", null),
                React.createElement("div", { className: "auth-field" },
                    React.createElement("div", { className: "auth-label-ru" }, "\u0412\u044B\u0431\u0435\u0440\u0438\u0442\u0435 \u0441\u0430\u0439\u0442"),
                    React.createElement("div", { className: "auth-label-en" }, "Choose a Site"),
                    React.createElement("div", { className: "auth-control" },
                        this.state.selectPlaceholderVisible ? React.createElement("div", { className: "auth-placeholder" }, "Choose a Site") : React.createElement(React.Fragment, null),
                        React.createElement("select", { className: "auth-site" + (this.state.siteError ? " error" : ""), value: this.state.site, onChange: e => this.setState({
                                selectPlaceholderVisible: false,
                                site: e.currentTarget.value
                            }) }, this.props.sites.map((s, i) => (i == 0 && this.state.selectPlaceholderVisible) ? React.createElement("option", { selected: true, disabled: true }) : React.createElement("option", null, s))))),
                React.createElement("div", null),
                React.createElement("div", null),
                React.createElement("div", { className: "auth-field" },
                    React.createElement("div", { className: "auth-label-ru" }, "\u041F\u0435\u0440\u0441\u043E\u043D\u0430\u043B\u044C\u043D\u044B\u0439 \u043D\u043E\u043C\u0435\u0440"),
                    React.createElement("div", { className: "auth-label-en" }, "NGH Number"),
                    React.createElement("div", { className: "auth-control" },
                        React.createElement("input", { type: "number", value: this.state.code, onChange: e => this.setState({ code: parseInt(e.currentTarget.value) > 99999 ? this.state.code : parseInt(e.currentTarget.value) }), className: this.state.codeError ? "error" : "" }))),
                React.createElement("div", null),
                React.createElement("div", null),
                React.createElement("div", { className: "auth-field" },
                    React.createElement("div", { className: "auth-label-ru" }, "\u0412\u044B\u0431\u0435\u0440\u0438\u0442\u0435 \u044F\u0437\u044B\u043A"),
                    React.createElement("div", { className: "auth-label-en" }, "Choose a Language"),
                    React.createElement("div", { className: "auth-control" + (this.state.langError ? " error" : "") },
                        React.createElement("div", { className: "auth-lang-control" },
                            React.createElement("input", { id: "langRu", type: "radio", name: "lang", checked: this.state.lang == Lang.russian, onChange: () => this.setState({ lang: Lang.russian }) }),
                            "\u00A0",
                            React.createElement("label", { htmlFor: "langRu" }, "\u0420\u0443\u0441\u0441\u043A\u0438\u0439")),
                        React.createElement("div", { className: "auth-lang-control" },
                            React.createElement("input", { id: "langEn", type: "radio", name: "lang", checked: this.state.lang == Lang.english, onChange: () => this.setState({ lang: Lang.english }) }),
                            "\u00A0",
                            React.createElement("label", { htmlFor: "langEn" }, "English")))),
                React.createElement("div", null),
                React.createElement("div", null),
                React.createElement("div", { className: "auth-button-row" },
                    React.createElement("div", null,
                        React.createElement("button", { className: "auth-button auth-save-button", onClick: () => this.onClick(false) },
                            "\u041D\u043E\u0432\u0430\u044F \u043A\u0430\u0440\u0442\u0430",
                            React.createElement("br", null),
                            "New Card")),
                    React.createElement("div", null,
                        React.createElement("button", { className: "auth-button auth-participation-button", onClick: () => this.onClick(true) },
                            "\u041C\u043E\u0435 \u0443\u0447\u0430\u0441\u0442\u0438\u0435",
                            React.createElement("br", null),
                            "My Participation"))))));
    }
    send(token = null, myParticipation) {
        let url = "/api/employees/info/" + this.state.code;
        let add = [];
        if (token)
            add.push("recaptchaToken=" + encodeURIComponent(token));
        if (this.state.kiosk)
            add.push("kiosk=" + encodeURIComponent(this.state.kiosk));
        if (add.length > 0)
            url += "?" + add.join("&");
        this.props.onSend();
        let handleError = (error) => {
            this.setState({ codeError: error.field == "code" });
            this.props.onError(error);
        };
        CommonHelper.fetch(url, HttpMethod.get)
            .then(res => {
            if (res.status == "ok")
                this.props.onAuth(this.state.site, this.state.lang, res.data, myParticipation);
            else
                handleError(res.errors[0]);
        })
            .catch(() => handleError({ text: Form.unknownError }));
    }
    auth(myParticipation) {
        if (!this.state.kiosk) {
            grecaptcha.ready(() => {
                grecaptcha.execute('6LeK2AcaAAAAAKBb9Ayt7t41q8z4-9zz2fTlwmyf', { action: 'submit' }).then((token) => {
                    this.send(token, myParticipation);
                });
            });
        }
        else
            this.send(null, myParticipation);
    }
}
//# sourceMappingURL=Auth.js.map
import { Form, FormReponseError, http } from 'a1dms-front';
import { HttpMethod } from 'a1dms-front';
import React from 'react'
import { EmployeeInfo, Lang } from './Card';

export interface AuthProps {
    alertVisible: boolean;
    sites: Array<string>;

    onSend: () => void;
    onError: (error: FormReponseError) => void;
    onAuth: (site: string, lang: Lang, employee: EmployeeInfo, myParticipation: boolean) => void;
}

export interface AuthState {
    site: string;
    code: number;
    lang: Lang;
    kiosk: string;

    siteError?: boolean;
    codeError?: boolean;
    langError?: boolean;

    selectPlaceholderVisible: boolean;
}

export declare let kiosk: string;
export declare let grecaptcha: any;

export default class Auth extends React.Component<AuthProps, AuthState> {
    public constructor(props) {
        super(props);

        this.state = {
            selectPlaceholderVisible: true,
            site: "",
            code: null,
            lang: null,
            kiosk: typeof (kiosk) !== "undefined" ? kiosk : ""
        };
    }

    public render() {
        return (
            <div className="auth-main">
                <img src="/images/exxonlogo.png" className="auth-logo" />

                <div className={"auth-alert" + (!this.props.alertVisible ? " hidden" : "")}>Attention! This NGH Portal version is for educational purpose only</div>

                <div className="auth-fields">
                    <div></div>
                    <div className="auth-field">
                        <div className="auth-label-ru">Выберите сайт</div>
                        <div className="auth-label-en">Choose a Site</div>
                        <div className="auth-control">
                            {this.state.selectPlaceholderVisible ? <div className="auth-placeholder">Choose a Site</div> : <></>}
                            <select className={"auth-site" + (this.state.siteError ? " error" : "")} value={this.state.site} onChange={e => this.setState({
                                selectPlaceholderVisible: false,
                                site: e.currentTarget.value
                            })}>
                                {this.props.sites.map((s, i) => (i == 0 && this.state.selectPlaceholderVisible) ? <option selected={true} disabled={true}></option> : <option>{s}</option>)}
                            </select>
                        </div>
                    </div>
                    <div></div>

                    <div></div>
                    <div className="auth-field">
                        <div className="auth-label-ru">Персональный номер</div>
                        <div className="auth-label-en">NGH Number</div>
                        <div className="auth-control">
                            <input
                                type="number"
                                value={this.state.code}
                                onChange={e => this.setState({ code: parseInt(e.currentTarget.value) > 99999 ? this.state.code : parseInt(e.currentTarget.value) })}
                                className={this.state.codeError ? "error" : ""}
                            />
                        </div>
                    </div>
                    <div></div>

                    <div></div>
                    <div className="auth-field">
                        <div className="auth-label-ru">Выберите язык</div>
                        <div className="auth-label-en">Choose a Language</div>
                        <div className={"auth-control" + (this.state.langError ? " error" : "")}>
                            <div className="auth-lang-control">
                                <input id="langRu" type="radio" name="lang" checked={this.state.lang == Lang.russian} onChange={() => this.setState({ lang: Lang.russian })} />&nbsp;
                                <label htmlFor="langRu">Русский</label>
                            </div>
                            <div className="auth-lang-control">
                                <input id="langEn" type="radio" name="lang" checked={this.state.lang == Lang.english} onChange={() => this.setState({ lang: Lang.english })} />&nbsp;
                                <label htmlFor="langEn">English</label>
                            </div>
                        </div>
                    </div>
                    <div></div>

                    <div></div>
                    <div className="auth-button-row">
                        <div><button className="auth-button auth-save-button" onClick={() => this.onClick(false)}>Новая карта<br />New Card</button></div>
                        <div><button className="auth-button auth-participation-button" onClick={() => this.onClick(true)}>Мое участие<br />My Participation</button></div>
                    </div>
                </div>
            </div>
        );
    }

    private send(token: string = null, myParticipation: boolean) {
        let url = "/api/employees/info/" + this.state.code;

        let add: Array<string> = [];
        if (token)
            add.push("recaptchaToken=" + encodeURIComponent(token));

        if (this.state.kiosk)
            add.push("kiosk=" + encodeURIComponent(this.state.kiosk));

        if (add.length > 0)
            url += "?" + add.join("&");

        this.props.onSend();

        let handleError = (error: FormReponseError) => {
            this.setState({ codeError: error.field == "code" });
            this.props.onError(error);
        };

        http.fetch<EmployeeInfo>(url, HttpMethod.get)
            .then(res => {
                if (res.status == "ok")
                    this.props.onAuth(this.state.site, this.state.lang, res.data, myParticipation);
                else
                    handleError(res.errors[0])

            })
            .catch(() => handleError({ text: Form.unknownError }));
    }

    private auth(myParticipation: boolean) {
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

    private onClick = (myParticipation: boolean) => {
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
    }
}
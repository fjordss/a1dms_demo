import { http } from 'a1dms-front';
import { HttpMethod } from 'a1dms-front';
import React from 'react'
import CardLabel from './CardLabel';
import HazardId from './HazardId';
import LSA from './LSA';
import { Employee } from './mgmt/employees/Employees';
import ReportType from './ReportType';
import SafeChoice from './SafeChoice';

export enum Lang {
    english,
    russian
}

export interface LangPair {
    en: string;
    ru: string;
}

export interface EmployeeInfo {
    code: number;
    firstName?: string;
    lastName?: string;
    company: string;
    department: string;
}

export interface CardProps {
    lang: Lang;
    sites: Array<string>;
    site: string;
    employee: EmployeeInfo;
    onSend: () => void;
    onError: () => void;
    onSubmit: (uniqueId: string) => void;
}

export interface CardState {
    site: string;
    date: string;
    firstName: string;
    lastName: string;
    company: string;
    department: string;
    reportType: string;
    LSA: string;
    HID: Array<string>;
    description: string;
    actionsTaken: string;
    safeChoice: Array<string>;
    furtherActionsRequired: boolean;
    location: string;
    suggestedFurtherActions: string;

    submitTried: boolean;
}

export default class Card extends React.Component<CardProps, CardState> {
    private validated: boolean;
    private submitted: boolean;
    private labels = new Map<string, LangPair>();

    public constructor(props) {
        super(props);

        this.fillLabels();

        let now = new Date();

        this.state = {
            site: this.props.site,
            date: now.getFullYear() + "-" + (now.getMonth() < 9 ? "0" : "") + (now.getMonth() + 1).toString() + "-" + (now.getDate() < 10 ? "0" : "") + (now.getDate()).toString(),
            firstName: this.props.employee.firstName ? this.props.employee.firstName.trim() : "",
            lastName: this.props.employee.lastName ? this.props.employee.lastName.trim() : "",
            company: this.props.employee.company ? this.props.employee.company.trim() : "",
            department: this.props.employee.department ? this.props.employee.department.trim() : "",
            reportType: null,
            LSA: "Not Applicable",
            HID: [],
            description: "",
            actionsTaken: "",
            safeChoice: [],
            furtherActionsRequired: false,
            location: "",
            suggestedFurtherActions: "",

            submitTried: false
        };
    }

    public render() {
        this.validated = true;

        let safeOrEmpty = this.state.reportType == "Safe Behavior" || !this.state.reportType;
        let hidOrEmpty = this.state.reportType == "Hazard ID" || !this.state.reportType;

        let offTheSite = this.state.HID.indexOf("Off the Site") != -1;

        return (
            <>
                <div className="card-main">
                    <div className="card-left">
                        <div>
                            <CardLabel pair={this.getLabel("date")} lang={this.props.lang} />
                            <div><input type="date" disabled={true} value={this.state.date} /></div>
                        </div>
                        <div>
                            <CardLabel pair={this.getLabel("site")} lang={this.props.lang} />
                            <div><select disabled={true} value={this.state.site}>{this.props.sites.map(s => <option>{s}</option>)}</select></div>
                        </div>

                        <div>
                            <CardLabel pair={this.getLabel("firstName")} lang={this.props.lang} error={this.mandatory(!this.state.firstName.trim())} />
                            <div><input type="text" onChange={e => this.setState({ firstName: e.currentTarget.value })} value={this.state.firstName} disabled={!!this.props.employee.firstName} /></div>
                        </div>
                        <div>
                            <CardLabel pair={this.getLabel("lastName")} lang={this.props.lang} error={this.mandatory(!this.state.lastName.trim())} />
                            <div><input type="text" onChange={e => this.setState({ lastName: e.currentTarget.value })} value={this.state.lastName} disabled={!!this.props.employee.lastName} /></div>
                        </div>

                        <div>
                            <CardLabel pair={this.getLabel("department")} lang={this.props.lang} />
                            <div><input type="text" onChange={e => this.setState({ department: e.currentTarget.value })} value={this.state.department} disabled={true} /></div>
                        </div>
                        <div>
                            <CardLabel pair={this.getLabel("company")} lang={this.props.lang} />
                            <div><input type="text" onChange={e => this.setState({ company: e.currentTarget.value })} value={this.state.company} disabled={true} /></div>
                        </div>

                        <div className="card-report-type"><ReportType lang={this.props.lang} value={this.state.reportType} onChange={this.onChangeReportType} error={this.mandatory(!this.state.reportType)} /></div>

                        <div className="card-lsa"><LSA lang={this.props.lang} value={this.state.LSA} onChange={value => this.setState({ LSA: value })} disabled={this.state.reportType == "Hazard ID"} /></div>

                        <div className="card-hid"><HazardId lang={this.props.lang} values={this.state.HID} onChange={this.onChangeHID} error={this.mandatory(this.state.HID.length == 0)} /></div>
                    </div>

                    <div className="card-right">
                        <div>
                            <CardLabel pair={this.getLabel("description")} lang={this.props.lang} error={this.mandatory(!this.state.description)} />
                            <div><textarea onChange={e => this.setState({ description: e.currentTarget.value })} value={this.state.description} maxLength={2000}></textarea></div>
                        </div>

                        <div>
                            <CardLabel pair={this.getLabel("actionsTaken")} lang={this.props.lang} error={this.mandatory(!this.state.actionsTaken)} />
                            <div><textarea onChange={e => this.setState({ actionsTaken: e.currentTarget.value })} value={this.state.actionsTaken} maxLength={2000}></textarea></div>
                        </div>

                        <div className="card-safe-choice">
                            <SafeChoice lang={this.props.lang} values={this.state.safeChoice} onChange={value => this.setState({ safeChoice: value })} disabled={hidOrEmpty} error={this.mandatory(this.state.reportType == "Safe Behavior" && (this.state.safeChoice.length == 0 || this.state.safeChoice[0] == "Not Applicable"))} />
                        </div>

                        <div className="card-border"></div>

                        <div className="card-inline-item">
                            <input type="checkbox" id="further-actions-required" onChange={this.onChangeActionRequired} checked={this.state.furtherActionsRequired} disabled={safeOrEmpty || offTheSite} />
                            <CardLabel pair={this.getLabel("furtherActionsRequired")} lang={this.props.lang} htmlFor="further-actions-required" className="card-inline bold" error={this.custom()} />
                        </div>

                        <div>
                            <CardLabel pair={this.getLabel("location")} lang={this.props.lang} error={this.custom() || this.mandatory(this.state.furtherActionsRequired && !this.state.location)} />
                            <div>
                                <input type="text" onChange={e => this.setState({ location: e.currentTarget.value })} value={this.state.location} disabled={!this.state.furtherActionsRequired} className="card-location" />
                            </div>
                        </div>
                        
                        <div>
                            <CardLabel pair={this.getLabel("suggestedFurtherActions")} lang={this.props.lang} error={this.custom() || this.mandatory(this.state.furtherActionsRequired && !this.state.suggestedFurtherActions)} />
                            <div>
                                <textarea
                                    onChange={e => this.setState({ suggestedFurtherActions: e.currentTarget.value })}
                                    value={this.state.suggestedFurtherActions}
                                    disabled={!this.state.furtherActionsRequired}
                                    maxLength={2000}
                                ></textarea>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="card-button-row">
                    <button onClick={this.onSubmit}>
                        <CardLabel pair={this.getLabel("saveButton")} lang={this.props.lang} className="card-inline" />
                    </button>

                    <button onClick={() => location.reload()}>
                        <CardLabel pair={this.getLabel("cancelButton")} lang={this.props.lang} className="card-inline" />
                    </button>
                </div>
            </>
        );
    }

    public componentDidUpdate() {
        if (this.submitted) {
            this.submitted = false;
            if (this.validated) {
                this.send();
            }
        }
    }

    private formatUniqueId(uniqueId: number) {
        let str = uniqueId.toString();
        let newStr = "";
        for (let i = 0; i < str.length; i++) {
            newStr += str[i];
            if ((i + 1) % 3 == 0)
                newStr += " ";
        }

        return newStr.trim();
    }

    private send() {
        this.props.onSend();

        let body = new Map<string, string | string[]>();
        body.set("site", this.state.site);
        body.set("firstName", this.state.firstName);
        body.set("lastName", this.state.lastName);
        body.set("company", this.state.company);
        body.set("department", this.state.department);
        body.set("reportType", this.state.reportType);
        body.set("lifeSavingActions", this.state.LSA);
        body.set("hazardIdentification", this.state.HID);
        body.set("description", this.state.description);
        body.set("actionsTaken", this.state.actionsTaken);
        body.set("safeChoice", this.state.safeChoice);
        body.set("furtherActionsRequired", this.state.furtherActionsRequired.toString());
        body.set("specificLocation", this.state.location);
        body.set("suggestedFurtherActions", this.state.suggestedFurtherActions);

        let handleError = () => this.props.onError();

        http.fetch<number>("/api/cards", HttpMethod.post, body)
            .then(res => {
                if (res.status == "ok") {
                    this.props.onSubmit(this.formatUniqueId(res.data));
                }
                else
                    handleError();
            })
            .catch(() => handleError());
    }

    private custom() {
        if (this.state.reportType == "Safe Behavior")
            return this.props.lang == Lang.english ? this.getLabel("notAvailableSafe").en : this.getLabel("notAvailableSafe").ru;

        if (this.state.HID.indexOf("Off the Site") != -1)
            return this.props.lang == Lang.english ? this.getLabel("notAvailableOff").en : this.getLabel("notAvailableOff").ru;

        return null;
    }

    private mandatory(condition: boolean) {
        if (condition && this.state.submitTried) {
            this.validated = false;

            return this.props.lang == Lang.english ? this.getLabel("mandatory").en : this.getLabel("mandatory").ru;
        }

        return null;
    }

    private onSubmit = () => {
        this.submitted = true;

        this.setState({ submitTried: true });
    }

    private onChangeActionRequired = (e: React.ChangeEvent<HTMLInputElement>) => {
        let checked = e.currentTarget.checked
        this.setState({
            furtherActionsRequired: checked,
            location: this.state.location ? (checked ? this.state.location : "") : "",
            suggestedFurtherActions: this.state.suggestedFurtherActions ? (checked ? this.state.suggestedFurtherActions : "") : ""
        })
    }

    private onChangeHID = (values: Array<string>) => {
        let offTheSite = values.indexOf("Off the Site") != -1;

        this.setState({
            HID: values,
            furtherActionsRequired: this.state.furtherActionsRequired ? !offTheSite : this.state.furtherActionsRequired,
            location: this.state.location ? (offTheSite ? "" : this.state.location) : this.state.location,
            suggestedFurtherActions: this.state.suggestedFurtherActions ? (offTheSite ? "" : this.state.suggestedFurtherActions) : this.state.suggestedFurtherActions
        })
    }

    private onChangeReportType = (reportType: string) => {
        this.setState({
            reportType: reportType,
            furtherActionsRequired: this.state.furtherActionsRequired ? reportType != "Safe Behavior" : this.state.furtherActionsRequired,
            location: this.state.location ? (reportType != "Safe Behavior" ? this.state.location : "") : this.state.location,
            suggestedFurtherActions: this.state.suggestedFurtherActions ? (reportType != "Safe Behavior" ? this.state.suggestedFurtherActions : "") : this.state.suggestedFurtherActions,
            LSA: this.state.LSA ? (reportType != "Hazard ID" ? this.state.LSA : "Not Applicable") : this.state.LSA,
            safeChoice: this.state.safeChoice.length > 0 ? (reportType != "Hazard ID" ? this.state.safeChoice : []) : []
        })
    }

    private getLabel(name: string): LangPair {
        if (!this.labels.has(name))
            throw new Error("label does not exist");

        return this.labels.get(name);
    }

    private fillLabels() {
        this.fillLabel("mandatory", "Field is mandatory", "Обязательное поле для заполнения");
        this.fillLabel("notAvailableSafe", "Not available for Safe Behavior", "Недоступно для безопасного поведения");
        this.fillLabel("notAvailableOff", "Not available for Off the Site", "Недоступно вне сайта");
        this.fillLabel("date", "Date", "Дата");
        this.fillLabel("site", "Site", "Сайт");
        this.fillLabel("firstName", "Worker First Name", "Имя работника (Наблюдатель)");
        this.fillLabel("lastName", "Worker Last Name", "Фамилия работника (Наблюдатель)");
        this.fillLabel("department", "Department", "Отдел");
        this.fillLabel("company", "Company", "Компания");
        this.fillLabel("description", "Description (What did you see)", "Описание (что вы наблюдали)");
        this.fillLabel("actionsTaken", "Actions Taken by You", "Предпринятые вами действия");
        this.fillLabel("furtherActionsRequired", "Further Actions are Required to Solve the Issue (At Site)?", "Требуются дополнительные меры для решения данного вопроса (на производственном объекте)?");
        this.fillLabel("location", "Specific Location", "Местоположение");
        this.fillLabel("suggestedFurtherActions", "Suggested Further Actions", "Предложенные дополнительные меры");
        this.fillLabel("saveButton", "Submit", "Отправить");
        this.fillLabel("cancelButton", "Log Out", "Выйти");
    }

    private fillLabel(key: string, enValue: string, ruValue: string) {
        this.labels.set(key, {
            en: enValue,
            ru: ruValue
        });
    }
}
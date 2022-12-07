import { http } from 'a1dms-front';
import { HttpMethod } from 'a1dms-front';
import React from 'react';
import CardLabel from './CardLabel';
import HazardId from './HazardId';
import LSA from './LSA';
import ReportType from './ReportType';
import SafeChoice from './SafeChoice';
export var Lang;
(function (Lang) {
    Lang[Lang["english"] = 0] = "english";
    Lang[Lang["russian"] = 1] = "russian";
})(Lang || (Lang = {}));
export default class Card extends React.Component {
    constructor(props) {
        super(props);
        this.labels = new Map();
        this.onSubmit = () => {
            this.submitted = true;
            this.setState({ submitTried: true });
        };
        this.onChangeActionRequired = (e) => {
            let checked = e.currentTarget.checked;
            this.setState({
                furtherActionsRequired: checked,
                location: this.state.location ? (checked ? this.state.location : "") : "",
                suggestedFurtherActions: this.state.suggestedFurtherActions ? (checked ? this.state.suggestedFurtherActions : "") : ""
            });
        };
        this.onChangeHID = (values) => {
            let offTheSite = values.indexOf("Off the Site") != -1;
            this.setState({
                HID: values,
                furtherActionsRequired: this.state.furtherActionsRequired ? !offTheSite : this.state.furtherActionsRequired,
                location: this.state.location ? (offTheSite ? "" : this.state.location) : this.state.location,
                suggestedFurtherActions: this.state.suggestedFurtherActions ? (offTheSite ? "" : this.state.suggestedFurtherActions) : this.state.suggestedFurtherActions
            });
        };
        this.onChangeReportType = (reportType) => {
            this.setState({
                reportType: reportType,
                furtherActionsRequired: this.state.furtherActionsRequired ? reportType != "Safe Behavior" : this.state.furtherActionsRequired,
                location: this.state.location ? (reportType != "Safe Behavior" ? this.state.location : "") : this.state.location,
                suggestedFurtherActions: this.state.suggestedFurtherActions ? (reportType != "Safe Behavior" ? this.state.suggestedFurtherActions : "") : this.state.suggestedFurtherActions,
                LSA: this.state.LSA ? (reportType != "Hazard ID" ? this.state.LSA : "Not Applicable") : this.state.LSA,
                safeChoice: this.state.safeChoice.length > 0 ? (reportType != "Hazard ID" ? this.state.safeChoice : []) : []
            });
        };
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
    render() {
        this.validated = true;
        let safeOrEmpty = this.state.reportType == "Safe Behavior" || !this.state.reportType;
        let hidOrEmpty = this.state.reportType == "Hazard ID" || !this.state.reportType;
        let offTheSite = this.state.HID.indexOf("Off the Site") != -1;
        return (React.createElement(React.Fragment, null,
            React.createElement("div", { className: "card-main" },
                React.createElement("div", { className: "card-left" },
                    React.createElement("div", null,
                        React.createElement(CardLabel, { pair: this.getLabel("date"), lang: this.props.lang }),
                        React.createElement("div", null,
                            React.createElement("input", { type: "date", disabled: true, value: this.state.date }))),
                    React.createElement("div", null,
                        React.createElement(CardLabel, { pair: this.getLabel("site"), lang: this.props.lang }),
                        React.createElement("div", null,
                            React.createElement("select", { disabled: true, value: this.state.site }, this.props.sites.map(s => React.createElement("option", null, s))))),
                    React.createElement("div", null,
                        React.createElement(CardLabel, { pair: this.getLabel("firstName"), lang: this.props.lang, error: this.mandatory(!this.state.firstName.trim()) }),
                        React.createElement("div", null,
                            React.createElement("input", { type: "text", onChange: e => this.setState({ firstName: e.currentTarget.value }), value: this.state.firstName, disabled: !!this.props.employee.firstName }))),
                    React.createElement("div", null,
                        React.createElement(CardLabel, { pair: this.getLabel("lastName"), lang: this.props.lang, error: this.mandatory(!this.state.lastName.trim()) }),
                        React.createElement("div", null,
                            React.createElement("input", { type: "text", onChange: e => this.setState({ lastName: e.currentTarget.value }), value: this.state.lastName, disabled: !!this.props.employee.lastName }))),
                    React.createElement("div", null,
                        React.createElement(CardLabel, { pair: this.getLabel("department"), lang: this.props.lang }),
                        React.createElement("div", null,
                            React.createElement("input", { type: "text", onChange: e => this.setState({ department: e.currentTarget.value }), value: this.state.department, disabled: true }))),
                    React.createElement("div", null,
                        React.createElement(CardLabel, { pair: this.getLabel("company"), lang: this.props.lang }),
                        React.createElement("div", null,
                            React.createElement("input", { type: "text", onChange: e => this.setState({ company: e.currentTarget.value }), value: this.state.company, disabled: true }))),
                    React.createElement("div", { className: "card-report-type" },
                        React.createElement(ReportType, { lang: this.props.lang, value: this.state.reportType, onChange: this.onChangeReportType, error: this.mandatory(!this.state.reportType) })),
                    React.createElement("div", { className: "card-lsa" },
                        React.createElement(LSA, { lang: this.props.lang, value: this.state.LSA, onChange: value => this.setState({ LSA: value }), disabled: this.state.reportType == "Hazard ID" })),
                    React.createElement("div", { className: "card-hid" },
                        React.createElement(HazardId, { lang: this.props.lang, values: this.state.HID, onChange: this.onChangeHID, error: this.mandatory(this.state.HID.length == 0) }))),
                React.createElement("div", { className: "card-right" },
                    React.createElement("div", null,
                        React.createElement(CardLabel, { pair: this.getLabel("description"), lang: this.props.lang, error: this.mandatory(!this.state.description) }),
                        React.createElement("div", null,
                            React.createElement("textarea", { onChange: e => this.setState({ description: e.currentTarget.value }), value: this.state.description, maxLength: 2000 }))),
                    React.createElement("div", null,
                        React.createElement(CardLabel, { pair: this.getLabel("actionsTaken"), lang: this.props.lang, error: this.mandatory(!this.state.actionsTaken) }),
                        React.createElement("div", null,
                            React.createElement("textarea", { onChange: e => this.setState({ actionsTaken: e.currentTarget.value }), value: this.state.actionsTaken, maxLength: 2000 }))),
                    React.createElement("div", { className: "card-safe-choice" },
                        React.createElement(SafeChoice, { lang: this.props.lang, values: this.state.safeChoice, onChange: value => this.setState({ safeChoice: value }), disabled: hidOrEmpty, error: this.mandatory(this.state.reportType == "Safe Behavior" && (this.state.safeChoice.length == 0 || this.state.safeChoice[0] == "Not Applicable")) })),
                    React.createElement("div", { className: "card-border" }),
                    React.createElement("div", { className: "card-inline-item" },
                        React.createElement("input", { type: "checkbox", id: "further-actions-required", onChange: this.onChangeActionRequired, checked: this.state.furtherActionsRequired, disabled: safeOrEmpty || offTheSite }),
                        React.createElement(CardLabel, { pair: this.getLabel("furtherActionsRequired"), lang: this.props.lang, htmlFor: "further-actions-required", className: "card-inline bold", error: this.custom() })),
                    React.createElement("div", null,
                        React.createElement(CardLabel, { pair: this.getLabel("location"), lang: this.props.lang, error: this.custom() || this.mandatory(this.state.furtherActionsRequired && !this.state.location) }),
                        React.createElement("div", null,
                            React.createElement("input", { type: "text", onChange: e => this.setState({ location: e.currentTarget.value }), value: this.state.location, disabled: !this.state.furtherActionsRequired, className: "card-location" }))),
                    React.createElement("div", null,
                        React.createElement(CardLabel, { pair: this.getLabel("suggestedFurtherActions"), lang: this.props.lang, error: this.custom() || this.mandatory(this.state.furtherActionsRequired && !this.state.suggestedFurtherActions) }),
                        React.createElement("div", null,
                            React.createElement("textarea", { onChange: e => this.setState({ suggestedFurtherActions: e.currentTarget.value }), value: this.state.suggestedFurtherActions, disabled: !this.state.furtherActionsRequired, maxLength: 2000 }))))),
            React.createElement("div", { className: "card-button-row" },
                React.createElement("button", { onClick: this.onSubmit },
                    React.createElement(CardLabel, { pair: this.getLabel("saveButton"), lang: this.props.lang, className: "card-inline" })),
                React.createElement("button", { onClick: () => location.reload() },
                    React.createElement(CardLabel, { pair: this.getLabel("cancelButton"), lang: this.props.lang, className: "card-inline" })))));
    }
    componentDidUpdate() {
        if (this.submitted) {
            this.submitted = false;
            if (this.validated) {
                this.send();
            }
        }
    }
    formatUniqueId(uniqueId) {
        let str = uniqueId.toString();
        let newStr = "";
        for (let i = 0; i < str.length; i++) {
            newStr += str[i];
            if ((i + 1) % 3 == 0)
                newStr += " ";
        }
        return newStr.trim();
    }
    send() {
        this.props.onSend();
        let body = new Map();
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
        http.fetch("/api/cards", HttpMethod.post, body)
            .then(res => {
            if (res.status == "ok") {
                this.props.onSubmit(this.formatUniqueId(res.data));
            }
            else
                handleError();
        })
            .catch(() => handleError());
    }
    custom() {
        if (this.state.reportType == "Safe Behavior")
            return this.props.lang == Lang.english ? this.getLabel("notAvailableSafe").en : this.getLabel("notAvailableSafe").ru;
        if (this.state.HID.indexOf("Off the Site") != -1)
            return this.props.lang == Lang.english ? this.getLabel("notAvailableOff").en : this.getLabel("notAvailableOff").ru;
        return null;
    }
    mandatory(condition) {
        if (condition && this.state.submitTried) {
            this.validated = false;
            return this.props.lang == Lang.english ? this.getLabel("mandatory").en : this.getLabel("mandatory").ru;
        }
        return null;
    }
    getLabel(name) {
        if (!this.labels.has(name))
            throw new Error("label does not exist");
        return this.labels.get(name);
    }
    fillLabels() {
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
    fillLabel(key, enValue, ruValue) {
        this.labels.set(key, {
            en: enValue,
            ru: ruValue
        });
    }
}
//# sourceMappingURL=Card.js.map
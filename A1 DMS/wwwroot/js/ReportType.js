import React from 'react';
import CardLabel from './CardLabel';
export default class ReportType extends React.Component {
    constructor(props) {
        super(props);
        this.labels = new Map();
        this.onChange = (e) => {
            this.props.onChange(e.currentTarget.value);
        };
        this.fillLabels();
    }
    render() {
        return (React.createElement(React.Fragment, null,
            React.createElement(CardLabel, { pair: this.getLabel("reportType"), lang: this.props.lang, error: this.props.error }),
            React.createElement("div", { className: "card-report-type-grid" },
                React.createElement("div", { className: "card-inline-item" },
                    React.createElement("input", { type: "radio", name: "reportType", id: "safe-behavior", onChange: this.onChange, value: "Safe Behavior", checked: this.props.value == "Safe Behavior" }),
                    React.createElement(CardLabel, { pair: this.getLabel("safeBehavior"), lang: this.props.lang, htmlFor: "safe-behavior", className: "card-inline" })),
                React.createElement("div", { className: "card-inline-item" },
                    React.createElement("input", { type: "radio", name: "reportType", id: "unsafe-behavior", onChange: this.onChange, value: "Unsafe Behavior", checked: this.props.value == "Unsafe Behavior" }),
                    React.createElement(CardLabel, { pair: this.getLabel("unsafeBehavior"), lang: this.props.lang, htmlFor: "unsafe-behavior", className: "card-inline" })),
                React.createElement("div", { className: "card-inline-item" },
                    React.createElement("input", { type: "radio", name: "reportType", id: "hazard-id", onChange: this.onChange, value: "Hazard ID", checked: this.props.value == "Hazard ID" }),
                    React.createElement(CardLabel, { pair: this.getLabel("hazardId"), lang: this.props.lang, htmlFor: "hazard-id", className: "card-inline" })))));
    }
    getLabel(name) {
        if (!this.labels.has(name))
            throw new Error("label does not exist");
        return this.labels.get(name);
    }
    fillLabels() {
        this.fillLabel("reportType", "Report Type", "Вид сообщения (ВЫБЕРИТЕ ЧТО-ТО ОДНО)");
        this.fillLabel("safeBehavior", "Safe Behavior", "Безопасное поведение");
        this.fillLabel("unsafeBehavior", "Unsafe Behavior", "Небезопасное поведение");
        this.fillLabel("hazardId", "Hazard Identification", "Опасный фактор");
    }
    fillLabel(key, enValue, ruValue) {
        this.labels.set(key, {
            en: enValue,
            ru: ruValue
        });
    }
}
//# sourceMappingURL=ReportType.js.map
import React from 'react';
import CardLabel from './CardLabel';
export default class SafeChoice extends React.Component {
    constructor(props) {
        super(props);
        this.labels = new Map();
        this.onChange = (e) => {
            let values = this.props.values;
            let value = e.currentTarget.value;
            if (e.currentTarget.checked)
                values.push(value);
            else
                values = values.filter(v => v != value);
            if (values.indexOf("Not Applicable") != -1)
                values = ["Not Applicable"];
            this.props.onChange(values);
        };
        this.fillLabels();
    }
    render() {
        let getControl = (name) => {
            let pair = this.getLabel(name);
            return (React.createElement("div", { className: "card-inline-item" },
                React.createElement("input", { type: "checkbox", id: "sc_" + name, checked: this.props.values.indexOf(pair.en) != -1, onChange: this.onChange, value: pair.en, disabled: this.props.disabled || (this.props.values.length && this.props.values[0] == "Not Applicable") && pair.en != "Not Applicable" }),
                React.createElement(CardLabel, { pair: pair, lang: this.props.lang, htmlFor: "sc_" + name, className: "card-inline" })));
        };
        return (React.createElement("div", null,
            React.createElement(CardLabel, { pair: this.getLabel("safeChoice"), lang: this.props.lang, className: "card-before-hint", error: this.props.error }),
            React.createElement(CardLabel, { pair: this.getLabel("hint"), lang: this.props.lang, className: "card-hint" }),
            React.createElement("div", { className: "card-safe-choice-grid" },
                React.createElement("div", null,
                    getControl("headBeforeHands"),
                    getControl("stayFocused"),
                    getControl("LMRA")),
                React.createElement("div", null,
                    getControl("biases"),
                    getControl("safetyTraps"),
                    getControl("notApplicable")))));
    }
    getLabel(name) {
        if (!this.labels.has(name))
            throw new Error("label does not exist");
        return this.labels.get(name);
    }
    fillLabels() {
        this.fillLabel("safeChoice", "Safe Choice Categories", "Программа \"Безопасный Выбор\"");
        this.fillLabel("hint", "(For Safe / Unsafe Behavior Only. Choose as Many as Applicable)", "(Только относительно безопасного / небезопасного поведения. Выберите любые, сколько применимо)");
        this.fillLabel("headBeforeHands", "Head before Hands (Fast / Slow thinking)", "Сначала думай, потом действуй (быстрое / медленное мышление)");
        this.fillLabel("stayFocused", "Stay focused (Present motivation)", "Сфокусированность (Текущая мотивация)");
        this.fillLabel("LMRA", "LMRA / 6 Steps in safe decision making", "Оценка риска перед началом работ/ 6 шагов в принятии решений");
        this.fillLabel("biases", "Biases", "Предубеждения");
        this.fillLabel("safetyTraps", "Safety Traps", "Ловушки");
        this.fillLabel("notApplicable", "Not Applicable", "Не применимо");
    }
    fillLabel(key, enValue, ruValue) {
        this.labels.set(key, {
            en: enValue,
            ru: ruValue
        });
    }
}
//# sourceMappingURL=SafeChoice.js.map
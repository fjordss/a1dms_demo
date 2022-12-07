import React from 'react'
import { Lang, LangPair } from './Card';
import CardLabel from './CardLabel';

export interface SafeChoiceProps {
    lang: Lang;
    onChange: (value: Array<string>) => void;
    values: Array<string>;
    disabled: boolean;
    error: string;
}

export default class SafeChoice extends React.Component<SafeChoiceProps> {
    private labels = new Map<string, LangPair>();

    public constructor(props) {
        super(props);

        this.fillLabels();
    }

    public render() {
        let getControl = (name: string) => {
            let pair = this.getLabel(name);
            return (
                <div className="card-inline-item">
                    <input type="checkbox" id={"sc_" + name} checked={this.props.values.indexOf(pair.en) != -1} onChange={this.onChange} value={pair.en} disabled={this.props.disabled || (this.props.values.length && this.props.values[0] == "Not Applicable") && pair.en != "Not Applicable"} />
                    <CardLabel pair={pair} lang={this.props.lang} htmlFor={"sc_" + name} className="card-inline" />
                </div>
            )
        };

        return (
            <div>
                <CardLabel pair={this.getLabel("safeChoice")} lang={this.props.lang} className="card-before-hint" error={this.props.error} />
                <CardLabel pair={this.getLabel("hint")} lang={this.props.lang} className="card-hint" />

                <div className="card-safe-choice-grid">
                    <div>
                        {getControl("headBeforeHands")}
                        {getControl("stayFocused")}
                        {getControl("LMRA")}
                    </div>

                    <div>
                        {getControl("biases")}
                        {getControl("safetyTraps")}
                        {getControl("notApplicable")}
                    </div>
                </div>
            </div>
        );
    }

    private onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        let values = this.props.values;

        let value = e.currentTarget.value;
        if (e.currentTarget.checked)
            values.push(value);
        else
            values = values.filter(v => v != value);

        if (values.indexOf("Not Applicable") != -1)
            values = ["Not Applicable"];

        this.props.onChange(values);
    }

    private getLabel(name: string): LangPair {
        if (!this.labels.has(name))
            throw new Error("label does not exist");

        return this.labels.get(name);
    }

    private fillLabels() {
        this.fillLabel("safeChoice", "Safe Choice Categories", "Программа \"Безопасный Выбор\"");
        this.fillLabel("hint", "(For Safe / Unsafe Behavior Only. Choose as Many as Applicable)", "(Только относительно безопасного / небезопасного поведения. Выберите любые, сколько применимо)");
        this.fillLabel("headBeforeHands", "Head before Hands (Fast / Slow thinking)", "Сначала думай, потом действуй (быстрое / медленное мышление)");
        this.fillLabel("stayFocused", "Stay focused (Present motivation)", "Сфокусированность (Текущая мотивация)");
        this.fillLabel("LMRA", "LMRA / 6 Steps in safe decision making", "Оценка риска перед началом работ/ 6 шагов в принятии решений");
        this.fillLabel("biases", "Biases", "Предубеждения");
        this.fillLabel("safetyTraps", "Safety Traps", "Ловушки");
        this.fillLabel("notApplicable", "Not Applicable", "Не применимо");
    }

    private fillLabel(key: string, enValue: string, ruValue: string) {
        this.labels.set(key, {
            en: enValue,
            ru: ruValue
        });
    }
}
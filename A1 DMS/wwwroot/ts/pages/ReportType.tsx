import React from 'react'
import { Lang, LangPair } from './Card';
import CardLabel from './CardLabel';

export interface ReportTypeProps {
    lang: Lang;
    onChange: (value: string) => void;
    value: string;
    error: string;
}

export default class ReportType extends React.Component<ReportTypeProps> {
    private labels = new Map<string, LangPair>();

    public constructor(props) {
        super(props);

        this.fillLabels();
    }

    public render() {
        return (
            <>
                <CardLabel pair={this.getLabel("reportType")} lang={this.props.lang} error={this.props.error} />
                <div className="card-report-type-grid">
                    <div className="card-inline-item">
                        <input type="radio" name="reportType" id="safe-behavior" onChange={this.onChange} value="Safe Behavior" checked={this.props.value == "Safe Behavior"} />
                        <CardLabel pair={this.getLabel("safeBehavior")} lang={this.props.lang} htmlFor="safe-behavior" className="card-inline" />
                    </div>
                    <div className="card-inline-item">
                        <input type="radio" name="reportType" id="unsafe-behavior" onChange={this.onChange} value="Unsafe Behavior" checked={this.props.value == "Unsafe Behavior"} />
                        <CardLabel pair={this.getLabel("unsafeBehavior")} lang={this.props.lang} htmlFor="unsafe-behavior" className="card-inline" />
                    </div>
                    <div className="card-inline-item">
                        <input type="radio" name="reportType" id="hazard-id" onChange={this.onChange} value="Hazard ID" checked={this.props.value == "Hazard ID"} />
                        <CardLabel pair={this.getLabel("hazardId")} lang={this.props.lang} htmlFor="hazard-id" className="card-inline" />
                    </div>
                </div>
            </>
        );
    }

    private onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        this.props.onChange(e.currentTarget.value);
    }

    private getLabel(name: string): LangPair {
        if (!this.labels.has(name))
            throw new Error("label does not exist");

        return this.labels.get(name);
    }

    private fillLabels() {
        this.fillLabel("reportType", "Report Type", "Вид сообщения (ВЫБЕРИТЕ ЧТО-ТО ОДНО)");
        this.fillLabel("safeBehavior", "Safe Behavior", "Безопасное поведение");
        this.fillLabel("unsafeBehavior", "Unsafe Behavior", "Небезопасное поведение");
        this.fillLabel("hazardId", "Hazard Identification", "Опасный фактор");
    }

    private fillLabel(key: string, enValue: string, ruValue: string) {
        this.labels.set(key, {
            en: enValue,
            ru: ruValue
        });
    }
}
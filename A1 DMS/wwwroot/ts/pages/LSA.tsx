import React from 'react'
import { Lang, LangPair } from './Card';
import CardLabel from './CardLabel';

export interface LSAProps {
    lang: Lang;
    onChange: (value: string) => void;
    value: string;
    disabled: boolean;
}

export default class LSA extends React.Component<LSAProps> {
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
                    <input type="radio" name="LSA" id={name} value={pair.en} checked={this.props.value == pair.en} onChange={this.onChange} disabled={this.props.disabled} />
                    <CardLabel pair={pair} lang={this.props.lang} htmlFor={name} className="card-inline" />
                </div>
            )
        };

        return (
            <div>
                <CardLabel pair={this.getLabel("LSA")} lang={this.props.lang} className="card-before-hint" />
                <CardLabel pair={this.getLabel("selectOne")} lang={this.props.lang} className="card-hint" />

                <div className="card-lsa-grid">
                    <div>
                        {getControl("wordAuthorization")}
                        {getControl("energyIsolation")}
                        {getControl("breakingContainment")}
                        {getControl("criticalDevices")}
                        {getControl("hotWork")}
                        {getControl("workingAtHeight")}
                    </div>

                    <div>
                        {getControl("confinedSpaceEntry")}
                        {getControl("liftingHoisting")}
                        {getControl("rotatingEquipment")}
                        {getControl("mobileEquipment")}
                        {getControl("criticalProcedures")}
                        {getControl("notApplicable")}
                    </div>
                </div>
            </div>
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
        this.fillLabel("LSA", "Observation Related to \"Life Saving Actions\"", "Наблюдение за производством работ, связанное с \"Действиями, сохраняющими жизнь\"");
        this.fillLabel("selectOne", "(Choose Only One)", "(Выберите что-то одно)");
        this.fillLabel("wordAuthorization", "Work Authorization", "Разрешение на выполнение работ");
        this.fillLabel("energyIsolation", "Energy Isolation", "Отключение оборудования");
        this.fillLabel("breakingContainment", "Breaking Containment", "Вскрытие оборудования");
        this.fillLabel("criticalDevices", "Critical Devices", "Защитные устройства оборудования");
        this.fillLabel("hotWork", "Hot Work", "Огневые работы");
        this.fillLabel("workingAtHeight", "Working at Height", "Работы на высоте");
        this.fillLabel("confinedSpaceEntry", "Confined Space Entry", "Работы в замкнутом пространстве");
        this.fillLabel("liftingHoisting", "Lifting and Hoisting", "Грузоподъемные работы");
        this.fillLabel("rotatingEquipment", "Rotating Equipment", "Оборудование с вращающимися элементами");
        this.fillLabel("mobileEquipment", "Mobile Equipment", "Самоходное оборудование");
        this.fillLabel("criticalProcedures", "Critical Procedures", "Процедуры для работ повышенной опасности");
        this.fillLabel("notApplicable", "Not Applicable", "Не применимо");
    }

    private fillLabel(key: string, enValue: string, ruValue: string) {
        this.labels.set(key, {
            en: enValue,
            ru: ruValue
        });
    }
}
import React from 'react';
import CardLabel from './CardLabel';
export default class LSA extends React.Component {
    constructor(props) {
        super(props);
        this.labels = new Map();
        this.onChange = (e) => {
            this.props.onChange(e.currentTarget.value);
        };
        this.fillLabels();
    }
    render() {
        let getControl = (name) => {
            let pair = this.getLabel(name);
            return (React.createElement("div", { className: "card-inline-item" },
                React.createElement("input", { type: "radio", name: "LSA", id: name, value: pair.en, checked: this.props.value == pair.en, onChange: this.onChange, disabled: this.props.disabled }),
                React.createElement(CardLabel, { pair: pair, lang: this.props.lang, htmlFor: name, className: "card-inline" })));
        };
        return (React.createElement("div", null,
            React.createElement(CardLabel, { pair: this.getLabel("LSA"), lang: this.props.lang, className: "card-before-hint" }),
            React.createElement(CardLabel, { pair: this.getLabel("selectOne"), lang: this.props.lang, className: "card-hint" }),
            React.createElement("div", { className: "card-lsa-grid" },
                React.createElement("div", null,
                    getControl("wordAuthorization"),
                    getControl("energyIsolation"),
                    getControl("breakingContainment"),
                    getControl("criticalDevices"),
                    getControl("hotWork"),
                    getControl("workingAtHeight")),
                React.createElement("div", null,
                    getControl("confinedSpaceEntry"),
                    getControl("liftingHoisting"),
                    getControl("rotatingEquipment"),
                    getControl("mobileEquipment"),
                    getControl("criticalProcedures"),
                    getControl("notApplicable")))));
    }
    getLabel(name) {
        if (!this.labels.has(name))
            throw new Error("label does not exist");
        return this.labels.get(name);
    }
    fillLabels() {
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
    fillLabel(key, enValue, ruValue) {
        this.labels.set(key, {
            en: enValue,
            ru: ruValue
        });
    }
}
//# sourceMappingURL=LSA.js.map
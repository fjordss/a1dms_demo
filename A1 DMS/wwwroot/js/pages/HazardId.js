import React from 'react';
import { CommonHelper } from '../source/CommonHelper';
import { Lang } from './Card';
import CardLabel from './CardLabel';
export default class HazardId extends React.Component {
    constructor(props) {
        super(props);
        this.labels = new Map();
        this.hidLabels = new Map();
        this.onChange = (e) => {
            let values = this.props.values;
            let value = e.currentTarget.value;
            if (e.currentTarget.checked)
                values.push(value);
            else
                values = values.filter(v => v != value);
            this.props.onChange(values);
        };
        this.fillLabels();
    }
    render() {
        let hidLabels = CommonHelper.mapToArray(this.hidLabels).sort((a, b) => {
            if (a.key == "other" || b.key == "other") {
                return a.key != b.key ? (a.key == "other" ? 1 : -1) : 0;
            }
            let s1 = this.props.lang == Lang.english ? a.value.en : a.value.ru;
            let s2 = this.props.lang == Lang.english ? b.value.en : b.value.ru;
            return s1.localeCompare(s2);
        });
        let map = CommonHelper.arrayToMap(hidLabels);
        let getControl = (name) => {
            let pair = this.getLabel(map, name);
            return (React.createElement("div", { className: "card-inline-item" },
                React.createElement("input", { type: "checkbox", id: name, value: pair.en, checked: this.props.values.indexOf(pair.en) != -1, onChange: this.onChange }),
                React.createElement(CardLabel, { pair: pair, lang: this.props.lang, htmlFor: name, className: "card-inline" })));
        };
        let length = hidLabels.length;
        let center = Math.round(length / 2);
        return (React.createElement("div", null,
            React.createElement(CardLabel, { pair: this.getLabel(this.labels, "HID"), lang: this.props.lang, className: "card-before-hint", error: this.props.error }),
            React.createElement(CardLabel, { pair: this.getLabel(this.labels, "selectMany"), lang: this.props.lang, className: "card-hint" }),
            React.createElement("div", { className: "card-hid-grid" },
                React.createElement("div", null, hidLabels.slice(0, center).map(s => getControl(s.key))),
                React.createElement("div", null, hidLabels.slice(center, length).map(s => getControl(s.key))))));
    }
    getLabel(labels, name) {
        if (!labels.has(name))
            throw new Error("label does not exist");
        return labels.get(name);
    }
    fillLabels() {
        this.fillLabel("HID", "Categories of Observation or Hazard Identification", "Категории наблюдения или опасного фактора");
        this.fillLabel("selectMany", "(Choose as Many as Applicable)", "(Выберите любые, сколько применимо)");
        this.fillHIDLabel("PPE", "PPE", "Средства индивидуальной защиты");
        this.fillHIDLabel("toolsEquipment", "Tools Equipment", "Инструменты и оборудование");
        this.fillHIDLabel("chemicals", "Chemicals", "Химические вещества");
        this.fillHIDLabel("warningSignsBarricades", "Warning Signs / Barricades", "Предупреждающие знаки / ограждения");
        this.fillHIDLabel("hygiene", "Hygiene", "Правила гигиены");
        this.fillHIDLabel("ergonomics", "Ergonomics", "Эргономика");
        this.fillHIDLabel("manualLifting / Handling", "Manual Lifting / Handling", "Подъем перемещение тяжестей вручную");
        this.fillHIDLabel("lineOfFire", "\"Line of Fire\"", "\"Линия огня\"");
        this.fillHIDLabel("pinchPoints", "Pinch Points", "Точки защемления");
        this.fillHIDLabel("handsSafety", "Hands Safety", "Травмы рук");
        this.fillHIDLabel("stressRush", "Stress / Rush / Fatigue / Distraction", "Стресс / Спешка / Усталость / Невнимательность");
        this.fillHIDLabel("communication", "Communication", "Коммуникация при выполнении работ");
        this.fillHIDLabel("policiesProcedures", "Policies Procedures", "Политики / Процедуры");
        this.fillHIDLabel("processSafety", "Process Safety", "Безопасность технологических процессов");
        this.fillHIDLabel("environmental", "Environmental", "Охрана окружающей среды");
        this.fillHIDLabel("security", "Security", "Сохранность имущества и информации (секьюрити)");
        this.fillHIDLabel("electricalSafety", "Electrical Safety", "Электробезопасность");
        this.fillHIDLabel("fireSafety", "Fire Safety", "Пожарная безопасность");
        this.fillHIDLabel("transportSafety", "Transport Safety", "Транспортная безопасность");
        this.fillHIDLabel("slipsTripsFalls", "Slips Trips Falls", "Спотыкания / Поскальзывания / Падения");
        this.fillHIDLabel("contactWithObject", "Contact With Object", "Столкновение с предметом");
        this.fillHIDLabel("droppedObjects", "Dropped Objects", "Падение предметов с высоты");
        this.fillHIDLabel("workEnvironmentalDesign", "Work Environmental / Design", "Рабочие условия / дизайн");
        this.fillHIDLabel("housekeeping", "Housekeeping", "Порядок на рабочем месте");
        this.fillHIDLabel("weatherConditions", "Weather Conditions", "Погодные условия");
        this.fillHIDLabel("offTheSite", "Off the Site", "Вне сайта");
        this.fillHIDLabel("wellControl", "Well Control", "Контроль за скважиной");
        this.fillHIDLabel("other", "Other", "Другое");
        this.fillHIDLabel("COVID19", "COVID-19", "COVID-19");
    }
    fillLabel(key, enValue, ruValue) {
        this.labels.set(key, {
            en: enValue,
            ru: ruValue
        });
    }
    fillHIDLabel(key, enValue, ruValue) {
        this.hidLabels.set(key, {
            en: enValue,
            ru: ruValue
        });
    }
}
//# sourceMappingURL=HazardId.js.map
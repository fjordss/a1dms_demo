import React from 'react';
export default class DateRangePicker extends React.Component {
    constructor(props) {
        super(props);
    }
    render() {
        return (React.createElement("div", { className: "date-range-picker" },
            React.createElement("div", null,
                React.createElement("a", { href: "", onClick: e => this.rangeSelected(e, "cd") }, "Today")),
            React.createElement("div", null,
                React.createElement("a", { href: "", onClick: e => this.rangeSelected(e, "pd") }, "Yesterday")),
            React.createElement("div", null,
                React.createElement("a", { href: "", onClick: e => this.rangeSelected(e, "cw") }, "Current Week")),
            React.createElement("div", null,
                React.createElement("a", { href: "", onClick: e => this.rangeSelected(e, "pw") }, "Previous Week")),
            React.createElement("div", null,
                React.createElement("a", { href: "", onClick: e => this.rangeSelected(e, "cm") }, "Current Month")),
            React.createElement("div", null,
                React.createElement("a", { href: "", onClick: e => this.rangeSelected(e, "pm") }, "Previous Month"))));
    }
    rangeSelected(e, type) {
        e.preventDefault();
        if (!this.props.onChange)
            return;
        let from;
        let to;
        [from, to] = DateRangePicker.getRange(type);
        this.props.onChange(from, to);
    }
    static getRange(type) {
        let onChange = (from, to) => [DateRangePicker.dateToString(from), to ? DateRangePicker.dateToString(to) : null];
        let now = new Date();
        if (type == "cw" || type == "pw") {
            let sunday = this.addDays(now, -(now.getDay() == 0 ? 0 : now.getDay()));
            if (type == "cw")
                return onChange(sunday);
            else
                return onChange(this.addDays(sunday, -7), this.addDays(sunday, -1));
        }
        else if (type == "cm" || type == "pm") {
            let monthStart = this.addDays(now, -now.getDate() + 1);
            if (type == "cm")
                return onChange(monthStart);
            else
                return onChange(this.addMonths(monthStart, -1), this.addDays(monthStart, -1));
        }
        else {
            if (type == "cd")
                return onChange(now, now);
            else
                return onChange(this.addDays(now, -1), this.addDays(now, -1));
        }
    }
    static dateToString(date) {
        return date.getFullYear() + "-" + (date.getMonth() < 9 ? "0" : "") + (date.getMonth() + 1) + "-" + (date.getDate() < 10 ? "0" : "") + date.getDate();
    }
    static addDays(date, days) {
        let result = new Date(date);
        result.setDate(date.getDate() + days);
        return result;
    }
    static addMonths(date, months) {
        let result = new Date(date);
        result.setMonth(date.getMonth() + months);
        return result;
    }
}
//# sourceMappingURL=DateRangePicker.js.map
import React from 'react';
import { Language } from '../../source/CommonHelper';
import Switch from 'react-switch';
export default class CardDetails extends React.Component {
    constructor(props) {
        super(props);
        this.state = { lang: Language.eng };
    }
    render() {
        return (React.createElement("div", { className: "card-details" },
            React.createElement("div", null,
                React.createElement("div", { className: "card-details-label" }, "Name"),
                React.createElement("div", null, this.getDisplayName())),
            React.createElement("div", null,
                React.createElement("div", { className: "card-details-label" }, "Toggle Language"),
                React.createElement("div", null,
                    React.createElement(Switch, { onChange: () => this.toggleLang(), checked: this.state.lang == Language.rus, uncheckedIcon: React.createElement("div", { className: "switch-label" }, "eng"), checkedIcon: React.createElement("div", { className: "switch-label" }, "rus"), height: 25, width: 60 }))),
            React.createElement("div", null),
            React.createElement("div", null,
                React.createElement("div", { className: "card-details-label" }, "Site"),
                React.createElement("div", null, this.props.card.site)),
            React.createElement("div", null,
                React.createElement("div", { className: "card-details-label" }, "Company"),
                React.createElement("div", null, this.props.card.company)),
            React.createElement("div", null,
                React.createElement("div", { className: "card-details-label" }, "Department"),
                React.createElement("div", null, this.props.card.department)),
            React.createElement("div", { className: "card-details-span3" },
                React.createElement("div", { className: "card-details-label" }, "Description"),
                React.createElement("div", null, this.state.lang == Language.eng ? this.props.card.description : this.props.card.descriptionRus)),
            React.createElement("div", { className: "card-details-span3" },
                React.createElement("div", { className: "card-details-label" }, "Actions Taken"),
                React.createElement("div", null, this.state.lang == Language.eng ? this.props.card.actionsTaken : this.props.card.actionsTakenRus)),
            React.createElement("div", { className: "card-details-span3" },
                React.createElement("div", { className: "card-details-label" }, "Actions Suggested"),
                React.createElement("div", null, this.state.lang == Language.eng ? this.props.card.furtherActions : this.props.card.furtherActionsRus))));
    }
    toggleLang() {
        this.setState({ lang: this.state.lang == Language.eng ? Language.rus : Language.eng });
    }
    getDisplayName() {
        return (this.props.card.lastName ? this.props.card.lastName : "") +
            (this.props.card.firstName && this.props.card.firstName ? ", " : "") +
            (this.props.card.firstName ? this.props.card.firstName : "");
    }
}
//# sourceMappingURL=CardDetails.js.map
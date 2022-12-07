import React from 'react';
import { Lang } from './Card';
export default class CardLabel extends React.Component {
    constructor(props) {
        super(props);
    }
    render() {
        return (React.createElement("div", { className: "card-label" + (this.props.className ? " " + this.props.className : "") },
            React.createElement("label", { htmlFor: this.props.htmlFor }, this.props.lang == Lang.english ? this.props.pair.en : this.props.pair.ru),
            React.createElement("div", { className: "card-error" }, this.props.error ? this.props.error : "")));
    }
}
//# sourceMappingURL=CardLabel.js.map
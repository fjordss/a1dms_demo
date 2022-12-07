import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
class CardApp extends React.Component {
    constructor(props) {
        super(props);
    }
    render() {
        return (React.createElement(BrowserRouter, null,
            React.createElement("div", { className: "wrapper" })));
    }
}
ReactDOM.render(React.createElement(CardApp, null), document.body);
//# sourceMappingURL=CardApp.js.map
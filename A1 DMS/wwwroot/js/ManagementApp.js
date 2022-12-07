import React from 'react';
import ReactDOM from 'react-dom';
import Header from './Header';
import Footer from './Footer';
import Main from './Main';
class ManagementApp extends React.Component {
    render() {
        return React.createElement(React.Fragment, null,
            React.createElement(Header, null),
            React.createElement(Main, null),
            React.createElement(Footer, null));
    }
}
ReactDOM.render(React.createElement(ManagementApp, null), document.body);
//# sourceMappingURL=ManagementApp.js.map
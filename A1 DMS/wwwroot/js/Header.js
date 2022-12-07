import React from 'react';
import '../../../css/v2/style.css';
export default class Header extends React.Component {
    render() {
        return React.createElement("header", null,
            React.createElement("span", { className: "header-left-label" }, "test label"),
            React.createElement("ul", { className: "header-menu-items" },
                React.createElement("li", { className: "header-menu-item" },
                    React.createElement("a", { href: "" }, "test link 1")),
                React.createElement("li", { className: "header-menu-item" },
                    React.createElement("a", { href: "" }, "test link 2")),
                React.createElement("li", { className: "header-menu-item" },
                    React.createElement("a", { href: "" }, "test link 3")),
                React.createElement("li", { className: "header-menu-item" },
                    React.createElement("a", { href: "" }, "test link 4"))),
            React.createElement("span", { className: "header-logout" }, "test logoout"));
    }
}
//# sourceMappingURL=Header.js.map
import React from 'react';
import { Link } from 'react-router-dom';
export default class Header extends React.Component {
    render() {
        return (React.createElement("header", null,
            React.createElement("span", { className: "header-left-label" }, this.props.pageLabel),
            React.createElement("ul", { className: "header-menu-items" }, this.props.menuItems.map(item => React.createElement(Link, { to: item.link },
                React.createElement("li", { className: "header-menu-item" + (!item.children || item.children.length == 0 ? " pointer" : "") },
                    React.createElement("span", null, item.label),
                    item.children && item.children.length > 0 &&
                        React.createElement("ul", { className: "header-submenu-items" }, item.children.map(child => React.createElement(Link, { to: child.link },
                            React.createElement("li", { className: "header-submenu-item" }, child.label)))))))),
            React.createElement("span", { className: "header-logout" },
                this.props.userName,
                React.createElement("a", { href: "/v2/mgmt/auth?hadler=logout" },
                    React.createElement("i", { className: "fa fa-sign-out", "aria-hidden": "true" })))));
    }
}
//# sourceMappingURL=Header.js.map
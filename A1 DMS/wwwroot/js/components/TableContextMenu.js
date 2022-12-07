import React from 'react';
export default class TableContextMenu extends React.Component {
    constructor(props) {
        super(props);
        this.rowHover = (e, remove = false) => {
            let hoverClass = "tv-context-menu-hover";
            let element = e.currentTarget;
            let near = element.classList.contains("tv-context-menu-label") ? element.previousElementSibling : element.nextElementSibling;
            !remove ? element.classList.add(hoverClass) : element.classList.remove(hoverClass);
            !remove ? near.classList.add(hoverClass) : near.classList.remove(hoverClass);
        };
    }
    render() {
        return (React.createElement("div", { className: this.getClassName("context-menu") },
            React.createElement("div", { className: this.getClassName("context-menu-grid") }, this.props.items.map(item => React.createElement(React.Fragment, null,
                React.createElement("div", { className: this.getClassName("context-menu-icon"), onClick: () => this.handleClick(item), onMouseEnter: e => this.rowHover(e), onMouseLeave: e => this.rowHover(e, true) }, item.icon),
                React.createElement("div", { className: this.getClassName("context-menu-label"), onClick: () => this.handleClick(item), onMouseEnter: e => this.rowHover(e), onMouseLeave: e => this.rowHover(e, true) }, item.label))))));
    }
    handleClick(item) {
        if (item.action)
            item.action();
        else if (item.route && this.props.onRedirect)
            this.props.onRedirect(item.route);
    }
    getClassName(postfix = null) {
        let base = "tv" + (postfix ? "-" + postfix : "");
        return base + (this.props.className ? " " + base + "-" + this.props.className : "");
    }
}
//# sourceMappingURL=TableContextMenu.js.map
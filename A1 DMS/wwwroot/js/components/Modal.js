import React from 'react';
export default class Modal extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            visible: this.toBool(this.props.visible),
            header: this.props.header
        };
    }
    render() {
        if (!this.props.visible)
            return React.createElement(React.Fragment, null);
        if (!this.props.loading) {
            let css = {};
            if (typeof (this.props.width) != "undefined")
                css.width = this.props.width + "px";
            if (typeof (this.props.height) != "undefined")
                css.height = this.props.height + "px";
            return (React.createElement("div", { className: this.getClassName("overlay"), onClick: () => this.close() },
                React.createElement("div", { style: css, className: this.getClassName("front"), onClick: e => {
                        e.stopPropagation();
                        e.nativeEvent.stopImmediatePropagation();
                    } },
                    this.canBeClosed() ? React.createElement("img", { src: "/images/closepic.png", className: this.getClassName("close"), onClick: () => this.close() }) : React.createElement(React.Fragment, null),
                    React.createElement("div", { className: this.getClassName("main") },
                        this.props.header ? React.createElement("div", { className: this.getClassName("header") }, this.props.header) : React.createElement(React.Fragment, null),
                        React.createElement("div", { className: this.getClassName("body") }, this.props.children),
                        this.props.header ? React.createElement("div", { className: this.getClassName("header") + " hidden" }, "\u00A0") : React.createElement(React.Fragment, null)))));
        }
        else {
            return React.createElement(Modal, { className: "preloader", width: 295, height: 175, canBeClosed: false, visible: !!this.props.visible });
        }
    }
    componentDidMount() {
        if (Modal.instances.filter(m => m == this).length == 0)
            Modal.instances.push(this);
        this.changeBodyOverflow();
    }
    componentDidUpdate() {
        this.changeBodyOverflow();
    }
    componentWillUnmount() {
        Modal.instances = Modal.instances.filter(m => m != this);
    }
    shouldComponentUpdate(nextProps, nextState) {
        if (nextProps != null) {
            let visible = this.toBool(nextProps.visible);
            if (visible != this.state.visible) {
                this.setState({ visible });
                return false;
            }
        }
        return true;
    }
    canBeClosed() {
        return typeof (this.props.canBeClosed) == "undefined" || this.props.canBeClosed === true;
    }
    changeBodyOverflow() {
        let allHidden = true;
        for (let modal of Modal.instances) {
            if (modal.props.visible) {
                allHidden = false;
                break;
            }
        }
        document.body.style.overflow = allHidden ? "" : "hidden";
    }
    close() {
        if (!this.canBeClosed())
            return;
        this.setState({ visible: false });
        if (this.props.onClose)
            this.props.onClose();
    }
    toBool(arg) {
        return (arg === true || arg === false) ? arg : false;
    }
    getClassName(postfix = null) {
        let base = "modal" + (postfix ? "-" + postfix : "");
        return base + (this.props.className ? " " + base + "-" + this.props.className : "");
    }
}
Modal.instances = [];
//# sourceMappingURL=Modal.js.map
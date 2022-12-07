import React from 'react';
import { app } from '../pages/mgmt/ManagementApp';
export default class Notification extends React.Component {
    constructor(props) {
        super(props);
        this.counter = 0;
        app.notification = this;
        this.state = {
            visible: false,
            body: [],
            timeout: 3000
        };
    }
    render() {
        this.elementRef = React.createRef();
        if (this.state.visible) {
            this.counter = 0;
            setTimeout(() => this.timeout(), 100);
        }
        return (React.createElement("div", { ref: this.elementRef, className: this.getClassName() + (this.state.visible ? " visible" : ""), onMouseMove: () => this.counter = 0, onMouseLeave: () => this.counter = this.state.timeout - 300 }, this.state.body));
    }
    show(body) {
        this.setState({
            visible: true,
            body
        });
    }
    timeout() {
        this.counter += 100;
        if (this.counter >= this.state.timeout)
            this.close();
        else
            setTimeout(() => this.timeout(), 100);
    }
    close() {
        let element = this.elementRef.current;
        element.classList.remove("visible");
        this.setState({ visible: false });
    }
    getClassName(postfix = null) {
        let base = "notification" + (postfix ? "-" + postfix : "");
        return base + (this.props.className ? " " + base + "-" + this.props.className : "");
    }
}
//# sourceMappingURL=Notification.js.map
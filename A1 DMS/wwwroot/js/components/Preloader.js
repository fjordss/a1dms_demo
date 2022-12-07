import React from 'react';
import Modal from './Modal';
export default class Preloader extends React.Component {
    constructor(props) {
        super(props);
    }
    render() {
        return React.createElement(Modal, { className: "preloader", width: 295, height: 175, canBeClosed: false, visible: !!this.props.visible });
    }
}
//# sourceMappingURL=Preloader.js.map
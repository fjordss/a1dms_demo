import React from 'react';
export default class Button extends React.Component {
    render() {
        return React.createElement("div", { onClick: e => alert(e.currentTarget.outerHTML) },
            React.createElement("button", null, "test"));
    }
}
//# sourceMappingURL=file.js.map
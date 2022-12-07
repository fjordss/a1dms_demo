class ManagementApp extends React.Component {
    render() {
        return React.createElement("div", { onClick: e => alert(e.currentTarget.outerHTML) },
            React.createElement("button", null, "test"));
    }
}
//# sourceMappingURL=App.js.map
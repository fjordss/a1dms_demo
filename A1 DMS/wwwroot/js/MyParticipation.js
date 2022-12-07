import { http } from 'a1dms-front';
import React from 'react';
export default class MyParticipation extends React.Component {
    constructor(props) {
        super(props);
        this.dateChange = (type, value) => {
            this.setState({
                loading: true,
                from: type == "from" ? value : this.state.from,
                to: type == "to" ? value : this.state.to
            }, () => this.getCount());
        };
        var date = new Date();
        this.state = {
            from: date.getFullYear() + "-" + (date.getMonth() < 9 ? "0" : "") + (date.getMonth() + 1) + "-01",
            loading: true
        };
    }
    render() {
        return (React.createElement("div", { className: "auth-main" },
            React.createElement("img", { src: "/images/exxonlogo.png", className: "auth-logo" }),
            React.createElement("div", { className: "auth-alert" + (!this.props.alertVisible ? " hidden" : "") }, "Attention! This NGH Portal version is for educational purpose only"),
            React.createElement("div", { className: "auth-fields" },
                React.createElement("div", null),
                React.createElement("div", { className: "auth-field mp-date" },
                    React.createElement("div", { className: "mp-o1" }, "From"),
                    React.createElement("div", { className: "mp-o3" }, "To"),
                    React.createElement("div", { className: "mp-o2" },
                        React.createElement("input", { type: "date", value: this.state.from, onChange: e => this.dateChange("from", e.currentTarget.value) })),
                    React.createElement("div", { className: "mp-o4" },
                        React.createElement("input", { type: "date", value: this.state.to, onChange: e => this.dateChange("to", e.currentTarget.value) }))),
                React.createElement("div", null),
                React.createElement("div", null),
                React.createElement("div", { className: "mp-info" },
                    React.createElement("div", null,
                        React.createElement("span", { className: "mp-label" }, "NGH #:"),
                        " ",
                        this.props.employee.code),
                    React.createElement("div", null,
                        React.createElement("span", { className: "mp-label" }, "Company:"),
                        " ",
                        this.props.employee.company),
                    React.createElement("div", null,
                        React.createElement("span", { className: "mp-label" }, "Number of Cards:"),
                        " ",
                        this.state.loading ? "..." : this.state.count)),
                React.createElement("div", null),
                React.createElement("div", null),
                React.createElement("div", { className: "auth-button-row" },
                    React.createElement("div", null,
                        React.createElement("button", { className: "auth-button auth-save-button", onClick: () => this.props.onNewCardPressed() },
                            "\u041D\u043E\u0432\u0430\u044F \u043A\u0430\u0440\u0442\u0430",
                            React.createElement("br", null),
                            "New Card")),
                    React.createElement("div", null,
                        React.createElement("button", { className: "auth-button auth-participation-button", onClick: () => location.reload() },
                            "\u0412\u044B\u0439\u0442\u0438",
                            React.createElement("br", null),
                            "Log Out"))))));
    }
    componentDidMount() {
        this.getCount();
    }
    getCount() {
        let handleError = () => this.props.onError();
        let query = "?from=" + (this.state.from ? encodeURIComponent(this.state.from) : "") + "&to=" + (this.state.to ? encodeURIComponent(this.state.to) : "");
        let url = "/api/cards/participation/" + this.props.employee.code + query;
        console.log(url);
        http.fetch(url)
            .then(res => {
            if (res.status == "ok") {
                this.setState({
                    loading: false,
                    count: res.data
                });
            }
            else
                handleError();
        })
            .catch(() => handleError());
    }
}
//# sourceMappingURL=MyParticipation.js.map
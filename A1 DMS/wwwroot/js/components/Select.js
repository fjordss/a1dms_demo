import React from 'react';
export default class Select extends React.Component {
    constructor(props) {
        super(props);
        this.selectClick = false;
        this.dropdownClick = false;
        this.hideDropdown = () => {
            if (this.selectClick) {
                this.selectClick = false;
                return;
            }
            if (this.dropdownClick) {
                this.dropdownClick = false;
                return;
            }
            this.setState({ dropdownVisible: false });
        };
        this.state = { dropdownVisible: false };
        this.options = this.handleOptionsArray(this.props.options);
        this.values = this.props.values ? this.props.values.map(v => v.toString()) : [];
    }
    render() {
        if (this.props.selectFirst && this.values.length == 0 && this.options.length > 0)
            this.values.push(this.options[0].value ? this.options[0].value : this.options[0].text);
        let selected = this.options.filter(opt => this.values.indexOf(opt.value) != -1).map(opt => opt.text).join(", ");
        return (React.createElement("div", { className: "select" + (this.props.disabled === true ? " disabled" : ""), style: this.props.width ? { width: this.props.width + "px" } : {} },
            React.createElement("div", { className: "select-header", onClick: e => this.toggleDropdown(e) },
                React.createElement("div", { className: "select-placeholder" + (selected ? " hidden" : "") }, this.props.placeholder ? this.props.placeholder : "None selected"),
                React.createElement("div", { className: "select-values" + (!selected ? " hidden" : "") }, selected)),
            React.createElement("div", { className: "select-dropdown" + (!this.state.dropdownVisible ? " hidden" : ""), style: this.props.dropdownWidth ? { width: this.props.dropdownWidth } : null }, this.options.map((opt, i) => (React.createElement("div", { className: "select-option " + (this.values.indexOf(opt.value) != -1 ? "selected" : "notselected") + (opt.disabled ? " disabled" : ""), onClick: (e) => this.onSelected(e, opt) },
                this.props.multiple ?
                    React.createElement("input", { className: "select-option-flag", type: "checkbox", checked: this.values.indexOf(opt.value) != -1, disabled: opt.disabled }) :
                    React.createElement("input", { className: "select-option-flag", type: "radio", checked: this.values.indexOf(opt.value) != -1, disabled: opt.disabled }),
                React.createElement("span", { className: "select-option-label" }, opt.text)))))));
    }
    componentWillUpdate(nextProps, nextState) {
        if (nextProps.values)
            this.values = nextProps.values.map(v => v.toString());
        if (nextProps.options)
            this.options = this.handleOptionsArray(nextProps.options);
    }
    componentDidMount() {
        document.body.addEventListener("click", this.hideDropdown);
    }
    componentWillUnmount() {
        document.body.removeEventListener("click", this.hideDropdown);
    }
    handleOptionsArray(options) {
        let newOptions = [];
        let list = options;
        if (list.length > 0) {
            if (typeof (list[0]) === "string")
                newOptions = options.map(opt => { return { text: opt }; });
            else
                newOptions = options;
        }
        newOptions.forEach(opt => {
            opt.text = opt.text.toString();
            opt.value = opt.value ? opt.value.toString() : opt.text;
        });
        return newOptions;
    }
    toggleDropdown(e) {
        this.selectClick = true;
        if (this.props.disabled === true)
            return;
        this.setState({ dropdownVisible: !this.state.dropdownVisible });
    }
    onSelected(e, opt) {
        this.dropdownClick = true;
        if (opt.disabled)
            return;
        if (!this.props.multiple) {
            this.values = [opt.value];
            this.dropdownClick = false;
            this.hideDropdown();
        }
        else {
            if (this.values.indexOf(opt.value) == -1)
                this.values.push(opt.value);
            else
                this.values = this.values.filter(v => v != opt.value);
        }
        if (this.props.onChange)
            this.props.onChange(this.values);
        this.setState({});
    }
}
//# sourceMappingURL=Select.js.map
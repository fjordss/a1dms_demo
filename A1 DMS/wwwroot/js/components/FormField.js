import React from 'react';
import Form, { FormFieldType } from './Form';
import Select from './Select';
export default class FormField extends React.Component {
    constructor(props) {
        super(props);
        this.props.field.fieldElement = this;
    }
    render() {
        return (React.createElement(React.Fragment, null, this.getField(this.props.field)));
    }
    getField(field) {
        if (!field) {
            console.error("Field '" + name + "' not found");
            return;
        }
        if (field.visible === false)
            return React.createElement(React.Fragment, null);
        if (field.type == FormFieldType.singleline) {
            return React.createElement("input", { type: "text", id: field.id, className: field.className, disabled: !!field.disabled, placeholder: field.placeholder, name: field.name, value: field.value, onChange: e => this.onChange(e) });
        }
        else if (field.type == FormFieldType.multiline) {
            return React.createElement("textarea", { id: field.id, className: field.className, disabled: !!field.disabled, name: field.name, onChange: e => this.onChange(e), value: field.value });
        }
        else if (field.type == FormFieldType.checkbox) {
            return React.createElement("input", { type: "checkbox", id: field.id, className: field.className, disabled: !!field.disabled, name: field.name, checked: field.value, onChange: e => this.onChange(e) });
        }
        else if (field.type == FormFieldType.datetime) {
            return React.createElement("input", { type: "date", id: field.id, className: field.className, disabled: !!field.disabled, name: field.name, value: field.value, onChange: e => this.onChange(e) });
        }
        else if (field.type == FormFieldType.select || field.type == FormFieldType.multiselect) {
            return React.createElement(Select, { width: 400, options: field.options, multiple: field.type == FormFieldType.multiselect, disabled: !!field.disabled, onChange: values => this.onChangeSelect(field.name, field.type == FormFieldType.multiselect ? values : values[0], field.type == FormFieldType.multiselect), placeholder: field.placeholder, values: field.value ? (Array.isArray(field.value) ? field.value.map(v => v.toString()) : [field.value.toString()]) : null });
        }
        return React.createElement(React.Fragment, null);
    }
    onChangeSelect(name, value, multiple) {
        let form = Form.getInstance();
        let fields = form.props.fields;
        let field = fields.find(f => f.name == name);
        if (field)
            field.value = value;
        if (field.onChange)
            field.onChange(field.value);
        field.fieldElement.setState({});
    }
    onChange(e) {
        let form = Form.getInstance();
        let fields = form.props.fields;
        let element = e.currentTarget;
        let tag = element.tagName.toLowerCase();
        let name = element.getAttribute("name");
        if (!name) {
            console.error("Element has no 'name' attribute");
            return;
        }
        let field = fields.find(f => f.name == name);
        if (tag == "input") {
            let type = element.getAttribute("type");
            if (type) {
                if (type == "text" || type == "date")
                    field.value = element.value;
                else if (type == "checkbox")
                    field.value = element.checked;
                else {
                    console.error("Unknown type of input");
                    return;
                }
            }
        }
        else if (tag == "textarea")
            field.value = element.value;
        if (field.onChange)
            field.onChange(field.value);
        field.fieldElement.setState({});
    }
}
//# sourceMappingURL=FormField.js.map
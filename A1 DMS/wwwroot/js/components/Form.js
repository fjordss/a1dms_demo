import React from 'react';
export var FormType;
(function (FormType) {
    FormType[FormType["new"] = 0] = "new";
    FormType[FormType["edit"] = 1] = "edit";
})(FormType || (FormType = {}));
export var FormFieldType;
(function (FormFieldType) {
    FormFieldType[FormFieldType["singleline"] = 0] = "singleline";
    FormFieldType[FormFieldType["multiline"] = 1] = "multiline";
    FormFieldType[FormFieldType["checkbox"] = 2] = "checkbox";
    FormFieldType[FormFieldType["select"] = 3] = "select";
    FormFieldType[FormFieldType["multiselect"] = 4] = "multiselect";
    FormFieldType[FormFieldType["datetime"] = 5] = "datetime";
})(FormFieldType || (FormFieldType = {}));
export default class Form extends React.Component {
    constructor(props) {
        super(props);
        Form.instance = this;
    }
    render() {
        return (React.createElement("div", { className: this.props.className }, this.props.children));
    }
    componentDidMount() {
        let fields = Form.getInstance().props.fields;
        for (let field of fields)
            field.value = typeof (field.value) != "undefined" ? field.value : Form.getInitValue(field);
    }
    static onSubmit() {
        let form = Form.getInstance();
        let url = form.props.url;
        let method = form.props.method;
        let fields = form.props.fields;
        if (form.errorElement)
            form.errorElement.setState({ errors: [] });
        if (Form.validate(fields)) {
            if (form.props.send)
                form.props.send();
            Form.sendRequest(method, url ? url : location.href, fields).then(data => {
                if (data.status == "ok" && form.props.success)
                    form.props.success(data);
                if (data.status == "error") {
                    if (form.props.error)
                        form.props.error(data);
                    Form.handleError(data.errors);
                }
            }, error => {
                if (form.props.error)
                    form.props.error(null);
                Form.handleError([{ text: Form.unknownError }]);
            });
        }
    }
    static getInstance() {
        return Form.instance;
    }
    static handleError(errors) {
        let form = Form.getInstance();
        let fields = form.props.fields;
        if (!errors)
            return;
        let formErrors = [];
        for (let error of errors) {
            if (!error.text)
                continue;
            if (error.field) {
                let field = fields.find(f => f.name == error.field);
                if (field && field.fieldErrorElement) {
                    field.error = error.text;
                    field.fieldErrorElement.setState({});
                }
            }
            else
                formErrors.push(error.text);
        }
        if (form.errorElement)
            form.errorElement.setState({ errors: formErrors });
    }
    static sendRequest(method, url, fields = null) {
        let requestInfo = {
            method: method,
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            body: this.getBody(fields)
        };
        return new Promise((resolve, reject) => {
            fetch(url, requestInfo)
                .then(response => response.json())
                .then((data) => resolve(data))
                .catch(error => reject(error));
        });
    }
    static getBody(fields) {
        let getValue = value => typeof (value) != "undefined" && value != null ? value : "";
        if (!fields)
            return null;
        let body = [];
        for (let field of fields) {
            let value = field.mapValue ? field.mapValue(field.value) : field.value;
            if (Array.isArray(value)) {
                for (let item of value)
                    body.push(field.name + "=" + encodeURIComponent(getValue(item)));
            }
            else
                body.push(field.name + "=" + encodeURIComponent(getValue(value)));
        }
        console.log(body.join("&"));
        return body.join("&");
    }
    static validate(fields) {
        let success = true;
        for (let field of fields) {
            if (field.required) {
                let select = field.type == FormFieldType.select || field.type == FormFieldType.multiselect;
                let input = field.type == FormFieldType.singleline || field.type == FormFieldType.multiline || field.type == FormFieldType.datetime;
                let error;
                if (select && (!field.value || field.value.length == 0))
                    error = Form.requiredFieldError;
                else if (input && !(typeof (field.value) != "undefined" && field.value != null ? field.value.trim() : null))
                    error = Form.requiredFieldError;
                if (error) {
                    field.error = error;
                    success = false;
                }
                else
                    field.error = null;
            }
            if (!field.error && field.validate) {
                let result;
                let error;
                [result, error] = field.validate(field.value);
                if (!result) {
                    field.error = error ? error : Form.requiredFieldError;
                    success = false;
                }
                else
                    field.error = null;
            }
            if (field.fieldErrorElement)
                field.fieldErrorElement.setState({});
        }
        return success;
    }
    static getInitValue(field) {
        if (field.type == FormFieldType.singleline || field.type == FormFieldType.multiline || field.type == FormFieldType.select || field.type == FormFieldType.datetime)
            return "";
        else if (field.type == FormFieldType.checkbox)
            return false;
        else if (field.type == FormFieldType.multiselect)
            return [];
    }
}
Form.requiredFieldError = "This field is required";
Form.unknownError = "Unknown error occured, please try again";
Form.unknownErrorWithRefresh = "Unknown error occured, please refresh page and try again";
//# sourceMappingURL=Form.js.map
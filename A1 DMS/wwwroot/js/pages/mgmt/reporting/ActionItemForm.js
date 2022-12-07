import React from 'react';
import Form, { FormFieldType } from '../../../components/Form';
import FormField from '../../../components/FormField';
import FormFieldError from '../../../components/FormFieldError';
import FormFieldLabel from '../../../components/FormFieldLabel';
import FormSubmit from '../../../components/FormSubmit';
import CardDetails from '../CardDetails';
import { app } from '../ManagementApp';
import { ActionItemStatus } from './Closeout';
export default class ActionItemForm extends React.Component {
    constructor(props) {
        super(props);
        this.submit = {
            value: "Save"
        };
        this.state = { detailsVisible: false };
    }
    render() {
        ActionItemForm.fields = this.getFields();
        return (React.createElement(React.Fragment, null, !this.state.detailsVisible ?
            React.createElement(Form, { method: "PUT", url: "/api/actionitems/" + this.props.actionItem.id, fields: ActionItemForm.fields, className: "form ai-form", send: () => this.props.onSend(), success: res => this.props.onSuccess(res), error: res => this.props.onError(res) },
                React.createElement("div", { className: "field" },
                    React.createElement("div", { className: "label" },
                        React.createElement(FormFieldLabel, { field: this.retrive("status") })),
                    React.createElement("div", { className: "control" },
                        React.createElement(FormField, { field: this.retrive("status") })),
                    React.createElement("div", { className: "error" },
                        React.createElement(FormFieldError, { field: this.retrive("status") }))),
                React.createElement("div", { onClick: () => this.setState({ detailsVisible: true }), className: "ai-card-details-label" },
                    React.createElement("span", { className: "a", onClick: () => this.setState({ detailsVisible: true }) }, "Card details")),
                React.createElement("div", { className: "field" },
                    React.createElement("div", { className: "label" },
                        React.createElement(FormFieldLabel, { field: this.retrive("responsibleId") })),
                    React.createElement("div", { className: "control" },
                        React.createElement(FormField, { field: this.retrive("responsibleId") })),
                    React.createElement("div", { className: "control" },
                        React.createElement(FormField, { field: this.retrive("otherResponsible") })),
                    React.createElement("div", { className: "error" },
                        React.createElement(FormFieldError, { field: this.retrive("responsibleId") })),
                    React.createElement("div", { className: "error" },
                        React.createElement(FormFieldError, { field: this.retrive("otherResponsible") }))),
                React.createElement("div", { className: "field" },
                    React.createElement("div", { className: "label" },
                        React.createElement(FormFieldLabel, { field: this.retrive("closedBy") })),
                    React.createElement("div", { className: "control" },
                        React.createElement(FormField, { field: this.retrive("closedBy") })),
                    React.createElement("div", { className: "error" },
                        React.createElement(FormFieldError, { field: this.retrive("closedBy") }))),
                React.createElement("div", { className: "field" },
                    React.createElement("div", { className: "label" },
                        React.createElement(FormFieldLabel, { field: this.retrive("furtherActions") })),
                    React.createElement("div", { className: "control" },
                        React.createElement(FormField, { field: this.retrive("furtherActions") })),
                    React.createElement("div", { className: "error" },
                        React.createElement(FormFieldError, { field: this.retrive("furtherActions") }))),
                React.createElement("div", { className: "field" },
                    React.createElement("div", { className: "label" },
                        React.createElement(FormFieldLabel, { field: this.retrive("comments") })),
                    React.createElement("div", { className: "control" },
                        React.createElement(FormField, { field: this.retrive("comments") }))),
                React.createElement("div", { className: "field" },
                    React.createElement("div", { className: "label" },
                        React.createElement(FormFieldLabel, { field: this.retrive("targetDate") })),
                    React.createElement("div", { className: "control" },
                        React.createElement(FormField, { field: this.retrive("targetDate") })),
                    React.createElement("div", { className: "error" },
                        React.createElement(FormFieldError, { field: this.retrive("targetDate") }))),
                React.createElement("div", { className: "field" },
                    React.createElement("div", { className: "label" },
                        React.createElement(FormFieldLabel, { field: this.retrive("closureDate") })),
                    React.createElement("div", { className: "control" },
                        React.createElement(FormField, { field: this.retrive("closureDate") })),
                    React.createElement("div", { className: "error" },
                        React.createElement(FormFieldError, { field: this.retrive("closureDate") }))),
                React.createElement("div", null,
                    React.createElement(FormSubmit, { submit: this.submit })),
                React.createElement("div", null,
                    React.createElement("button", { className: "cancel", onClick: () => this.props.onClose() }, "Cancel"))) :
            React.createElement("div", { className: "ai-card-details" },
                React.createElement("span", { className: "a ai-card-details-backlabel", onClick: () => this.setState({ detailsVisible: false }) }, "Back to Action Item"),
                React.createElement(CardDetails, { card: this.props.actionItem.card }))));
    }
    static clear() {
        ActionItemForm.fields = null;
    }
    getFields() {
        let fields = [];
        let departments = app.departments.filter(opt => opt.text != "Blank");
        departments.push({ value: "0", text: "Other" });
        let statusField = {
            name: "status",
            displayName: "Status",
            type: FormFieldType.select,
            options: [
                { value: ActionItemStatus.open.toString(), text: this.getStatusDisplayName(ActionItemStatus.open) },
                { value: ActionItemStatus.inProgress.toString(), text: this.getStatusDisplayName(ActionItemStatus.inProgress) },
                { value: ActionItemStatus.closed.toString(), text: this.getStatusDisplayName(ActionItemStatus.closed) }
            ],
            onChange: () => this.setState({}),
            value: ActionItemForm.fields ? this.retrive("status").value : [this.props.actionItem.status],
        };
        let status = this.getStatusByCode(statusField.value);
        fields.push(statusField);
        let responsbileField = {
            name: "responsibleId",
            displayName: "Reponsible Party",
            type: FormFieldType.select,
            options: departments,
            required: status != ActionItemStatus.open,
            disabled: status != ActionItemStatus.inProgress,
            onChange: () => this.setState({}),
            value: ActionItemForm.fields ? this.retrive("responsibleId").value : (this.props.actionItem.responsible ? this.props.actionItem.responsible.id : null)
        };
        let isOther = responsbileField.value == "0";
        fields.push(responsbileField);
        fields.push({
            name: "otherResponsible",
            type: FormFieldType.singleline,
            visible: isOther,
            placeholder: "Input any value here",
            required: isOther,
            value: ActionItemForm.fields ? this.retrive("otherResponsible").value : this.props.actionItem.otherResponsible
        });
        fields.push({
            name: "furtherActions",
            displayName: "Further Actions (заполнять на английском)",
            type: FormFieldType.multiline,
            required: status != ActionItemStatus.open,
            disabled: status != ActionItemStatus.inProgress,
            value: ActionItemForm.fields ? this.retrive("furtherActions").value : this.props.actionItem.furtherActions
        });
        fields.push({
            name: "targetDate",
            displayName: "Target Date",
            type: FormFieldType.datetime,
            required: status != ActionItemStatus.open,
            disabled: status != ActionItemStatus.inProgress,
            value: ActionItemForm.fields ? this.retrive("targetDate").value : this.dateToControl(this.props.actionItem.targetDate),
            validate: (value) => {
                if (!value)
                    return [false, Form.requiredFieldError];
                let validated = new Date(value).getTime() >= new Date(this.props.currentDate).getTime();
                return [validated, !validated ? "Target date cannot be less than today" : null];
            }
        });
        fields.push({
            name: "closedBy",
            displayName: "Closed by",
            type: FormFieldType.singleline,
            required: status == ActionItemStatus.closed,
            disabled: true,
            value: (() => {
                if (status != ActionItemStatus.closed)
                    return "";
                return ActionItemForm.fields ? app.currentUser.name : this.props.actionItem.closedBy.name;
            })()
        });
        fields.push({
            name: "comments",
            displayName: "Closeout Comments (заполнять на английском)",
            type: FormFieldType.multiline,
            disabled: status != ActionItemStatus.closed,
            value: (() => {
                if (status != ActionItemStatus.closed)
                    return "";
                return ActionItemForm.fields ? this.retrive("comments").value : this.props.actionItem.comments;
            })()
        });
        fields.push({
            name: "closureDate",
            displayName: "Date of Closure",
            type: FormFieldType.datetime,
            required: status == ActionItemStatus.closed,
            disabled: true,
            value: (() => {
                if (status != ActionItemStatus.closed)
                    return "";
                return ActionItemForm.fields ? this.props.currentDate : this.dateToControl(this.props.actionItem.closureDate);
            })()
        });
        if (ActionItemForm.fields) {
            for (let field of fields) {
                let existing = ActionItemForm.fields.find(f => f.name == field.name);
                if (existing) {
                    field.fieldElement = existing.fieldElement;
                    field.fieldErrorElement = existing.fieldErrorElement;
                    field.fieldLabelElement = existing.fieldLabelElement;
                    field.error = existing.error;
                }
            }
        }
        return fields;
    }
    retrive(name) {
        let field = ActionItemForm.fields.find(f => f.name == name);
        if (!field)
            throw new Error("field '" + name + "' does not exist");
        return field;
    }
    dateToControl(date) {
        return date ? date.split("T")[0] : "";
    }
    getStatusDisplayName(status) {
        if (status == ActionItemStatus.open)
            return "Open";
        if (status == ActionItemStatus.inProgress)
            return "In Progress";
        if (status == ActionItemStatus.closed)
            return "Closed";
        return null;
    }
    getStatusByCode(status) {
        let displayName = ActionItemStatus[parseInt(status)];
        if (displayName == "open")
            return ActionItemStatus.open;
        if (displayName == "inProgress")
            return ActionItemStatus.inProgress;
        if (displayName == "closed")
            return ActionItemStatus.closed;
        return null;
    }
}
//# sourceMappingURL=ActionItemForm.js.map
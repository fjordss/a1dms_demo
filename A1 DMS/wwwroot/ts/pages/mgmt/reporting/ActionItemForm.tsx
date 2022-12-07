import { Form, FormField, FormFieldDesc, FormFieldError, FormFieldLabel, FormFieldType, FormResponse, FormSubmit, FormSubmitDesc } from 'a1dms-front';
import React from 'react'
import CardDetails from '../CardDetails';
import { app } from '../ManagementApp';
import { ActionItem, ActionItemStatus } from './Closeout';

export interface ActionItemFormProps {
    actionItem: ActionItem;
    currentDate: string;
    onSuccess: (data: FormResponse<ActionItem>) => void;
    onError: (data: FormResponse<ActionItem>) => void;
    onSend: () => void;
    onClose: () => void;
}

export interface ActionItemFormState {
    detailsVisible: boolean;
}

export default class ActionItemForm extends React.Component<ActionItemFormProps, ActionItemFormState> {
    private static fields: Array<FormFieldDesc>;

    private submit: FormSubmitDesc = {
        value: "Save"
    }

    public constructor(props) {
        super(props);

        this.state = { detailsVisible: false };
    }

    public render() {
        ActionItemForm.fields = this.getFields();

        return (
            <>
                {!this.state.detailsVisible ?
                    <Form<ActionItem>
                        method="PUT"
                        url={"/api/actionitems/" + this.props.actionItem.id}
                        fields={ActionItemForm.fields}
                        className="form ai-form"
                        send={() => this.props.onSend()}
                        success={res => this.props.onSuccess(res)}
                        error={res => this.props.onError(res)}
                    >
                        <div className="field">
                            <div className="label"><FormFieldLabel field={this.retrive("status")} /></div>
                            <div className="control"><FormField field={this.retrive("status")} /></div>
                            <div className="error"><FormFieldError field={this.retrive("status")} /></div>
                        </div>

                        <div onClick={() => this.setState({ detailsVisible: true })} className="ai-card-details-label">
                            <span className="a" onClick={() => this.setState({ detailsVisible: true })}>Card details</span>
                        </div>

                        <div className="field">
                            <div className="label"><FormFieldLabel field={this.retrive("responsibleId")} /></div>
                            <div className="control"><FormField field={this.retrive("responsibleId")} /></div>
                            <div className="control"><FormField field={this.retrive("otherResponsible")} /></div>
                            <div className="error"><FormFieldError field={this.retrive("responsibleId")} /></div>
                            <div className="error"><FormFieldError field={this.retrive("otherResponsible")} /></div>
                        </div>

                        <div className="field">
                            <div className="label"><FormFieldLabel field={this.retrive("closedBy")} /></div>
                            <div className="control"><FormField field={this.retrive("closedBy")} /></div>
                            <div className="error"><FormFieldError field={this.retrive("closedBy")} /></div>
                        </div>

                        <div className="field">
                            <div className="label"><FormFieldLabel field={this.retrive("furtherActions")} /></div>
                            <div className="control"><FormField field={this.retrive("furtherActions")} /></div>
                            <div className="error"><FormFieldError field={this.retrive("furtherActions")} /></div>
                        </div>

                        <div className="field">
                            <div className="label"><FormFieldLabel field={this.retrive("comments")} /></div>
                            <div className="control"><FormField field={this.retrive("comments")} /></div>
                        </div>

                        <div className="field">
                            <div className="label"><FormFieldLabel field={this.retrive("targetDate")} /></div>
                            <div className="control"><FormField field={this.retrive("targetDate")} /></div>
                            <div className="error"><FormFieldError field={this.retrive("targetDate")} /></div>
                        </div>

                        <div className="field">
                            <div className="label"><FormFieldLabel field={this.retrive("closureDate")} /></div>
                            <div className="control"><FormField field={this.retrive("closureDate")} /></div>
                            <div className="error"><FormFieldError field={this.retrive("closureDate")} /></div>
                        </div>

                        <div>
                            <FormSubmit submit={this.submit} />
                        </div>

                        <div>
                            <button className="cancel" onClick={() => this.props.onClose()}>Cancel</button>
                        </div>
                    </Form> :
                    <div className="ai-card-details">
                        <span className="a ai-card-details-backlabel" onClick={() => this.setState({ detailsVisible: false })}>Back to Action Item</span>
                        <CardDetails card={this.props.actionItem.card} />
                    </div>}
            </>
        );
    }

    public static clear() {
        ActionItemForm.fields = null;
    }

    private getFields(): Array<FormFieldDesc> {
        let fields: Array<FormFieldDesc> = [];

        let departments = app.departments.filter(opt => opt.text != "Blank");
        departments.push({ value: "0", text: "Other" });

        let statusField: FormFieldDesc = {
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

        let responsbileField: FormFieldDesc = {
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
            validate: (value: string) => {
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

                return ActionItemForm.fields ? app.currentUser.name : this.props.actionItem.closedBy.name
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

    private retrive(name: string): FormFieldDesc {
        let field = ActionItemForm.fields.find(f => f.name == name);
        if (!field)
            throw new Error("field '" + name + "' does not exist");

        return field;
    }

    private dateToControl(date: string) {
        return date ? date.split("T")[0] : "";
    }

    private getStatusDisplayName(status: ActionItemStatus): string {
        if (status == ActionItemStatus.open)
            return "Open";

        if (status == ActionItemStatus.inProgress)
            return "In Progress";

        if (status == ActionItemStatus.closed)
            return "Closed";

        return null;
    }

    private getStatusByCode(status: string): ActionItemStatus {
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
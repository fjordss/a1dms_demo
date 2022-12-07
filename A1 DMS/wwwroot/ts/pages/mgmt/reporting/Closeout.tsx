import React from 'react'
import Switch from 'react-switch'
import { app } from '../ManagementApp';
import { Card, Language } from '../CardDetails';
import { Department } from '../departments/Departments';
import { User } from '../users/Users';
import ActionItemForm from './ActionItemForm';
import { DateRangePicker, Form, http, Modal, ModalError, Select, Table, TableColumn, TableContainer, TableContainerProps, TableContainerState, TableContextMenuItem, TableDefaultHeader, TableInfo, TablePaginator, TableRow, TableSearch, utility } from 'a1dms-front';

export interface CloseoutItem extends TableRow {
    site: string;
    date: string;
    name: string;
    company: string;
    department: string;
    description: string;
    actionsTaken: string;
    location: string;
    suggestedFurtherActions: string;
    status: string;
    furtherActions: string;
    responsible: string;
    targetDate: string;
    closeoutComments: string;
    closedBy: string;
    closureDate: string;
}

export enum ActionItemStatus {
    open = 0,
    inProgress = 1,
    closed = 2,
}

export interface ActionItem {
    id: string;
    status: ActionItemStatus;
    furtherActions: string;
    responsible: Department;
    otherResponsible: string;
    targetDate: string;
    closureDate: string;
    comments: string;
    closedBy: User;
    card: Card;
}

export interface CloseoutState extends TableContainerState {
    showDatePicker: boolean;
    dateFrom: string;
    dateTo: string;
    lang: Language;

    editFormLoading: boolean;
    editFormVisible: boolean;

    errorMessage: string;
    errorVisible: boolean;

    actionItem: ActionItem;
    currentDate: string;
}

export default class Closeout extends TableContainer<TableContainerProps, CloseoutState> {
    public constructor(props) {
        super(props);

        let state = this.state as CloseoutState;

        state.showDatePicker = false;
        state.dateFrom = DateRangePicker.getRange("cm")[0];
        state.pageTitle = "Close-out report (action items data)";

        this.onFieldValueChanged("from", [this.state.dateFrom]);
    }

    public render() {
        return (
            <div>
                <Modal height={270} header="Select range" visible={this.state.showDatePicker} onClose={() => this.setState({ showDatePicker: false })}>
                    <DateRangePicker onChange={(from, to) => this.dateRangeSelected(from, to)} />
                </Modal>

                <Modal visible={this.state.editFormVisible} loading={this.state.editFormLoading} width={1060} onClose={() => {
                    ActionItemForm.clear();
                    this.setState({ editFormVisible: false });
                }}>
                    <ActionItemForm
                        actionItem={this.state.actionItem}
                        currentDate={this.state.currentDate}
                        onClose={() => {
                            ActionItemForm.clear();
                            this.setState({ editFormVisible: false });
                        }}
                        onSend={() => this.setState({ editFormLoading: true })}
                        onSuccess={res => {
                            ActionItemForm.clear();
                            this.setState({
                                editFormVisible: false,
                                updateTable: true
                            });
                        }}
                        onError={res => {
                            if (res.errors.filter(e => !!e.field).length > 0) {
                                this.setState({
                                    editFormLoading: false
                                });
                            }
                            else {
                                this.setState({
                                    editFormVisible: false,
                                    errorVisible: true,
                                    errorMessage: res && res.errors.length > 0 ? res.errors[0].text : Form.unknownError
                                });
                            } 
                        }}
                    />
                </Modal>

                <ModalError visible={this.state.errorVisible} errors={[this.state.errorMessage]} onClose={() => this.setState({ errorVisible: false })} />
                
                <div className="report-search-area">
                    <div className="report-search-left">
                        <Select options={app.sites.map(s => s.text)} multiple={true} placeholder="Select sites..." width={200} onChange={v => this.onFieldValueChanged("sites", v)} />
                    </div>
                    <div className="report-search-left">
                        <Select options={app.companies.map(s => s.text)} multiple={true} placeholder="Select companies..." width={200} onChange={v => this.onFieldValueChanged("companies", v)} />
                    </div>
                    <div className="report-search-left">
                        <Select options={app.departments.map(s => s.text)} multiple={true} placeholder="Select departments..." width={200} onChange={v => this.onFieldValueChanged("departments", v)} />
                    </div>
                    <div className="report-search-left nopadding">
                        <input type="date" placeholder="From..." value={this.state.dateFrom} onChange={e => this.onDateChanged(e.currentTarget.value, "from")} />&nbsp;-&nbsp;
                        <input type="date" placeholder="To..." value={this.state.dateTo} onChange={e => this.onDateChanged(e.currentTarget.value, "to")} /> &nbsp;
                    </div>
                    <div className="report-search-left"><button className="date-picker-button" onClick={() => this.setState({ showDatePicker: true })}>...</button></div>
                    <div className="report-search-left"><button onClick={() => this.getReport()}>Get Report</button></div>
                    <div className="report-search-space"></div>
                    <div className="report-search-right">
                        <TableSearch<Closeout> parent={this} />
                    </div>
                </div>

                <div className={"pagination-area" + (this.state.totalRows == 0 ? " hidden" : "")}>
                    <div className="pagination-info"><TableInfo rowsPerPage={this.state.rowsPerPage} page={this.state.page} totalRows={this.state.totalRows} /></div>
                    <div><TablePaginator rowsPerPage={this.state.rowsPerPage} totalRows={this.state.totalRows} page={this.state.page} onChange={page => this.changePage(page)} /></div>
                </div>

                <Table<Closeout, CloseoutItem>
                    parent={this}
                    className="closeout"
                    apiUrl="/api/reporting/closeout"
                    columns={this.getColumns()}
                    getContextMenu={this.getContextMenu}
                    getAdditionalRowClass={row => row.status == "Open" ? "closeout-cell-open" : (row.status == "Closed" ? "closeout-cell-closed" : "closeout-cell-inprogress")}
                    getAdditionalRowClassHover={row => row.status == "Open" ? "closeout-cell-open-hover" : (row.status == "Closed" ? "closeout-cell-closed-hover" : "closeout-cell-inprogress-hover")}
                >
                    <div className="closeout-top-cell">
                        <Switch
                            onChange={() => this.toggleLang()}
                            checked={this.state.lang == Language.rus}
                            uncheckedIcon={<div className="switch-label">eng</div>}
                            checkedIcon={<div className="switch-label">rus</div>}
                            height={25}
                            width={60}
                        />
                    </div>
                    <TableDefaultHeader />
                </Table>

                <div className={"pagination-area" + (this.state.totalRows == 0 ? " hidden" : "")}>
                    <div className="pagination-info"><TableInfo rowsPerPage={this.state.rowsPerPage} page={this.state.page} totalRows={this.state.totalRows} /></div>
                    <div><TablePaginator rowsPerPage={this.state.rowsPerPage} totalRows={this.state.totalRows} page={this.state.page} onChange={page => this.changePage(page)} /></div>
                </div>
            </div>
        );
    }

    private getContextMenu = (row: CloseoutItem): Array<TableContextMenuItem> => {
        return [
            {
                label: "Edit",
                icon: <i className="fas fa-edit"></i>,
                action: () => this.showEdit(row)
            }
        ];
    }

    private showEdit(row: CloseoutItem) {
        this.setState({
            editFormLoading: true,
            editFormVisible: true
        });

        let handleError = () => {
            this.setState({
                editFormLoading: false,
                editFormVisible: false,
                errorVisible: true,
                errorMessage: "Failed to retrieve card data"
            });
        }

        http.fetch<string>("/api/date")
            .then(res => {
                if (res.status == "ok") {
                    let date = res.data.split("T")[0];

                    http.fetch<ActionItem>("/api/actionitems/" + row.id)
                        .then(res => {
                            if (res.status == "ok") {
                                this.setState({
                                    editFormLoading: false,
                                    actionItem: res.data,
                                    currentDate: date
                                });
                            }
                            else
                                handleError();
                        })
                        .catch(() => handleError());
                }
                else
                    handleError();
            })
            .catch(() => handleError())

    }

    private toggleLang() {
        let lang = Language.rus;
        if (this.state.lang == Language.rus)
            lang = Language.eng;

        this.setState({ lang });
    }

    private changePage(page: number) {
        this.setState({
            page,
            updateTable: true
        });
    }

    private getReport() {
        this.setState({
            updateTable: true,
            query: this.state.query
        });
    }

    private onDateChanged(value: string, field: string) {
        if (field == "from")
            this.setState({ dateFrom: value })
        else if (field == "to")
            this.setState({ dateTo: value })

        this.onFieldValueChanged(field, [value]);
    }

    private onFieldValueChanged(field: string, values: Array<string>) {
        this.state.query.set(field, values);
    }

    private dateRangeSelected(from: string, to?: string) {
        this.onFieldValueChanged("from", [from]);

        if (to)
            this.onFieldValueChanged("to", [to]);

        this.setState({
            dateFrom: from,
            dateTo: to,
            showDatePicker: false
        });
    }

    private getColumns(): Array<TableColumn<CloseoutItem>> {
        let getColumn = (
            label: string,
            internalName: string = null,
            sortable: boolean = false,
            filterable: boolean = false,
            searchable: boolean = false,
            map: (e: CloseoutItem) => JSX.Element | Array<JSX.Element> = null,
            headerCellClass: string = null
        ) => {
            if (!internalName)
                internalName = label;

            let column = {
                label,
                internalName,
                sortable,
                filterable,
                searchable,
                map,
                headerCellClass
            } as TableColumn<CloseoutItem>;

            column.onDoubleClick = row => this.showEdit(row);

            return column;
        }

        let getStringByLang = (text: string, lang: Language) => <>{text ? text.split("{-DELIM-}")[lang == Language.rus ? 1 : 0] : ""}</>;

        return [
            getColumn("Site", "site", true, true, true),
            getColumn("Date", "date", true, true, false, row => <span>{utility.convertDate(row.date)}</span>),
            getColumn("Observer Name", "name", true, true, true),
            getColumn("Company", "company", true, true, true),
            getColumn("Observer Department", "department", true, true, true),
            getColumn("Description", "description", false, false, true, row => getStringByLang(row.description, this.state.lang)),
            getColumn("Actions Taken", "actionsTaken", false, false, true, row => getStringByLang(row.actionsTaken, this.state.lang)),
            getColumn("Specific Location", "location", false, false, true, row => getStringByLang(row.location, this.state.lang)),
            getColumn("Actions Suggested", "suggestedFurtherActions", false, false, true, row => getStringByLang(row.suggestedFurtherActions, this.state.lang)),
            getColumn("Status", "status", true, true, true, null, "closeout-header-cell"),
            getColumn("Further Actions", "furtherActions", false, false, true, null, "closeout-header-cell"),
            getColumn("Responsible Party", "responsible", true, true, true, null, "closeout-header-cell"),
            getColumn("Target Date", "targetDate", true, true, false, row => <span>{utility.convertDate(row.targetDate)}</span>, "closeout-header-cell"),
            getColumn("Closeout Comments", "closeoutComments", false, false, true, null, "closeout-header-cell"),
            getColumn("Closed by", "closedBy", true, true, true, null, "closeout-header-cell"),
            getColumn("Date of Closure", "closureDate", true, true, false, row => <span>{utility.convertDate(row.closureDate)}</span>, "closeout-header-cell")
        ];
    }
}
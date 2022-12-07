import { Access, Form, FormReponseError, FormResponse, http, Modal, ModalError, Select, SelectOption, Table, TableColumn, TableContainer, TableContainerProps, TableContainerState, TableContextMenuItem, TableDefaultHeader, TableInfo, TablePaginator, TableResponse, TableRow, TableSearch } from 'a1dms-front';
import { HttpMethod } from 'a1dms-front';
import React from 'react'
import CardDetails, { Card } from '../CardDetails';
import { app } from '../ManagementApp';
import { UserService } from '../users/Users';

export interface NominationReportItem extends TableRow {
    description: string;
    actionsTaken: string;
    suggestedActions: string;
    descriptionRus: string;
    actionsTakenRus: string;
    suggestedActionsRus: string;
    nominationCategory: string;
    votesNumberStage1: number;
    votesNumberStage3: number;
    stage3VoteMade: boolean;
    isWinner: boolean;
    selected: boolean;
}

export interface NominationReport extends TableResponse<NominationReportItem> {
    stage: number;
    reportId: number;
    from: string;
    to: string;
}

export interface NominationState extends TableContainerState {
    nominationLoading: boolean;
    nominationSelectorVisible: boolean;
    nominationCardId: number;
    nominationCategory: string;

    detailsVisible: boolean;
    detailsLoading: boolean;

    details: Card;

    errorVisible: boolean;
    errorMessage: string;

    reportId: number;
    from: string;
    to: string;
    stage: number;
    selectedStage: number;
    rows: Array<NominationReportItem>
}

export default class Nomination extends TableContainer<TableContainerProps, NominationState> {
    private columns: Array<TableColumn<NominationReportItem>> = [];
    private isSSHEUser: boolean;
    private isVotingUser: boolean;

    public constructor(props) {
        super(props);

        this.isSSHEUser = UserService.correspondsPolicy("nominationSSHEUser");
        this.isVotingUser = UserService.correspondsPolicy("nominationVotingUser");
    }

    public render() {
        this.columns = this.getColumns();

        if (!this.state.query.has("site"))
            this.onFieldValueChanged("site", [app.sites[0].text]);

        let categories = ["All"];
        categories = categories.concat(app.nominationCategories);

        return (
            <div>
                <Access app={app} policy="nomination" />

                <Modal visible={this.state.detailsVisible} loading={this.state.detailsLoading} width={900} onClose={() => this.setState({ detailsVisible: false })}>
                    <CardDetails card={this.state.details} />
                </Modal>

                <Modal
                    visible={this.state.nominationSelectorVisible}
                    loading={this.state.nominationLoading}
                    width={400}
                    height={240}
                    header="Select category"
                    onClose={() => this.setState({ nominationSelectorVisible: false })}
                >
                    <Select options={app.nominationCategories} dropdownWidth="500px" onChange={values => this.categorySelected(values[0])} values={this.state.nominationCategory ? [this.state.nominationCategory] : null} />
                </Modal>

                <ModalError visible={this.state.errorVisible} errors={[this.state.errorMessage]} onClose={() => this.setState({ errorVisible: false })} />
                
                <div className="report-search-area">
                    <div className="report-search-left nomination-date-range">
                        <span>{(this.state.from && this.state.to) ? this.state.from + " - " + this.state.to : ""}</span>
                    </div>
                    <div className="report-search-left">
                        <Select options={app.sites.map(s => s.text)} selectFirst={true} placeholder="Select site..." width={200} onChange={v => this.onFieldValueChanged("site", v)} />
                    </div>
                    <div className="report-search-left">
                        <Select
                            options={categories}
                            selectFirst={true}
                            placeholder="Select category..."
                            width={200}
                            dropdownWidth="500px"
                            onChange={v => v[0] != "All" ? this.onFieldValueChanged("category", v) : this.state.query.delete("category")}
                        />
                    </div>
                    <div className="report-search-left"><button onClick={() => this.getReport()}>Get Report</button></div>
                    <div className="report-search-space"></div>
                    <div className="report-search-right">
                        <TableSearch<Nomination> parent={this} />
                    </div>
                </div>

                <div className={"pagination-area" + (this.state.totalRows == 0 ? " hidden" : "")}>
                    <div className="pagination-info"><TableInfo rowsPerPage={this.state.rowsPerPage} page={this.state.page} totalRows={this.state.totalRows} /></div>
                    <div className="nomination-top-paginator">
                        {this.isSSHEUser ?
                            <>
                                <Select
                                    onChange={values => this.setState({ selectedStage: parseInt(values[0]) })}
                                    values={this.state.selectedStage ? [this.state.selectedStage.toString()] : (this.state.stage ? [this.state.stage.toString()] : null)}
                                    options={this.getStages()}
                                    selectFirst={true}
                                    width={200}
                                />
                                <button onClick={this.changeStage}>Save</button>
                            </> :
                            <></>}
                        <TablePaginator rowsPerPage={this.state.rowsPerPage} totalRows={this.state.totalRows} page={this.state.page} onChange={page => this.changePage(page)} />
                    </div>
                </div>

                <Table<Nomination, NominationReportItem>
                    onDataLoaded={this.setReportData}
                    parent={this}
                    className={this.getClass()}
                    apiUrl="/api/reporting/nomination"
                    columns={this.columns}
                    getContextMenu={this.getContextMenu}
                >
                    {this.state.stage == 1 || this.state.stage == 2 ?
                        <div className="nomination-top-cell">
                            <i className="fas fa-trash-alt" onClick={() => this.excludeCards()}></i>
                        </div> :
                        <></>}
                    <TableDefaultHeader />
                </Table>

                <div className={"pagination-area" + (this.state.totalRows == 0 ? " hidden" : "")}>
                    <div className="pagination-info"><TableInfo rowsPerPage={this.state.rowsPerPage} page={this.state.page} totalRows={this.state.totalRows} /></div>
                    <div><TablePaginator rowsPerPage={this.state.rowsPerPage} totalRows={this.state.totalRows} page={this.state.page} onChange={page => this.changePage(page)} /></div>
                </div>
            </div>
        );
    }

    private getContextMenu = (row: NominationReportItem): Array<TableContextMenuItem> => {
        let items: Array<TableContextMenuItem> = [];

        items.push({
            label: "Details",
            icon: <i className="fas fa-info-circle"></i>,
            action: () => this.showDetails(row)
        });

        if (this.state.stage == 1 || this.state.stage == 2) {
            items.push({
                label: "Change category",
                icon: <i className="fas fa-vote-yea"></i>,
                action: () => this.showNominationSelector(row)
            });

            items.push({
                label: "Exclude from Report",
                icon: <i className="fas fa-trash-alt"></i>,
                action: () => this.excludeCards(row.id)
            })
        }
        else if (this.state.stage == 3 && this.isVotingUser) {
            items.push({
                label: row.stage3VoteMade ? "Down Vote" : "Up Vote",
                icon: <i className="fas fa-vote-yea"></i>,
                action: () => row.stage3VoteMade ? this.unsetVote(row) : this.setVote(row)
            });
        }
        else if (this.state.stage == 4 && this.isSSHEUser) {
            if (row.isWinner) {
                items.push({
                    label: "Remove Winner Status",
                    icon: <i className="fas fa-trash-alt"></i>,
                    action: () => this.unsetWinner(row)
                });
            }
            else {
                items.push({
                    label: "Set as a Winner",
                    icon: <i className="fas fa-trophy"></i>,
                    action: () => this.setWinner(row)
                });

                items.push({
                    label: "Up Vote",
                    icon: <i className="fas fa-vote-yea"></i>,
                    action: () => this.offsetVote(row, 1)
                });

                items.push({
                    label: "Down Vote",
                    icon: <i className="fas fa-vote-yea"></i>,
                    action: () => this.offsetVote(row, -1)
                });
            }
        }

        return items;
    }

    private offsetVote(row: NominationReportItem, offset: number) {
        let params = new Map<string, string>();
        params.set("offset", offset.toString());

        http.fetch("/api/reporting/nomination/" + this.state.reportId + "/offsetvote/" + row.id, HttpMethod.put, params)
            .then(res => {
                if (res.status == "ok")
                    this.setState({ updateTable: true });
                else
                    this.handleError(res.errors[0].text);
            })
            .catch(() => this.handleError());
    }

    private setVote = row => this.vote(row, true);

    private unsetVote = (row: NominationReportItem) => this.vote(row, false);

    private vote(row: NominationReportItem, set: boolean) {
        http.fetch("/api/reporting/nomination/" + this.state.reportId + "/" + (set ? "set" : "unset") + "vote/" + row.id, HttpMethod.put)
            .then(res => {
                if (res.status == "ok")
                    this.setState({ updateTable: true });
                else
                    this.handleError(res.errors[0].text);
            })
            .catch(() => this.handleError());
    }

    private setWinner = row => this.winner(row, true);

    private unsetWinner = (row: NominationReportItem) => this.winner(row, false);

    private winner(row: NominationReportItem, set: boolean) {
        http.fetch("/api/reporting/nomination/" + this.state.reportId + "/" + (set ? "set" : "unset") + "winner/" + row.id, HttpMethod.put)
            .then(res => {
                if (res.status == "ok")
                    this.setState({ updateTable: true });
                else
                    this.handleError(res.errors[0].text);
            })
            .catch(() => this.handleError());
    }

    private changeStage = () => {
        if (this.state.selectedStage && this.state.selectedStage != this.state.stage) {
            let params = new Map<string, string>();
            params.set("stage", this.state.selectedStage.toString());

            http.fetch("/api/reporting/nomination/" + this.state.reportId + "/changestage", HttpMethod.put, params)
                .then(res => {
                    if (res.status == "ok")
                        this.setState({ updateTable: true });
                    else
                        this.handleError(res.errors[0].text);
                })
                .catch(() => this.handleError());
        }
    }

    private excludeCards = (cardId: number = null) => {
        let selected = this.state.rows.filter(row => row.selected);

        if ((selected.length > 0 || cardId != null) && confirm("Do you want to exclude selected cards from the report?")) {
            let params = new Map<string, string[]>();
            params.set("cardIds", cardId != null ? [cardId.toString()] : this.state.rows.filter(row => row.selected).map(row => row.id.toString()));

            http.fetch("/api/reporting/nomination/" + this.state.reportId + "/exclude", HttpMethod.delete, params)
                .then(res => {
                    if (res.status == "ok")
                        this.setState({ updateTable: true });
                    else
                        this.handleError();
                })
                .catch(() => this.handleError());
        }
    }

    private categorySelected(category: string) {
        let handleError = () => {
            this.setState({
                nominationSelectorVisible: false,
                errorVisible: true,
                errorMessage: Form.unknownError
            });
        }

        let params = new Map<string, string>();
        params.set("category", category);

        http.fetch("/api/reporting/nomination/" + this.state.reportId + "/setcategory/" + this.state.nominationCardId, HttpMethod.put, params)
            .then(res => {
                if (res.status == "ok") {
                    this.setState({
                        nominationSelectorVisible: false,
                        updateTable: true
                    });
                }
                else
                    handleError();
            })
            .catch(() => handleError())
    }

    private showDetails(row: NominationReportItem) {
        this.setState({
            detailsLoading: true,
            detailsVisible: true
        });

        let handleError = () => {
            this.setState({
                detailsLoading: false,
                detailsVisible: false,
                errorVisible: true,
                errorMessage: "Failed to retrieve card data"
            });
        }

        http.fetch<Card>("/api/cards/" + row.id)
            .then(res => {
                if (res.status == "ok") {
                    this.setState({
                        detailsLoading: false,
                        details: res.data
                    });
                }
                else
                    handleError();
            })
            .catch(() => handleError());
    }

    private showNominationSelector(row: NominationReportItem) {
        this.setState({
            nominationSelectorVisible: true,
            nominationLoading: true,
            nominationCardId: row.id
        });

        let handleError = () => {
            this.setState({
                nominationLoading: false,
                nominationSelectorVisible: false,
                errorVisible: true,
                errorMessage: Form.unknownError
            });
        }

        http.fetch<Card>("/api/cards/" + row.id)
            .then(res => {
                if (res.status == "ok")
                    this.setState({
                        nominationLoading: false,
                        nominationCategory: res.data.nominationCategory
                    });
                else
                    handleError();
            })
            .catch(() => handleError());
    }

    private setReportData = (res: FormResponse<NominationReport>) => {
        if (res.status == "ok") {
            if (res.data.from && res.data.to) {
                this.setState({
                    reportId: res.data.reportId,
                    rows: res.data.rows,
                    from: this.convertDate(res.data.from),
                    to: this.convertDate(res.data.to),
                    stage: res.data.stage,
                    selectedStage: 0
                });
            }
            else {

            }
        }
    }

    private changePage(page: number) {
        this.setState({
            page,
            updateTable: true
        })
    }

    private getReport() {
        this.setState({
            updateTable: true,
            query: this.state.query
        })
    }

    private onFieldValueChanged(field: string, values: Array<string>) {
        this.state.query.set(field, values);
    }

    private convertDate(date: string) {
        let parts = date.split("T")[0].split("-");
        return parts[1] + "/" + parts[2] + "/" + parts[0];
    }

    private getStages(): Array<SelectOption> {
        return [
            { value: "1", text: "Stage 1" },
            { value: "2", text: "Stage 2" },
            { value: "3", text: "Stage 3" },
            { value: "4", text: "Stage 4", disabled: this.state.stage == 1 || this.state.stage == 2 },
            { value: "5", text: "Closed", disabled: this.state.stage == 1 || this.state.stage == 2 || this.state.stage == 3 }
        ];
    }

    private getClass(): string {
        if (this.state.stage == 1 || this.state.stage == 2)
            return "nomination12";
        else if (this.state.stage == 3)
            return "nomination3";

        return "nomination";
    }

    private getColumns(): Array<TableColumn<NominationReportItem>> {
        let getColumn = (label: string, internalName: string = null, sortable: boolean = false, filterable: boolean = false, searchable: boolean = false, map: (e: NominationReportItem) => JSX.Element | Array<JSX.Element> = null) => {
            if (!internalName)
                internalName = label;

            let column = {
                label,
                internalName,
                sortable,
                filterable,
                searchable,
                map
            } as TableColumn<NominationReportItem>;

            if (this.state.stage == 1 || this.state.stage == 2)
                column.onClick = row => row.selected = !row.selected;

            if (internalName == "nominationCategory") {
                if (this.state.stage == 3 && this.isVotingUser)
                    column.getAdditionalCellClass = row => row.stage3VoteMade ? "nomination-category-cell-voted" : "nomination-category-cell";
                else if (this.state.stage == 4 || this.state.stage == 5)
                    column.getAdditionalCellClass = row => row.isWinner ? "nomination-category-cell-winner" : "nomination-category-cell";
                else
                    column.getAdditionalCellClass = () => "nomination-category-cell";

                if (this.state.stage == 1 || this.state.stage == 2)
                    column.onDoubleClick = row => this.showNominationSelector(row);
                else if (this.state.stage == 3 && this.isVotingUser)
                    column.onDoubleClick = row => row.stage3VoteMade ? this.unsetVote(row) : this.setVote(row);
                else if (this.state.stage == 4 && this.isSSHEUser)
                    column.onDoubleClick = row => row.isWinner ? this.unsetWinner(row) : this.setWinner(row);
                else
                    column.onDoubleClick = row => this.showDetails(row);
            }
            else {
                column.getAdditionalCellClass = row => row.selected ? "nomination-cell-selected" : "";
                column.onDoubleClick = row => this.showDetails(row);
            }

            return column;
        }

        let columns = [
            getColumn("Description", "description", false, false, true),
            getColumn("Actions Taken", "actionsTaken", false, false, true),
            getColumn("Suggested Actions", "furtherActions", false, false, true),
            getColumn("Description (rus)", "descriptionRus", false, false, true),
            getColumn("Actions Taken (rus)", "actionsTakenRus", false, false, true),
            getColumn("Suggested Actions (rus)", "furtherActionsRus", false, false, true),
            getColumn("Nomination's Category", "nominationCategory", true, true, true)
        ];

        if (this.state.stage == 1 || this.state.stage == 2) {
            let column = getColumn("", "id");
            column.map = row => <input type="checkbox" checked={!!row.selected} />;

            columns.unshift(column);
        }
        else if ((this.state.stage == 3 && this.isSSHEUser) || this.state.stage == 4) {
            let column = getColumn("Votes S2", "votesNumberStage3", true, true, true);
            column.getAdditionalCellClass = row => (this.state.stage == 4 && row.isWinner) ? "nomination-category-cell-winner" : "nomination-category-cell";

            columns.push(column);
        }

        return columns;
    }

    private handleError(error: string = null) {
        this.setState({
            errorVisible: true,
            errorMessage: error ? error : Form.unknownError
        });
    }
}
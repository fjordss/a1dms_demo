import React from 'react'
import { app } from './ManagementApp';
import Switch from 'react-switch'
import CardDetails, { Card, Language } from './CardDetails';
import { DateRangePicker, Form, FormResponse, http, Modal, ModalError, Select, Table, TableColumn, TableContainer, TableContainerProps, TableContainerState, TableContextMenuItem, TableDefaultHeader, TableInfo, TablePaginator, TableRow, TableSearch, utility } from 'a1dms-front';
import { HttpMethod } from 'a1dms-front';

export interface CardRow extends TableRow {
    date: string;
    employee: string;
    nghNumber: string;
    site: string;
    company: string;
    department: string;
    reportType: string;
    description: string;
    actionsTaken: string;
    furtherActions: string;
    lifeSavingActions: string;
    hazardID: Array<string>;
    safeChoice: Array<string>;
    location: string;
    nominationCategory: string;
    nominatedBy: string;
}

export interface CardsState extends TableContainerState {
    showDatePicker: boolean;
    dateFrom: string;
    dateTo: string;
    lang: Language;

    detailsVisible: boolean;
    detailsLoading: boolean;
    details: Card;

    nominationSelectorVisible: boolean;
    nominationSelectorValue: string;
    nominationCardId: number;
    nominationCategory: string;
    nominationLoading: boolean;

    errorVisible: boolean;
    errorMessage: string;
}

export default class Cards extends TableContainer<TableContainerProps, CardsState> {
    public constructor(props) {
        super(props);

        let state = this.state as CardsState;

        state.showDatePicker = false;
        state.dateFrom = DateRangePicker.getRange("cm")[0];
        state.pageTitle = "NGH Cards";
        state.detailsVisible = false;
        state.detailsLoading = false;
        state.nominationSelectorVisible = false;
        state.nominationLoading = false;
        state.errorVisible = false;

        this.onFieldValueChanged("from", [this.state.dateFrom]);
    }

    public render() {
        return (
            <div>
                <Modal header="Select range" height={270} visible={this.state.showDatePicker} onClose={() => this.setState({ showDatePicker: false })}>
                    <DateRangePicker onChange={(from, to) => this.dateRangeSelected(from, to)} />
                </Modal>

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
                    <Select options={app.nominationCategories} onChange={values => this.categorySelected(values[0])} dropdownWidth="500px" values={this.state.nominationCategory ? [this.state.nominationCategory] : null} />
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
                        <TableSearch<Cards> parent={this} />
                    </div>
                </div>

                <div className={"pagination-area" + (this.state.totalRows == 0 ? " hidden" : "")}>
                    <div className="pagination-info"><TableInfo rowsPerPage={this.state.rowsPerPage} page={this.state.page} totalRows={this.state.totalRows} /></div>
                    <div><TablePaginator rowsPerPage={this.state.rowsPerPage} totalRows={this.state.totalRows} page={this.state.page} onChange={page => this.changePage(page)} /></div>
                </div>

                <Table<Cards, CardRow> parent={this} className="cards" apiUrl="/api/cards" columns={this.getColumns()} getContextMenu={this.getContextMenu}>
                    <div className="cards-top-cell">
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

    private categorySelected(category: string) {
        this.setState({ nominationLoading: true });

        let handleError = (error: string = null) => {
            this.setState({
                nominationLoading: false,
                nominationSelectorVisible: false,
                errorVisible: true,
                errorMessage: error ? error : Form.unknownError
            })
        }

        let body = new Map<string, string>();
        body.set("cardId", this.state.nominationCardId.toString())
        body.set("category", category);

        http.fetch<FormResponse>("/api/nominations", HttpMethod.post, body)
            .then(res => {
                if (res.status == "ok") {
                    this.setState({
                        nominationLoading: false,
                        nominationSelectorVisible: false,
                        updateTable: true
                    });
                }
                else
                    handleError(res.errors[0].text);
            })
            .catch(() => handleError())
    }

    private showDetails(row: CardRow) {
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

    private showNominationSelector(row: CardRow) {
        this.setState({
            nominationSelectorVisible: true,
            nominationLoading: true,
            nominationCardId: row.id,
            nominationCategory: row.nominationCategory
        });
        
        let handleError = (error: string = null) => {
            this.setState({
                nominationLoading: false,
                nominationSelectorVisible: false,
                errorVisible: true,
                errorMessage: error ? error : Form.unknownError
            });
        }

        fetch("/api/nominations/allowed/" + row.id)
            .then(res => res.ok ? res.json() : new Error())
            .then((res: FormResponse<boolean>) => {
                if (res.status == "ok")
                    this.setState({ nominationLoading: false });
                else
                    handleError(res.errors[0].text);
            })
            .catch(() => handleError());
    }

    private getContextMenu = (row: CardRow): Array<TableContextMenuItem> => {
        return [
            {
                label: "Nominate",
                icon: <i className="fas fa-vote-yea"></i>,
                action: () => this.showNominationSelector(row)
            },
            {
                label: "Details",
                icon: <i className="fas fa-info-circle"></i>,
                action: () => this.showDetails(row)
            },
            {
                label: "Edit",
                icon: <i className="fas fa-edit"></i>,
                action: () => location.href = "/index?id=" + row.id
            }
        ];
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
        })
    }

    private getReport() {
        this.setState({
            updateTable: true,
            query: this.state.query
        })
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

    private getColumns(): Array<TableColumn<CardRow>> {
        let getColumn = (label: string, internalName: string = null, sortable: boolean = false, filterable: boolean = false, searchable: boolean = false, map: (e: CardRow) => JSX.Element | Array<JSX.Element> = null) => {
            if (!internalName)
                internalName = label;

            return {
                label,
                internalName,
                sortable,
                filterable,
                searchable,
                map,
                onDoubleClick: row => this.showDetails(row)
            } as TableColumn<CardRow>
        }

        let convertStringList = (items: Array<string>): Array<JSX.Element> => {
            let list: Array<JSX.Element> = [];
            for (let i = 0; i < items.length; i++) {
                list.push(<>{items[i]};</>);

                if (i != items.length - 1)
                    list.push(<br />);
            }

            return list;
        };

        let getStringByLang = (text: string, lang: Language) => <>{text ? text.split("{-DELIM-}")[lang == Language.rus ? 1 : 0] : ""}</>;

        let getAdditionalCellClass = (row: CardRow) => row.nominationCategory || row.nominatedBy ? "tv-cell-nominated-card" : ""

        let nomination = getColumn("Nomination", "nominationCategory", true, true, true);
        nomination.getAdditionalCellClass = getAdditionalCellClass;
        nomination.onDoubleClick = row => this.showNominationSelector(row);

        let nominatedBy = getColumn("Nominated by", "nominatedBy", true, true, true);
        nominatedBy.getAdditionalCellClass = getAdditionalCellClass;
        nominatedBy.onDoubleClick = row => this.showNominationSelector(row);

        return [
            getColumn("Card #", "id", true, false, true),
            getColumn("Date", "date", true, true, false, row => <span>{utility.convertDate(row.date, true)}</span>),
            getColumn("Site", "site", true, true, true),
            getColumn("Company", "company", true, true, true),
            getColumn("Department", "department", true, true, true),
            getColumn("Name", "employee", true, false, true),
            getColumn("Report Type", "reportType", true, true, true),
            getColumn("Life Saving Actions", "lifeSavingActions", true, true, true),
            getColumn("Categories", "hazardID", false, true, true, row => convertStringList(row.hazardID)),
            getColumn("Safe Choice Categories", "safeChoice", false, true, true, row => convertStringList(row.safeChoice)),
            getColumn("Description", "description", false, false, true, row => getStringByLang(row.description, this.state.lang)),
            getColumn("Actions Taken", "actionsTaken", false, false, true, row => getStringByLang(row.actionsTaken, this.state.lang)),
            getColumn("Location", "location", false, false, true, row => getStringByLang(row.location, this.state.lang)),
            getColumn("Suggested Actions", "furtherActions", false, false, true, row => getStringByLang(row.furtherActions, this.state.lang)),
            nomination,
            nominatedBy
        ];
    }
}
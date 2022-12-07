import { DateRangePicker, Modal, Select, Table, TableColumn, TableContainer, TableContainerProps, TableContainerState, TableDefaultHeader, TableInfo, TablePaginator, TableRow, TableSearch } from 'a1dms-front';
import React from 'react'
import { app } from '../ManagementApp';

export interface ObserverReportItem extends TableRow {
    name: string;
    company: string;
    department: string;
    site: string;
    totalCards: number;
    hid: number;
    safeBehavior: number;
    unsafeBehavior: number;
    offTheSite: number;
    security: number;
    environmental: number;
    jan: number;
    feb: number;
    mar: number;
    apr: number;
    may: number;
    jun: number;
    jul: number;
    aug: number;
    sep: number;
    oct: number;
    nov: number;
    dec: number;
}

export interface ObserverState extends TableContainerState {
    showDatePicker: boolean;
    dateFrom: string;
    dateTo: string;
}

export default class Observer extends TableContainer<TableContainerProps, ObserverState> {
    public constructor(props) {
        super(props);

        let state = this.state as any;

        state.showDatePicker = false;
        state.dateFrom = DateRangePicker.getRange("cm")[0];
        state.pageTitle = "User report (by Observer)";

        this.onFieldValueChanged("from", [this.state.dateFrom]);
    }

    public render() {
        return (
            <div>
                <Modal height={270} header="Select range" visible={this.state.showDatePicker} onClose={() => this.setState({ showDatePicker: false })}>
                    <DateRangePicker onChange={(from, to) => this.dateRangeSelected(from, to)} />
                </Modal>

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
                        <TableSearch<Observer> parent={this} />
                    </div>
                </div>

                <div className={"pagination-area" + (this.state.totalRows == 0 ? " hidden" : "")}>
                    <div className="pagination-info"><TableInfo rowsPerPage={this.state.rowsPerPage} page={this.state.page} totalRows={this.state.totalRows} /></div>
                    <div><TablePaginator rowsPerPage={this.state.rowsPerPage} totalRows={this.state.totalRows} page={this.state.page} onChange={page => this.changePage(page)} /></div>
                </div>

                <Table<Observer, ObserverReportItem>
                    parent={this}
                    className="observer"
                    apiUrl="/api/reporting/observer"
                    columns={this.getColumns()}
                >
                    <div className="observer-top-cell-left">By Observer</div>
                    <div className="observer-top-cell-right">Cards Submitted by Month</div>
                    <TableDefaultHeader />
                </Table>

                <div className={"pagination-area" + (this.state.totalRows == 0 ? " hidden" : "")}>
                    <div className="pagination-info"><TableInfo rowsPerPage={this.state.rowsPerPage} page={this.state.page} totalRows={this.state.totalRows} /></div>
                    <div><TablePaginator rowsPerPage={this.state.rowsPerPage} totalRows={this.state.totalRows} page={this.state.page} onChange={page => this.changePage(page)} /></div>
                </div>
            </div>
        );
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

    private getColumns(): Array<TableColumn<ObserverReportItem>> {
        let months: Array<string> = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

        let getColumn = (label: string,
                         internalName: string = null,
                         sortable: boolean = false,
                         filterable: boolean = false,
                         searchable: boolean = false,
                         hasTotal: boolean = false,
                         map: (e: ObserverReportItem) => JSX.Element | Array<JSX.Element> = null
        ) => {
            if (!internalName)
                internalName = label;

            let column = {
                label,
                internalName,
                sortable,
                filterable,
                searchable,
                hasTotal,
                map
            } as TableColumn<ObserverReportItem>;

            let light = ["offTheSite", "security", "environmental"];

            column.headerCellClass = light.indexOf(internalName) != -1 ? "observer-header-cell2" : (months.indexOf(label) != -1 ? "observer-header-cell3" : "observer-header-cell1");

            return column;
        }

        let columns = [
            getColumn("Name", "name", true, true, true),
            getColumn("Company", "company", true, true, true),
            getColumn("Department", "department", true, true, true),
            getColumn("Site", "site", true, true, true),
            getColumn("Total Cards", "totalCards", true, true, true, true),
            getColumn("HID", "hid", true, true, true, true),
            getColumn("Safe Behavior", "safeBehavior", true, true, true, true),
            getColumn("Unsafe Behavior", "unsafeBehavior", true, true, true, true),
            getColumn("Off-the-Site", "offTheSite", true, true, true, true),
            getColumn("Security", "security", true, true, true, true),
            getColumn("Environmental", "environmental", true, true, true, true)
        ];

        months.forEach(m => columns.push(getColumn(m, m.toLowerCase(), true, true, true, true)));

        return columns;
    }
}
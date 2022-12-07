import { DateRangePicker, Modal, Select, Table, TableColumn, TableContainer, TableContainerProps, TableContainerState, TableDefaultHeader, TableHeaderCell, TableInfo, TablePaginator, TableRow, TableSearch } from 'a1dms-front';
import React from 'react';
import { app } from '../ManagementApp';


export interface OIMSReportItem extends TableRow {
    site: string;
    totalCards: number;
    hid: number;
    safeBehavior: number;
    unsafeBehavior: number;
    offTheSite: number;
    security: number;
    environmental: number;
    safeUnsafeTotal: number;
    hidPercent: number;
    safeBehaviorPercent: number;
    unsafeBehaviorPercent: number;
    safeUnsafeTotalPercent: number;
    openActionItems: number;
    expiredActionItems: number;
    actionItemsWithoutDates: number;
}

export interface OIMSState extends TableContainerState {
    showDatePicker: boolean;
    dateFrom: string;
    dateTo: string;
}

export default class OIMS extends TableContainer<TableContainerProps, OIMSState> {
    public constructor(props) {
        super(props);

        let state = this.state as any;

        state.showDatePicker = false;
        state.dateFrom = DateRangePicker.getRange("cm")[0];
        state.pageTitle = "OIMS System 5-4 KPIs Data";

        this.onFieldValueChanged("from", [this.state.dateFrom]);
    }

    public render() {
        let columns = this.getColumns();

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
                        <TableSearch<OIMS> parent={this} />
                    </div>
                </div>

                <div className={"pagination-area" + (this.state.totalRows == 0 ? " hidden" : "")}>
                    <div className="pagination-info"><TableInfo rowsPerPage={this.state.rowsPerPage} page={this.state.page} totalRows={this.state.totalRows} /></div>
                    <div><TablePaginator rowsPerPage={this.state.rowsPerPage} totalRows={this.state.totalRows} page={this.state.page} onChange={page => this.changePage(page)} /></div>
                </div>

                <Table<OIMS, OIMSReportItem>
                    parent={this}
                    className="oims"
                    apiUrl="/api/reporting/oims"
                    columns={columns}
                >
                    <TableDefaultHeader>
                        <div className="oims-top-cell">Participation by Site</div>

                        <TableHeaderCell column={columns.find(c => c.internalName == "site")} additionalClass="oims-rowspan2" />
                        <TableHeaderCell column={columns.find(c => c.internalName == "totalCards")} additionalClass="oims-rowspan2" />
                        <TableHeaderCell column={columns.find(c => c.internalName == "hid")} additionalClass="oims-rowspan2" />

                        <div className="oims-colspan3">BBO</div>

                        <TableHeaderCell column={columns.find(c => c.internalName == "hidPercent")} additionalClass="oims-rowspan2" />

                        <div className="oims-colspan3">BBO%</div>

                        <TableHeaderCell column={columns.find(c => c.internalName == "openActionItems")} additionalClass="oims-rowspan2" />
                        <TableHeaderCell column={columns.find(c => c.internalName == "expiredActionItems")} additionalClass="oims-rowspan2" />
                        <TableHeaderCell column={columns.find(c => c.internalName == "actionItemsWithoutDates")} additionalClass="oims-rowspan2" />

                        <TableHeaderCell column={columns.find(c => c.internalName == "safeBehavior")} />
                        <TableHeaderCell column={columns.find(c => c.internalName == "unsafeBehavior")} />
                        <TableHeaderCell column={columns.find(c => c.internalName == "safeUnsafeTotal")} />

                        <TableHeaderCell column={columns.find(c => c.internalName == "safeBehaviorPercent")} />
                        <TableHeaderCell column={columns.find(c => c.internalName == "unsafeBehaviorPercent")} />
                        <TableHeaderCell column={columns.find(c => c.internalName == "safeUnsafeTotalPercent")} />
                    </TableDefaultHeader>
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
            this.setState({ dateFrom: value });
        else if (field == "to")
            this.setState({ dateTo: value });

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

    private getColumns(): Array<TableColumn<OIMSReportItem>> {
        let getColumn = (label: string, internalName: string) => {
            return {
                label,
                internalName,
                sortable: true,
                filterable: true,
                searchable: true,
                hasTotal: internalName != "site",
            } as TableColumn<OIMSReportItem>;
        };

        let columns = [
            getColumn("Site", "site"),
            getColumn("Total Number of Reports", "totalCards"),
            getColumn("HID", "hid"),
            getColumn("Safe Behavior", "safeBehavior"),
            getColumn("Unsafe Behavior", "unsafeBehavior"),
            getColumn("Total", "safeUnsafeTotal"),
            getColumn("HID%", "hidPercent"),
            getColumn("Safe", "safeBehaviorPercent"),
            getColumn("Unsafe", "unsafeBehaviorPercent"),
            getColumn("Total", "safeUnsafeTotalPercent"),
            getColumn("Open + In Progress Action Items", "openActionItems"),
            getColumn("Open + In Progress Action Items With Expired Target Date", "expiredActionItems"),
            getColumn("Open + In Progress Action Items Without Assigned Target Date", "actionItemsWithoutDates")
        ];

        return columns;
    }
}

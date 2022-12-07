import { DateRangePicker, Modal, Select, Table, TableColumn, TableContainer, TableContainerProps, TableContainerState, TableDefaultHeader, TableRow, TableSearch } from 'a1dms-front';
import React from 'react'
import Switch from 'react-switch'
import { Language } from '../CardDetails';
import { app } from '../ManagementApp';

export interface CordItem extends TableRow {
    cord: string;
    totalCards: string;
    hid: string;
    safeBehavoir: string;
    unsafeBehavoir: string;
    offTheSite: string;
    security: string;
    environmental: string;
}

export interface CordState extends TableContainerState {
    showDatePicker: boolean;
    dateFrom: string;
    dateTo: string;
    lang: Language;
}

export default class Cord extends TableContainer<TableContainerProps, CordState> {
    public constructor(props) {
        super(props);

        let state = this.state as any;

        state.showDatePicker = false;
        state.dateFrom = DateRangePicker.getRange("cm")[0];
        state.pageTitle = "User report (company or department participation)";

        this.onFieldValueChanged("from", [this.state.dateFrom]);
    }

    public render() {
        return (
            <div className="cord-container">
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
                        <TableSearch<Cord> parent={this} />
                    </div>
                </div>

                <br /><br />

                <Table<Cord, CordItem> parent={this} className="cordcompany" apiUrl="/api/reporting/cord/byCompany" columns={this.getColumns("byCompany")}>
                    <div className="cord-top-cell-company">Participation by Company</div>
                    <TableDefaultHeader />
                </Table>

                <br /><br />

                <Table<Cord, CordItem> parent={this} className="corddept" apiUrl="/api/reporting/cord/byDepartment" columns={this.getColumns("byDepartment")}>
                    <div className="cord-top-cell-dept">Participation by Department</div>
                    <TableDefaultHeader />
                </Table>

                <br /><br />

                <Table<Cord, CordItem> parent={this} className="cordenldept" apiUrl="/api/reporting/cord/byENLDepartment" columns={this.getColumns("byENLDepartment")}>
                    <div className="cord-top-cell-enldept">Participation by ENL Department</div>
                    <TableDefaultHeader />
                </Table>
            </div>
        );
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

    private getColumns(type: string): Array<TableColumn<CordItem>> {
        let getColumn = (label: string, internalName: string = null, sortable: boolean = false, filterable: boolean = false, searchable: boolean = false, map: (e: CordItem) => JSX.Element | Array<JSX.Element> = null) => {
            if (!internalName)
                internalName = label;

            let column = {
                label,
                internalName,
                sortable,
                filterable,
                searchable,
                map
            } as TableColumn<CordItem>;

            column.headerCellClass = type == "byCompany" ? "cord-header-cell-company" : (type == "byDepartment" ? "cord-header-cell-dept" : "cord-header-cell-enldept");

            if (internalName == "offTheSite" || internalName == "security" || internalName == "environmental")
                column.headerCellClass += "-light";

            if (internalName != "cord")
                column.hasTotal = true;

            return column;
        }

        let getCordFieldName = (type: string) => type == "byCompany" ? "Company" : (type == "byDepartment" ? "Department" : "ENL Department");

        return [
            getColumn(getCordFieldName(type), "cord", true, true, true),
            getColumn("Total Cards Submitted for the Period", "totalCards", true, true, true),
            getColumn("HID", "hid", true, true, true),
            getColumn("Safe Behavior", "safeBehavior", true, true, true),
            getColumn("Unsafe Behavior", "unsafeBehavior", true, true, true),
            getColumn("Off-The-Site", "offTheSite", true, true, true),
            getColumn("Security", "security", true, true, true),
            getColumn("Environmental", "environmental", true, true, true),
        ];
    }
}
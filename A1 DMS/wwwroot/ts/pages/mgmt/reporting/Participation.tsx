import { Select, SelectOption, Table, TableColumn, TableContainer, TableContainerProps, TableContainerState, TableDefaultHeader, TableInfo, TablePaginator, TableRow, TableSearch } from 'a1dms-front';
import React from 'react'
import { app } from '../ManagementApp';

export interface ParticipationReportItem extends TableRow {
    code: string;
    name: string;
    site: string;
    company: string;
    department: string;
    totalCards: number;
    d1: number;
    d2: number;
    d3: number;
    d4: number;
    d5: number;
    d6: number;
    d7: number;
    d8: number;
    d9: number;
    d10: number;
    d12: number;
    d13: number;
    d14: number;
    d15: number;
    d16: number;
    d17: number;
    d18: number;
    d19: number;
    d20: number;
    d21: number;
    d22: number;
    d23: number;
    d24: number;
    d25: number;
    d26: number;
    d27: number;
    d28: number;
    d29: number;
    d30: number;
    d31: number;
}

export interface ParticipationState extends TableContainerState {
    month: number;
    year: number;
}

export default class Participation extends TableContainer<TableContainerProps, ParticipationState> {
    private columns: Array<TableColumn<ParticipationReportItem>>;
    private daysInMonth: number;

    public constructor(props) {
        super(props);

        let state = this.state as any;
        state.pageTitle = "Participation report";
        state.month = new Date().getMonth() + 1
        state.year = new Date().getFullYear();

        this.onFieldValueChanged("month", [this.state.month.toString()]);
        this.onFieldValueChanged("year", [this.state.year.toString()]);
    }

    public render() {
        return (
            <div>
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
                    <div className="report-search-left">
                        <Select options={this.getMonths()} width={200} values={[this.state.month.toString()]} onChange={(values) => {
                            this.setState({ month: parseInt(values[0]) });
                            this.onFieldValueChanged("month", values);
                        }} />
                    </div>
                    <div className="report-search-left">
                        <input type="number" value={this.state.year} onChange={this.onYearChanged} />
                    </div>
                    <div className="report-search-left"><button onClick={() => this.getReport()}>Get Report</button></div>
                    <div className="report-search-space"></div>
                    <div className="report-search-right">
                        <TableSearch<Participation> parent={this} />
                    </div>
                </div>

                <div className={"pagination-area" + (this.state.totalRows == 0 ? " hidden" : "")}>
                    <div className="pagination-info"><TableInfo rowsPerPage={this.state.rowsPerPage} page={this.state.page} totalRows={this.state.totalRows} /></div>
                    <div><TablePaginator rowsPerPage={this.state.rowsPerPage} totalRows={this.state.totalRows} page={this.state.page} onChange={page => this.changePage(page)} /></div>
                </div>

                {this.columns ?
                    <Table<Participation, ParticipationReportItem>
                        parent={this}
                        className="participation"
                        apiUrl="/api/reporting/participation"
                        columns={this.columns}
                    >
                        <div className="participation-top-cell-left">By observer</div>
                        {this.daysInMonth > 0 ?
                            <div className="participation-top-cell-right" style={{ gridColumn: "span " + this.daysInMonth }}>{this.getMonths().find(m => m.value == this.state.month.toString()).text}</div> :
                            <></>}
                        <TableDefaultHeader />
                    </Table> :
                    <></>}

                <div className={"pagination-area" + (this.state.totalRows == 0 ? " hidden" : "")}>
                    <div className="pagination-info"><TableInfo rowsPerPage={this.state.rowsPerPage} page={this.state.page} totalRows={this.state.totalRows} /></div>
                    <div><TablePaginator rowsPerPage={this.state.rowsPerPage} totalRows={this.state.totalRows} page={this.state.page} onChange={page => this.changePage(page)} /></div>
                </div>
            </div>
        );
    }

    public componentDidMount() {
        this.getReport();
    }

    private getMonths(): Array<SelectOption> {
        return [
            { value: "1", text: "January" },
            { value: "2", text: "February" },
            { value: "3", text: "March" },
            { value: "4", text: "April" },
            { value: "5", text: "May" },
            { value: "6", text: "June" },
            { value: "7", text: "July" },
            { value: "8", text: "August" },
            { value: "9", text: "September" },
            { value: "10", text: "October" },
            { value: "11", text: "November" },
            { value: "12", text: "December" }
        ];
    }

    private changePage(page: number) {
        this.setState({
            page,
            updateTable: true
        })
    }

    private getReport() {
        this.columns = this.getColumns();

        this.setState({
            updateTable: true,
            query: this.state.query
        })
    }

    private onYearChanged = (e: React.ChangeEvent<HTMLInputElement>) => {
        let value = e.currentTarget.value;

        this.setState({ year: parseInt(e.currentTarget.value) })

        this.onFieldValueChanged("year", [value]);
    }

    private onFieldValueChanged(field: string, values: Array<string>) {
        this.state.query.set(field, values);
    }

    private getColumns(): Array<TableColumn<ParticipationReportItem>> {
        let getColumn = (label: string, internalName: string, headerCellClass: string = null, getAdditionalCellClass: (row: ParticipationReportItem, column: string) => string = null) => {
            return {
                label,
                internalName,
                sortable: true,
                filterable: ["code", "name"].indexOf(internalName) == -1,
                searchable: true,
                hasTotal: ["code", "name", "company", "department", "site"].indexOf(internalName) == -1,
                headerCellClass,
                getAdditionalCellClass
            } as TableColumn<ParticipationReportItem>;
        }

        let columns = [
            getColumn("NGH #", "code"),
            getColumn("Name", "name"),
            getColumn("Company", "company"),
            getColumn("Department", "department"),
            getColumn("Site", "site"),
            getColumn("Total Cards", "totalCards"),
        ];

        let currentDate = new Date();
        let currentMonth = currentDate.getMonth() + 1;
        let currentYear = currentDate.getFullYear();

        this.daysInMonth = currentMonth == this.state.month && currentYear == this.state.year ? currentDate.getDate() : new Date(this.state.year, this.state.month, 0).getDate();
        if (this.state.year > currentYear || (this.state.year == currentYear && this.state.month > currentMonth))
            this.daysInMonth = 0;

        for (let i = 1; i <= this.daysInMonth; i++)
            columns.push(getColumn((i <= 9 ? "0" : "") + i, "d" + i, "participation-header-cell-date", (row, column) => {
                let count = parseInt(row[column]);
                return count > 0 ? (count == 1 ? "participation-cell-one" : "participation-cell-many") : "participation-cell-any";
            }));

        return columns;
    }
}
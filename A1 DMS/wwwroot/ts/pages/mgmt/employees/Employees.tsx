import { Form, FormResponse, Modal, ModalError, Table, TableColumn, TableContainer, TableContainerProps, TableContainerState, TableContextMenuItem, TableInfo, TablePaginator, TableRow, TableSearch, utility } from 'a1dms-front';
import React from 'react'
import { Link } from 'react-router-dom'
import { app } from '../ManagementApp';
import { UserService } from '../users/Users';

export interface Employee {
    id: number;
    code: string;
    date: string;
    firstName: string;
    lastName: string;
    name: string;
    siteId: number;
    company: string;
    department: string;
    ptsNumber: string;
    additionalInfo: string;
    inactive: boolean;
}

export interface EmployeeReportItem extends TableRow {
    id: number;
    code: string,
    date: string,
    firstName: string,
    lastName: string,
    company: string,
    department: string,
    site: string,
    ptsNumber: string,
    additionalInfo: string,
    inactive: boolean
}

export interface EmployeesState extends TableContainerState {
    loading: boolean;
    errors: Array<string>;
}

export default class Employees extends TableContainer<TableContainerProps, EmployeesState> {
    public constructor(props) {
        super(props);

        let state = this.state as any;
        state.pageTitle = "Employees (NGH)";
        state.loading = false;
        state.errors = [];
    }

    public render() {
        let isSiteAdministrator = UserService.correspondsPolicy("siteAdministrator");

        let hasContextMenu = UserService.correspondsPolicy("administrator") || isSiteAdministrator;

        return (
            <>
                <Modal loading={true} visible={this.state.loading} />
                <ModalError visible={this.state.errors.length > 0} errors={this.state.errors} backUrl="/v2/mgmt/employees" backLabel="Back to Employees" />

                <div className="employees-container">
                    <div className="report-search-area">
                        <div className="report-search-left">{isSiteAdministrator ? <Link to="/v2/mgmt/employees/new">Create New</Link> : <></>}</div>
                        <div className="report-search-space"></div>
                        <div className="report-search-right"><TableSearch<Employees> parent={this} /></div>
                        <div className="report-search-right">
                            <button className="tv-button" onClick={() => location.href = "/api/employees/export"}>
                                <i className="fa fa-table" aria-hidden="true"></i>
                            </button>
                        </div>
                    </div>

                    <div className={"pagination-area" + (this.state.totalRows == 0 ? " hidden" : "")}>
                        <div className="pagination-info"><TableInfo rowsPerPage={this.state.rowsPerPage} page={this.state.page} totalRows={this.state.totalRows} /></div>
                        <div><TablePaginator rowsPerPage={this.state.rowsPerPage} totalRows={this.state.totalRows} page={this.state.page} onChange={page => this.changePage(page)} /></div>
                    </div>

                    <Table<Employees, EmployeeReportItem> parent={this} apiUrl="/api/employees" columns={this.getColumns()} className="employees" getContextMenu={hasContextMenu ? this.getContextMenu : null} />

                    <div className={"pagination-area" + (this.state.totalRows == 0 ? " hidden" : "")}>
                        <div className="pagination-info"><TableInfo rowsPerPage={this.state.rowsPerPage} page={this.state.page} totalRows={this.state.totalRows} /></div>
                        <div><TablePaginator rowsPerPage={this.state.rowsPerPage} totalRows={this.state.totalRows} page={this.state.page} onChange={page => this.changePage(page)} /></div>
                    </div>
                </div>
            </>
        );
    }

    private changePage(page: number) {
        this.setState({
            page,
            updateTable: true
        })
    }

    private delete(row: EmployeeReportItem) {
        if (confirm("Do you want to delete this employee?")) {
            this.setState({ loading: true });

            Form.sendRequest<Employee>("DELETE", "/api/employees/" + row.id).then(
                res => this.onDeleted(res),
                () => this.setState({
                    errors: [Form.unknownError],
                    loading: false
                })
            );
        }
    }

    private onDeleted(res: FormResponse<Employee>) {
        if (res.status == "ok")
            app.notification.show(<div>Employee{res.data.name ? " " + res.data.name + "," : ""} NGH # {res.data.code} successfully deleted</div>);

        this.setState({
            updateTable: true,
            errors: res.status == "error" ? res.errors.map(error => error.text) : [],
            loading: false
        })
    }

    private getContextMenu = (row: EmployeeReportItem): Array<TableContextMenuItem> => {
        let items: Array<TableContextMenuItem> = [];

        if (UserService.correspondsPolicy("siteAdministrator")) {
            items.push({
                label: "Edit",
                icon: <i className="fas fa-info-circle"></i>,
                route: "/v2/mgmt/employees/edit/" + row.id
            });
        }

        if (UserService.correspondsPolicy("administrator")) {
            items.push({
                label: "Edit",
                icon: <i className="fas fa-info-circle"></i>,
                route: "/v2/mgmt/employees/edit/" + row.id
            });
        }

        return items;
    }

    private getColumns(): Array<TableColumn<EmployeeReportItem>> {
        let getColumn = (label: string, internalName: string = null, sortable: boolean = false, filterable: boolean = false, searchable: boolean = false, map: (e: EmployeeReportItem) => JSX.Element = null) => {
            if (!internalName)
                internalName = label;

            return {
                label,
                internalName,
                sortable,
                filterable,
                searchable,
                map
            } as TableColumn<EmployeeReportItem>
        }

        let isAdministrator = UserService.correspondsPolicy("administrator");
        let isSiteAdministrator = UserService.correspondsPolicy("siteAdministrator");

        let convertInactive = (row: EmployeeReportItem): JSX.Element => <input type="checkbox" disabled={true} checked={row.inactive} />;
        let convertId = (row: EmployeeReportItem): JSX.Element => {
            let links: Array<JSX.Element> = [];
            if (isSiteAdministrator)
                links.push(<Link to={"/v2/mgmt/employees/edit/" + row.id}>edit</Link>);

            if (isAdministrator) {
                if (links.length > 0)
                    links.push(<span> | </span>)

                links.push(<span className="a" onClick={() => this.delete(row)}>delete</span>);
            }
            return <>{links}</>;
        };

        let columns = [
            getColumn("NGH #", "code", true, false, true),
            getColumn("First Name", "firstName", true, false, true),
            getColumn("Last Name", "lastName", true, false, true),
            getColumn("Site", "site", true, true, true),
            getColumn("Company", "company", true, true, true),
            getColumn("Department", "department", true, true, true),
            getColumn("PTS #", "ptsNumber", false, false, true),
            getColumn("Additional Information", "additionalInfo", false, false, true),
            getColumn("Created", "date", true, true, false, row => <span>{utility.convertDate(row.date)}</span>),
            getColumn("Inactive", "inactive", false, true, false, convertInactive)
        ];

        if (isAdministrator || isSiteAdministrator)
            columns.push(getColumn("", "id", false, false, false, convertId));

        return columns;
    }
}
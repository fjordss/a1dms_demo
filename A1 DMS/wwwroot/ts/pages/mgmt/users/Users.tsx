import React from 'react'
import { Link } from 'react-router-dom'
import { Access, Form, FormResponse, IUser, Modal, ModalError, Table, TableColumn, TableContainer, TableContainerProps, TableContainerState, TableContextMenuItem, TableInfo, TablePaginator, TableRow, TableSearch } from 'a1dms-front';
import { app } from '../ManagementApp';

export enum UserRole {
    administrator = 1,
    siteAdministrator = 2,
    supervisor = 4,
    SSHEUser = 8,
    votingUser = 16
}

export class UserService {
    public static hasRole(role: UserRole): boolean {
        let roles: number = (Array.isArray(app.currentUser.role) ? app.currentUser.role as Array<number> : [app.currentUser.role]).reduce((n1, n2) => n1 | n2);

        return (roles & role) != 0;
    }

    public static correspondsPolicy(policyName: string): boolean {
        let policy = app.accessPolicies.get(policyName);
        if (policy == null)
            throw new Error("Policy '" + policyName + "' not found");

        return policy();
    }
}

export interface User extends IUser {

}

export interface UserReportItem extends TableRow {
    firstName: string;
    lastName: string;
    logonName: string,
    name: string,
    eMail: string,
    role: string,
    company: string,
    sites: string,
    createdBy: string
}

export interface UsersState extends TableContainerState {
    loading: boolean;
    errors: Array<string>;
}

export default class Users extends TableContainer<TableContainerProps, UsersState> {
    public constructor(props) {
        super(props);

        let state = this.state as UsersState;
        state.pageTitle = "Users";
        state.loading = false;
        state.errors = [];
    }

    public render() {
        return (
            <>
                <Access app={app} policy="administrator" />

                <Modal loading={true} visible={this.state.loading} />
                <ModalError visible={this.state.errors.length > 0} errors={this.state.errors} backUrl="/v2/mgmt/users" backLabel="Back to Users" />

                <div className="users-container">
                    <div className="report-search-area">
                        <div className="report-search-left"><Link to="/v2/mgmt/users/new">Create New</Link></div>
                        <div className="report-search-space"></div>
                        <div className="report-search-right"><TableSearch<Users> parent={this} /></div>
                        <div className="report-search-right">
                            <button className="tv-button" onClick={() => location.href = "/api/users/export"}>
                                <i className="fa fa-table" aria-hidden="true"></i>
                            </button>
                        </div>
                    </div>

                    <div className={"pagination-area" + (this.state.totalRows == 0 ? " hidden" : "")}>
                        <div className="pagination-info"><TableInfo rowsPerPage={this.state.rowsPerPage} page={this.state.page} totalRows={this.state.totalRows} /></div>
                        <div><TablePaginator rowsPerPage={this.state.rowsPerPage} totalRows={this.state.totalRows} page={this.state.page} onChange={page => this.changePage(page)} /></div>
                    </div>

                    <Table<Users, UserReportItem> parent={this} apiUrl="/api/users" columns={this.getColumns()} className="users" getContextMenu={this.getContextMenu} />

                    <div className={"pagination-area" + (this.state.totalRows == 0 ? " hidden" : "")}>
                        <div className="pagination-info"><TableInfo rowsPerPage={this.state.rowsPerPage} page={this.state.page} totalRows={this.state.totalRows} /></div>
                        <div><TablePaginator rowsPerPage={this.state.rowsPerPage} totalRows={this.state.totalRows} page={this.state.page} onChange={page => this.changePage(page)} /></div>
                    </div>
                </div>
            </>
        );
    }

    private getContextMenu = (row: UserReportItem): Array<TableContextMenuItem> => {
        return [
            {
                label: "Edit",
                icon: <i className="fas fa-info-circle"></i>,
                route: "/v2/mgmt/users/edit/" + row.id
            },
            {
                label: "Delete",
                icon: <i className="fas fa-edit"></i>,
                action: () => this.delete(row)
            }
        ];
    }

    private changePage(page: number) {
        this.setState({
            page,
            updateTable: true
        })
    }

    private delete(row: UserReportItem) {
        if (confirm("Do you want to delete this user?")) {
            this.setState({ loading: true });

            Form.sendRequest<User>("DELETE", "/api/users/" + row.id).then(
                res => this.onDeleted(res),
                () => this.setState({
                    errors: [Form.unknownError],
                    loading: false
                })
            );
        }
    }

    private onDeleted(res: FormResponse<User>) {
        if (res.status == "ok")
            app.notification.show(<div>User {res.data.name} successfully deleted</div>);

        this.setState({
            updateTable: true,
            errors: res.status == "error" ? res.errors.map(error => error.text) : [],
            loading: false
        })
    }

    private getColumns(): Array<TableColumn<UserReportItem>> {
        let getColumn = (label: string, internalName: string = null, sortable: boolean = false, filterable: boolean = false, searchable: boolean = false, map: (e: UserReportItem) => JSX.Element = null) => {
            if (!internalName)
                internalName = label;

            return {
                label,
                internalName,
                sortable,
                filterable,
                searchable,
                map
            } as TableColumn<UserReportItem>
        }

        let convertId = (row: UserReportItem): JSX.Element => <><Link to={"/v2/mgmt/users/edit/" + row.id}>edit</Link> | <span className="a" onClick={() => this.delete(row)}>delete</span></>;

        return [
            getColumn("Name", "name", true, true, true),
            getColumn("Logon Name", "logonName", true, true, true),
            getColumn("EMail", "eMail", true, true, true),
            getColumn("Role", "role", false, true),
            getColumn("Company", "company", true, true, true),
            getColumn("Sites", "sites", false, true),
            getColumn("Created by", "createdBy", true, true, true),
            getColumn("", "id", false, false, false, convertId)
        ];
    }
}
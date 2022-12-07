import { Access, Form, FormResponse, Modal, ModalError, Table, TableColumn, TableContainer, TableContainerProps, TableContainerState, TableContextMenuItem, TableInfo, TablePaginator, TableRow, TableSearch } from 'a1dms-front';
import React from 'react'
import { Link } from 'react-router-dom'
import { app } from '../ManagementApp';

export interface Company extends TableRow {
    name: string;
    inactive: boolean;
}

export interface CompaniesState extends TableContainerState {
    loading: boolean;
    errors: Array<string>;
}

export default class Companies extends TableContainer<TableContainerProps, CompaniesState> {
    public constructor(props) {
        super(props);

        let state = this.state as CompaniesState;
        state.pageTitle = "Companies";
        state.loading = false;
        state.errors = [];
    }

    public render() {
        return (
            <>
                <Access app={app} policy="administrator" />

                <Modal loading={true} visible={this.state.loading} />
                <ModalError visible={this.state.errors.length > 0} errors={this.state.errors} backUrl="/v2/mgmt/companies" backLabel="Back to Companies" />

                <div className="small-container">
                    <div className="report-search-area">
                        <div className="report-search-left"><Link to="/v2/mgmt/companies/new">Create New</Link></div>
                        <div className="report-search-space"></div>
                        <div className="report-search-right"><TableSearch<Companies> parent={this} /></div>
                        <div className="report-search-right">
                            <button className="tv-button" onClick={() => location.href = "/api/companies/export"}>
                                <i className="fa fa-table" aria-hidden="true"></i>
                            </button>
                        </div>
                    </div>

                    <div className={"pagination-area" + (this.state.totalRows == 0 ? " hidden" : "")}>
                        <div className="pagination-info"><TableInfo rowsPerPage={this.state.rowsPerPage} page={this.state.page} totalRows={this.state.totalRows} /></div>
                        <div><TablePaginator rowsPerPage={this.state.rowsPerPage} totalRows={this.state.totalRows} page={this.state.page} onChange={page => this.changePage(page)} /></div>
                    </div>

                    <Table<Companies, Company> parent={this} apiUrl="/api/companies" columns={this.getColumns()} className="small" getContextMenu={this.getContextMenu} />

                    <div className={"pagination-area" + (this.state.totalRows == 0 ? " hidden" : "")}>
                        <div className="pagination-info"><TableInfo rowsPerPage={this.state.rowsPerPage} page={this.state.page} totalRows={this.state.totalRows} /></div>
                        <div><TablePaginator rowsPerPage={this.state.rowsPerPage} totalRows={this.state.totalRows} page={this.state.page} onChange={page => this.changePage(page)} /></div>
                    </div>
                </div>
            </>
        );
    }

    private getContextMenu = (row: Company): Array<TableContextMenuItem> => {
        return [
            {
                label: "Edit",
                icon: <i className="fas fa-info-circle"></i>,
                route: "/v2/mgmt/companies/edit/" + row.id
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

    private delete(row: Company) {
        if (confirm("Do you want to delete this company?")) {
            this.setState({ loading: true });

            Form.sendRequest<Company>("DELETE", "/api/companies/" + row.id).then(
                res => this.onDeleted(res),
                () => this.setState({
                    errors: [Form.unknownError],
                    loading: false
                })
            );
        }
    }

    private onDeleted(res: FormResponse<Company>) {
        if (res.status == "ok")
            app.notification.show(<div>Company {res.data.name} successfully deleted</div>);

        this.setState({
            updateTable: true,
            errors: res.status == "error" ? res.errors.map(error => error.text) : [],
            loading: false
        })
    }

    private getColumns(): Array<TableColumn<Company>> {
        let getColumn = (label: string, internalName: string = null, sortable: boolean = false, filterable: boolean = false, searchable: boolean = false, map: (e: Company) => JSX.Element = null) => {
            if (!internalName)
                internalName = label;

            return {
                label,
                internalName,
                sortable,
                filterable,
                searchable,
                map
            } as TableColumn<Company>
        }

        let convertInactive = (row: Company): JSX.Element => <input type="checkbox" disabled={true} checked={row.inactive} />;
        let convertId = (row: Company): JSX.Element => <><Link to={"/v2/mgmt/companies/edit/" + row.id}>edit</Link> | <span className="a" onClick={() => this.delete(row)}>delete</span></>;

        return [
            getColumn("Name", "name", true, true, true),
            getColumn("Inactive", "inactive", false, true, false, convertInactive),
            getColumn("", "id", false, false, false, convertId)
        ];
    }
}
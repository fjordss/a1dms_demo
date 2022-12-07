import { Access, Form, FormResponse, Modal, ModalError, Table, TableColumn, TableContainer, TableContainerProps, TableContainerState, TableContextMenuItem, TableInfo, TablePaginator, TableRow, TableSearch } from 'a1dms-front';
import React from 'react'
import { Link } from 'react-router-dom'
import { app } from '../ManagementApp';

export interface Site extends TableRow {
    name: string;
    inactive: boolean;
}

export interface SitesState extends TableContainerState {
    loading: boolean;
    errors: Array<string>;
}

export default class Sites extends TableContainer<TableContainerProps, SitesState> {
    public constructor(props) {
        super(props);

        let state = this.state as SitesState;
        state.pageTitle = "Sites";
        state.loading = false;
        state.errors = [];
    }

    public render() {
        return (
            <>
                <Access app={app} policy="administrator" />

                <Modal loading={true} visible={this.state.loading} />
                <ModalError visible={this.state.errors.length > 0} errors={this.state.errors} backUrl="/v2/mgmt/sites" backLabel="Back to Sites" />

                <div className="small-container">
                    <div className="report-search-area">
                        <div className="report-search-left"><Link to="/v2/mgmt/sites/new">Create New</Link></div>
                        <div className="report-search-space"></div>
                        <div className="report-search-right"><TableSearch<Sites> parent={this} /></div>
                        <div className="report-search-right">
                            <button className="tv-button" onClick={() => location.href = "/api/sites/export"}>
                                <i className="fa fa-table" aria-hidden="true"></i>
                            </button>
                        </div>
                    </div>

                    <div className={"pagination-area" + (this.state.totalRows == 0 ? " hidden" : "")}>
                        <div className="pagination-info"><TableInfo rowsPerPage={this.state.rowsPerPage} page={this.state.page} totalRows={this.state.totalRows} /></div>
                        <div><TablePaginator rowsPerPage={this.state.rowsPerPage} totalRows={this.state.totalRows} page={this.state.page} onChange={page => this.changePage(page)} /></div>
                    </div>

                    <Table<Sites, Site> parent={this} apiUrl="/api/sites" columns={this.getColumns()} className="small" getContextMenu={this.getContextMenu} />

                    <div className={"pagination-area" + (this.state.totalRows == 0 ? " hidden" : "")}>
                        <div className="pagination-info"><TableInfo rowsPerPage={this.state.rowsPerPage} page={this.state.page} totalRows={this.state.totalRows} /></div>
                        <div><TablePaginator rowsPerPage={this.state.rowsPerPage} totalRows={this.state.totalRows} page={this.state.page} onChange={page => this.changePage(page)} /></div>
                    </div>
                </div>
            </>
        );
    }

    private getContextMenu = (row: Site): Array<TableContextMenuItem> => {
        return [
            {
                label: "Edit",
                icon: <i className="fas fa-info-circle"></i>,
                route: "/v2/mgmt/sites/edit/" + row.id
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
        });
    }

    private delete(row: Site) {
        if (confirm("Do you want to delete this site?")) {
            this.setState({ loading: true });

            Form.sendRequest<Site>("DELETE", "/api/sites/" + row.id).then(
                res => this.onDeleted(res),
                () => this.setState({
                    errors: [Form.unknownError],
                    loading: false
                })
            );
        }
    }

    private onDeleted(res: FormResponse<Site>) {
        if (res.status == "ok")
            app.notification.show(<div>Site {res.data.name} successfully deleted</div>);

        this.setState({
            updateTable: true,
            errors: res.status == "error" ? res.errors.map(error => error.text) : [],
            loading: false
        })
    }

    private getColumns(): Array<TableColumn<Site>> {
        let getColumn = (label: string, internalName: string = null, sortable: boolean = false, filterable: boolean = false, searchable: boolean = false, map: (e: Site) => JSX.Element = null) => {
            if (!internalName)
                internalName = label;

            return {
                label,
                internalName,
                sortable,
                filterable,
                searchable,
                map
            } as TableColumn<Site>
        }

        let convertInactive = (row: Site): JSX.Element => <input type="checkbox" disabled={true} checked={row.inactive} />;
        let convertId = (row: Site): JSX.Element => <><Link to={"/v2/mgmt/sites/edit/" + row.id}>edit</Link> | <span className="a" onClick={() => this.delete(row)}>delete</span></>;

        return [
            getColumn("Name", "name", true, true, true),
            getColumn("Inactive", "inactive", false, true, false, convertInactive),
            getColumn("", "id", false, false, false, convertId)
        ];
    }
}
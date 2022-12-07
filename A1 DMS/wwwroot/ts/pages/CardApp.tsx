import React from 'react'
import ReactDOM from 'react-dom'
import { FetchData, Form, Modal, ModalError, FormResponse, TableResponse } from 'a1dms-front'
import Auth from './Auth';
import Card, { EmployeeInfo, Lang } from './Card';
import MyParticipation from './MyParticipation';
import { Site } from './mgmt/sites/Sites';

interface CardAppState {
    loadingSites: boolean;
    loading: boolean;
    site?: string;
    lang?: Lang;
    employee?: EmployeeInfo;
    authenticated: boolean;
    myParticipation: boolean;
    showError: boolean;
    showResult: boolean;
    uniqueId?: string;
}

class CardApp extends React.Component<{}, CardAppState> {
    public sites: Array<string>;
    private sitesPromise: Promise<Array<string>>

    public constructor(props = null) {
        super(props);

        this.state = {
            loadingSites: true,
            loading: true,
            authenticated: false,
            showError: false,
            showResult: false,
            myParticipation: false
        };
    }

    public render() {
        if (!this.state.authenticated)
            document.title = "Nobody Gets Hurt - Login";
        else {
            document.title = "Nobody Gets Hurt" + (this.state.myParticipation ? " - My Participation" : "");
            for (let child of document.body.children) {
                if (child.tagName.toLowerCase() == "div" && !child.id)
                    child.remove();
            }
        }

        return (
            <>
                <Modal loading={true} visible={this.state.loading} />
                <ModalError visible={this.state.showError} errors={[Form.unknownError]} onClose={() => this.setState({ showError: false })} />
                <Modal visible={this.state.showResult} canBeClosed={true} width={295} height={175} onClose={() => location.reload()}>
                    <span className="card-unique-id">
                        {this.state.lang == Lang.english ? "Card #" + this.state.uniqueId + " submitted successfully" : "Карта #" + this.state.uniqueId + " успешно отправлена"}
                    </span>
                </Modal>

                {this.state.loadingSites ?
                    <FetchData<FormResponse<TableResponse<Site>>, Array<string>>
                        url="/api/sites?rowsPerPage=100"
                        obj={this}
                        prop="sitesPromise"
                        map={res => res.data.rows.map(s => s.name)}
                        after={() => this.sitesPromise.then(data => {
                            this.sites = data;
                            this.setState({
                                loadingSites: false,
                                loading: false
                            });
                        })}
                    /> :
                    <>
                        {this.state.authenticated ?
                            (this.state.myParticipation ?
                                <MyParticipation
                                    alertVisible={false}
                                    employee={this.state.employee}
                                    onError={() => this.setState({ showError: true })}
                                    onNewCardPressed={() => this.setState({ myParticipation: false })}
                                /> :
                                <Card
                                    sites={this.sites}
                                    lang={this.state.lang}
                                    site={this.state.site}
                                    employee={this.state.employee}
                                    onSend={() => this.setState({ loading: true })}
                                    onError={() => this.setState({
                                        loading: false,
                                        showError: true
                                    })}
                                    onSubmit={uniqueId => this.setState({
                                        loading: false,
                                        showResult: true,
                                        uniqueId
                                    })}
                                />) :
                            <Auth
                                alertVisible={false}
                                sites={this.sites}
                                onSend={() => this.setState({ loading: true })}
                                onError={error => this.setState({
                                    loading: false,
                                    showError: !error.field
                                })}
                                onAuth={(site, lang, employee, myParticipation) => this.setState({
                                    loading: false,
                                    site: site,
                                    lang: lang,
                                    employee: employee,
                                    authenticated: true,
                                    myParticipation: myParticipation
                                })}
                            />}
                    </>}
            </>
        );
    }
}

ReactDOM.render(<CardApp />, document.getElementById("main"));
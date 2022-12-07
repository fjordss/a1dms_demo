import { FetchData, Form, FormResponse, FormType, Modal, ModalError, RouteComponentProps } from 'a1dms-front';
import React from 'react'
import { Site } from './Sites';
import SitesForm from './SitesForm'

export interface SitesEditFormState {
    value: Site;
    errors: Array<string>;
}

export interface SitesEditFormParams {
    id: number;
}

export default class SitesEditForm extends React.Component<RouteComponentProps<SitesEditFormParams>, SitesEditFormState> {
    private site: Promise<FormResponse<Site>>;

    public constructor(props: RouteComponentProps<SitesEditFormParams>) {
        super(props);

        this.state = {
            value: null,
            errors: []
        };
    }

    public render() {
        return (
            <>
                {this.state.value == null ? <FetchData obj={this} prop="site" url={"/api/sites/" + this.props.match.params.id} /> : <></>}

                <Modal loading={true} visible={this.state.value == null} />
                <ModalError visible={this.state.errors.length > 0} errors={this.state.errors} backLabel="Back to Sites" backUrl="/v2/mgmt/sites" />

                <SitesForm formType={FormType.edit} submitLabel="Save" value={this.state.value} method="PUT" url={"/api/sites/" + this.props.match.params.id} redirectUrl="/v2/mgmt/sites" />
            </>
        );
    }

    public componentDidMount() {
        if (this.site) {
            this.site
                .then(
                    res => {
                        if (res.status == "ok")
                            this.setState({ value: res.data });
                        else 
                            this.setState({ errors: res.errors.map(e => e.text) })
                    },
                    error => this.setState({ errors: [Form.unknownErrorWithRefresh] })
                )
                .catch(error => this.setState({ errors: [Form.unknownErrorWithRefresh] }));
        }
    }
}
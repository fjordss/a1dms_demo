import { FetchData, Form, FormResponse, FormType, Modal, ModalError, RouteComponentProps, SelectOption } from 'a1dms-front';
import React from 'react'
import { User } from './Users';
import UsersForm from './UsersForm';

export interface UsersEditFormState {
    value: User;
    errors: Array<string>;
}

export interface UsersEditFormParams {
    id: number;
}

export default class UsersEditForm extends React.Component<RouteComponentProps<UsersEditFormParams>, UsersEditFormState> {
    private user: Promise<FormResponse<User>>;

    public constructor(props: RouteComponentProps<UsersEditFormParams>) {
        super(props);

        this.state = {
            value: null,
            errors: []
        };
    }

    public render() {
        return (
            <>
                {this.state.value == null ? <FetchData<FormResponse<User>>
                    obj={this}
                    prop="user"
                    url={"/api/users/" + this.props.match.params.id}
                    map={res => this.mapUser(res)}
                /> : <></>}

                <Modal loading={true} visible={this.state.value == null} />
                <ModalError visible={this.state.errors.length > 0} errors={this.state.errors} backLabel="Back to Users" backUrl="/v2/mgmt/users" />

                <UsersForm formType={FormType.edit} submitLabel="Save" value={this.state.value} method="PUT" url={"/api/users/" + this.props.match.params.id} redirectUrl="/v2/mgmt/users" />
            </>
        );
    }

    private mapUser(res: FormResponse<User>): FormResponse<User> {
        if (!Array.isArray(res.data.role)) {
            let count = (new UsersForm(null).getFields().find(f => f.name == "role").options as Array<SelectOption>).length;
            let role = res.data.role as number;

            let roles: Array<number> = [];
            for (let i = 0; i < count; i++) {
                let current = Math.pow(2, i);
                if ((role & current) == current)
                    roles.push(current);
            }

            res.data.role = roles;
        }

        return res;
    }

    public componentDidMount() {
        if (this.user) {
            this.user
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
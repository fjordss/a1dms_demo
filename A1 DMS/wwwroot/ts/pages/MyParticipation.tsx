import { http } from 'a1dms-front';
import React from 'react'
import { EmployeeInfo, Lang } from './Card';

export interface MyParticipationProps {
    alertVisible: boolean;
    employee: EmployeeInfo;
    onError: () => void;
    onNewCardPressed: () => void;
}

export interface MyParticipationState {
    from: string;
    to?: string;
    loading: boolean;
    count?: number;
}
export default class MyParticipation extends React.Component<MyParticipationProps, MyParticipationState> {
    public constructor(props) {
        super(props);

        var date = new Date();
        this.state = {
            from: date.getFullYear() + "-" + (date.getMonth() < 9 ? "0" : "") + (date.getMonth() + 1) + "-01",
            loading: true
        }
    }

    public render() {
        return (
            <div className="auth-main">
                <img src="/images/exxonlogo.png" className="auth-logo" />

                <div className={"auth-alert" + (!this.props.alertVisible ? " hidden" : "")}>Attention! This NGH Portal version is for educational purpose only</div>

                <div className="auth-fields">
                    <div></div>
                    <div className="auth-field mp-date">
                        <div className="mp-o1">From</div>
                        <div className="mp-o3">To</div>
                        <div className="mp-o2"><input type="date" value={this.state.from} onChange={e => this.dateChange("from", e.currentTarget.value)} /></div>
                        <div className="mp-o4"><input type="date" value={this.state.to} onChange={e => this.dateChange("to", e.currentTarget.value)} /></div>
                    </div>
                    <div></div>

                    <div></div>
                    <div className="mp-info">
                        <div><span className="mp-label">NGH #:</span> {this.props.employee.code}</div>
                        <div><span className="mp-label">Company:</span> {this.props.employee.company}</div>
                        <div><span className="mp-label">Number of Cards:</span> {this.state.loading ? "..." : this.state.count}</div>
                    </div>
                    <div></div>

                    <div></div>
                    <div className="auth-button-row">
                        <div><button className="auth-button auth-save-button" onClick={() => this.props.onNewCardPressed()}>Новая карта<br />New Card</button></div>
                        <div><button className="auth-button auth-participation-button" onClick={() => location.reload()}>Выйти<br />Log Out</button></div>
                    </div>
                </div>
            </div>
        );
    }

    public componentDidMount() {
        this.getCount();
    }

    private dateChange = (type: string, value: string) => {
        this.setState({
            loading: true,
            from: type == "from" ? value : this.state.from,
            to: type == "to" ? value : this.state.to
        }, () => this.getCount());
    }

    private getCount() {
        let handleError = () => this.props.onError();

        let query = "?from=" + (this.state.from ? encodeURIComponent(this.state.from) : "") + "&to=" + (this.state.to ? encodeURIComponent(this.state.to) : "");
        let url = "/api/cards/participation/" + this.props.employee.code + query;

        console.log(url);

        http.fetch<number>(url)
            .then(res => {
                if (res.status == "ok") {
                    this.setState({
                        loading: false,
                        count: res.data
                    });
                }
                else
                    handleError();
            })
            .catch(() => handleError())
    } 
}
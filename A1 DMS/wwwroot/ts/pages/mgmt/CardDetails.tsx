import React from 'react'
import Switch from 'react-switch'

export enum Language {
    eng,
    rus
}

export interface Card {
    id: number;
    date: string;
    site: string;
    company: string;
    department: string;
    firstName: string;
    lastName: string;
    reportType: string;
    lifeSavingActions: string;
    hazardID: Array<string>;
    safeChoice: Array<string>;
    description: string;
    descriptionRus: string;
    actionsTaken: string;
    actionsTakenRus: string;
    furtherActionsRequired: boolean;
    location: string;
    locationRus: string;
    furtherActions: string;
    furtherActionsRus: string;
    nominationCategory: string;
}

export interface CardDetailsProps {
    card: Card;
}

export interface CardDetailsState {
    lang: Language;
}

export default class CardDetails extends React.Component<CardDetailsProps, CardDetailsState> {
    public constructor(props: CardDetailsProps) {
        super(props);

        this.state = { lang: Language.eng };
    }

    public render() {
        return (
            <div className="card-details">
                <div>
                    <div className="card-details-label">Name</div>
                    <div>{this.getDisplayName()}</div>
                </div>
                <div>
                    <div className="card-details-label">Toggle Language</div>
                    <div>
                        <Switch
                            onChange={() => this.toggleLang()}
                            checked={this.state.lang == Language.rus}
                            uncheckedIcon={<div className="switch-label">eng</div>}
                            checkedIcon={<div className="switch-label">rus</div>}
                            height={25}
                            width={60}
                        />
                    </div>
                </div>
                <div></div>

                <div>
                    <div className="card-details-label">Site</div>
                    <div>{this.props.card.site}</div>
                </div>
                <div>
                    <div className="card-details-label">Company</div>
                    <div>{this.props.card.company}</div>
                </div>
                <div>
                    <div className="card-details-label">Department</div>
                    <div>{this.props.card.department}</div>
                </div>

                <div className="card-details-span3">
                    <div className="card-details-label">Description</div>
                    <div>{this.state.lang == Language.eng ? this.props.card.description : this.props.card.descriptionRus}</div>
                </div>

                <div className="card-details-span3">
                    <div className="card-details-label">Actions Taken</div>
                    <div>{this.state.lang == Language.eng ? this.props.card.actionsTaken : this.props.card.actionsTakenRus}</div>
                </div>

                <div className="card-details-span3">
                    <div className="card-details-label">Actions Suggested</div>
                    <div>{this.state.lang == Language.eng ? this.props.card.furtherActions : this.props.card.furtherActionsRus}</div>
                </div>
            </div>
        );
    }

    private toggleLang() {
        this.setState({ lang: this.state.lang == Language.eng ? Language.rus : Language.eng });
    }

    private getDisplayName() {
        return (this.props.card.lastName ? this.props.card.lastName : "") +
               (this.props.card.firstName && this.props.card.firstName ? ", " : "") +
               (this.props.card.firstName ? this.props.card.firstName : "");
    }
}
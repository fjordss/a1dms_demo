import React from 'react'
import { Lang, LangPair } from './Card';

export interface CardLabelProps {
    pair: LangPair;
    lang: Lang;
    className?: string;
    htmlFor?: string;
    error?: string;
}

export default class CardLabel extends React.Component<CardLabelProps> {
    public constructor(props) {
        super(props);
    }

    public render() {
        return (
            <div className={"card-label" + (this.props.className ? " " + this.props.className : "")}>
                <label htmlFor={this.props.htmlFor}>{this.props.lang == Lang.english ? this.props.pair.en : this.props.pair.ru}</label>
                <div className="card-error">{this.props.error ? this.props.error : ""}</div>
            </div>
        );
    }
}
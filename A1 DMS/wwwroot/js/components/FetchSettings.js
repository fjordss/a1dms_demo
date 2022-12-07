import React from 'react';
export default class FetchSettings extends React.Component {
    constructor(props) {
        super(props);
    }
    render() {
        return (React.createElement(React.Fragment, null));
    }
    componentDidMount() {
        let promise = new Promise((resolve, reject) => {
            fetch(this.props.url)
                .then(r => r.json())
                .then(data => {
                if (this.props.map)
                    data = this.props.map(data);
                resolve(data);
            })
                .catch(error => console.error(error));
        });
        this.props.settings[this.props.prop] = promise;
    }
}
//# sourceMappingURL=FetchSettings.js.map
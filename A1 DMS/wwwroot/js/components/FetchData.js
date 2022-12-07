import React from 'react';
export default class FetchData extends React.Component {
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
                .then((data) => {
                if (this.props.map)
                    resolve(this.props.map(data));
                else
                    resolve(data);
            })
                .catch(error => console.error(error));
        });
        this.props.obj[this.props.prop] = promise;
        if (this.props.after)
            this.props.after();
    }
}
//# sourceMappingURL=FetchData.js.map
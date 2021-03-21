import { Component, Fragment } from 'react'
import { connectionRequest } from "../lib/lamden"
export default class Wallet extends Component {
    componentDidMount() {
        // document.dispatchEvent(new CustomEvent('lamdenWalletGetInfo'));
        document.dispatchEvent(new CustomEvent('lamdenWalletConnect', { detail: JSON.stringify(connectionRequest) }));
    }
    render() {
        return <Fragment />
    }
}

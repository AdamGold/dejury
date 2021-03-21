import '../styles/global.css'
import { Fragment } from 'react'
import App from 'next/app'
import dynamic from 'next/dynamic'
const Wallet = dynamic(
    () => import('./wallet'),
    { ssr: false }
)
export default class CustomApp extends App {
    constructor() {
        super()
        this.state = { walletInfo: null }
    }

    lamdenWalletInfo = (response) => {
        if (response.error && response.error.length > 0) {
            console.log(response.error)
            return
        }
        if (response.locked) {
            alert("Please unlock your Lamden wallet.")
        } else {
            //Get user's account address
            var detail = response.detail
            this.setState({ walletInfo: detail })
        }
    }

    lamdenWalletStatus = (response) => {
        console.log(response)
        if (response.resultInfo && response.resultInfo.type === 'error') {
            console.log(response.resultInfo.errors)
            //Handle Errors
        } else {
            //Do soemething
        }
    }

    async componentDidMount() {
        // Get Wallet Info
        document.addEventListener('lamdenWalletInfo', this.lamdenWalletInfo);
        document.addEventListener('lamdenWalletTxStatus', this.lamdenWalletStatus);
    }
    render() {
        const { Component, pageProps } = this.props
        console.log(this.state)
        return (
            <Fragment>
                <Wallet />
                <Component walletInfo={this.state.walletInfo} {...pageProps} />
            </Fragment>
        )
    }
}

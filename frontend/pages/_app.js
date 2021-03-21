import '../styles/global.css'
import { Fragment } from 'react'
import App from 'next/app'
import dynamic from 'next/dynamic'
import { withRouter } from 'next/router'


const Wallet = dynamic(
    () => import('./wallet'),
    { ssr: false }
)

class CustomApp extends App {
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
            var txInfo = response.detail.data.txInfo
            if (txInfo.methodName === "post") {
                this.props.router.push(`/questions/${txInfo['senderVk']}?title=${txInfo["kwargs"]["title"]}`)
            }
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

export default withRouter(CustomApp)
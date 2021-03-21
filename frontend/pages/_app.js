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
        var data = response.detail.data
        console.log(data)
        if (data.resultInfo && data.resultInfo.type === 'error') {
            console.log(data.resultInfo.errorInfo)
            alert("An error has occured, please try again.")
        } else if (!data.resultInfo.title.includes("Pending")) {
            var txInfo = data.txInfo
            if (txInfo.methodName === "post") {
                this.props.router.push(`/questions/${txInfo['senderVk']}?title=${encodeURIComponent(txInfo["kwargs"]["title"])}`)
            } else if (txInfo.methodName === "answer") {
                alert("Your answer has been submitted. The owner will be notified via email and will have the ability to award you with the bounty.")
            } else if (txInfo.methodName === "award") {
                alert("Bounty awarded!")
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

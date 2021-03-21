import Lamden from "lamden-js"

export const CONTRACT_NAME = "con_dejury_testing4"
export const NETWORK = "testnet"
export const connectionRequest = {
    appName: 'Dejury', // Your DAPPS's name
    version: '1.1.0', // any version to start, increment later versions to update connection info
    contractName: CONTRACT_NAME, // Will never change
    networkType: NETWORK, // other option is 'mainnet'
    logo: 'images/logo.png', // or whatever the location of your logo
}
const TEST_NETWORK_URL = "https://testnet-master-1.lamden.io"
const PROD_NETWORK_URL = "https://masternode-01.lamden.io"
export const API = new Lamden.Masternode_API({ hosts: [TEST_NETWORK_URL] })

import Lamden from "lamden-js"

const DEV_CONTRACT_NAME = "con_dejury_testing4"
// const PROD_CONTRACT_NAME = "con_dejury"
// export const CONTRACT_NAME = DEV_CONTRACT_NAME
export const CONTRACT_NAME = process.env.NEXT_PUBLIC_CONTRACT_NAME || DEV_CONTRACT_NAME
export const NETWORK = process.env.NEXT_PUBLIC_NETWORK || "testnet"
export const connectionRequest = {
    appName: 'Dejury', // Your DAPPS's name
    version: process.env.NEXT_PUBLIC_VERSION, // any version to start, increment later versions to update connection info
    contractName: CONTRACT_NAME, // Will never change
    networkType: NETWORK, // other option is 'mainnet'
    logo: 'images/logo.png', // or whatever the location of your logo
}
const TEST_NETWORK_URL = "https://testnet-master-1.lamden.io"
const PROD_NETWORK_URL = "https://masternode-01.lamden.io"
export const NETWORK_URL = process.env.NEXT_PUBLIC_NETWORK_URL || TEST_NETWORK_URL
export const API = new Lamden.Masternode_API({ hosts: [NETWORK_URL] })

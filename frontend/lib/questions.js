import { NETWORK, CONTRACT_NAME, API } from "./lamden"

export const postQuestion = async (kwargs, wallet) => {
    var detail = JSON.stringify({
        contractName: 'currency',
        methodName: 'approve',
        networkType: NETWORK,
        kwargs: {
            amount: parseInt(kwargs["bounty"]),  // amount of TAU to approve
            to: CONTRACT_NAME // contract to approve
        },
        stampLimit: 40
    });

    document.dispatchEvent(new CustomEvent('lamdenWalletSendTx', { detail }));
    await new Promise(r => setTimeout(r, 2000)); // wait for approval

    detail = JSON.stringify({
        //Which Lamden Network to send this to
        //mainnet, testnet are the only acceptable values
        networkType: NETWORK,

        //The method in your contract to call
        methodName: 'post',

        //The argument values for your method
        kwargs,
        //The maximum amount of stamps this transaction is allowed to use
        //Could you less but won't be allowed to use more
        stampLimit: 100
    });

    //Send transaction to the wallet
    document.dispatchEvent(new CustomEvent('lamdenWalletSendTx', { detail }));
}

export const getQuestion = async (owner, title) => {
    // get data from blockchain
    const content = await API.getVariable(CONTRACT_NAME, 'posts', owner + ":" + title + ":content")
    const bounty = await API.getVariable(CONTRACT_NAME, 'posts', owner + ":" + title + ":bounty")
    const email = await API.getVariable(CONTRACT_NAME, 'posts', owner + ":" + title + ":email")
    return { content, bounty, email }
}

export const answerQuestion = async event => {
    // post to blockchain & email the owner with the answer & award link
    event.preventDefault()
    // const res = await api.getVariable(config.devContract, 'questions')
    // return res
}

export const award = async event => {
    event.preventDefault()
    // const res = await api.getVariable(config.devContract, 'questions')
    // return res
}

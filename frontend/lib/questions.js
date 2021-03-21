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
        networkType: NETWORK,
        methodName: 'post',
        kwargs,
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

export const answerQuestion = async (owner, title, content) => {
    // post to blockchain & email the owner with the answer & award link
    var detail = JSON.stringify({
        networkType: NETWORK,
        methodName: 'answer',
        kwargs: { owner, title, content },
        stampLimit: 60
    });

    //Send transaction to the wallet
    document.dispatchEvent(new CustomEvent('lamdenWalletSendTx', { detail }));
}

export const awardAnswer = async (title, winner) => {
    var detail = JSON.stringify({
        networkType: NETWORK,
        methodName: 'award',
        kwargs: { title, winner },
        stampLimit: 40
    });

    //Send transaction to the wallet
    document.dispatchEvent(new CustomEvent('lamdenWalletSendTx', { detail }));
}

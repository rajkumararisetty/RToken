import Web3 from 'web3';
import Token from '../abis/Token.json';
import Exchange from '../abis/Exchange.json';
import {
    web3Loaded,
    web3AccountLoaded,
    tokenLoaded,
    exchangeLoaded,
    cancelledOrdersLoaded,
    filledOrdersLoadeed,
    allOrdersLoadeed,
    orderCancelling,
    orderCancelled,
    orderFilling,
    orderFilled,
    tokenBalanceLoaded,
    etherBalanceLoaded,
    exchangeTokenBalanceLoaded,
    exchangeEtherBalanceLoaded,
    balancesLoaded,
    balancesLoading
} from './actions.js';
import {ETHER_ADDRESS} from '../helpers';

// Web3
export const loadWeb3 = (dispatch) => {
    const web3 = new Web3(Web3.givenProvider || 'http://localhost:7545');
    dispatch(web3Loaded(web3));
    return web3;
}

export const loadAccount = async (web3, dispatch) => {
    const accounts = await web3.eth.getAccounts();
    const account = accounts[0];
    dispatch(web3AccountLoaded(account));
    return account;
}

// Token
export const loadTokenn = async (web3, networkId, dispatch) => {
    try {
        const token = web3.eth.Contract(Token.abi, Token.networks[networkId].address);
        dispatch(tokenLoaded(token));
        return token;
    } catch(error) {
        console.log('Contract is not deployed to the current network. Please select another network with metamask');
        return null;
    }
}

// Exchange
export const loadExchange = async (web3, networkId, dispatch) => {
    try {
        const exchange = web3.eth.Contract(Exchange.abi, Exchange.networks[networkId].address);
        dispatch(exchangeLoaded(exchange));
        return exchange;
    } catch(error) {
        console.log('Contract is not deployed to the current network. Please select another network with metamask');
        return null;    
    }
}

export const loadAllOrders = async (exchange, dispatch) => {
    const cancelStream = await exchange.getPastEvents('orderCancel', {fromBlock: 0, toBlock: 'latest'});
    const cancelledOrders = cancelStream.map(event => event.returnValues);
    dispatch(cancelledOrdersLoaded(cancelledOrders));

    const tradeStream = await exchange.getPastEvents('Trade', {fromBlock: 0, toBlock: 'latest'});
    const tradeOrders = tradeStream.map(event => event.returnValues);
    dispatch(filledOrdersLoadeed(tradeOrders));

    const orderStream = await exchange.getPastEvents('Order', {fromBlock: 0, toBlock: 'latest'});
    const allOrders = orderStream.map(event => event.returnValues);
    dispatch(allOrdersLoadeed(allOrders));
}

export const subscribeToEvents = async (dispatch, web3, exchange, token, account) => {
    exchange.events.orderCancel({}, (error, event) => {
        dispatch(orderCancelled(event.returnValues));
    });

    exchange.events.Trade({}, (error, event) => {
        dispatch(orderFilled(event.returnValues));
    });

    exchange.events.Deposit({}, (error, event) => {
        loadBalances(dispatch, web3, exchange, token, account);
    });

    exchange.events.Withdraw({}, (error, event) => {
       loadBalances(dispatch, web3, exchange, token, account); 
    })
}

export const cancelOrder = (dispatch, exchange, orderId, account) => {
    exchange.methods.cancelOrder(orderId).send({from: account})
    .on('transactionHash', (hash) => {
        dispatch(orderCancelling());
    })
    .on('error', (error) => {
        console.log(error);
        window.alert('There was an error in cancelling order!');
    });
}

export const fillOrder = (dispatch, exchange, orderId, account) => {
    exchange.methods.fillOrder(orderId).send({from: account})
    .on('transactionHash', (hash) => {
        dispatch(orderFilling());
    })
    .on('error', (error) => {
        console.log(error);
        window.alert('There was an error in filling order!');
    });
}

export const loadBalances = async (dispatch, web3, exchange, token, account) => {
    // Ether balance in the wallet
    const etherBalance = await web3.eth.getBalance(account);
    dispatch(etherBalanceLoaded(etherBalance));

    // Token balance in wallet
    const tokenBalance = await token.methods.balanceOf(account).call();
    dispatch(tokenBalanceLoaded(tokenBalance));

    // Ether balance in exchange
    const exchangeEtherBalance = await exchange.methods.balanceOf(ETHER_ADDRESS, account).call();
    dispatch(exchangeEtherBalanceLoaded(exchangeEtherBalance));

    // Token balance in exchange
    const exchangeTokenBalance = await exchange.methods.balanceOf(token.options.address, account).call();
    dispatch(exchangeTokenBalanceLoaded(exchangeTokenBalance));

    // All balances loaded
    dispatch(balancesLoaded());
}

export const depositEther = (dispatch, exchange, web3, amount, account) => {
    exchange.methods.depositEther.send({from: account, value: web3.utils.toWei(amount, 'ether')})
    .on('transactionHash', (hash) => {
        dispatch(balancesLoading());
    })
    .on('error', (error) => {
        console.error(error);
        window.alert('There was an error in depositing ether');
    });
}

export const withdrawEther = (dispatch, exchange, web3, amount, account) => {
    exchange.methods.withdrawEther(web3.utils.toWei(amount, 'ether')).send({from: account})
    .on('transactionHash', (hash) => {
        dispatch(balancesLoading());
    }).on('error', (error) => {
        console.log(error);
        window.alert('Error in withdrawing wther');
    });
}

export const depositToken = (dispatch, exchange, web3, token, amount, account) => {
    amount = web3.utils.toWei(amount, 'ether');
    token.methods.approve(exchange.options.address, amount).send({from: account})
    .on('transactionHash', (hash) => {
        exchange.methods.depositToken(token.options.address, amount).send({from: account})
        .on('transactionHash', (hash) => {
            dispatch(balancesLoading());
        })
        .on('error', (error) => {
            console.error(error);
            window.alert('There was an error!');
        })
    })
}

export const withdrawToken = (dispatch, exchange, web3, token, amount, account) =>  {
    amount = web3.utils.toWei(amount, 'ether');
    exchange.methods.withdrawToken(token.options.address, amount).send({from: account})
    .on('transactionHash', (hash) => {
        dispatch(balancesLoading());
    })
    .on('error', (error) => {
        console.log(error);
        window.alert('There was an error');
    });
}

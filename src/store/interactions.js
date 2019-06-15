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
    orderCancelled
} from './actions.js';

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
    dispatch(filledOrdersLoadeed(tradeOrders))

    const orderStream = await exchange.getPastEvents('Order', {fromBlock: 0, toBlock: 'latest'});
    const allOrders = orderStream.map(event => event.returnValues);
    dispatch(allOrdersLoadeed(allOrders))
}

export const cancelOrder = (dispatch, exchange, orderId, account) => {
    exchange.methods.cancelOrder(orderId).send({from: account})
    .on('transactionHash', (hash) => {
        dispatch(orderCancelling());
    })
    .on('error', (error) => {
        console.log(error);
        window.alert('There was an error!');
    });
}

export const subscribeToEvents = async (exchange, dispatch) => {
    exchange.events.orderCancel({}, (error, event) => {
        dispatch(orderCancelled(event.returnValues));
    });
}

import {createSelector} from 'reselect';
import {get} from 'lodash';
import moment from 'moment';
import {ETHER_ADDRESS, tokens, ether, GREEN, RED} from '../helpers';

const account = state => get(state, 'web3.account');
export const accountSelector = createSelector(account, a => a);

const tokenLoaded = state => get(state, 'token.loaded', false);
export const tokenLoadedSelector = createSelector(tokenLoaded, tl => tl);

const exchangeLoaded = state => get(state, 'exchange.loaded', false);
export const exchangeLoadedSelector = createSelector(exchangeLoaded, el => el);

export const contractsLoadedSelector = createSelector(
    tokenLoaded, exchangeLoaded, (tl, el) => (tl && el)
);

const exchange = state => get(state, 'exchange.contract');
export const exchangeSelector = createSelector(exchange, e => e);

const filledOrdersLoaded = state => get(state, 'exchange.filledOrders.loaded', false);
export const filledOrdersLoadedSelector = createSelector(filledOrdersLoaded, fol => fol);

const filledOrders = state => get(state, 'exchange.filledOrders.data', []);
export const filledOrdersSelector = createSelector(filledOrders, orders => {
    // Decorate the orders
    orders = decorateFilledOrders(orders);
    // sort orders by date ascending for price comparison
    return orders.sort((a, b) => a.timestamp - b.timestamp);
});

const decorateFilledOrders = (orders) => {
    // Track previous order to track history
    let previousOrder = orders[0];
    return (
        orders.map(order => {
            order = decorateOrder(order)
            order = decorateFilledOrder(order, previousOrder);
            previousOrder = order; // update the previous order once it's decorated
            return order;
        })
    );
}

const decorateOrder = (order) => {
    let etherAmount;
    let tokenAmount;
    if (order.tokenGive === ETHER_ADDRESS) {
        etherAmount = order.amountGive;
        tokenAmount = order.amountGet;
    } else {
        etherAmount = order.amountGet;
        tokenAmount = order.amountGive;
    }

    // Canculate token price to 5 decinal places
    const precision = 100000;
    let tokenPrice = (etherAmount / tokenAmount);
    tokenPrice = Math.round(tokenPrice * precision) / precision;

    return ({
        ...order,
        etherAmount: ether(etherAmount),
        tokenAmount: tokens(tokenAmount),
        tokenPrice,
        formattedTimeStamp: moment.unix(order.timestamp).format('h:mm:ss a M/D')
    });
}

const decorateFilledOrder = (order, previousOrder) => {
    return ({
        ...order,
        tokenPriceClass: tokenPriceClass(order.tokenPrice, order.id, previousOrder)
    })
}

const tokenPriceClass = (tokenPrice, orderId, previousOrder) => {
    // Show gree price if the order price is heigher than the previous price
    // Shoow red price if the order price is lower than the previous price
    if (previousOrder.id === orderId || previousOrder.tokenPrice <= tokenPrice) {
        return GREEN; // Success
    }
    return RED; // Failure
}
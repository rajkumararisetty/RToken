import {createSelector} from 'reselect';
import {get, reject, groupBy} from 'lodash';
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

const allOrdersLoaded = state => get(state, 'exchange.allOrders.loaded', false);
export const allOrdersLoadedSelector = createSelector(allOrdersLoaded, aol => aol);

const allOrders = state => get(state, 'exchange.allOrders.data', []);

// Cancelled orders
const cancelledOrdersLoaded = state => get(state, 'exchange.canelledOrders.loaded', false);
export const cancelledOrdersLoadedSelector = createSelector(cancelledOrdersLoaded, col => col);

const cancelledOrders = state => get(state, 'exchange.canelledOrders.data', []);
export const canelledOrdersSelector = createSelector(cancelledOrders, o => o);

// Fillded order
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

const openOrders = (state) => {
    const all = allOrders(state);
    const filled = filledOrders(state);
    const cancelled = cancelledOrders(state);

    const openOrders = reject(all, (order) => {
        const orderFilled = filled.some(o =>  o.id === order.id);
        const orderCancelled = cancelled.some(o =>  o.id === order.id);
        return (orderFilled || orderCancelled);
    });

    return openOrders;
}

const orderBookLoaded = state => (cancelledOrdersLoaded(state) && filledOrdersLoaded(state) && allOrdersLoaded(state));

export const orderBookLoadedSelector = createSelector(orderBookLoaded, obl => obl);
// Create the order book
export const orderBookSelector = createSelector(
    openOrders,
    (orders) => {
        // Decotate orders
        orders = decorateOrderBookOrders(orders);
        // group orders by "groupBy"
        orders = groupBy(orders, 'orderType');
        // Fetch buy orders
        const buyOrders = get(orders, 'buy', []);
        // Fetch the sell Orders
        const sellOrders = get(orders, 'sell', []);
        orders = {
            ...orders,
            // Sort buy order by token price
            buyOrders: buyOrders.sort((a,b) => b.tokenPrice - a.tokenPrice),
            // Sort sell orders by token price
            sellOrders: sellOrders.sort((a,b) => b.tokenPrice - a.tokenPrice)
        }

        return orders;
    }
);

const decorateOrderBookOrders = orders => {
    return (
        orders.map(order => {
            order = decorateOrder(order);
            order = decorateOrderBookOrder(order);
            return order;
        })
    )   
}

const decorateOrderBookOrder = (order) => {
    const orderType = order.tokenGive === ETHER_ADDRESS ? 'buy' : 'sell';
    return ({
        ...order,
        orderType,
        orderTypeClass: (orderType === 'buy' ? GREEN : RED),
        orderFillClass: orderType === 'buy' ? 'sell' : 'buy'
    })
};
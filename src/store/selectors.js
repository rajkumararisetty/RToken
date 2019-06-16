import {createSelector} from 'reselect';
import {get, reject, groupBy, maxBy, minBy} from 'lodash';
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
const cancelledOrdersLoaded = state => get(state, 'exchange.cancelledOrders.loaded', false);
export const cancelledOrdersLoadedSelector = createSelector(cancelledOrdersLoaded, col => col);

const cancelledOrders = state => get(state, 'exchange.cancelledOrders.data', []);
export const cancelledOrdersSelector = createSelector(cancelledOrders, o => o);

// Fillded order
const filledOrdersLoaded = state => get(state, 'exchange.filledOrders.loaded', false);
export const filledOrdersLoadedSelector = createSelector(filledOrdersLoaded, fol => fol);

const filledOrders = state => get(state, 'exchange.filledOrders.data', []);
export const filledOrdersSelector = createSelector(filledOrders, orders => {
    // Decorate the orders
    orders = decorateFilledOrders(orders);
    // sort orders by date ascending for price comparison
    return orders.sort((a, b) => b.timestamp - a.timestamp);
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
    // buy order
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
        orderFillAction: orderType === 'buy' ? 'sell' : 'buy'
    })
};

// My Filled Order selectors
export const myFilledOrdersLoadedSelector = createSelector(filledOrdersLoaded, loaded => loaded);
export const myFilledOrdersSelector = createSelector(
    account,
    filledOrders,
    (account, orders) => {
        // Find our orders
        orders = orders.filter(order => (order.user === account || order.userFill === account))
        // Sort Date ascending
        orders = orders.sort((a,b) => a.timestamp - b.timestamp);
        // Decorate the orders = add display aatributes
        return decorateMyFilledOrders(orders, account);
    }
);

const decorateMyFilledOrders = (orders, account) => {
    return (
        orders.map((order) => {
            order = decorateOrder(order);
            order = decorateMyFilledOrder(order, account);
            return order;
        })
    );
}

const decorateMyFilledOrder = (order, account) => {
    const myOrder = order.user === account;

    let orderType;
    if (myOrder) {
        orderType = order.tokenGive === ETHER_ADDRESS ? 'buy' : 'sell';
    } else {
        orderType = order.tokenGive === ETHER_ADDRESS ? 'sell' : 'buy';
    }

    return ({
        ...order,
        orderType,
        orderTypeClass: (orderType === 'buy' ? GREEN : RED),
        orderSign: (orderType === 'buy' ? '+' : '-')
    })
}

export const myOpenOrdersLoadedSelector = createSelector(orderBookLoaded, loaded => loaded);

export const myOpenOrderSelector = createSelector(openOrders, account, (orders, account) => {
    // Filter orders created by current account
    orders = orders.filter(order => order.user === account);
    // Decorate orders = add display attributes
    orders = decorateMyOpenOrders(orders, account);
    // Sort orders date descending
    return orders.sort((a, b) => b.timestamp - a.timestamp)
});

const decorateMyOpenOrders = (orders, account) => {
    return (
        orders.map(order => {
            order = decorateOrder(order);
            order = decorateMyOpenOrder(order, account);
            return order;
        })
    )
}

const decorateMyOpenOrder = (order, account) => {
    let orderType = order.tokenGive === ETHER_ADDRESS ? 'buy' : 'sell';
    return ({
        ...order,
        orderType,
        orderTypeClass: (orderType === 'buy' ? GREEN : RED)
    });
}

// Price Chart selectors
export const priceChartLoadedSelector = createSelector(filledOrdersLoaded, loaded => loaded);

export const priceChartSelector = createSelector(filledOrders, (orders) => {
    // Sort orders by date ascending to compare history
    orders = orders.sort((a,b) => a.timestamp - b.timestamp);
    // decorate orders = add display attributes
    orders = orders.map(order => decorateOrder(order));
    // Get last 2 order for final price and price change
    let secondLastOrder, lastOrder;
    [secondLastOrder, lastOrder] = orders.slice(orders.length - 2, orders.length);
    // Get last order price
    const lastPrice = get(lastOrder, 'tokenPrice', 0);
    const secondLastPrice = get(secondLastOrder, 'tokenPrice', 0);

    return ({
        lastPrice,
        lastPriceChange: (lastPrice >= secondLastPrice ? '+' : '-'),
        series:[{
            data: buildGraphData(orders)
        }]
    })
});

const buildGraphData = (orders) => {
    // Group the orders by hour for graph
    orders = groupBy(orders, (order) => moment.unix(order.timestamp).startOf('hour').format());
    // Get each hour where the data exist
    const hours = Object.keys(orders);
    // Build the graph series
    const graphData = hours.map(hour => {
        // Fetch all the orders from current hour
        const group = orders[hour];
        // Canculate price values - open, heigh, low and close
        const open = group[0]; // First order
        const close = group[(group.length)-1] // Last order
        const high = maxBy(group, 'tokenPrice');
        const low = minBy(group, 'tokenPrice');
        return ({
            x: new Date(hour),
            y: [open.tokenPrice, high.tokenPrice, low.tokenPrice, close.tokenPrice]
        })
    });
    return graphData;
}

const orderCancelling = (state) => get(state, 'exchange.orderCancelling', false);
export const orderCancellingSelector = createSelector(orderCancelling, status => status);

const orderFilling = (state) => get(state, 'exchange.orderFilling', false);
export const orderFillingSelector = createSelector(orderFilling, status => status);

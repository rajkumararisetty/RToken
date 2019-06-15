export const web3Loaded = (connection) => ({type: 'WEB3_LOADED', connection});

export const web3AccountLoaded = (account) => ({type: 'WEB3_ACCOUNT_LOADED', account});

export const tokenLoaded = (contract) => ({type: 'TOKEN_LOADED', contract});

export const exchangeLoaded = (contract) => ({type: 'EXCHANGE_LOADED', contract});

export const cancelledOrdersLoaded = (cancelledOrders) => ({type: 'CANCELLED_ORDERS_LOADED', cancelledOrders});

export const filledOrdersLoadeed = (filledOrders) => ({type: 'FILLED_ORDERS_LOADED', filledOrders});

export const allOrdersLoadeed = (allOrders) => ({type: 'ALL_ORDERS_LOADED', allOrders})

export const orderCancelling = () => ({type: 'ORDER_CANCELLING'});

export const orderCancelled = (order) => ({type: 'ORDER_CANCELLED', order});

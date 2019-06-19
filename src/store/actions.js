export const web3Loaded = (connection) => ({type: 'WEB3_LOADED', connection});

export const web3AccountLoaded = (account) => ({type: 'WEB3_ACCOUNT_LOADED', account});

export const tokenLoaded = (contract) => ({type: 'TOKEN_LOADED', contract});

export const exchangeLoaded = (contract) => ({type: 'EXCHANGE_LOADED', contract});

export const cancelledOrdersLoaded = (cancelledOrders) => ({type: 'CANCELLED_ORDERS_LOADED', cancelledOrders});

export const filledOrdersLoadeed = (filledOrders) => ({type: 'FILLED_ORDERS_LOADED', filledOrders});

export const allOrdersLoadeed = (allOrders) => ({type: 'ALL_ORDERS_LOADED', allOrders})

export const orderCancelling = () => ({type: 'ORDER_CANCELLING'});

export const orderCancelled = (order) => ({type: 'ORDER_CANCELLED', order});

export const orderFilling = () => ({type: 'ORDER_FILLING'});

export const orderFilled = (order) => ({type: 'ORDER_FILLED', order});

export const tokenBalanceLoaded = (balance) => ({type: 'TOKEN_BALANCE', balance});

export const etherBalanceLoaded = (balance) => ({type: 'ETHER_BALANCE', balance});

export const exchangeTokenBalanceLoaded = (balance) => ({type: 'EXCHANGE_TOKEN_BALANCE', balance});

export const exchangeEtherBalanceLoaded = (balance) => ({type: 'EXCHANGE_ETHER_BALANCE', balance});

export const balancesLoading = () => ({type: 'BALANCES_LOADING'});

export const balancesLoaded = () => ({type: 'BALANCES_LOADED'});

export const etherDepositAmountChange = (amount) => ({type: 'ETHER_DEPOSIT_AMOUNT_CHANGE', amount});

export const etherWithdrawAmountChange = (amount) => ({type: 'ETHER_WITHDRAW_AMOUNT_CHANGE', amount});

export const tokenDepositAmountChange = (amount) => ({type: 'TOKEN_DEPOSIT_AMOUNT_CHANGE', amount});

export const tokenWithdrawAmountChange = (amount) => ({type: 'TOKEN_WITHDRAW_AMOUNT_CHANGE', amount});

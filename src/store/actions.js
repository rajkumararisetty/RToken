export const web3Loaded = (connection) => ({type: 'WEB3_LOADED', connection});

export const web3AccountLoaded = (account) => ({type: 'WEB3_ACCOUNT_LOADED', account});

export const tokenLoaded = (contract) => ({type: 'TOKEN_LOADED', contract});

export const exchangeLoaded = (contract) => ({type: 'EXCHANGE_LOADED', contract});

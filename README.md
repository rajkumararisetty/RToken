# R-Token:

#### Prerequisite tools:
``` tools
Install: 
    node
    npm
    Note: Better install to nvm(Node Version Manager)
 	Ref: https://www.digitalocean.com/community/tutorials/how-to-install-node-js-on-ubuntu-18-04
    
    Truffle(Framework to develop Dapp): npm install -g truffle@5.0.1
    Ref: https://www.trufflesuite.com/
    
    Gananche(local blockchain for development): https://github.com/trufflesuite/ganache.git

    Some other dependencies to install:        
        npm install -g libgconf-2-4 node-gpy@3.6.2
```

### Steps for dev mode:
```sol
Ganache:
    cd ganache
    npm install
    npm start

trufflr commands:
    truffle migrate
    truffle exec scripts/seed-exchange.js

R Token:
    git clone https://github.com/rajkumararisetty/RToken.git
    cd RToken
    npm install
    npm start
```

### Packages:
```pack
    Truffle(Framework for Dapp development in ethereum)
    React
    Redux
    apexcharts
    lodash
    moment
    reselect
```

### Demo: <https://r-token-exchange.herokuapp.com/>

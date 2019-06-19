import React, {useEffect} from 'react';
import {useSelector, useDispatch} from 'react-redux';
import {Tabs, Tab} from 'react-bootstrap';
import {
    accountSelector,
    exchangeSelector,
    tokenSelector,
    web3Selector,
    balancesLoadingSelector,
    etherBalanceSelector,
    tokenBalanceSelector,
    exchangeEtherBalanceSelector,
    exchangeTokenBalanceSelector,
    etherDepositAmountSelector,
    etherWithdrawAmountSelector,
    tokenDepositAmountSelector,
    tokenWithdrawAmountSelector
} from '../store/selectors';
import {loadBalances} from '../store/interactions';
import {
    etherDepositAmountChange,
    etherWithdrawAmountChange,
    tokenDepositAmountChange,
    tokenWithdrawAmountChange
} from '../store/actions';
import {
    depositEther,
    withdrawEther,
    depositToken,
    withdrawToken
} from '../store/interactions';
import Spinner from './Spinner';

const ShowForm = () => {
    const dispatch = useDispatch();
    const etherBalance = useSelector(etherBalanceSelector);
    const exchangeEtherBalance = useSelector(exchangeEtherBalanceSelector);
    const tokenBalance = useSelector(tokenBalanceSelector);
    const exchangeTokenBalance = useSelector(exchangeTokenBalanceSelector);
    const etherDepositAmount = useSelector(etherDepositAmountSelector);
    const etherWithdrawAmount = useSelector(etherWithdrawAmountSelector);
    const tokenDepositAmount = useSelector(tokenDepositAmountSelector);
    const tokenWithdrawAmount = useSelector(tokenWithdrawAmountSelector);
    const exchange = useSelector(exchangeSelector);
    const token = useSelector(tokenSelector);
    const web3 = useSelector(web3Selector);
    const account = useSelector(accountSelector);
    return (
        <Tabs defaultActiveKey="deposit" className="bg-dark text-white">
            <Tab eventKey="deposit" title="Deposit" className="bg-dark">
                <table className="table table-dark table-sm small">
                    <thead>
                        <tr>
                            <th>Token</th>
                            <th>Wallet</th>
                            <th>Exchange</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>ETH</td>
                            <td>{etherBalance}</td>
                            <td>{exchangeEtherBalance}</td>
                        </tr>
                    </tbody>
                </table>
                <form className="row" onSubmit={(event) => {
                    event.preventDefault();
                    depositEther(dispatch, exchange, web3, etherDepositAmount, account);
                }}>
                    <div className="col-12 col-sm pr-sm-2">
                        <input 
                            type="text"
                            placeholder="ETH Amount"
                            onChange={(e) => dispatch(etherDepositAmountChange(e.target.value))}
                            className="form-control form-control-sm bg-dark text-white"
                            required
                        />
                    </div>
                    <div className="col-12 col-sm-auto pl-sm-0">
                        <button type="submit" className="btn btn-primary btn-block btn-sm">Deposit</button>
                    </div>
                </form>
                <table className="table table-dark table-sm small">
                    {/*<thead>
                        <tr>
                            <th>Token</th>
                            <th>Wallet</th>
                            <th>Exchange</th>
                        </tr>
                    </thead>*/}
                    <tbody>
                        <tr>
                            <td>R</td>
                            <td>{tokenBalance}</td>
                            <td>{exchangeTokenBalance}</td>
                        </tr>
                    </tbody>
                </table>

                <form className="row" onSubmit={(event) => {
                    event.preventDefault();
                    depositToken(dispatch, exchange, web3, token, tokenDepositAmount, account);
                }}>
                    <div className="col-12 col-sm pr-sm-2">
                        <input 
                            type="text"
                            placeholder="R Amount"
                            onChange={(e) => dispatch(tokenDepositAmountChange(e.target.value))}
                            className="form-control form-control-sm bg-dark text-white"
                            required
                        />
                    </div>
                    <div className="col-12 col-sm-auto pl-sm-0">
                        <button type="submit" className="btn btn-primary btn-block btn-sm">Deposit</button>
                    </div>
                </form>
            </Tab>
            <Tab eventKey="withdraw" title="Withdraw" className="bg-dark">
                <table className="table table-dark table-sm small">
                    <thead>
                        <tr>
                            <th>Token</th>
                            <th>Wallet</th>
                            <th>Exchange</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>ETH</td>
                            <td>{etherBalance}</td>
                            <td>{exchangeEtherBalance}</td>
                        </tr>
                    </tbody>
                </table>
                <form className="row" onSubmit={(event) => {
                    event.preventDefault();
                    withdrawEther(dispatch, exchange, web3, etherWithdrawAmount, account);
                }}>
                    <div className="col-12 col-sm pr-sm-2">
                        <input 
                            type="text"
                            placeholder="ETH Amount"
                            onChange={(e) => dispatch(etherWithdrawAmountChange(e.target.value))}
                            className="form-control form-control-sm bg-dark text-white"
                            required
                        />
                    </div>
                    <div className="col-12 col-sm-auto pl-sm-0">
                        <button type="submit" className="btn btn-primary btn-block btn-sm">Withdraw</button>
                    </div>
                </form>
                <table className="table table-dark table-sm small">
                    {/*<thead>
                        <tr>
                            <th>Token</th>
                            <th>Wallet</th>
                            <th>Exchange</th>
                        </tr>
                    </thead>*/}
                    <tbody>
                        <tr>
                            <td>R</td>
                            <td>{tokenBalance}</td>
                            <td>{exchangeTokenBalance}</td>
                        </tr>
                    </tbody>
                </table>
                <form className="row" onSubmit={(event) => {
                    event.preventDefault();
                    withdrawToken(dispatch, exchange, web3, token, tokenWithdrawAmount, account);
                }}>
                    <div className="col-12 col-sm pr-sm-2">
                        <input 
                            type="text"
                            placeholder="R Amount"
                            onChange={(e) => dispatch(tokenWithdrawAmountChange(e.target.value))}
                            className="form-control form-control-sm bg-dark text-white"
                            required
                        />
                    </div>
                    <div className="col-12 col-sm-auto pl-sm-0">
                        <button type="submit" className="btn btn-primary btn-block btn-sm">Withdraw</button>
                    </div>
                </form>
            </Tab>
        </Tabs>
    );
}

const Balance = () => {
    const dispatch = useDispatch();
    const account = useSelector(accountSelector);
    const exchange = useSelector(exchangeSelector);
    const token = useSelector(tokenSelector);
    const web3 = useSelector(web3Selector);
    // balances
    const balancesLoading = useSelector(balancesLoadingSelector);
    useEffect(() => {
        const loadBlockchainData = async () => {
            loadBalances(dispatch, web3, exchange, token, account);
        }

        loadBlockchainData();
    }, []);

    return (
        <div className="card bg-dark text-white">
            <div className="card-header">
                Balance
            </div>
            <div className="card-body">
                {!balancesLoading ? <ShowForm /> : <Spinner />}
            </div>
        </div>
    );
}

export default Balance;
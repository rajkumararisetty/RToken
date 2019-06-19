import React, {useEffect} from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {loadAllOrders, subscribeToEvents} from '../store/interactions';
import {exchangeSelector, web3Selector, tokenSelector, accountSelector} from '../store/selectors';
import Trades from './Trades';
import OrderBook from './OrderBook';
import MyTransactions from './MyTransactions';
import PriceChart from './PriceChart';
import Balance from './Balance';

const Content = () => {
    const dispatch = useDispatch();
    const exchange = useSelector(exchangeSelector);
    const web3 = useSelector(web3Selector);
    const token = useSelector(tokenSelector);
    const account = useSelector(accountSelector);
    useEffect(() => {
        const loadOrders = async () => {
            await loadAllOrders(exchange, dispatch);
            await subscribeToEvents(dispatch, web3, exchange, token, account)
        }

        loadOrders();
    }, []);
	return (
		<div className="content">
            <div className="vertical-split">
	            <Balance />
	            <div className="card bg-dark text-white">
	                <div className="card-header">
	                    Card Title
	                </div>
	                <div className="card-body">
	                    <p className="card-text">Some quick example text to build on the card title and make up the bulk of the card's content.</p>
	                    <a href="/#" className="card-link">Card link</a>
	                </div>
	            </div>
            </div>
            <OrderBook />
            <div className="vertical-split">
                <PriceChart />
                <MyTransactions />
            </div>
            <Trades />
        </div>
	);
};

export default Content;

import React from 'react';
import {useSelector} from 'react-redux';
import {Tabs, Tab} from 'react-bootstrap';
import {
    myFilledOrdersLoadedSelector, 
    myFilledOrdersSelector, 
    myOpenOrdersLoadedSelector, 
    myOpenOrderSelector
} from '../store/selectors';
import Spinner from './Spinner';

const createMyFilledOrders = (orders) => {
    return (
        <tbody>
            {orders.map(order => {
                return(
                    <tr key={order.id}>
                        <td className="text-muted">{order.formattedTimeStamp}</td>
                        <td className={`text-${order.orderTypeClass}`}>{order.orderSign}{order.tokenAmount}</td>
                        <td className={`text-${order.orderTypeClass}`}>{order.tokenPrice}</td>
                    </tr>
                )
            })}
        </tbody>
    );
}

const createMyOpenOrders = (orders) => {
    return (
        <tbody>
            {orders.map(order => {
                return (
                    <tr key={order.id}>
                        <td className={`text-${order.orderTypeClass}`}>{order.tokenAmount}</td>
                        <td className={`text-${order.orderTypeClass}`}>{order.tokenPrice}</td>
                        <td className="text-muted">x</td>
                    </tr>
                )
            })}
        </tbody>
    );
}

const MyTransactions = () => {
    const showMyFilledOrders = useSelector(myFilledOrdersLoadedSelector);
    const myFilledOrders = useSelector(myFilledOrdersSelector);
    const showMyOpenOrders = useSelector(myOpenOrdersLoadedSelector);
    const myOpenOrders = useSelector(myOpenOrderSelector);
    return (
        <div className="card bg-dark text-white">
            <div className="card-header">
              My Transactions
            </div>
            <div className="card-body">
                <Tabs defaultActiveKey="trades" className="bg-dark text-white">
                    <Tab eventKey="trades" title="Trades" className="bg-dark">
                        <table className="table table-dark table-sm small">
                            <thead>
                                <tr>
                                    <th>Time</th>
                                    <th>R</th>
                                    <th>R/ETH</th>
                                </tr>
                            </thead>
                            {showMyFilledOrders ? createMyFilledOrders(myFilledOrders) : <Spinner type="table" />}
                        </table>
                    </Tab>
                    <Tab eventKey="orders" title="Orders">
                        <table className="table table-dark table-sm small">
                            <thead>
                                <tr>
                                    <th>Amount</th>
                                    <th>R/ETH</th>
                                    <th>Cancel</th>
                                </tr>
                            </thead>
                            {showMyOpenOrders ? createMyOpenOrders(myOpenOrders) : <Spinner type="table" />}
                        </table>
                    </Tab>
                </Tabs>
            </div>
        </div>
    );
}

export default MyTransactions;
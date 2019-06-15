import React from 'react';
import {useSelector} from 'react-redux';
import {orderBookSelector, orderBookLoadedSelector} from '../store/selectors';
import Spinner from './Spinner';

const renderOrder = (order) => {
    return (
        <tr key={order.id}>
            <td>{order.tokenAmount}</td>
            <td className={`text-${order.orderTypeClass}`}>{order.tokenPrice}</td>
            <td>{order.etherAmount}</td>
        </tr>
    );
}

const constructOrderBook = (orderBook) => {
    return (
        <tbody>
            {orderBook.sellOrders.map(order => renderOrder(order))}
            <tr>
                <th>T</th>
                <th>R/ETH</th>
                <th>ETH</th>
            </tr>
            {orderBook.buyOrders.map(order => renderOrder(order))}
        </tbody>)
}

const OrderBook = () => {
    const showOrderBook = useSelector(orderBookLoadedSelector);
    const orderBook = useSelector(orderBookSelector);
    return (
        <div className="vertical">
            <div className="card bg-dark text-white">
                <div className="card-header">
                    Order Book
                </div>
                <div className="card-body order-book">
                    <table className="table table-dark table-sm small">
                        {showOrderBook ? constructOrderBook(orderBook) : <Spinner type="table" />}
                    </table>
                </div>
            </div>
        </div>
    );
}

export default OrderBook;
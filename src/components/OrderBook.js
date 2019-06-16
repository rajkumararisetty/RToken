import React from 'react';
import {useSelector, useDispatch} from 'react-redux';
import {OverlayTrigger, Tooltip} from 'react-bootstrap';
import {
    orderBookSelector,
    orderBookLoadedSelector,
    accountSelector,
    exchangeSelector,
    orderFillingSelector
} from '../store/selectors';
import {fillOrder} from '../store/interactions';
import Spinner from './Spinner';

const renderOrder = (order, dispatch, exchange, account) => {
    return (
        <OverlayTrigger
            key={order.id}
            placement='auto'
            overlay={
                <Tooltip id={order.id}>
                    {`Click here to ${order.orderFillAction}`}
                </Tooltip>
            }
        >
            <tr 
                key={order.id}
                className="order-book-order"
                onClick={() => fillOrder(dispatch, exchange, order.id, account)}
            >
                <td>{order.tokenAmount}</td>
                <td className={`text-${order.orderTypeClass}`}>{order.tokenPrice}</td>
                <td>{order.etherAmount}</td>
            </tr>
        </OverlayTrigger>
    );
}

const constructOrderBook = (orderBook, dispatch, exchange, account) => {
    return (
        <tbody>
            {orderBook.sellOrders.map(order => renderOrder(order, dispatch, exchange, account))}
            <tr>
                <th>T</th>
                <th>R/ETH</th>
                <th>ETH</th>
            </tr>
            {orderBook.buyOrders.map(order => renderOrder(order, dispatch, exchange, account))}
        </tbody>
    );
}

const OrderBook = () => {
    const showOrderBook = useSelector(orderBookLoadedSelector);
    const orderBook = useSelector(orderBookSelector);
    const dispatch = useDispatch();
    const exchange = useSelector(exchangeSelector);
    const account = useSelector(accountSelector);
    const orderFilling = useSelector(orderFillingSelector);
    return (
        <div className="vertical">
            <div className="card bg-dark text-white">
                <div className="card-header">
                    Order Book
                </div>
                <div className="card-body order-book">
                    <table className="table table-dark table-sm small">
                        {showOrderBook || !orderFilling ? constructOrderBook(orderBook, dispatch, exchange, account) : <Spinner type="table" />}
                    </table>
                </div>
            </div>
        </div>
    );
}

export default OrderBook;
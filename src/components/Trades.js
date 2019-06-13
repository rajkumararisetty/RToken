import React from 'react';
import {useSelector} from 'react-redux';
import {filledOrdersLoadedSelector, filledOrdersSelector} from '../store/selectors';
import Spinner from './Spinner';

const showFilldedOrders = (filledOrders) => {
    return (
        <tbody>
            {filledOrders.map(order => {
                return (
                    <tr key={order.id}>
                        <td className="text-muted">{order.formattedTimeStamp}</td>
                        <td>{order.tokenAmount}</td>
                        <td className={`text-${order.tokenPriceClass}`}>{order.tokenPrice}</td>
                    </tr>
                )
            })}
        </tbody>)
}

const Trades = () => {
    const filledOrdersLoaded = useSelector(filledOrdersLoadedSelector);
    const filledOrders = useSelector(filledOrdersSelector);
    return (
        <div className="vertical">
            <div className="card bg-dark text-white">
                <div className="card-header">
                    Trades
                </div>
                <div className="card-body">
                    <table className="table table-dark table-sm small">
                        <thead>
                            <tr>
                                <th>Time</th>
                                <th>R</th>
                                <th>R/ETH</th>
                            </tr>
                        </thead>
                        {filledOrdersLoaded ? showFilldedOrders(filledOrders) : <Spinner type="table" />}
                    </table>
                </div>
            </div>
        </div>
    );
}

export default Trades;

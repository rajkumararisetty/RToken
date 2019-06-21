import React from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {Tabs, Tab} from 'react-bootstrap';
import {
    exchangeSelector,
    tokenSelector,
    accountSelector,
    web3Selector,
    buyOrderSelector,
    sellOrderSelector
} from '../store/selectors';
import {
    buyOrderAmountChanged,
    buyOrderPriceChanged,
    sellOrderAmountChanged,
    sellOrderPriceChanged
} from '../store/actions';
import Spinner from './Spinner';

import {makeSellOrder, makeBuyOrder} from '../store/interactions';

const ShowForm = () => {
    const dispatch = useDispatch();
    const account = useSelector(accountSelector);
    const exchange = useSelector(exchangeSelector);
    const token = useSelector(tokenSelector);
    const web3 = useSelector(web3Selector);
    const buyOrder = useSelector(buyOrderSelector);
    const sellOrder = useSelector(sellOrderSelector);
    const showBuyTotal = buyOrder.amount && buyOrder.price;
    const showSellTotal = sellOrder.amount && sellOrder.price;
    return (
        <Tabs defaultActiveKey="buy" className="bg-dark text-white">
            <Tab eventKey="buy" title="Buy" className="bg-dark">
                <form
                    onSubmit={(event) => {
                        event.preventDefault()
                        makeBuyOrder(dispatch, exchange, token, web3, buyOrder, account);
                    }}
                >
                    <div className="form-group small">
                        <label>Buy Amount(R)</label>
                        <div className="input-group">
                            <input
                                type="text"
                                className="form-control form-control-sm bg-dark text-white"
                                placeholder="Buy Amount"
                                onChange={(e) => dispatch(buyOrderAmountChanged(e.target.value))}
                                required
                            />
                        </div>
                    </div>
                    <div className="form-group small">
                        <label>Buy Price(E)</label>
                        <div className="input-group">
                            <input
                                type="text"
                                className="form-control form-control-sm bg-dark text-white"
                                placeholder="Buy Price"
                                onChange={(e) => dispatch(buyOrderPriceChanged(e.target.value))}
                                required
                            />
                        </div>
                    </div>
                    <button type="submit" className="btn btn-primary btn-sm btn-block">Buy Order</button>
                    {showBuyTotal && <small>Total: {buyOrder.amount * buyOrder.price} ETH</small>}
                </form>
            </Tab>
            <Tab eventKey="sell" title="Sell" className="bg-dark">
                <form
                    onSubmit={(event) => {
                        event.preventDefault()
                        makeSellOrder(dispatch, exchange, token, web3, sellOrder, account);
                    }}
                >
                    <div className="form-group small">
                        <label>Sell Amount(R)</label>
                        <div className="input-group">
                            <input
                                type="text"
                                className="form-control form-control-sm bg-dark text-white"
                                placeholder="Sell Amount"
                                onChange={(e) => dispatch(sellOrderAmountChanged(e.target.value))}
                                required
                            />
                        </div>
                    </div>
                    <div className="form-group small">
                        <label>Sell Price</label>
                        <div className="input-group">
                            <input
                                type="text"
                                className="form-control form-control-sm bg-dark text-white"
                                placeholder="Sell Price"
                                onChange={(e) => dispatch(sellOrderPriceChanged(e.target.value))}
                                required
                            />
                        </div>
                    </div>
                    <button type="submit" className="btn btn-primary btn-sm btn-block">Sell Order</button>
                    {showSellTotal && <small>Total: {sellOrder.amount * sellOrder.price} ETH</small>}
                </form>
            </Tab>
        </Tabs>
    );
}

const NewOrder = () => {
    const buyOrder = useSelector(buyOrderSelector);
    const sellOrder = useSelector(sellOrderSelector);
    const showForm = !buyOrder.making && !sellOrder.making;
    return (
        <div className="card bg-dark text-white">
            <div className="card-header">
                Card Title
            </div>
            <div className="card-body">
                {showForm ? <ShowForm /> : <Spinner />}
            </div>
        </div>
    );
};

export default NewOrder;

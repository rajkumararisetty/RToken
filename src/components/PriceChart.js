import React from 'react';
import {useSelector} from 'react-redux';
import Chart from 'react-apexcharts';
import Spinner from './Spinner';
import {chartOptions} from '../PriceChart.config.js'
import {priceChartLoadedSelector, priceChartSelector} from '../store/selectors';

const priceSymbol = (lastPriceChange) => {
    if (lastPriceChange === '+') {
        return <span className="text-success">&#9650;</span> // Green upper triangle
    }
    return <span className="text-danger">&#9660;</span> // Red downward triangle
}

const ShowPriceChart = (priceChartData) => {
    return (
        <div className="price-chart">
            <div className="price">
                <h4>R/ETH &nbsp; {priceSymbol(priceChartData.lastPriceChange)} &nbsp; {priceChartData.lastPrice}</h4>
            </div>
            <Chart options={chartOptions} series={priceChartData.series} type='candlestick' width='100%' height='100%' />
        </div>
    );
}

const PriceChart = () => {
    const showPriceChartData = useSelector(priceChartLoadedSelector);
    const priceChartData = useSelector(priceChartSelector);
    return (
        <div className="card bg-dark text-white">
            <div className="card-header">
                Price Chart
            </div>
            <div className="card-body">
                {showPriceChartData ? ShowPriceChart(priceChartData) : <Spinner />}
            </div>
        </div>
    );
}

export default PriceChart;
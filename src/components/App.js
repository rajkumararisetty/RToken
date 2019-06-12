import React, { useEffect } from 'react';
import './App.css';
import Navbar from './Navbar';
import Content from './Content';
import {loadWeb3, loadAccount, loadTokenn, loadExchange} from '../store/interactions';
import { useDispatch, useSelector } from 'react-redux';
import {contractsLoadedSelector} from '../store/selectors';

const App = () => {
    const dispatch = useDispatch();
    // Effect for loading the blockchain data
    const contractLoaded = useSelector(contractsLoadedSelector);
    useEffect(() => {
        const loadBlockchainData = async () => {
            const web3 = loadWeb3(dispatch);
            await loadAccount(web3, dispatch);
            const networkId = await web3.eth.net.getId();
            const token = await loadTokenn(web3, networkId, dispatch);
            if (!token) {
                window.alert('Contract is not deployed to the current network. Please select another network with metamask');
                return;
            }
            const exchange = await loadExchange(web3, networkId, dispatch);
            if (!exchange) {
                window.alert('Contract is not deployed to the current network. Please select another network with metamask');
                return;
            }
        };

        loadBlockchainData();
    }, []);
    return (
        <>
            <Navbar />
            {contractLoaded ? <Content /> : <div className="content" />}
        </>
        );
}

export default App;

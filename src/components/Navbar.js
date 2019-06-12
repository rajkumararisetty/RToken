import React from 'react';
import {useSelector} from 'react-redux';
import {accountSelector} from '../store/selectors';

const Navbar = () => {
    const account = useSelector(accountSelector);
    return (
        <nav className="navbar navbar-expand-lg navbar-dark bg-primary">
            <a className="navbar-brand" href="#/">R-Token</a>
            <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNavDropdown" aria-controls="navbarNavDropdown" aria-expanded="false" aria-label="Toggle navigation">
                <span className="navbar-toggler-icon"></span>
            </button>
            <ul className="navbar-nav ml-auto">
                <li className="nav-item">
                    <a
                      className="nav-link small"
                      href={`https://etherscan.io/address/${account}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                        {account}
                    </a>
                </li>
            </ul>
        </nav>
    );
}

export default Navbar;
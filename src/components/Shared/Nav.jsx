import React, {useState} from 'react';

import './Nav.css';
import logo from './files/logo.png';

function Nav() {

    const [connectionStatus, SetConnectionStatus] = useState("connect wallet");

    return (
        <div className="nav">
            <a className="nav-logo" href="./">
                <img src={logo} alt="logo" />
                <h2>Credentials</h2>
            </a>

            <div className="nav-section">
                <a className="nav-link" href="./owner">owner</a>
                <a className="nav-link" href="./holder">holder</a>
                <a className="nav-link" href="./verifier">verifier</a>

                <button className="nav-connection"> {connectionStatus} </button>
            </div>
        </div>
    );
}

export default Nav;
import React, {useState} from 'react';

import './Nav.css';
import logo from './files/logo.png';

function Nav(props) {

    const [connectionStatus, SetConnectionStatus] = useState("connect wallet");

    function connectWallet() {
        SetConnectionStatus("connecting...");

        props.connect()
            .then(() => {
                SetConnectionStatus("connected!");
            })
            .catch(() => {
                SetConnectionStatus("error");
            });
    }

    return (
        <div className="nav">
            <a className="nav-logo" onClick={() => props.SetPageRoute("start")}>
                <img src={logo} alt="logo" />
                <h2>Credentials</h2>
            </a>

            <div className="nav-section">
                <a className="nav-link" onClick={() => props.SetPageRoute("owner")}>owner</a>
                <a className="nav-link" onClick={() => props.SetPageRoute("holder")}>holder</a>
                <a className="nav-link" onClick={() => props.SetPageRoute("verifier")}>verifier</a>

                <button onClick={connectWallet} className="nav-connection"> 
                    {connectionStatus} 
                </button>
            </div>
        </div>
    );
}

export default Nav;
import React, { useState } from 'react';

import './Issuer.css';

function Issuer() {

    const [issuerTabState, SetIssuerTabState] = useState("users");
    /**
     * @dev 
     * tabs
     * - users : shows list of all users
     * - data : shows data of a selected user
     */

    function handleState(state) {
        if(state === "data")
            SetIssuerTabState("data");
        else
            SetIssuerTabState("users");
    }

    return (
        <div className="issuer-body">
            {() => {
                if(issuerTabState === "users")
                    return <usersTab> </usersTab>
                else 
                    return <dataTab> </dataTab>
            }}
        </div>
    );
}

function usersTab() {
    return (
        <h1> 
            This is UserTab.
        </h1>
    );
}

function dataTab() {
    return (
        <h1> 
            This is dataTab.
        </h1>
    );
}

export default Issuer;
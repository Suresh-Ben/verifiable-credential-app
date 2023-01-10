import React, { useState } from 'react';

import './Issuer.css';

import notfound from './files/notfound.png';
import accepted from './files/tick.png';
import rejected from './files/rejected.png';
import pending from './files/pending.png';

const statusImg = [
    notfound,
    accepted,
    rejected,
    pending
];

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
            {issuerTabState === "users" ?
                <UsersTab> </UsersTab> : <DataTab> </DataTab>
            }
        </div>
    );
}

function UsersTab() {
    return (
        <h1> 
            This is UserTab.
        </h1>
    );
}

function DataTab() {
    return (
        <h1> 
            This is dataTab.
        </h1>
    );
}

function userItem(props) {
    return (
        <div className="user-item">
            <input className="user-id" value={props.id} type="text" disabled={true} />
            <img src={statusImg[props.status]} alt="status" />
        </div>
    );
}

export default Issuer;
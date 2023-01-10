import React, { useState } from 'react';

import './Holder.css';
import Sidebar from '../Shared/Home/Sidebar';

function Holder() {

    const [holderTabState, SetHolderTabState] = useState("data");
    /**
     * @dev 
     * tabs
     * - data - shows data to user and user and update data
     * - auth - user can handle data access to verifier
     */

    function handleState(state) {
        if(state === "auth")
            SetHolderTabState("auth");
        else
            SetHolderTabState("data");
    }

    const holderTabs =[
        {
            id : "data",
            status : "data",
            img : 0
        },
        {
            id : "auth",
            status : "auth",
            img : 1
        }
    ];

    return (
        <div className="holder-body">
            <Sidebar tabs={holderTabs} handle={handleState}> </Sidebar>
            {holderTabState === "data" ?
                <DataTab> </DataTab> : <AuthTab> </AuthTab>
            }
        </div>
    );
}

function DataTab() {
    return (
        <h1> 
            This is data tab.
        </h1>
    );
}

function AuthTab() {
    return (
        <h1> 
            This is auth tab.
        </h1>
    );
}

export default Holder;
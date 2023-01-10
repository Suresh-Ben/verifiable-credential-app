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

            <div className="holder-id">
                {"0xUVyjtukgehflseiulisghlu"}
            </div>

            {holderTabState === "data" ?
                <DataTab> </DataTab> : <AuthTab> </AuthTab>
            }
        </div>
    );
}

function DataTab() {

    const creds = [
        "name",
        "age",
        "college",
        "semester",
        "grade",
        "phone",
        "address"
    ];

    const [canUpdate, SetCanUpdate] = useState(false);

    function handleButton() {
        SetCanUpdate(true);
    }

    return (
        <div className="user-data">
            {creds.map((cred) => {
                return <InputArea 
                    key = {cred}
                    id = {cred}
                    type = {cred}
                    setUpdate={handleButton}
                > </InputArea>
            })}

            <div className="holder-button">
                <button disabled={!canUpdate} className="update-data">
                    Update Data
                </button>
            </div>
        </div>
    );
}

function AuthTab() {

    const creds = [
        "name",
        "age",
        "college",
        "semester",
        "grade",
        "phone",
        "address"
    ];
    const [buttonText, SetButtonText] = useState("update");

    function updateAccess(event) {
        event.preventDefault();

        console.log("access : " + event.target.accesstype.value);
        console.log("type : " + event.target.selectedtype.value);
        console.log("recipentid : " + event.target.recipentid.value);
    }
    function updateAccessState(event) {
        SetButtonText(event.target.value);
    }

    return (
        <div className="auth-section">

            <form onSubmit={updateAccess}>
                <input id="recipentid" type="text" placeholder="Enter recipent address" />
                <br /> 

                <label htmlFor="selectedtype">Select data type : </label>
                <select id="selectedtype">
                    {creds.map((cred) => {
                        return <option key={cred} value={cred} >{cred}</option>
                    })}
                </select>
                <br />

                <label htmlFor="accesstype">Select access : </label>
                <select id="accesstype" onChange={updateAccessState}>
                    <option value="update" > update </option>
                    <option value="revoke" > revoke </option>
                    <option value="check" > check </option>
                </select>
                <br />
                <button type="submit" className="update-data update-access">
                    {buttonText}
                </button>
                
            </form>

        </div>
    );
}

function InputArea(props) {

    function activateUpdate(data_type, event) {
        console.log(data_type + " : " + event.target.value);
        props.setUpdate();
    }

    return (
        <div id={props.id} className="input-area">
            <input className="data-type" type="text" value={props.type} disabled={true}/>
            <input className="data" type="text" onChange={(event) => {activateUpdate(props.type, event)}} />
        </div>
    );
}

export default Holder;
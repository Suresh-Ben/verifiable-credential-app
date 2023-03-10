import React, { useState } from 'react';
import axios from 'axios';
import fs from 'fs';

import './Verifier.css';
import reload from './files/reload.png';

console.log(fs);

function Verifier(props) {

    const [userStatusUpdate, SetUserStatusUpdate] = useState("");
    const [requestedUserId, SetRequestedUserId] = useState("");

    const creds = [
        "name",
        "age",
        "college",
        "semester",
        "grade",
        "phone",
        "address"
    ];

    async function fetchDetails(event) {
        event.preventDefault();
        SetUserStatusUpdate("fetching...!!");
        SetRequestedUserId(event.target.userid.value);
        
        const updatedStatus = await props.contract.getStatus( event.target.userid.value );
        if(updatedStatus === 0)
            SetUserStatusUpdate("User not found");
        else if(updatedStatus === 1)
            SetUserStatusUpdate("User status : pending");
        else if(updatedStatus === 2)
            SetUserStatusUpdate("User status : verfied");
        else if(updatedStatus === 3)
            SetUserStatusUpdate("User status : rejected");
    }

    return (
        <div className ="verifier-body">
            <div className="user-id">
                <form className="verifier-form" onSubmit={fetchDetails}>
                    <input type="text" id="userid" />

                    <button type="submit">
                        fetch details
                    </button>
                </form>

                <div className="userid-status">
                    {userStatusUpdate}
                </div>
            </div>

            <div className="user-data">
                {creds.map((cred) => {
                    return <InputArea 
                    key = {cred}
                    type = {cred}

                    contract={props.contract}
                    userId={requestedUserId}
                    address={props.address}
                > </InputArea>
                })}
            </div>
        </div>
    );
}

function InputArea(props) {

    const [reqUserData, SetreqUserData] = useState("");

    async function getData(hash) {
        let theData;

        await axios.get('https://ipfs.io/ipfs/' + hash, {timeout: 1000})
            .then((response) => {
                console.log(response.data);
                theData = response.data;
            })
            .catch(async (err) => {
                
                await axios.get('https://cloudflare-ipfs.com/ipfs/' + hash, {timeout: 1000})
                    .then((response) => {
                        console.log(response.data);
                        theData = response.data;
                    })
                    .catch(async (err) => {
                        await axios.get('https://ipfs.eth.aragon.network/ipfs/' + hash)
                            .then((response) => {
                                console.log(response.data);
                                theData = response.data;
                            })
                            .catch((err) => {
                                console.log(err);
                            })
                    })
            })

        return theData;
    }

    async function updateReqUserData() {
        const access = await props.contract.check_consent(props.userId, props.type, props.address);

        if(!access) {
            SetreqUserData("*** this data is not allowed ***");
            return;
        }

        const reqDataHash = await props.contract.getCredits(props.userId, props.type);
        console.log(props.type + " : " + reqDataHash);
        
        const reqData = await getData(reqDataHash);
        SetreqUserData(reqData.data);
    }

    return (
        <div id={props.id} className="input-area">
            <input className="data-type" type="text" value={props.type} disabled={true}/>
            <input className="data" type="text" disabled={true} value={reqUserData}/>
            <img onClick={updateReqUserData} className="reload-id" src={reload} alt="reload" />
        </div>
    );
}

export default Verifier;
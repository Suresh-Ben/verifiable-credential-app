import React, { useState, useEffect } from 'react';
import axios from 'axios';
import fs from 'fs';

import './Issuer.css';

import notfound from './files/notfound.png';
import accepted from './files/tick.png';
import rejected from './files/rejected.png';
import pending from './files/pending.png';

const statusImg = [
    notfound,
    pending,
    accepted,
    rejected
];

console.log(fs);

function Issuer(props) {

    const [ selectedUser, SetSelectedUser ] = useState("");
    const [issuerTabState, SetIssuerTabState] = useState("users");
    /**
     * @dev 
     * tabs
     * - users : shows list of all users
     * - data : shows data of a selected user
     */

    function openUserDetails(selectedUserId) {
        SetSelectedUser(selectedUserId);
        SetIssuerTabState("data");
    }

    function backToUsers() {
        SetSelectedUser(null);
        SetIssuerTabState("users");
    }


    return (
        <div className="issuer-body">
            {issuerTabState === "users" ?
                <UsersTab SetSelectedUser={openUserDetails} contract={props.contract} > </UsersTab> : <DataTab backToUsers={backToUsers} selectedUser={selectedUser} contract={props.contract}> </DataTab>
            }
        </div>
    );
}

function UsersTab(props) {
    
    const [ usersArray, SetUsersArray ] = useState([]);
    

    async function getAllUsers() {
        try {
            const allUsers = await props.contract.getAllUserIds();
            SetUsersArray(allUsers);
        }
        catch {
            console.log("you are not owner|Issuer");
        }
    }

    function SetSelectedUser(userIdSelected) {
        props.SetSelectedUser(userIdSelected);
    }

    return (
        <div className="users-list-body">
            <button className="load-users" onClick={getAllUsers}>
                Get All user Ids
            </button>

            {usersArray.map((userid) => {
                return <UserItem SetSelectedUser={SetSelectedUser} key={userid} contract={props.contract} id={userid}> </UserItem>
            })}
        </div>
    );
}

function DataTab(props) {

    const [selectedUserStatus, SetSelectedUserStatus] = useState("");

    const creds = [
        "name",
        "age",
        "college",
        "semester",
        "grade",
        "phone",
        "address"
    ];

    async function handleVerification(value) {
        SetSelectedUserStatus("updating status...!!!");
        let reciept = await props.contract.updateStatus(props.selectedUser ,value);
        await reciept.wait(1);
        SetSelectedUserStatus("updated status");
    }

    return (
        <div className="user-data">
            <button onClick={props.backToUsers} className="verifier-back">
                Go back!
            </button>
            {creds.map((cred) => {
                return <InputArea 
                    key = {cred}
                    type = {cred}

                    contract={props.contract}
                    userId={props.selectedUser}
                > </InputArea>
            })}

            <div className="owner-buttons">
                <button className="reject-button" onClick={() => handleVerification(false)}>
                    Rejected
                </button>
                
                <button className="verify-button" onClick={() => handleVerification(true)}>
                    Verified
                </button>
            </div>
            <br />
            <div className="mid-content">
                {selectedUserStatus}
            </div>
        </div>
    );
}

function UserItem(props) {

    const [ userStatus, SetUserStatus ] = useState(0);

    async function handleUserStatus() {
        if(!props.contract) {
            console.log("plese connect wallet");
            return;
        }
        
        let tempStatus = await props.contract.getStatus(props.id);
        SetUserStatus(tempStatus);
    }
    
    useEffect(() => {
        handleUserStatus();
    }, []);

    return (
        <div className="user-item">
            <button onClick={() => {props.SetSelectedUser(props.id)}} className="user-id" type="text">
                {props.id}
            </button>
            <img src={statusImg[userStatus]} alt="status" />
        </div>
    );
}

function InputArea(props) {

    const [userData, SetUserData] = useState("");

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

    async function handleUserData() {
        if(!props.contract) {
            console.log("plese connect wallet");
            return;
        }
        
        let tempUserDataHash = await props.contract.getCredits(props.userId, props.type);
        console.log(props.type + " : " + tempUserDataHash);

        let tempUserData = await getData(tempUserDataHash);
        SetUserData(tempUserData.data);
    }
    
    useEffect(() => {
        handleUserData();
    }, []);

    return (
        <div id={props.id} className="input-area">
            <input className="data-type" type="text" value={props.type} disabled={true}/>
            <input className="data" type="text" disabled={true} value={userData}/>
        </div>
    );
}

export default Issuer;
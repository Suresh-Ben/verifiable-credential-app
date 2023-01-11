import React, { useState, useEffect } from 'react';

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


    return (
        <div className="issuer-body">
            {issuerTabState === "users" ?
                <UsersTab SetSelectedUser={openUserDetails} contract={props.contract} > </UsersTab> : <DataTab selectedUser={selectedUser} contract={props.contract}> </DataTab>
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
            {selectedUserStatus}
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

    async function handleUserData() {
        if(!props.contract) {
            console.log("plese connect wallet");
            return;
        }
        
        let tempUserData = await props.contract.getCredits(props.userId, props.type);
        SetUserData(tempUserData);
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
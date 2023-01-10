import React, { useState } from 'react';

import './Holder.css';
import reload from './files/reload.png';
import Sidebar from '../Shared/Home/Sidebar';

function Holder(props) {

    const [userId, SetUserId] = useState("");
    const [contract, SetContract] = useState(null);
    const [updateError, SetUpdateError] = useState("");

    const [holderTabState, SetHolderTabState] = useState("data");
    /**
     * @dev 
     * tabs
     * - data - shows data to user and user and update data
     * - auth - user can handle data access to verifier
     */

    async function updateId() {
        if(!props.contract) return;
        SetContract(props.contract);
        
        if(contract)
        {
            const tempUserId = await contract.getUserId();
            SetUserId(tempUserId);
        }
    }

    async function updateCredits(data_type, data)
    {
        SetUpdateError("updating data...!!!");

        if(!contract)
            SetContract(props.contract);
        
        if(contract){
            const recipet = await contract.updateCredits(data_type, data);
            await recipet.wait(1);
            SetUpdateError("updated data successfully...!!!");
        }
        else
            SetUpdateError("please connect wallet...!!!")
    }
      

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
                {"user id : " + userId}
                <img onClick={updateId} className="reload-id" src={reload} alt="reload" />
            </div>

            {holderTabState === "data" ?
                <DataTab userId={userId} contract={contract} updateError={updateError} updateCredits={updateCredits}> </DataTab> 
                : <AuthTab userId={userId} contract={contract} > </AuthTab>
            }
        </div>
    );
}

function DataTab(props) {

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
    const [updatedTypes, SetUpdatedTypes] = useState([]);
    const [updatedData, SetUpdatedData] = useState([]);
    const [updatedDataObj, SetUpdatedDataObj] = useState({});

    function handleButton() {
        SetCanUpdate(true);
    }

    function updateCredits() {
        for (let key in updatedDataObj) {
            let tempTypes = updatedTypes;
            tempTypes.push(key);
            SetUpdatedTypes(tempTypes);

            let tempData = updatedData;
            tempData.push(updatedDataObj[key]);
            SetUpdatedData(tempData);
        }
        
        console.log("data types : " + updatedTypes);
        console.log("data : " + updatedData);

        props.updateCredits(updatedTypes, updatedData);
    }

    return (
        <div className="user-data">
            {creds.map((cred) => {
                return <InputArea 
                    key = {cred}
                    id = {cred}
                    type = {cred}
                    setUpdate={handleButton}

                    updatedDataObj={updatedDataObj}
                    SetUpdatedDataObj={SetUpdatedDataObj}

                    contract={props.contract}
                    userId={props.userId}
                > </InputArea>
            })}

            <div className="holder-button">
                <button onClick={updateCredits} disabled={!canUpdate} className="update-data">
                    Update Data
                </button>
            </div>
            {props.updateError}
        </div>
    );
}

function AuthTab(props) {

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
    const [accessCheck, SetAccessCheck] = useState("");

    async function updateAccess(event) {
        event.preventDefault();
        SetAccessCheck("connecting...!!!");

        const recipentid = event.target.recipentid.value;
        const selectedtype = event.target.selectedtype.value;
        const accessType = event.target.accesstype.value;

        if(!props.userId || !props.contract) {
            console.log("update id...");
            return;
        }

        if(accessType === "update") {
            const reciept = await props.contract.give_consent(props.userId, selectedtype, recipentid);
            await reciept.wait(1);
        }
        else if(accessType === "revoke") {
            const reciept = await props.contract.revoke_consent(props.userId, selectedtype, recipentid);
            await reciept.wait(1);
        }
        else if(accessType === "check"){
            const checkstatus = await props.contract.check_consent(props.userId, selectedtype, recipentid);
            
            if(checkstatus)
                SetAccessCheck("access given to this recipent");
            else
                SetAccessCheck("no access given to this recipent");

            return;
        }

        SetAccessCheck("access updated");
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
                {accessCheck}
            </form>

        </div>
    );
}

function InputArea(props) {

    const [myData, SetMyData] = useState("");

    function activateUpdate(data_type, event) {

        SetMyData(event.target.value);
        let tempObj = props.updatedDataObj;
        tempObj[data_type] = event.target.value;
        props.SetUpdatedDataObj(tempObj);

        props.setUpdate();
    }

    async function updateMyData() {

        if(!props.userId || !props.contract) {
            console.log("update id...");
            return;
        }
        const tempMyData = await props.contract.getCredits(props.userId, props.type);
        SetMyData(tempMyData);

        console.log(myData);
    }

    return (
        <div id={props.id} className="input-area">
            <input className="data-type" type="text" value={props.type} disabled={true}/>
            <input value={myData} className="data" type="text" onChange={(event) => {activateUpdate(props.type, event)}} />
            <img onClick={updateMyData} className="reload-id" src={reload} alt="reload" />
        </div>
    );
}

export default Holder;
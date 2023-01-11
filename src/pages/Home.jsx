import React, { useState } from 'react';
import { ethers } from 'ethers';
import Credits from './Credits.json';

import Nav from '../components/Shared/Nav';
import About from '../components/Shared/About';

import Start from '../components/Home/Start';
import Issuer from '../components/Home/Issuer';
import Holder from '../components/Home/Holder';
import Verifier from '../components/Home/Verifier';

function Home(props) {

    const [address, SetAddress] = useState("");
    const [contract, SetContract] = useState(null);
    const [connectionError, SetConnectionError] = useState("");

    async function connectWallet() {
        let provider = await new ethers.providers.Web3Provider(window.ethereum);

        if(provider) {
            await provider.send("eth_requestAccounts",[]);
            const signer = await provider.getSigner();
            const accountAddress = await signer.getAddress();
            SetAddress(accountAddress);

            const contractAddress = "0x9e03876A0850d8597c16F70c5D69204c1a3882f1";
            let CreditsContract = await new ethers.Contract(
                contractAddress,
                Credits.abi,
                signer
            );
            SetContract(CreditsContract);
            console.log(contract);
        }
        else
            SetConnectionError("Metamask is not installed...!!!");
    }

    return (
        <div className="home">
            <Nav connect={connectWallet}> </Nav>
            <p style={{color : "red"}}>
                {connectionError}
            </p>

            {props.id === "start" ? 
                <Start> </Start> : 
                (props.id === "owner" ?
                    <Issuer contract={contract} > </Issuer> : 
                    (props.id === "holder" ? 
                        <Holder contract={contract} > </Holder> :
                        (props.id === "verifier" ? 
                            <Verifier address={address} contract={contract} > </Verifier> :
                            <h1> 
                                404 Notfound
                            </h1>)))
            }

            <About> </About>
        </div>
    );
}

export default Home;
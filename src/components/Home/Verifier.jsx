import React from 'react';

import './Verifier.css';

function Verifier() {

    function fetchDetails() {
        console.log("fetching...!!!");
    }

    return (
        <div class ="verifier-body">
            <div className="user-id">
                <form className="verifier-form" onSubmit={fetchDetails}>
                    <input type="text" id="userid" />

                    <button type="submit">
                        fetch details
                    </button>
                </form>

                <div className="userid-status">
                    {"status of the userId"}
                </div>
            </div>

            <div className="user-details">
                
            </div>
        </div>
    );
}

export default Verifier;
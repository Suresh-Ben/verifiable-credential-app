import React from 'react';

import './Start.css';

function Start(props) {
    return (
        <div className="start-body">
            <div>
                <h2>Welcome to verifiable cerdential application</h2><br />
                <p>
                    create your credentials, <a style={{color : "blue"}} onClick={() => props.SetPageRoute("holder")}>get your ID.</a>
                </p>
            </div>
        </div>
    );
}   

export default Start;
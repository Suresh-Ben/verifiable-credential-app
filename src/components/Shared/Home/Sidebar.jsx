import React from 'react';

import './Sidebar.css';

import data from '../files/data.png'
import auth from '../files/auth.png'

const sideImgs = [
    data, 
    auth
];

function Sidebar(props) {
    return (
        <div className="sidebar">
            {props.tabs.map((obj) => {
                return <Link handle={props.handle} id={obj.id} status={obj.status} img={obj.img} alt={obj.id}> </Link>
            })}
        </div>
    );
}

function Link(props) {
    return (
        <a className="sidebar-link" onClick={() => props.handle(props.status)}>
            <img src={sideImgs[props.img]} alt={props.alt} />
        </a>
    );
}

export default Sidebar;
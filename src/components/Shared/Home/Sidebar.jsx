import React from 'react';

function Sidebar(props) {
    return (
        <div className="sidebar">
            {props.links.map((obj) => {
                <Link link={obj.link} img={obj.img} alt={obj.alt}> </Link>
            })}
        </div>
    );
}

function Link(props) {
    return (
        <a className="sidebar-link" href={props.link}>
            <img src={props.img} alt={props.alt} />
        </a>
    );
}

export default Sidebar;
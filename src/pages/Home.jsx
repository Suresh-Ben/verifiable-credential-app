import React from 'react';
import { BrowserRouter as Router, Route, Routes as Switch } from 'react-router-dom';

import Nav from '../components/Shared/Nav';
import About from '../components/Shared/About';

import Start from '../components/Home/Start';
import Issuer from '../components/Home/Issuer';
import Holder from '../components/Home/Holder';
import Verifier from '../components/Home/Verifier';

function Home() {
    return (
        <div className="home">
            <Nav> </Nav>

            <Router>
                <Switch>
                    <Route path="/" element={<Start />} exact/>
                    <Route path="/owner" element={<Issuer />} exact/>
                    <Route path="/holder" element={<Holder />} exact/>
                    <Route path="/verifier" element={<Verifier />} exact/>
                </Switch>
            </Router>

            <About> </About>
        </div>
    );
}

export default Home;
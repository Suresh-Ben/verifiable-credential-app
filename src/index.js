import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router, Route, Routes as Switch } from 'react-router-dom';

import './index.css';
import Start from './pages/Start';
import Issuer from './pages/Issuer';
import Holder from './pages/Holder';
import Verifier from './pages/Verifier';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <Router>
        <Switch>
            <Route path="/" element={<Start />} />
            <Route path="/owner" element={<Issuer />} />
            <Route path="/holder" element={<Holder />} />
            <Route path="/verifier" element={<Verifier />} />
        </Switch>
    </Router>
);


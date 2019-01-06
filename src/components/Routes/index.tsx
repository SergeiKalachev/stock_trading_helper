import * as React from 'react';
import { Route, Switch, Redirect } from "react-router-dom";

import Main from '../../pages/Main';
import Instruction from '../../pages/Instruction';
import Contacts from '../../pages/Contacts';
import FooteredRoute from '../../components/FooteredRoute';

import './styles.scss';

export default () => (
    <div className="page">
        <Switch>
            <FooteredRoute exact path="/" component={Main} />
            <Route exact path="/instruction" component={Instruction} />
            <Route exact path="/contacts" component={Contacts} />
            <Redirect to="/" />
        </Switch>
    </div>
)

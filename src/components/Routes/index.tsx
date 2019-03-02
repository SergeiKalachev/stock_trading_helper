import * as React from 'react';
import { Route, Switch, Redirect } from 'react-router-dom';

import Main from '../../pages/Main';
import Instruction from '../../pages/Instruction';
import FooteredRoute from '../../components/FooteredRoute';

import './styles.scss';

export default () => (
    <div className='page'>
        <Switch>
            <FooteredRoute exact={true} path='/' component={Main} />
            <Route exact={true} path='/instruction' component={Instruction} />
            <Redirect to='/' />
        </Switch>
    </div>
);

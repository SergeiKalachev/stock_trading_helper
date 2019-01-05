import * as React from 'react';
import { Route, Switch, Redirect } from "react-router-dom";
import cn from 'classnames';

import Main from '../../pages/Main';

import './styles.scss';

const Footer: React.FunctionComponent<{ className?: String }> = ({ className }) => (
    <div className={cn('body', className)}>
        <Switch>
            <Route exact path="/" component={Main} />
            <Redirect to="/" />
        </Switch>
    </div>
)

export default Footer;

import * as React from 'react';
import { Route } from "react-router-dom";

import Footer from '../Footer';

export default ({ component: Component, ...rest }) => (
    <Route
        {...rest}
        render={props => (
            <React.Fragment>
                <div className="body page__body">
                    <Component {...props} />
                </div>
                <Footer className="page__footer"/>
            </React.Fragment>
        )}
    />
);
import * as React from 'react';
import { Route, Switch } from "react-router-dom";
import SideloadingRequirement from '../pages/SideloadingRequirement';
// import * as OfficeHelpers from '@microsoft/office-js-helpers';

import Main from '../pages/Main';

export interface AppProps {
    title: string;
    isOfficeInitialized: boolean;
}

export default class App extends React.Component<AppProps, any> {
    /* setColor = async () => {
        try {
            await Excel.run(async context => {
                const range = context.workbook.getSelectedRange();
                range.load('address');
                range.format.fill.color = 'green';
                await context.sync();
                console.log(`The range address was ${range.address}.`);
            });
        } catch (error) {
            OfficeHelpers.UI.notify(error);
            OfficeHelpers.Utilities.log(error);
        }
    } */

    render() {
        const { isOfficeInitialized, title } = this.props;

        if (!isOfficeInitialized) {
            return <SideloadingRequirement title={title} />
        }

        return (
            <Switch>
                <Route exact path="/" component={Main} />
                <Route exact path="/about" render={() => (<div>About page</div>)} />
            </Switch>
        );
    }
}
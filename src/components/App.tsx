import * as React from 'react';
import SideloadingRequirement from '../pages/SideloadingRequirement';
// import * as OfficeHelpers from '@microsoft/office-js-helpers';

import Routes from './Routes';

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

        return <Routes />
    }
}
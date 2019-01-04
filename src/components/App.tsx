import * as React from 'react';
// import * as OfficeHelpers from '@microsoft/office-js-helpers';

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
        const { isOfficeInitialized } = this.props;

        if (!isOfficeInitialized) {
            return (
                <div className='main'>
                    Here should be spinner and message that add-in should be sideloaded
                </div>
            );
        }

        return (
            <div className='main'>
                Here is my add-in functionality
            </div>
        );
    }
}
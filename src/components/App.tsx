import * as React from 'react';
import SideloadingRequirement from '../pages/SideloadingRequirement';

import Routes from './Routes';

export interface AppProps {
    title: string;
    isOfficeInitialized: boolean;
}

export default class App extends React.Component<AppProps, any> {
    render() {
        const { isOfficeInitialized, title } = this.props;

        if (!isOfficeInitialized) {
            return <SideloadingRequirement title={title} />
        }

        return <Routes />
    }
}
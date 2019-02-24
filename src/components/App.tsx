import * as React from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import SideloadingRequirement from '../pages/SideloadingRequirement';

import Routes from './Routes';

export interface IAppProps {
    title: string;
    isOfficeInitialized: boolean;
}

export default class App extends React.Component<IAppProps, any> {
    render() {
        const { isOfficeInitialized, title } = this.props;

        if (!isOfficeInitialized) {
            return <SideloadingRequirement title={title} />;
        }

        return (
            <React.Fragment>
                <Routes />
                <ToastContainer position={toast.POSITION.TOP_CENTER} autoClose={2000} />
            </React.Fragment>
        );
    }
}

import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { AppContainer } from 'react-hot-loader';
import { initializeIcons } from 'office-ui-fabric-react/lib/Icons';
import { HashRouter } from 'react-router-dom';

import App from './components/App';

import './styles.scss';
import 'office-ui-fabric-react/dist/css/fabric.min.css';

initializeIcons();

let isOfficeInitialized = false;

const title = 'stock trading helper';

const render = Component => {
    ReactDOM.render(
        <HashRouter>
            <AppContainer>
                <Component title={title} isOfficeInitialized={isOfficeInitialized} />
            </AppContainer>
        </HashRouter>,
        document.getElementById('container')
    );
};

/* Render application after Office initializes */
Office.initialize = () => {
    isOfficeInitialized = true;
    render(App);
};

/* Initial render showing a progress bar */
render(App);

if ((module as any).hot) {
    (module as any).hot.accept('./components/App', () => {
        const NextApp = require('./components/App').default;
        render(NextApp);
    });
}

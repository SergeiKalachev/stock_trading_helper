import * as React from 'react';
import { Spinner, SpinnerType } from 'office-ui-fabric-react';

import './styles.scss';

export default ({ title }) => (
    <section className='sideload-requirement'>
        <img
            width='90'
            height='90'
            src='assets/logo-filled.png'
            alt={title}
            title={title}
        />
        <h1 className='ms-fontSize-su ms-fontWeight-light ms-fontColor-neutralPrimary'>
            {title}
        </h1>
        <Spinner
            type={SpinnerType.large}
            label='Please sideload your addin to see app body.'
        />
    </section>
);

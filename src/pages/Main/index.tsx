import * as React from 'react';
import { Link } from 'react-router-dom';

export default () => (
    <div className="main">
        Main page
        <Link to="/about">About</Link>
    </div>
);

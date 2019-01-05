import * as React from 'react';
import cn from 'classnames';

import './styles.scss';

export default class Footer extends React.Component<{ className?: String }, any> {
    render() {
        const { className } = this.props;
        return (
            <div className={cn('footer', className)}>
                <span className="footer__action-link">Instruction</span>
                <span className="footer__action-link">Contacts</span>
            </div>
        );
    }
}
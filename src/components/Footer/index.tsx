import * as React from 'react';
import cn from 'classnames';
import { getServerHost } from '../../helpers/utils';

import './styles.scss';

export default class Footer extends React.Component<{ className?: String }, any> {
    onInstructionClick = () => {
        Office.context.ui.displayDialogAsync(`${getServerHost()}/#/instruction`, {
            height: 50,
            width: 60,
        });
    }

    onContactsClick = () => {
        Office.context.ui.displayDialogAsync(`${getServerHost()}/#/contacts`, {
            height: 30,
            width: 40,
        });
    }

    render() {
        const { className } = this.props;
        return (
            <div className={cn('footer', className)}>
                <span
                    onClick={this.onInstructionClick}
                    className="footer__action-link"
                >
                    Instruction
                </span>
                <span
                    onClick={this.onContactsClick}
                    className="footer__action-link"
                >
                    Contacts
                </span>
            </div>
        );
    }
}
import * as React from 'react';
import cn from 'classnames';
import { getServerHost } from '../../helpers/utils';

import './styles.scss';

export default class Footer extends React.Component<{ className?: String }, any> {
    onInstructionClick = () => {
        Office.context.ui.displayDialogAsync(`${getServerHost()}/#/instruction`, {
            height: 70,
            width: 50
        });
    };

    render() {
        const { className } = this.props;
        return (
            <div className={cn('footer', className)}>
                <span onClick={this.onInstructionClick} className='footer__action-link'>
                    Instruction
                </span>
            </div>
        );
    }
}

import * as React from 'react';
import cn from 'classnames';
import Checkbox from '../../../components/controls/Checkbox';
import Tooltip from '../../../components/controls/Tooltip';

interface IProps {
    onChange: (checked: boolean) => any;
    optionText: string;
    checked: boolean;
    enabled: boolean;
    tooltip?: string;
    warn?: string;
}

export default ({ onChange, optionText, checked, enabled, tooltip, warn }: IProps) => (
    <div className='main__option'>
        <Checkbox
            className={cn('main__option-checkbox', { 'main__option-checkbox_enabled': enabled })}
            checked={checked}
            onChange={event => {
                if (enabled) {
                    onChange(event.currentTarget.checked);
                }
            }}
        />
        <div className={cn('main__option-label', { 'main__option-label_enabled': enabled })}>{optionText}</div>
        {tooltip && <Tooltip text={tooltip} />}
        {warn && <Tooltip warn={true} text={warn} />}
    </div>
);

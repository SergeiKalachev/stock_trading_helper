import * as React from 'react';
import cn from 'classnames';
import Checkbox from '../../../components/controls/Checkbox';

interface IProps {
    onChange: (checked: boolean) => any;
    optionText: string;
    checked: boolean;
    enabled: boolean;
}

export default ({ onChange, optionText, checked, enabled }: IProps) => (
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
        <div className={cn('main__option-label', { 'main__option-label_enabled': enabled })}>
            {optionText}
        </div>
    </div>
);

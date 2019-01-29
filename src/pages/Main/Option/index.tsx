import * as React from 'react';
import Checkbox from '../../../components/controls/Checkbox';

interface IProps {
    onChange: (event?: React.ChangeEvent<HTMLInputElement>) => any;
    optionText: string;
    checked: boolean;
}

export default ({ onChange, optionText, checked }: IProps) => (
    <div className='main__option'>
        <Checkbox
            className='main__option-checkbox'
            checked={checked}
            onChange={onChange}
        />
        <div className='main__option-label'>{optionText}</div>
    </div>
);

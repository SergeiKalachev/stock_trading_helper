import * as React from 'react';
import cn from 'classnames';

import './styles.scss';

interface ICheckboxParams {
  checked?: boolean;
  onChange?: (...args: any[]) => any;
  className?: string;
  type?: string;
}

export default ({
  checked,
  onChange,
  className,
  type = 'default'
}: ICheckboxParams) => {
  if (type === 'circle') {
    return (
      <label className={cn('circle__container', className)}>
        <input type='checkbox' checked={checked} onChange={onChange} />
        <span className='circle__checkmark' />
      </label>
    );
  }
  return (
    <label className={cn('checkbox2__container', className)}>
      <input type='checkbox' checked={checked} onChange={onChange} />
      <span className='checkbox2__checkmark' />
    </label>
  );
};

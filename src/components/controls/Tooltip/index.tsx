import * as React from 'react';
import { Icon } from 'office-ui-fabric-react/lib/Icon';
import './styles.scss';

export default class Tooltip extends React.Component<{ text: string }, any> {
    render() {
        return (
            <span className='tooltip__container'>
                <Icon iconName='Info' className='tooltip__icon' />
            </span>
        );
    }
}

import * as React from 'react';
import { Icon } from 'office-ui-fabric-react/lib/Icon';
import './styles.scss';

interface IProps {
    text: string;
}

interface IState {
    visible: boolean;
}

export default class Tooltip extends React.Component<IProps, IState> {
    state = {
        visible: false
    };

    render() {
        const { text } = this.props;
        const { visible } = this.state;
        return (
            <span className='tooltip__container'>
                <Icon
                    iconName='Info'
                    className='tooltip__icon'
                    onMouseEnter={() => this.setState({ visible: true })}
                    onMouseLeave={() => this.setState({ visible: false })}
                />
                {visible && <div className='tooltip__text'>{text}</div>}
            </span>
        );
    }
}

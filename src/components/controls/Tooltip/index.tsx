import * as React from 'react';
import { Icon } from 'office-ui-fabric-react/lib/Icon';
import './styles.scss';

interface IProps {
    text: string;
    warn?: boolean;
}

interface IState {
    visible: boolean;
}

export default class Tooltip extends React.Component<IProps, IState> {
    state = {
        visible: false
    };

    handleMouseEnter = () => this.setState({ visible: true });

    handleMouseLeave = () => this.setState({ visible: false });

    render() {
        const { text, warn } = this.props;
        const { visible } = this.state;
        return (
            <span className='tooltip__container'>
                {warn && <Icon iconName='Info' className='tooltip__icon' onMouseEnter={this.handleMouseEnter} onMouseLeave={this.handleMouseLeave} />}
                {!warn && <span className='question-mark' onMouseEnter={this.handleMouseEnter} onMouseLeave={this.handleMouseLeave} />}
                {visible && <div className='tooltip__text'>{text}</div>}
            </span>
        );
    }
}

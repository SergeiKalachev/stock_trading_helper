import * as React from 'react';
import cn from 'classnames';

import './styles.scss';

interface IProps {
    title: string;
    className?: string;
    bodyText?: string;
    bodyComponent?: any;
    imgPath?: string;
}

const Section: React.FunctionComponent<IProps> = ({ title, bodyText, bodyComponent: BodyComponent, imgPath, className }) => (
    <div className={cn('section', className)}>
        <div className='section__title'>{title}</div>
        <div className='section__body'>
            {bodyText && <div className='section__body-text'>{bodyText}</div>}
            {BodyComponent && <BodyComponent />}
            {imgPath && (
                <div className='section__body-image-container'>
                    <img className='section__body-image' width='100%' height='auto' src={imgPath} alt={imgPath} />
                </div>
            )}
        </div>
    </div>
);

export default Section;

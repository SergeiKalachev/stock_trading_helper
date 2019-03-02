import * as React from 'react';
import Section from '../../components/Section';
import Colors from '../../components/Colors';
import { TABLE_HEADER } from '../../helpers/constants';

import './styles.scss';

const Instruction: React.FunctionComponent = () => (
    <div className='instruction'>
        <div className='instruction__section-container'>
            <Section
                className='instruction__section'
                title='Создайте новый лист (Create New Sheet)'
                bodyText='Структура таблицы будет подготовлена.'
                imgPath='assets/instructions/new_sheet.gif'
            />
            <Section
                className='instruction__section'
                title='Вставьте данные'
                bodyText='В подготовленную таблицу.'
                imgPath='assets/instructions/insert_data.gif'
            />
            <Section
                className='instruction__section'
                title='Выделите область'
                bodyText={`Включая ${TABLE_HEADER.Date}, ${TABLE_HEADER.Open}, ${TABLE_HEADER.High}, ${TABLE_HEADER.Low}, ${TABLE_HEADER.Close}.`}
                imgPath='assets/instructions/select_range.gif'
            />
            <Section
                className='instruction__section'
                title='Используйте разные цены'
                bodyText='Индикаторы можно подсчитать для любой цены. Просто выделите нужную Вам область.'
                imgPath='assets/instructions/various_columns.gif'
            />
            <Section className='instruction__section' title='Цвета сигналов' bodyComponent={Colors} />
        </div>
    </div>
);

export default Instruction;

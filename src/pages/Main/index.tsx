import * as React from 'react';
import Checkbox from '../../components/controls/Checkbox';
// import { toast } from 'react-toastify';

import {
    wrapExcelLogic,
    mapColumnIntoArrayOfValues,
    getServerHost
} from '../../helpers/utils';
import {
    calculateSMA,
    calculateEMA,
    calculateROC
} from '../../helpers/indicatorsHelper';

import './styles.scss';

const CHART_NAME = 'candlestick';

export default class Main extends React.Component {
    selectionChangedEvent = null;
    sheetActivatedEvent = null;

    async componentDidMount() {
        await wrapExcelLogic(async context => {
            const sheets = context.workbook.worksheets;
            this.sheetActivatedEvent = sheets.onActivated.add(
                this.resubscribeSelectionEvent
            );

            await this.subscribeSelectionEvent();
            await context.sync();
        });
    }

    subscribeSelectionEvent = async () => {
        await wrapExcelLogic(async context => {
            const worksheet = context.workbook.worksheets.getActiveWorksheet();
            this.selectionChangedEvent = worksheet.onSelectionChanged.add(
                this.handleSelectionChange
            );
            this.resetRangeToA1(context);
            await context.sync();
        });
    };

    resubscribeSelectionEvent = async () => {
        await Excel.run(this.selectionChangedEvent.context, async context => {
            this.selectionChangedEvent.remove();
            await this.subscribeSelectionEvent();

            await context.sync();
        });
    };

    resetRangeToA1 = context => {
        const worksheet = context.workbook.worksheets.getActiveWorksheet();
        worksheet.getRange('A1').select();
    };

    async componentWillUnmount() {
        await this.unsubscribeEvent(this.selectionChangedEvent);
        await this.unsubscribeEvent(this.sheetActivatedEvent);
    }

    async handleSelectionChange(event) {
        await wrapExcelLogic(async context => {
            await context.sync();
            console.log(event);
        });
    }

    async unsubscribeEvent(event) {
        await Excel.run(event.context, async context => {
            event.remove();
            await context.sync();
        });
    }

    createSheet = async () => {
        await wrapExcelLogic(async context => {
            const newWorksheet = context.workbook.worksheets.add();
            const table = newWorksheet.tables.add('A1:H50', true);
            table.getHeaderRowRange().values = [
                ['DATE', 'OPEN', 'HIGH', 'LOW', 'CLOSE', 'SMA', 'EMA', 'ROC']
            ];
            newWorksheet.activate();
            Office.context.ui.displayDialogAsync(
                `${getServerHost()}/#/table-insertion-tip`,
                {
                    height: 50,
                    width: 60
                }
            );
        });
    };

    handleDrawChartClick = async () => {
        await wrapExcelLogic(async context => {
            const dataRange = context.workbook.getSelectedRange();
            const highColumnIndex = 2;
            const lowColumnIndex = 3;
            const highPricesColumn = dataRange.getColumn(highColumnIndex);
            const lowPricesColumn = dataRange.getColumn(lowColumnIndex);
            highPricesColumn.load('values');
            lowPricesColumn.load('values');

            const worksheet = context.workbook.worksheets.getActiveWorksheet();
            const candlestickChart = worksheet.charts.add(
                Excel.ChartType.stockOHLC,
                dataRange
            );

            candlestickChart.name = CHART_NAME;
            candlestickChart.title.text = 'Candlesticks';
            candlestickChart.height = 200;
            candlestickChart.width = 500;
            candlestickChart.top = 0;
            await context.sync();

            const verticalAxis = candlestickChart.axes.valueAxis;
            verticalAxis.maximum = Math.max(
                ...mapColumnIntoArrayOfValues(highPricesColumn.values)
            );
            verticalAxis.minimum = Math.min(
                ...mapColumnIntoArrayOfValues(lowPricesColumn.values)
            );
            await context.sync();
        });
    };

    handleCountIndicatorsClick = async () => {
        await this.clearIndicatorsRange();
        await wrapExcelLogic(async context => {
            const dataRange = context.workbook.getSelectedRange();
            const worksheet = context.workbook.worksheets.getActiveWorksheet();
            dataRange.load(['address', 'values', 'columnCount']);
            worksheet.load('name');
            await context.sync();

            const dataRangeAddress = dataRange.address.replace(
                `${worksheet.name}!`,
                ''
            );

            const outputSMARangeAddress = dataRangeAddress.replace(
                /[a-zA-Z]/g,
                'F'
            );
            const outputSMARange = worksheet.getRange(outputSMARangeAddress);

            const outputEMARangeAddress = dataRangeAddress.replace(
                /[a-zA-Z]/g,
                'G'
            );
            const outputEMARange = worksheet.getRange(outputEMARangeAddress);

            const outputROCRangeAddress = dataRangeAddress.replace(
                /[a-zA-Z]/g,
                'H'
            );
            const outputROCRange = worksheet.getRange(outputROCRangeAddress);

            const prices = dataRange.values.map(item => item[0]);
            outputSMARange.values = calculateSMA(prices, 5);
            outputEMARange.values = calculateEMA(prices, 5);
            outputROCRange.values = calculateROC(prices, 5);
            await context.sync();
        });
    };

    handleResetClick = async () => {
        await this.clearIndicatorsRange();
        await this.clearCharts();
    };

    async clearIndicatorsRange() {
        await wrapExcelLogic(async context => {
            const worksheet = context.workbook.worksheets.getActiveWorksheet();

            this.clearIndicatorRange(worksheet, 'F', 'SMA');
            this.clearIndicatorRange(worksheet, 'G', 'EMA');
            this.clearIndicatorRange(worksheet, 'H', 'ROC');

            await context.sync();
        });
    }

    clearIndicatorRange(worksheet, column, title) {
        const range = worksheet.getRange(`${column}:${column}`);
        const titleCell = worksheet.getRange(`${column}1`);
        range.clear(Excel.ClearApplyTo.contents);
        titleCell.values = [[title]];
    }

    async clearCharts() {
        await wrapExcelLogic(async context => {
            const worksheet = context.workbook.worksheets.getActiveWorksheet();
            worksheet.load('charts/items/name');
            await context.sync();

            for (const chart of worksheet.charts.items) {
                if (chart.name === CHART_NAME) {
                    chart.delete();
                }
            }
            await context.sync();
        });
    }

    render() {
        return (
            <div className='main'>
                <div className='main__actions'>
                    <div
                        onClick={this.createSheet}
                        className='main__action main__action_clickable'
                    >
                        create new sheet
                    </div>
                    <div
                        onClick={this.handleResetClick}
                        className='main__action main__action_clickable'
                    >
                        reset worksheet
                    </div>
                    <div className='main__action main__action_primary'>
                        <div className='main__option'>
                            <Checkbox
                                className='main__option-checkbox'
                                checked={false}
                                onChange={() => {}}
                            />
                            <div className='main__option-label'>
                                draw candlestick chart
                            </div>
                        </div>
                        <div className='main__option'>
                            <Checkbox
                                className='main__option-checkbox'
                                checked={true}
                                onChange={() => {}}
                            />
                            <div className='main__option-label'>
                                count indicators
                            </div>
                        </div>
                        <div className='main__option'>
                            <Checkbox
                                className='main__option-checkbox'
                                checked={false}
                                onChange={() => {}}
                            />
                            <div className='main__option-label'>
                                draw ROC indicator
                            </div>
                        </div>
                        <button
                            className='main__primary-action-btn'
                            onClick={() => {}}
                        >
                            Apply
                        </button>
                    </div>
                </div>
            </div>
        );
    }
}

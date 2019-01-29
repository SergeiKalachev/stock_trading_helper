import * as React from 'react';
import cn from 'classnames';
import Option from './Option';
import { TABLE_HEADER, TABLE_HEADER_FOR_CANDLESTICK } from '../../helpers/constants';
// import { toast } from 'react-toastify';

import { wrapExcelLogic, mapColumnIntoArrayOfValues, getServerHost } from '../../helpers/utils';
import { calculateSMA, calculateEMA, calculateROC } from '../../helpers/indicatorsHelper';

import './styles.scss';

const CHART_NAME = 'candlestick';

interface IState {
    selectedRange: any[][];

    drawCandlestickChartEnabled: boolean;
    countIndicatorsEnabled: boolean;
    drawROCChartEnabled: boolean;

    drawCandlestickChart: boolean;
    countIndicators: boolean;
    drawROCChart: boolean;
}

export default class Main extends React.Component<{}, IState> {
    constructor(props) {
        super(props);
        this.state = {
            selectedRange: null,

            drawCandlestickChartEnabled: false,
            countIndicatorsEnabled: false,
            drawROCChartEnabled: false,

            drawCandlestickChart: false,
            countIndicators: false,
            drawROCChart: false
        };
    }
    selectionChangedEvent = null;
    sheetActivatedEvent = null;

    async componentDidMount() {
        await wrapExcelLogic(async context => {
            const sheets = context.workbook.worksheets;
            this.sheetActivatedEvent = sheets.onActivated.add(this.resubscribeSelectionEvent);

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

    handleSelectionChange = async () => {
        await wrapExcelLogic(async context => {
            const dataRange = context.workbook.getSelectedRange();
            dataRange.load('values, columnCount, rowCount');
            await context.sync();
            const tableHeaderRowValues = Object.values(TABLE_HEADER_FOR_CANDLESTICK);
            const firstRow = dataRange.values[0] || [];

            const rangeCandlestickChartHasRightDimensions =
                dataRange.columnCount === 5 && dataRange.rowCount > 2;
            const rangeCandlestickChartHasRightColumns = tableHeaderRowValues.every(
                value => firstRow.indexOf(value) > -1
            );

            this.setState(prevState => {
                const newState = {
                    selectedRange: dataRange.values,
                    drawCandlestickChartEnabled:
                        rangeCandlestickChartHasRightDimensions &&
                        rangeCandlestickChartHasRightColumns,
                    countIndicatorsEnabled: false,
                    drawROCChartEnabled: false
                };
                return {
                    ...newState,
                    drawCandlestickChart: newState.drawCandlestickChartEnabled
                        ? prevState.drawCandlestickChart
                        : false,
                    countIndicators: newState.countIndicatorsEnabled
                        ? prevState.countIndicators
                        : false,
                    drawROCChart: newState.drawROCChartEnabled ? prevState.drawROCChart : false
                };
            });
        });
    };

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
            table.getHeaderRowRange().values = [Object.values(TABLE_HEADER)];
            newWorksheet.activate();
            Office.context.ui.displayDialogAsync(`${getServerHost()}/#/table-insertion-tip`, {
                height: 50,
                width: 60
            });
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
            const candlestickChart = worksheet.charts.add(Excel.ChartType.stockOHLC, dataRange);

            candlestickChart.name = CHART_NAME;
            candlestickChart.title.text = 'Candlesticks';
            candlestickChart.height = 200;
            candlestickChart.width = 500;
            candlestickChart.top = 0;
            await context.sync();

            const verticalAxis = candlestickChart.axes.valueAxis;
            verticalAxis.maximum = Math.max(...mapColumnIntoArrayOfValues(highPricesColumn.values));
            verticalAxis.minimum = Math.min(...mapColumnIntoArrayOfValues(lowPricesColumn.values));
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

            const dataRangeAddress = dataRange.address.replace(`${worksheet.name}!`, '');

            const outputSMARangeAddress = dataRangeAddress.replace(/[a-zA-Z]/g, 'F');
            const outputSMARange = worksheet.getRange(outputSMARangeAddress);

            const outputEMARangeAddress = dataRangeAddress.replace(/[a-zA-Z]/g, 'G');
            const outputEMARange = worksheet.getRange(outputEMARangeAddress);

            const outputROCRangeAddress = dataRangeAddress.replace(/[a-zA-Z]/g, 'H');
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

            this.clearIndicatorRange(worksheet, 'F', TABLE_HEADER.SMA);
            this.clearIndicatorRange(worksheet, 'G', TABLE_HEADER.EMA);
            this.clearIndicatorRange(worksheet, 'H', TABLE_HEADER.ROC);

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

    checkAtLeastOneOptionSelected = () => {
        const { drawCandlestickChart, countIndicators, drawROCChart } = this.state;
        return [drawCandlestickChart, countIndicators, drawROCChart].some(i => i);
    };

    render() {
        const {
            drawCandlestickChartEnabled,
            countIndicatorsEnabled,
            drawROCChartEnabled,
            drawCandlestickChart,
            countIndicators,
            drawROCChart
        } = this.state;
        return (
            <div className='main'>
                <div className='main__actions'>
                    <div onClick={this.createSheet} className='main__action main__action_clickable'>
                        create new sheet
                    </div>
                    <div
                        onClick={this.handleResetClick}
                        className='main__action main__action_clickable'
                    >
                        reset worksheet
                    </div>
                    <div className='main__action main__action_primary'>
                        <Option
                            onChange={checked => {
                                this.setState({ drawCandlestickChart: checked });
                            }}
                            optionText='draw candlestick chart'
                            checked={drawCandlestickChart}
                            enabled={drawCandlestickChartEnabled}
                        />
                        <Option
                            onChange={checked => {
                                this.setState({ countIndicators: checked });
                            }}
                            optionText='count indicators'
                            checked={countIndicators}
                            enabled={countIndicatorsEnabled}
                        />
                        <Option
                            onChange={checked => {
                                this.setState({ drawROCChart: checked });
                            }}
                            optionText='draw ROC chart'
                            checked={drawROCChart}
                            enabled={drawROCChartEnabled}
                        />
                        <button
                            className={cn('main__primary-action-btn', {
                                'main__primary-action-btn_disabled': !this.checkAtLeastOneOptionSelected()
                            })}
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

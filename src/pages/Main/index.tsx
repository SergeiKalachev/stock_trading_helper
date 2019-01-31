import * as React from 'react';
import cn from 'classnames';
import Option from './Option';
import { TABLE_HEADER, CHART_NAMES } from '../../helpers/constants';
import { toast } from 'react-toastify';

import { wrapExcelLogic, mapColumnIntoArrayOfValues, getServerHost } from '../../helpers/utils';
import { calculateSMA, calculateEMA, calculateROC } from '../../helpers/indicatorsHelper';

import './styles.scss';

interface IState {
    drawCandlestickChartEnabled: boolean;
    countIndicatorsEnabled: boolean;

    drawCandlestickChart: boolean;
    countIndicators: boolean;
    drawROCChart: boolean;
}

export default class Main extends React.Component<{}, IState> {
    constructor(props) {
        super(props);
        this.state = {
            drawCandlestickChartEnabled: false,
            countIndicatorsEnabled: false,

            drawCandlestickChart: false,
            countIndicators: false,
            drawROCChart: false
        };
    }
    selectionChangedEvent: OfficeExtension.EventHandlerResult<
        Excel.WorksheetSelectionChangedEventArgs
    > = null;
    sheetActivatedEvent: OfficeExtension.EventHandlerResult<
        Excel.WorksheetActivatedEventArgs
    > = null;

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

    resetRangeToA1 = (context: Excel.RequestContext) => {
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
            this.setState(this.calculateStateAfterRangeSelection(dataRange));
        });
    };

    calculateStateAfterRangeSelection = (dataRange: Excel.Range) => {
        const { drawCandlestickChart, countIndicators } = this.state;
        const { Date, Open, High, Low, Close } = TABLE_HEADER;
        const tableHeaderRowValues = [Date, Open, High, Low, Close];
        const firstRow = dataRange.values[0] || [];
        const rangeCandlestickChartHasRightDimensions =
            dataRange.columnCount === 5 && dataRange.rowCount > 2;
        const rangeCandlestickChartHasRightColumns = tableHeaderRowValues.every(
            value => firstRow.indexOf(value) > -1
        );
        const drawCandlestickChartEnabled =
            rangeCandlestickChartHasRightDimensions && rangeCandlestickChartHasRightColumns;

        const countIndicatorsHasRightDimensons =
            dataRange.columnCount === 1 && dataRange.rowCount > 2;

        const countIndicatorsEnabled =
            drawCandlestickChartEnabled || countIndicatorsHasRightDimensons;

        const newState = {
            drawCandlestickChartEnabled,
            countIndicatorsEnabled
        };
        return {
            ...newState,
            drawCandlestickChart: newState.drawCandlestickChartEnabled
                ? drawCandlestickChart
                : false,
            countIndicators: newState.countIndicatorsEnabled ? countIndicators : false
        };
    };

    async unsubscribeEvent(event: OfficeExtension.EventHandlerResult<any>) {
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

    drawCandlestickChart = async () => {
        await wrapExcelLogic(
            async context => {
                const dataRange = context.workbook.getSelectedRange();
                const highColumnIndex = 2;
                const lowColumnIndex = 3;
                const highPricesColumn = dataRange.getColumn(highColumnIndex);
                const lowPricesColumn = dataRange.getColumn(lowColumnIndex);
                highPricesColumn.load('values');
                lowPricesColumn.load('values');

                const worksheet = context.workbook.worksheets.getActiveWorksheet();
                const candlestickChart = worksheet.charts.add(Excel.ChartType.stockOHLC, dataRange);

                candlestickChart.name = CHART_NAMES.Candlestick;
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
            },
            error => {
                if (error.code === Excel.ErrorCodes.invalidSelection) {
                    toast.error('Your selection is out of focus. Please reselect it.', {
                        autoClose: false
                    });
                } else {
                    toast.error(`Error occured. ${error.message}`, {
                        autoClose: false
                    });
                }
            }
        );
    };

    countIndicators = async () => {
        await this.clearIndicatorsRange();
        await wrapExcelLogic(async context => {
            const worksheet = context.workbook.worksheets.getActiveWorksheet();
            const selectedRange = context.workbook.getSelectedRange();

            let rangeToUse = this.defineRangeToUse(selectedRange);

            rangeToUse.load(['address', 'values', 'columnCount']);
            worksheet.load('name');
            await context.sync();
            // If column starts with "OPEN" or "CLOSE" etc.
            if (isNaN(+rangeToUse.values[0][0])) {
                // Then take sub-range without row with "OPEN" or "CLOSE"
                rangeToUse = rangeToUse.getOffsetRange(1, 0).getResizedRange(-1, 0);
                rangeToUse.load(['address', 'values', 'columnCount']);
                await context.sync();
            }
            const rangeToUseAddress = rangeToUse.address.replace(`${worksheet.name}!`, '');

            const outputSMARangeAddress = rangeToUseAddress.replace(/[a-zA-Z]/g, 'F');
            const outputSMARange = worksheet.getRange(outputSMARangeAddress);

            const outputEMARangeAddress = rangeToUseAddress.replace(/[a-zA-Z]/g, 'G');
            const outputEMARange = worksheet.getRange(outputEMARangeAddress);

            const outputROCRangeAddress = rangeToUseAddress.replace(/[a-zA-Z]/g, 'H');
            const outputROCRange = worksheet.getRange(outputROCRangeAddress);

            const prices = rangeToUse.values.map(item => item[0]);

            outputSMARange.values = calculateSMA(prices, 5);
            outputEMARange.values = calculateEMA(prices, 5);
            outputROCRange.values = calculateROC(prices, 5);
            await context.sync();
        });
    };

    drawROCChart = async () => {
        wrapExcelLogic(async context => {
            const worksheet = context.workbook.worksheets.getActiveWorksheet();
            const selectedRange = context.workbook.getSelectedRange();

            const rangeToUse = this.defineRangeToUse(selectedRange);
            const ROCChart = worksheet.charts.add(Excel.ChartType.lineMarkers, rangeToUse);

            ROCChart.name = CHART_NAMES.Roc;
            ROCChart.title.text = 'Rate of change';
            ROCChart.height = 200;
            ROCChart.width = 500;
            ROCChart.top = 210;
            await context.sync();
        });
    };

    defineRangeToUse = (selectedRange: Excel.Range): Excel.Range => {
        const { drawCandlestickChartEnabled } = this.state;
        return drawCandlestickChartEnabled ? selectedRange.getLastColumn() : selectedRange;
    };

    handleResetClick = async () => {
        await this.clearIndicatorsRange();
        await this.clearCharts();
    };

    async clearIndicatorsRange() {
        await wrapExcelLogic(async context => {
            const worksheet = context.workbook.worksheets.getActiveWorksheet();

            this.clearIndicatorRange(worksheet, 'F', TABLE_HEADER.Sma);
            this.clearIndicatorRange(worksheet, 'G', TABLE_HEADER.Ema);
            this.clearIndicatorRange(worksheet, 'H', TABLE_HEADER.Roc);

            await context.sync();
        });
    }

    clearIndicatorRange(worksheet: Excel.Worksheet, column: string, title: string): void {
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
                if (chart.name === CHART_NAMES.Candlestick || chart.name === CHART_NAMES.Roc) {
                    chart.delete();
                }
            }
            await context.sync();
        });
    }

    checkAtLeastOneOptionSelected = () => {
        const { drawCandlestickChart, countIndicators } = this.state;
        return [drawCandlestickChart, countIndicators].some(i => i);
    };

    handleApplyClicked = async () => {
        const { drawCandlestickChart, countIndicators, drawROCChart } = this.state;
        if (drawCandlestickChart) {
            this.drawCandlestickChart(); // don't need to wait here
        }
        if (countIndicators) {
            await this.countIndicators();
        }
        if (countIndicators && drawROCChart) {
            await this.drawROCChart(); // should go after countIndicators
        }
    };

    render() {
        const {
            drawCandlestickChartEnabled,
            countIndicatorsEnabled,
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
                                if (!checked) {
                                    this.setState({
                                        countIndicators: checked,
                                        drawROCChart: false
                                    });
                                } else {
                                    this.setState({ countIndicators: checked });
                                }
                            }}
                            optionText='count indicators'
                            checked={countIndicators}
                            enabled={countIndicatorsEnabled}
                        />
                        <Option
                            onChange={checked => this.setState({ drawROCChart: checked })}
                            optionText='draw ROC chart'
                            checked={countIndicators && drawROCChart}
                            enabled={countIndicators} // allow drawROCChart when countIndicators option checked
                        />
                        <button
                            className={cn('main__primary-action-btn', {
                                'main__primary-action-btn_disabled': !this.checkAtLeastOneOptionSelected()
                            })}
                            onClick={this.handleApplyClicked}
                        >
                            Apply
                        </button>
                    </div>
                </div>
            </div>
        );
    }
}

import * as React from 'react';

import { wrapExcelLogic, mapColumnIntoArrayOfValues } from '../../helpers/utils';
import { calculateSMA, calculateEMA, calculateROC } from '../../helpers/indicatorsHelper';

import './styles.scss';

const CHART_NAME = 'candlestick';

export default class Main extends React.Component {
    handleDrawChartClick = async () => {
        await wrapExcelLogic(async (context) => {
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
            candlestickChart.title.text = "Candlesticks";
            candlestickChart.height = 200;
            candlestickChart.width = 500;
            candlestickChart.top = 0;
            await context.sync();
            
            const verticalAxis = candlestickChart.axes.valueAxis;
            verticalAxis.maximum = Math.max(...mapColumnIntoArrayOfValues(highPricesColumn.values));
            verticalAxis.minimum = Math.min(...mapColumnIntoArrayOfValues(lowPricesColumn.values));
            await context.sync();
        });
    }

    handleCountIndicatorsClick = async () => {
        await this.clearIndicatorsRange();
        await wrapExcelLogic(async (context) => {
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
    }
    
    handleResetClick = async () => {
        await this.clearIndicatorsRange();
        await this.clearCharts();
    }

    async clearIndicatorsRange() {
        await wrapExcelLogic(async (context) => {
            const worksheet = context.workbook.worksheets.getActiveWorksheet();

            this.clearIndicatorRange(worksheet, 'F', 'SMA');
            this.clearIndicatorRange(worksheet, 'G', 'EMA');
            this.clearIndicatorRange(worksheet, 'H', 'ROC');

            await context.sync();
        })
    }

    clearIndicatorRange(worksheet, column, title) {
        const range = worksheet.getRange(`${column}:${column}`);
        const titleCell = worksheet.getRange(`${column}1`);
        range.clear(Excel.ClearApplyTo.contents);
        titleCell.values = [[title]];
    }

    async clearCharts() {
        await wrapExcelLogic(async (context) => {
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
            <div className="main">
                <div className="main__actions">
                    <div
                        onClick={this.handleDrawChartClick}
                        className="main__action"
                    >
                        draw candlestick chart
                    </div>
                    <div
                        onClick={this.handleCountIndicatorsClick}
                        className="main__action"
                    >
                        count indicators
                    </div>
                    <div
                        onClick={this.handleResetClick}
                        className="main__action"
                    >
                        reset worksheet
                    </div>
                </div>
            </div>
        );
    }
}

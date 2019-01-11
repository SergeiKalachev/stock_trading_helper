import * as React from 'react';

import { wrapExcelLogic } from '../../helpers/utils'

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
            verticalAxis.maximum = Math.max(...this.mapColumnIntoArrayOfValues(highPricesColumn.values));
            verticalAxis.minimum = Math.min(...this.mapColumnIntoArrayOfValues(lowPricesColumn.values));
            await context.sync();
        });
    }

    handleCountIndicatorsClick = () => {}

    handleResetClick = async () => {
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

    mapColumnIntoArrayOfValues(column) {
        // this is an array of arrays, where each array consists of only one element
        // we remove 1st array because it is header
        return column.slice(1).map(elem => elem[0]);
    }

    render() {
        return (
            <div className="main">
                <div className="main__actions">
                    <div
                        onClick={this.handleDrawChartClick}
                        className="main__action"
                    >
                        Draw Candlestick Chart
                    </div>
                    <div
                        onClick={this.handleCountIndicatorsClick}
                        className="main__action"
                    >
                        Count Indicators
                    </div>
                    <div
                        onClick={this.handleResetClick}
                        className="main__action"
                    >
                        Reset worksheet
                    </div>
                </div>
            </div>
        );
    }
}

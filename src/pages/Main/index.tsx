import * as React from 'react';

import { wrapExcelLogic } from '../../helpers/utils'

import './styles.scss';

export default class Main extends React.Component {
    handleDrawChartClick = async () => {
        await wrapExcelLogic(async (context) => {
            const dataRange = context.workbook.getSelectedRange();
            const worksheet = context.workbook.worksheets.getItem("Sheet1");
            const candlestickChart = worksheet.charts.add(Excel.ChartType.stockOHLC, dataRange);

            candlestickChart.title.text = "Candlesticks";
            candlestickChart.height = 200;
            candlestickChart.width = 500;
            candlestickChart.top = 0;
            
            const verticalAxis = candlestickChart.axes.valueAxis;
            verticalAxis.maximum = 500;// this.getDataRangeMaximum(verticalAxis.series.getItemAt(0));
            verticalAxis.minimum = 200;// this.getDataRangeMinimum(verticalAxis.series.getItemAt(0));

            await context.sync();
        });
    }

    handleCountIndicatorsClick = () => {}

    getDataRangeMaximum = (series) => {
        const values = series.points.items;
        return Math.max(...values);
    }

    getDataRangeMinimum = (series) => {
        const values = series.points.items;
        return Math.min(...values);
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
                </div>
            </div>
        );
    }
}

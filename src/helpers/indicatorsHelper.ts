import { getArrayWithMultipleItems } from './utils';

export function calculateSMA(prices, period) {
    const SMA = [];
    for(let i = 0; i < prices.length; i++) {
        let SMAForPeriod = 0;
        if (i >= period - 1) {
            for(let j = i; j >= i - (period - 1); j--) {
                SMAForPeriod = SMAForPeriod + prices[j];
            }
            SMAForPeriod = SMAForPeriod / period;
        }
        SMA.push(SMAForPeriod);
    }
    return SMA;
}

export function calculateEMA(prices, period) {
    const initialEMAValue = _calculateInitialEMAValue(prices, period);
    const EMA = getArrayWithMultipleItems(0, period - 1); // for period 5 returns [0, 0, 0, 0]
    EMA.push(initialEMAValue); // for period 5 it's [0, 0, 0, 0, someInitialValue]

    const weight = 2 / (period + 1);
    for(let i = period; i < prices.length; i++) {
        let EMAForPeriod = (prices[i] - EMA[i-1]) * weight + EMA[i-1];
        EMA.push(EMAForPeriod);
    }
    return EMA;
}

export function calculateROC(prices, period) {
    const ROC = getArrayWithMultipleItems(0, period);

    for(let i = period; i < prices.length; i++) {
        let ROCForPeriod = ((prices[i] - prices[i - period]) / prices[i - period]) * 100;
        ROC.push(ROCForPeriod);
    }
    return ROC;
}

function _calculateInitialEMAValue(prices, period) {
    let sum = 0;
    for(let i = 0; i < period; i++) {
        sum = sum + prices[i];
    }
    return sum / period;
}
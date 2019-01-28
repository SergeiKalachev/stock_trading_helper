import { getArrayWithMultipleItems } from './utils';

export function calculateSMA(prices, period) {
    const SMA = [];
    for (let i = 0; i < prices.length; i++) {
        let SMAForPeriod = 0;
        if (i >= period - 1) {
            for (let j = i; j >= i - (period - 1); j--) {
                SMAForPeriod = SMAForPeriod + prices[j];
            }
            SMAForPeriod = SMAForPeriod / period;
        }
        SMA.push(SMAForPeriod);
    }
    return SMA.map(item => [item]);
}

export function calculateEMA(prices, period) {
    const initialEMAValue = prices[0];
    const EMA = [];
    EMA.push(initialEMAValue);

    const weight = 2 / (period + 1);
    for (let i = 1; i < prices.length; i++) {
        let EMAForPeriod = weight * prices[i] + (1 - weight) * EMA[i - 1];
        EMA.push(EMAForPeriod);
    }
    return EMA.map(item => [item]);
}

export function calculateROC(prices, period) {
    const ROC = getArrayWithMultipleItems(0, period);

    for (let i = period; i < prices.length; i++) {
        let ROCForPeriod = ((prices[i] - prices[i - period]) / prices[i - period]);
        ROC.push(ROCForPeriod);
    }
    return ROC.map(item => [item]);
}

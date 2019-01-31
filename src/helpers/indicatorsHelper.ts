import { getArrayWithMultipleItems } from './utils';

export function calculateSMA(prices: any[], period: number): any[] {
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
    return SMA;
}

export function calculateEMA(prices: any[], period: number): any[] {
    const initialEMAValue = prices[0];
    const EMA = [];
    EMA.push(initialEMAValue);

    const weight = 2 / (period + 1);
    for (let i = 1; i < prices.length; i++) {
        let EMAForPeriod = weight * prices[i] + (1 - weight) * EMA[i - 1];
        EMA.push(EMAForPeriod);
    }
    return EMA;
}

export function calculateROC(prices: any[], period: number): any[] {
    const ROC = getArrayWithMultipleItems(0, period);

    for (let i = period; i < prices.length; i++) {
        let ROCForPeriod = (prices[i] - prices[i - period]) / prices[i - period];
        ROC.push(ROCForPeriod);
    }
    return ROC;
}

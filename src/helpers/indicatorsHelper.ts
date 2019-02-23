import { getArrayWithMultipleItems } from './utils';
import { signal } from '../models';

export function calcSMA(prices: any[], period: number): any[] {
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

export function calcEMA(prices: any[], period: number): any[] {
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

export function calcROC(prices: any[], period: number): any[] {
    const ROC = getArrayWithMultipleItems(0, period);

    for (let i = period; i < prices.length; i++) {
        let ROCForPeriod = (prices[i] - prices[i - period]) / prices[i - period];
        ROC.push(ROCForPeriod);
    }
    return ROC;
}

function prefillSMASignals(): signal[] {
    return [{ value: '' }, { value: '' }];
}

export function calcSignalSMA(SMAValues: any[], prices: any[]): signal[] {
    const signals: signal[] = prefillSMASignals();

    for (let i = 2; i < prices.length; i++) {
        let currSMASignal: signal = { value: '' };
        let prevFirstSMASignal = signals[i - 1];
        let prevSecondSMASignal = signals[i - 2];
        if (SMAValues[i] < SMAValues[i - 1]) {
            currSMASignal.value = 'decrease';
            if (prevFirstSMASignal.value === 'increase' && prevSecondSMASignal.value === 'increase') {
                currSMASignal.color = 'red';
            }
        } else if (SMAValues[i] > SMAValues[i - 1]) {
            currSMASignal.value = 'increase';
            if (prevFirstSMASignal.value === 'decrease' && prevSecondSMASignal.value === 'decrease') {
                currSMASignal.color = 'green';
            }
        }
        signals.push(currSMASignal);
    }

    return signals;
}

// export function calcSignalEMA(EMARange: Excel.Range, EMAValues: any[], prices: any[]): void {}

// export function calcSignalROC(ROCRange: Excel.Range, ROCValues: any[], prices: any[]): void {}

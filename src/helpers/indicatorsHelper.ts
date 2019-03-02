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
    if (prices.length > period) {
        const ROC = getArrayWithMultipleItems(0, period);

        for (let i = period; i < prices.length; i++) {
            let ROCForPeriod = (prices[i] - prices[i - period]) / prices[i - period];
            ROC.push(ROCForPeriod);
        }
        return ROC;
    }

    return getArrayWithMultipleItems(0, prices.length);
}

function prefillSignals(): signal[] {
    return [{ value: '' }, { value: '' }];
}

export function calcSignalSMA(SMAValues: any[], prices: any[]): signal[] {
    const signals: signal[] = prefillSignals();

    for (let i = 2; i < prices.length; i++) {
        const currSMASignal: signal = { value: '' };
        const prevFirstSMASignal = signals[i - 1];
        const prevSecondSMASignal = signals[i - 2];
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

export function calcSignalEMA(EMAValues: any[], prices: any[]): signal[] {
    const signals: signal[] = prefillSignals();

    for (let i = 2; i < EMAValues.length; i++) {
        const currEMASignal: signal = { value: '' };
        const currEMAValue = EMAValues[i];
        const currPrice = prices[i];
        const prevFirstEMAValue = EMAValues[i - 1];
        const prevSecondEMAValue = EMAValues[i - 2];

        if (currEMAValue > prevFirstEMAValue) {
            currEMASignal.value = 'increase';

            if (prevFirstEMAValue < prevSecondEMAValue && currPrice > currEMAValue) {
                currEMASignal.color = 'green';
            }
        } else if (currEMAValue < prevFirstEMAValue) {
            currEMASignal.value = 'decrease';

            if (prevFirstEMAValue > prevSecondEMAValue && currPrice < currEMAValue) {
                currEMASignal.color = 'red';
            }
        }

        signals.push(currEMASignal);
    }

    return signals;
}

export function calcSignalROC(ROCValues: any[]): signal[] {
    const signals: signal[] = [{ value: '' }];

    for (let i = 1; i < ROCValues.length; i++) {
        const currROCSignal: signal = { value: '' };
        const prevROCValue = ROCValues[i - 1];
        const currROCValue = ROCValues[i];

        if (prevROCValue < 0 && currROCValue > 0) {
            currROCSignal.color = 'green';
        } else if (prevROCValue > 0 && currROCValue < 0) {
            currROCSignal.color = 'red';
        }
        signals.push(currROCSignal);
    }

    return signals;
}

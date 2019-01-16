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

// calculateEMA

// calculateROC
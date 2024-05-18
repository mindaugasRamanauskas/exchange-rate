import LRUCache  from '../utils/cache';
import logger from '../utils/logger';
import axios from 'axios';
import { Quote } from '../models/quote';

interface ExchangeRate {
    currency: string,
    rate: number,
}

const lruCache = new LRUCache<ExchangeRate[]>();

const fetchExchangeRates = (baseRate: string): Promise<[string, number][]> => {
    return axios.get(`${process.env.EXTERNAL_API_URL}/${process.env.EXTERNAL_API_KEY}/latest/${baseRate}`)
        .then(response => response.data)
        .then(data => {
            if (!data?.rates && ! data?.conversion_rates) {
                logger.error(`Failed to fetch exchange rates,
                        response: ${JSON.stringify(data)} `);
    
                throw new Error('Failed to fetch exchange rates');
            }

            return Object.entries(data.rate ? data.rates : data.conversion_rates);
        })
}

const fetchCachedExchangeRates = async (baseRate: string) => {
    const rates: ExchangeRate[] = lruCache.get(baseRate);

    if (!rates) {
        logger.info(`${baseRate} not found in cache, fetching from external API`);

        await fetchExchangeRates(baseRate)
            .then(rates => rates.map(([ currency, rate ]: [string, number]) => ({ currency, rate } as ExchangeRate)))
            .then(exchangeRates => lruCache.set(baseRate, exchangeRates));
    }
}

const calculateExchangeAmount = async (baseRate: string, quote: string, amount: number, precision: number): Promise<Quote> => {
    await fetchCachedExchangeRates(baseRate);

    const rates: ExchangeRate[] = lruCache.get(baseRate);
    console.log(lruCache);
    if (!rates) {
        logger.error(`Failed to fetch exchange rate for ${baseRate}`);
        throw new Error(`Failed to fetch exchange rate for ${baseRate}`);
    }

    const cachedQuote = rates.find(rate => 
        rate.currency.trim().toLocaleLowerCase() === quote.trim().toLowerCase());

    if (!cachedQuote) {
        logger.error(`Failed to fetch exchange rate for ${quote}`);
        throw new Error(`Failed to fetch exchange rate for ${quote}`);
    }

    return Promise.resolve({
        exchangeRate: Number(cachedQuote.rate.toFixed(precision)),
        exchangedAmount: Number((amount * cachedQuote.rate).toFixed(precision)),
        baseCurrency: baseRate,
        quoteCurrency: quote,
    });
}

export {
    calculateExchangeAmount,
}
import { QuoteRequest, SupportedCurrencies } from '../models/quote';
import { Validation } from '../models/validation';

const validate = (payload: QuoteRequest): Validation => {
    if (!payload.baseCurrency) {
        return {
            isValid: false,
            message: 'baseCurrency is required',
        };
    }

    if (!payload.quoteCurrency) {
        return {
            isValid: false,
            message: 'quoteCurrency is required',
        };
    }

    if (!payload.baseAmount) {
        return {
            isValid: false,
            message: 'baseAmount is required',
        };
    }

    if (isNaN(parseFloat(payload.baseAmount))) {
        return {
            isValid: false,
            message: 'baseAmount must be a number',
        };
    }

    if (parseFloat(payload.baseAmount) <= 1) {
        return {
            isValid: false,
            message: 'baseAmount must be greater than 1',
        };
    }

    if (!SupportedCurrencies[payload.baseCurrency.trim().toUpperCase()]) {
        return {
            isValid: false,
            message: `${payload.baseCurrency} currency is not supported`,
        };
    }

    if (!SupportedCurrencies[payload.quoteCurrency.trim().toUpperCase()]) {
        return {
            isValid: false,
            message: `${payload.quoteCurrency} currency is not supported`,
        };
    }

    return {
        isValid: true,
        message: null
    };
}

export {
    validate,
};
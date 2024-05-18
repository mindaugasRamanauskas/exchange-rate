import { QuoteRequest, QuoteResponse, Quote } from '../models/quote';
import { Validation } from '../models/validation';
import { Request, Response } from 'express';
import { validate as validateRequest } from '../validators/exchangeValidator';
import { calculateExchangeAmount } from '../services/externalService';
import { asyncHandler } from '../middlewares/asyncHandler';

// @route GET /api/v1/quote
const getQuote = asyncHandler(async (req: Request, res: Response) => {
    const { baseCurrency, quoteCurrency, baseAmount } = req.query;
    
    const quoteRequest: QuoteRequest = {
        baseCurrency: baseCurrency as string,
        quoteCurrency: quoteCurrency as string,
        baseAmount: baseAmount as string,
    };

    const validation: Validation = validateRequest(quoteRequest);

    if (!validation.isValid) {
        res.status(400);
        res.json({
            message: validation.message,
        });
        return;
    }

    const decimalPrecision = 3;

    const exchangeQuote: Quote = await calculateExchangeAmount(quoteRequest.baseCurrency,
         quoteRequest.quoteCurrency,
         +quoteRequest.baseAmount,
         decimalPrecision);

    res.status(200).json({
        exchangeRate: exchangeQuote.exchangeRate,
        quoteAmount: Number(exchangeQuote.exchangedAmount.toFixed()),
    } as QuoteResponse);
});

export {
    getQuote,
};
interface QuoteResponse {
    exchangeRate: number,
    quoteAmount: number
}

interface QuoteRequest {
    baseCurrency: string,
    quoteCurrency: string,
    baseAmount: string,
}

interface Quote {
    exchangeRate: number,
    exchangedAmount: number,
    baseCurrency: string,
    quoteCurrency: string
}

enum SupportedCurrencies {
    USD = 'USD',
    EUR = 'EUR',
    GBP = 'GBP',
    ILS = 'ILS',
}

export {
    Quote,
    QuoteResponse,
    QuoteRequest,
    SupportedCurrencies
}
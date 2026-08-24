/**
 * AURA LUXE - Multi-Currency Engine
 * Handles live exchange conversions and formatted pricing displays.
 */

export const CURRENCIES = {
  GHS: { symbol: 'GH₵', code: 'GHS', rate: 15.65, name: 'Ghanaian Cedi', format: (val) => `GH₵${val.toLocaleString('en-GH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` },
  USD: { symbol: '$', code: 'USD', rate: 1.0, name: 'US Dollar', format: (val) => `$${val.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}` }
};

export function convertPrice(usdAmount, targetCurrencyCode = 'USD') {
  const currency = CURRENCIES[targetCurrencyCode] || CURRENCIES.USD;
  const converted = usdAmount * currency.rate;
  return {
    raw: converted,
    formatted: currency.format(converted),
    currency
  };
}

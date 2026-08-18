/**
 * AURA LUXE - Multi-Currency Engine
 * Handles live exchange conversions and formatted pricing displays.
 */

export const CURRENCIES = {
  USD: { symbol: '$', code: 'USD', rate: 1.0, name: 'US Dollar', format: (val) => `$${val.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}` },
  EUR: { symbol: '€', code: 'EUR', rate: 0.92, name: 'Euro', format: (val) => `€${val.toLocaleString('de-DE', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}` },
  GBP: { symbol: '£', code: 'GBP', rate: 0.79, name: 'British Pound', format: (val) => `£${val.toLocaleString('en-GB', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}` },
  JPY: { symbol: '¥', code: 'JPY', rate: 154.5, name: 'Japanese Yen', format: (val) => `¥${Math.round(val).toLocaleString('ja-JP')}` },
  CAD: { symbol: 'CA$', code: 'CAD', rate: 1.37, name: 'Canadian Dollar', format: (val) => `CA$${val.toLocaleString('en-CA', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}` },
  AUD: { symbol: 'A$', code: 'AUD', rate: 1.52, name: 'Australian Dollar', format: (val) => `A$${val.toLocaleString('en-AU', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}` },
  GHS: { symbol: 'GH₵', code: 'GHS', rate: 15.65, name: 'Ghanaian Cedi', format: (val) => `GH₵${val.toLocaleString('en-GH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` }
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

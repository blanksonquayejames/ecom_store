/**
 * AURA LUXE - Multi-Currency Engine
 * Handles live exchange conversions and formatted pricing displays.
 */

export const CURRENCIES = {
  GHS: {
    symbol: 'GH₵',
    code: 'GHS',
    rate: 15.65,
    name: 'Ghanaian Cedi',
    format: (val) => `GH₵${val.toLocaleString('en-GH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
  }
};

export function convertPrice(usdAmount, targetCurrencyCode = 'GHS') {
  const currency = CURRENCIES.GHS;
  const num = typeof usdAmount === 'number' ? usdAmount : Number(usdAmount) || 0;
  const converted = num * currency.rate;
  return {
    raw: converted,
    formatted: currency.format(converted),
    currency
  };
}


/**
 * Currency utilities for the admin dashboard
 */

export type CurrencyCode = "USD" | "JOD" | "SP";

export const CURRENCY_SYMBOLS: Record<CurrencyCode, string> = {
  USD: "$",
  JOD: "JOD",
  SP: "SP",
};

/**
 * Get currency symbol from currency code
 */
export function getCurrencySymbol(currency: CurrencyCode = "USD"): string {
  return CURRENCY_SYMBOLS[currency] || "$";
}

/**
 * Format price value (number only, no currency symbol)
 * SP currency shows no decimals, others show 2 decimals
 */
export function formatPriceValue(
  price: number | string,
  currency: CurrencyCode = "USD"
): string {
  const numPrice = typeof price === "string" ? parseFloat(price) : price;
  return currency === "SP" ? numPrice.toString() : numPrice.toFixed(2);
}

/**
 * Format price with currency
 */
export function formatPrice(
  price: number | string,
  currency: CurrencyCode = "USD"
): string {
  const symbol = getCurrencySymbol(currency);
  const formattedPrice = formatPriceValue(price, currency);
  
  // For USD, put symbol before price; for others, put after
  if (currency === "USD") {
    return `${symbol}${formattedPrice}`;
  }
  return `${symbol} ${formattedPrice}`;
}

/**
 * Get effective currency from user (uses user's currency or defaults to USD)
 */
export function getUserCurrency(user: any): CurrencyCode {
  return user?.currency || "USD";
}

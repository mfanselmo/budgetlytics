export const CURRENCIES = ["EUR", "CLP"] as const;

export const CurrencyToLocaleMap = {
  EUR: "en-EN",
  CLP: "es-CL",
} as const;

export default function formatCurrency(
  value: number,
  currency: (typeof CURRENCIES)[number],
) {
  return new Intl.NumberFormat(CurrencyToLocaleMap[currency], {
    style: "currency",
    currency: currency,
  }).format(value);
}

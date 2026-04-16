/** EU countries for SEO page generation */
export const EU_COUNTRIES = [
  { code: "DE", name: "Germany" },
  { code: "FR", name: "France" },
  { code: "PL", name: "Poland" },
  { code: "IT", name: "Italy" },
  { code: "ES", name: "Spain" },
  { code: "NL", name: "Netherlands" },
  { code: "SE", name: "Sweden" },
  { code: "AT", name: "Austria" },
  { code: "BE", name: "Belgium" },
  { code: "CZ", name: "Czechia" },
  { code: "DK", name: "Denmark" },
  { code: "FI", name: "Finland" },
  { code: "IE", name: "Ireland" },
  { code: "PT", name: "Portugal" },
  { code: "RO", name: "Romania" },
  { code: "GR", name: "Greece" },
  { code: "HU", name: "Hungary" },
  { code: "SK", name: "Slovakia" },
  { code: "BG", name: "Bulgaria" },
  { code: "HR", name: "Croatia" },
  { code: "LT", name: "Lithuania" },
  { code: "SI", name: "Slovenia" },
  { code: "LV", name: "Latvia" },
  { code: "EE", name: "Estonia" },
  { code: "LU", name: "Luxembourg" },
  { code: "MT", name: "Malta" },
  { code: "CY", name: "Cyprus" },
] as const;

export type CountryCode = (typeof EU_COUNTRIES)[number]["code"];

/**
 * Convert an ISO 3166-1 alpha-2 country code into the Unicode flag emoji
 * by mapping each letter to its Regional Indicator Symbol. Falls back to
 * a neutral white flag if the code is malformed.
 */
export function countryFlag(code: string): string {
  if (!code || code.length !== 2) return "\u{1F3F3}";
  const upper = code.toUpperCase();
  const base = 0x1f1e6; // Regional Indicator "A"
  const a = upper.charCodeAt(0) - 65;
  const b = upper.charCodeAt(1) - 65;
  if (a < 0 || a > 25 || b < 0 || b > 25) return "\u{1F3F3}";
  return String.fromCodePoint(base + a, base + b);
}

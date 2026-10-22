export type SharedQuote = { s: Record<string, string>; e: string[] };
export function encodeQuote(quote: SharedQuote): string {
  return btoa(JSON.stringify(quote));
}
export function decodeQuote(value: string): SharedQuote | null {
  try {
    if (value.length > 16000) return null;
    const data = JSON.parse(atob(value));
    if (!data || typeof data.s !== 'object' || Array.isArray(data.s) || !data.s || !Array.isArray(data.e)) return null;
    if (Object.values(data.s).some(id => typeof id !== 'string') || data.e.some((id: unknown) => typeof id !== 'string')) return null;
    return { s: data.s, e: data.e };
  } catch { return null; }
}
export function quoteShareUrl(origin: string, quote: SharedQuote): string {
  const url = new URL('/quote', origin);
  url.searchParams.set('b', encodeQuote(quote));
  return url.toString();
}
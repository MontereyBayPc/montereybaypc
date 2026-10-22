import { describe, it, expect } from 'vitest';
import { decodeQuote, quoteShareUrl } from '../lib/quote-share';
describe('exact quote sharing', () => {
  it('restores every selection including repeated storage and extras', () => {
    const quote = { s: { cpu: 'cpu-id', storage: 'disk-id', 'storage-secondary': 'disk-id', os: 'none' }, e: ['extra-one', 'extra-two'] };
    const url = new URL(quoteShareUrl('https://montereybaypcs.com', quote));
    expect(url.pathname).toBe('/quote');
    expect(decodeQuote(url.searchParams.get('b') ?? '')).toEqual(quote);
  });
  it('rejects invalid shared selections', () => expect(decodeQuote(btoa(JSON.stringify({ s: { cpu: 123 }, e: [] })))).toBeNull());
});
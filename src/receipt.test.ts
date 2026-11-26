import { describe, expect, it } from 'vitest';
import { parseReceipt } from './receipt';

describe('receipt text assistance', () => {
  it('extracts likely store, date, currency, total, and item rows for review', () => {
    const result = parseReceipt('MARKET PLACE\n11/24/2026\n2x Apples $3.00\nBread 2.49\nSubtotal 5.49\nTax 0.44\nTOTAL $5.93');
    expect(result.store).toBe('MARKET PLACE');
    expect(result.date).toBe('2026-11-24');
    expect(result.currency).toBe('USD');
    expect(result.total).toBe('5.93');
    expect(result.items).toMatchObject([
      {description:'Apples',quantity:2,unitPrice:1.5,selected:true},
      {description:'Bread',quantity:1,unitPrice:2.49,selected:true},
    ]);
  });

  it('keeps ambiguous amounts as unparsed text and rejects invalid dates', () => {
    const result = parseReceipt('SHOP\n13/40/2026\n1234567890\nTOTAL 1234567890');
    expect(result.date).toBe('');
    expect(result.items).toEqual([]);
    expect(result.unparsed).toContain('1234567890');
    expect(result.total).toBe('');
  });

  it('does not parse totals or tax as products', () => {
    const result = parseReceipt('STORE\nMilk 4.00\nSales tax 0.32\nGrand total $4.32');
    expect(result.items).toHaveLength(1);
    expect(result.total).toBe('4.32');
  });
});

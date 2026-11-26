import { describe, expect, it } from 'vitest';
import { aggregateEventPeriods } from './analytics';
import type { Event } from './model';

const event = (date: string, action: string, value: number): Event => ({ id: `${date}-${action}`, item: 'Pear', action, date, value });

describe('analytics period aggregation', () => {
  it('returns twelve calendar months ending in the current UTC month', () => {
    const months = aggregateEventPeriods([], 'months', new Date('2026-11-26T12:00:00Z'));
    expect(months).toHaveLength(12);
    expect(months[0].key).toBe('2025-12');
    expect(months.at(-1)?.key).toBe('2026-11');
  });

  it('counts explicitly discarded and rescued value without treating consumption as savings', () => {
    const events = [
      event('2026-10-03T12:00:00Z', 'discarded', 8),
      event('2026-10-04T12:00:00Z', 'rescued', 5),
      event('2026-10-05T12:00:00Z', 'consumed', 99),
      event('2026-10-06T12:00:00Z', 'rescued', -4),
      event('not-a-date', 'discarded', 100),
    ];
    const months = aggregateEventPeriods(events, 'months', new Date('2026-11-26T12:00:00Z'));
    const october = months.find(bucket => bucket.key === '2026-10');
    expect(october).toMatchObject({ waste: 8, rescued: 5, eventCount: 4 });
    expect(months.find(bucket => bucket.key === '2026-11')?.eventCount).toBe(0);
  });

  it('keeps the rolling weekly view at eight date ranges', () => {
    expect(aggregateEventPeriods([], 'weeks', new Date('2026-11-26T12:00:00Z'))).toHaveLength(8);
  });
});

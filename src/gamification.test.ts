import { describe, expect, it } from 'vitest';
import { currentRecordkeepingStreak } from './gamification';
import type { Event } from './model';

const record = (date: string): Event => ({ id: date, item: 'Oats', action: 'updated', date, value: 0 });

describe('recordkeeping streak', () => {
  it('counts distinct consecutive UTC days from events and scans', () => {
    const events = [record('2026-11-25T14:00:00Z'), record('2026-11-24T09:00:00Z'), record('2026-11-25T15:00:00Z')];
    expect(currentRecordkeepingStreak(events, [{ date: '2026-11-26T01:00:00Z' }], new Date('2026-11-26T12:00:00Z'))).toBe(3);
  });

  it('keeps yesterday active but resets after a missed day', () => {
    expect(currentRecordkeepingStreak([record('2026-11-25T12:00:00Z')], [], new Date('2026-11-26T12:00:00Z'))).toBe(1);
    expect(currentRecordkeepingStreak([record('2026-11-23T12:00:00Z')], [], new Date('2026-11-26T12:00:00Z'))).toBe(0);
  });

  it('ignores invalid and future-dated activity', () => {
    expect(currentRecordkeepingStreak([record('nope'), record('2026-11-27T12:00:00Z')], [], new Date('2026-11-26T12:00:00Z'))).toBe(0);
  });
});

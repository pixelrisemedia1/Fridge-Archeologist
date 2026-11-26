import type { Event } from './model';

export type AnalyticsPeriod = 'weeks' | 'months';
export type EventBucket = {
  key: string;
  label: string;
  waste: number;
  rescued: number;
  eventCount: number;
};

/** Aggregate only explicitly recorded discarded/rescued values; consumed events are not savings. */
export function aggregateEventPeriods(events: Event[], period: AnalyticsPeriod, now = new Date()): EventBucket[] {
  const count = period === 'weeks' ? 8 : 12;
  const buckets: EventBucket[] = [];
  const base = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));

  for (let index = count - 1; index >= 0; index--) {
    let start: Date;
    let end: Date;
    if (period === 'months') {
      start = new Date(Date.UTC(base.getUTCFullYear(), base.getUTCMonth() - index, 1));
      end = new Date(Date.UTC(base.getUTCFullYear(), base.getUTCMonth() - index + 1, 1));
    } else {
      end = new Date(base.getTime() - index * 7 * 86_400_000 + 86_400_000);
      start = new Date(end.getTime() - 7 * 86_400_000);
    }
    const key = period === 'months'
      ? `${start.getUTCFullYear()}-${String(start.getUTCMonth() + 1).padStart(2, '0')}`
      : start.toISOString().slice(0, 10);
    const relevant = events.filter(event => {
      const time = Date.parse(event.date);
      return Number.isFinite(time) && time >= start.getTime() && time < end.getTime();
    });
    buckets.push({
      key,
      label: period === 'months'
        ? new Intl.DateTimeFormat(undefined, { month: 'short', year: '2-digit', timeZone: 'UTC' }).format(start)
        : new Intl.DateTimeFormat(undefined, { month: 'short', day: 'numeric', timeZone: 'UTC' }).format(start),
      waste: relevant.filter(event => event.action === 'discarded').reduce((total, event) => total + Math.max(0, event.value || 0), 0),
      rescued: relevant.filter(event => event.action === 'rescued').reduce((total, event) => total + Math.max(0, event.value || 0), 0),
      eventCount: relevant.length,
    });
  }
  return buckets;
}

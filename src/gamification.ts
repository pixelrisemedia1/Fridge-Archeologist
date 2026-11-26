import type { Event } from './model';

export type ActivityRecord = { date: string };

/** Count consecutive UTC calendar dates with a saved record or shelf review. */
export function currentRecordkeepingStreak(events: Event[], scans: ActivityRecord[] = [], now = new Date()): number {
  const today = Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate());
  const activeDays = new Set([...events, ...scans].flatMap(entry => {
    const parsed = Date.parse(entry.date);
    if (!Number.isFinite(parsed) || parsed > now.getTime()) return [];
    return [new Date(parsed).toISOString().slice(0, 10)];
  }));
  const todayKey = new Date(today).toISOString().slice(0, 10);
  const yesterdayKey = new Date(today - 86_400_000).toISOString().slice(0, 10);
  if (!activeDays.has(todayKey) && !activeDays.has(yesterdayKey)) return 0;
  let count = 0;
  for (let offset = activeDays.has(todayKey) ? 0 : 1; activeDays.has(new Date(today - offset * 86_400_000).toISOString().slice(0, 10)); offset++) count++;
  return count;
}

import { describe, expect, it } from 'vitest';
import { searchStorageGuidance, storageGuidanceSource } from './guidance';

describe('official cold-storage reference', () => {
  it('attributes the chart to FoodSafety.gov', () => {
    expect(storageGuidanceSource.url).toContain('foodsafety.gov');
  });

  it('finds common foods by alias and shows storage ranges', () => {
    const results = searchStorageGuidance('minced beef');
    expect(results).toHaveLength(1);
    expect(results[0]).toMatchObject({ refrigerator: '1–2 days', freezer: '3–4 months' });
  });

  it('keeps opened and unopened package guidance separate', () => {
    const results = searchStorageGuidance('hot dog');
    expect(results).toHaveLength(2);
    expect(results.map(x => x.condition)).toEqual(['Opened package', 'Unopened package']);
    expect(results.map(x => x.refrigerator)).toEqual(['1 week', '2 weeks']);
  });

  it('does not invent a match for unsupported foods', () => {
    expect(searchStorageGuidance('dragon fruit')).toEqual([]);
  });
});

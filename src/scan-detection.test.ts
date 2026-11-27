import { describe, expect, it, vi } from 'vitest';
import { detectShelfImage, type ScanDetection } from './scan-detection';

describe('shelf-photo detection crops', () => {
  it('maps crop boxes to full-photo coordinates and removes duplicate overlaps', async () => {
    const responses: ScanDetection[][] = [
      [{ class: 'banana', score: .9, bbox: [460, 70, 80, 80] }],
      [{ class: 'banana', score: .8, bbox: [460, 70, 80, 80] }],
      [{ class: 'banana', score: .7, bbox: [10, 70, 80, 80] }],
      [{ class: 'carrot', score: .75, bbox: [50, 20, 30, 40] }],
      [{ class: 'apple', score: .6, bbox: [10, 10, 20, 20] }],
    ];
    const model = { detect: vi.fn(async () => responses.shift() ?? []) };
    const drawImage = vi.fn();
    const canvas = { width: 0, height: 0, getContext: () => ({ drawImage }) } as unknown as HTMLCanvasElement;
    const image = { naturalWidth: 1000, naturalHeight: 800 } as HTMLImageElement;

    const results = await detectShelfImage(model, image, () => canvas);

    expect(model.detect).toHaveBeenCalledTimes(5);
    expect(results.map(x => x.class)).toEqual(['banana', 'carrot', 'apple']);
    expect(results[1].bbox).toEqual([50, 380, 30, 40]);
    expect(results[2].bbox).toEqual([460, 370, 20, 20]);
    expect(drawImage).toHaveBeenCalledTimes(4);
  });

  it('falls back to full-photo results if a canvas context is unavailable', async () => {
    const detection = { class: 'apple', score: .72, bbox: [10, 10, 20, 20] };
    const model = { detect: vi.fn(async () => [detection]) };
    const canvas = { getContext: () => null } as unknown as HTMLCanvasElement;
    const image = { naturalWidth: 400, naturalHeight: 300 } as HTMLImageElement;

    await expect(detectShelfImage(model, image, () => canvas)).resolves.toEqual([detection]);
    expect(model.detect).toHaveBeenCalledTimes(1);
  });
});

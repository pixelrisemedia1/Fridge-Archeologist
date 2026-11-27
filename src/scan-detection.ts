export type ScanDetection = { class: string; score: number; bbox: number[] };
type ScanDetector = { detect: (source: HTMLImageElement | HTMLCanvasElement, maxNumBoxes: number, minScore: number) => Promise<ScanDetection[]> };

function intersectionOverUnion(a: number[], b: number[]) {
  const x1 = Math.max(a[0], b[0]);
  const y1 = Math.max(a[1], b[1]);
  const x2 = Math.min(a[0] + a[2], b[0] + b[2]);
  const y2 = Math.min(a[1] + a[3], b[1] + b[3]);
  const intersection = Math.max(0, x2 - x1) * Math.max(0, y2 - y1);
  const union = a[2] * a[3] + b[2] * b[3] - intersection;
  return union > 0 ? intersection / union : 0;
}

export async function detectShelfImage(
  model: ScanDetector,
  image: HTMLImageElement,
  createCanvas: () => HTMLCanvasElement = () => document.createElement('canvas'),
) {
  const width = image.naturalWidth || image.width;
  const height = image.naturalHeight || image.height;
  const candidates = (await model.detect(image, 20, .3)).map(item => ({ ...item }));
  const canvas = createCanvas();
  const context = canvas.getContext('2d');
  if (!context) return candidates;

  for (const [x, y] of [[0, 0], [.45, 0], [0, .45], [.45, .45]]) {
    const left = Math.floor(width * x);
    const top = Math.floor(height * y);
    const cropWidth = Math.min(width - left, Math.ceil(width * .55));
    const cropHeight = Math.min(height - top, Math.ceil(height * .55));
    if (cropWidth < 2 || cropHeight < 2) continue;
    canvas.width = cropWidth;
    canvas.height = cropHeight;
    context.drawImage(image, left, top, cropWidth, cropHeight, 0, 0, cropWidth, cropHeight);
    const tile = await model.detect(canvas, 20, .3);
    for (const item of tile) {
      candidates.push({
        ...item,
        bbox: [item.bbox[0] + left, item.bbox[1] + top, item.bbox[2], item.bbox[3]],
      });
    }
  }

  const unique: ScanDetection[] = [];
  for (const item of candidates.sort((a, b) => b.score - a.score)) {
    if (!unique.some(previous => previous.class === item.class && intersectionOverUnion(previous.bbox, item.bbox) > .5)) {
      unique.push(item);
    }
    if (unique.length >= 20) break;
  }
  return unique;
}

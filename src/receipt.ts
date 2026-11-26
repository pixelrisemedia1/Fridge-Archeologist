export type ReceiptLine = {
  id: string;
  raw: string;
  description: string;
  quantity: number;
  unitPrice: number;
  selected: boolean;
};

export type ReceiptDraft = {
  store: string;
  date: string;
  currency: string;
  total: string;
  items: ReceiptLine[];
  unparsed: string[];
};

const datePattern = /\b(\d{4})[-/.](\d{1,2})[-/.](\d{1,2})\b|\b(\d{1,2})[-/.](\d{1,2})[-/.](\d{2,4})\b/;
const ignoredLine = /\b(subtotal|sales tax|tax|total|amount due|balance due|change|cash|credit|debit|visa|mastercard|amex|thank you|receipt)\b/i;
const currencyFor = (text: string) => text.includes('€') ? 'EUR' : text.includes('£') ? 'GBP' : text.includes('$') ? 'USD' : 'Unknown';

function parseDate(text: string): string {
  const match = text.match(datePattern);
  if (!match) return '';
  let year: number, month: number, day: number;
  if (match[1]) [, year, month, day] = match.map(Number) as [number, number, number, number];
  else {
    month = Number(match[4]); day = Number(match[5]); year = Number(match[6]);
    if (year < 100) year += year >= 70 ? 1900 : 2000;
  }
  const date = new Date(Date.UTC(year!, month! - 1, day!));
  if (date.getUTCFullYear() !== year || date.getUTCMonth() !== month - 1 || date.getUTCDate() !== day) return '';
  return `${year!.toString().padStart(4,'0')}-${month!.toString().padStart(2,'0')}-${day!.toString().padStart(2,'0')}`;
}

function amountFrom(line: string): number | null {
  const match = line.match(/(?:\$|€|£)?\s*(-?\d{1,7}(?:,\d{3})*(?:\.\d{2}))\s*$/);
  if (!match) return null;
  const value = Number(match[1].replaceAll(',', ''));
  return Number.isFinite(value) && value >= 0 ? value : null;
}

export function parseReceipt(text: string): ReceiptDraft {
  const lines = text.split(/\r?\n/).map(raw => raw.trim()).filter(Boolean);
  const date = lines.map(parseDate).find(Boolean) || '';
  const currency = currencyFor(text);
  let total = '';
  const items: ReceiptLine[] = [];
  const unparsed: string[] = [];
  let store = '';

  lines.forEach((raw, index) => {
    const normalized = raw.toLowerCase();
    const amount = amountFrom(raw);
    const isTotal = /\b(grand\s+total|total|amount due|balance due)\b/i.test(raw);
    if (isTotal && amount !== null) { total = amount.toFixed(2); return; }
    if (datePattern.test(raw)) return;
    if (ignoredLine.test(raw)) return;
    if (!store && amount === null && /[a-z]/i.test(raw) && index < 3) { store = raw; return; }
    if (amount === null) { unparsed.push(raw); return; }

    const priceMatch = raw.match(/(?:\$|€|£)?\s*(-?\d{1,7}(?:,\d{3})*(?:\.\d{2}))\s*$/);
    const descriptionRaw = priceMatch ? raw.slice(0, priceMatch.index).replace(/[\s*xX@]+$/,'').trim() : '';
    if (!descriptionRaw) { unparsed.push(raw); return; }
    const explicitQuantity = descriptionRaw.match(/^(\d+(?:\.\d+)?)\s*[xX@]\s*(.+)$/);
    const description = (explicitQuantity?.[2] || descriptionRaw).trim();
    const quantity = explicitQuantity ? Number(explicitQuantity[1]) : 1;
    if (!description || quantity <= 0) { unparsed.push(raw); return; }
    items.push({id:`receipt-line-${index}`,raw,description,quantity,unitPrice:amount/quantity,selected:true});
  });
  return {store,date,currency,total,items,unparsed};
}

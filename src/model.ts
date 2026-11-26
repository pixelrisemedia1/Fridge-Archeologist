export type Location = 'Fridge' | 'Freezer' | 'Pantry';
export type ItemStatus = 'active' | 'unobserved' | 'consumed' | 'discarded';
export type Item = {
  id: string; name: string; location: Location; quantity: number; price: number;
  first: string; last: string; expiry: string; status: ItemStatus;
  category?: string; brand?: string; barcode?: string; unit?: string;
  opened?: string; purchased?: string; confidence?: number; note?: string;
};
export type Event = { id: string; item: string; itemId?: string; action: string; date: string; value: number; quantity?: number; reason?: string; location?: Location; category?: string };
export type ShoppingItem = { id: string; name: string; done: boolean; quantity?: number; category?: string; price?: number; source?: string };
export type NotificationPreferences = { enteredDates: boolean; weeklyScan: boolean; mealPlanning: boolean; shopping: boolean; weeklySummary: boolean };
export type State = {
  items: Item[]; events: Event[]; shopping: ShoppingItem[]; onboarded: boolean;
  currency: string; household: number; country?: string; unitSystem?: 'metric' | 'imperial';
  groceryBudget?: number; preferences?: string[]; allergies?: string[]; excluded?: string[];
  reminder?: string; motivation?: string; favorites?: string[]; plans?: Record<string, string[]>; recipeServings?: Record<string, number>;
  xp?: number; achievements?: string[]; theme?: 'light'|'dark'|'system'; scans?: {id:string;date:string;location:Location;photoCount:number;notes:string}[];
  notifications?: NotificationPreferences;
};
export const initial: State = { items: [], events: [], shopping: [], onboarded: false, currency: 'USD', household: 1, country: 'United States', unitSystem: 'imperial', groceryBudget: 0, preferences: [], allergies: [], excluded: [], reminder: 'Weekly', motivation: 'Save money', favorites: [], plans: {}, recipeServings:{}, xp: 0, achievements: [], theme: 'system', scans: [], notifications:{enteredDates:true,weeklyScan:true,mealPlanning:true,shopping:true,weeklySummary:true} };
export const day = 86_400_000;
export function age(i: Item, now = Date.now()) { return Math.max(0, Math.floor((now - Date.parse(i.first)) / day)); }
export function classification(n: number) { return n <= 2 ? 'Fresh Discovery' : n <= 5 ? 'Established Resident' : n <= 10 ? 'Forgotten Treasure' : n <= 20 ? 'Ancient Artifact' : n <= 30 ? 'Relic' : 'Museum Exhibit'; }
export function score(i: Item, now = Date.now()) {
  const observedAge = age(i, now);
  const untilEnteredDate = i.expiry ? Math.ceil((Date.parse(i.expiry + 'T23:59:59') - now) / day) : null;
  const urgency = untilEnteredDate === null ? 0 : untilEnteredDate < 0 ? 35 : untilEnteredDate <= 2 ? 35 : untilEnteredDate <= 5 ? 24 : untilEnteredDate <= 10 ? 12 : 0;
  const agePoints = Math.min(25, observedAge * 1.25);
  const valuePoints = Math.min(20, Math.log2(1 + Math.max(0, i.price * i.quantity)) * 5);
  const quantityPoints = Math.min(10, Math.max(0, i.quantity - 1) * 2);
  const uncertaintyPenalty = i.expiry ? 0 : 8;
  return Math.min(100, Math.round(urgency + agePoints + valuePoints + quantityPoints - uncertaintyPenalty));
}
export function scoreExplanation(i: Item, now = Date.now()) {
  const until = i.expiry ? Math.ceil((Date.parse(i.expiry + 'T23:59:59') - now) / day) : null;
  return [i.expiry ? (until! < 0 ? 'Entered date has passed' : until! <= 2 ? 'Entered date is within 2 days' : until! <= 5 ? 'Entered date is within 5 days' : '') : 'No package date entered', `${age(i, now)} days since first observed`, `${i.quantity} tracked unit(s)`, `${(i.price * i.quantity).toFixed(2)} entered currency units estimated value`].filter(Boolean);
}
export function normalize(s: string) { return s.normalize('NFKD').trim().toLocaleLowerCase().replace(/[^\p{L}\p{N}]+/gu, ' ').trim(); }
export function match(items: Item[], name: string, location: Location) { const key = normalize(name); return items.filter(i => (i.status === 'active' || i.status === 'unobserved') && normalize(i.name) === key && i.location === location); }
export function matchBarcode(items: Item[], barcode: string) { return items.filter(i => i.status !== 'discarded' && i.barcode === barcode); }
export function totals(items: Item[], events: Event[]) {
  const inventory = items.filter(i => i.status === 'active').reduce((s, i) => s + i.price * i.quantity, 0);
  return { inventory, risk: items.filter(i => i.status === 'active' && score(i) >= 50).reduce((s, i) => s + i.price * i.quantity, 0), waste: events.filter(e => e.action === 'discarded').reduce((s, e) => s + e.value, 0), rescued: events.filter(e => e.action === 'rescued' && e.value > 0).reduce((s, e) => s + e.value, 0) };
}
export function validateItem(i: Partial<Item>) { return Boolean(i.name?.trim() && i.location && Number.isFinite(i.quantity) && (i.quantity ?? 0) > 0 && Number.isFinite(i.price) && (i.price ?? -1) >= 0); }
export function duplicateKey(i: Pick<Item,'name'|'location'|'brand'|'barcode'>) { return i.barcode ? `barcode:${i.barcode}` : `${i.location}:${normalize(`${i.brand ?? ''} ${i.name}`)}`; }
export function annotateUnobserved(items: Item[], observedIds: Set<string>) { return items.map(i => i.status === 'active' && !observedIds.has(i.id) ? { ...i, status: 'unobserved' as const } : i); }
export function calculateSavings(events: Event[]) { return events.filter(e => e.action === 'rescued').reduce((sum, e) => sum + Math.max(0, e.value), 0); }

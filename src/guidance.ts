export type StorageGuidance = {
  food: string;
  category: string;
  aliases: string[];
  refrigerator?: string;
  freezer?: string;
  condition?: string;
};

export const storageGuidanceSource = {
  title: 'FoodSafety.gov Cold Food Storage Chart',
  url: 'https://www.foodsafety.gov/food-safety-charts/cold-food-storage-charts',
  reviewed: '2023-09-19',
} as const;

// A compact transcription of selected rows from the official chart.
// Times are storage guidance at refrigerator <= 40°F / 4°C and freezer <= 0°F / -18°C.
export const storageGuidance: StorageGuidance[] = [
  {food:'Egg, chicken, ham, tuna, or macaroni salad',category:'Prepared food',aliases:['egg salad','chicken salad','ham salad','tuna salad','macaroni salad'],refrigerator:'3–4 days',freezer:'Does not freeze well'},
  {food:'Hot dogs',category:'Meat & seafood',aliases:['hot dog','frankfurter','franks'],refrigerator:'1 week',freezer:'1–2 months',condition:'Opened package'},
  {food:'Hot dogs',category:'Meat & seafood',aliases:['hot dog','frankfurter','franks'],refrigerator:'2 weeks',freezer:'1–2 months',condition:'Unopened package'},
  {food:'Luncheon meat',category:'Meat & seafood',aliases:['deli meat','lunch meat','cold cuts'],refrigerator:'3–5 days',freezer:'1–2 months',condition:'Opened package or deli sliced'},
  {food:'Luncheon meat',category:'Meat & seafood',aliases:['deli meat','lunch meat','cold cuts'],refrigerator:'2 weeks',freezer:'1–2 months',condition:'Unopened package'},
  {food:'Bacon',category:'Meat & seafood',aliases:['bacon'],refrigerator:'1 week',freezer:'1 month'},
  {food:'Raw sausage',category:'Meat & seafood',aliases:['sausage','breakfast sausage','raw sausage'],refrigerator:'1–2 days',freezer:'1–2 months',condition:'Raw sausage'},
  {food:'Fully cooked sausage',category:'Meat & seafood',aliases:['cooked sausage','sausage'],refrigerator:'1 week',freezer:'1–2 months',condition:'Fully cooked sausage'},
  {food:'Ground meat and ground poultry',category:'Meat & seafood',aliases:['ground beef','minced beef','hamburger meat','ground turkey','ground chicken','minced meat'],refrigerator:'1–2 days',freezer:'3–4 months'},
  {food:'Fresh beef, veal, lamb, or pork steaks, chops, and roasts',category:'Meat & seafood',aliases:['steak','beef steak','pork chop','lamb chop','pork roast','beef roast','veal'],refrigerator:'3–5 days',freezer:'4–12 months'},
  {food:'Fresh chicken or turkey, whole',category:'Meat & seafood',aliases:['whole chicken','whole turkey'],refrigerator:'1–2 days',freezer:'1 year'},
  {food:'Fresh chicken or turkey pieces',category:'Meat & seafood',aliases:['chicken breast','chicken thigh','chicken wings','turkey pieces','chicken pieces'],refrigerator:'1–2 days',freezer:'9 months'},
  {food:'Fatty fish',category:'Meat & seafood',aliases:['salmon','tuna','mackerel','bluefish','catfish','mullet'],refrigerator:'1–3 days',freezer:'2–3 months'},
  {food:'Raw eggs in shell',category:'Dairy & eggs',aliases:['eggs','egg','raw eggs'],refrigerator:'3–5 weeks',freezer:'Do not freeze in shell'},
  {food:'Hard-cooked eggs',category:'Dairy & eggs',aliases:['hard boiled egg','hard-boiled egg','boiled eggs'],refrigerator:'1 week',freezer:'Do not freeze'},
  {food:'Casseroles with eggs',category:'Prepared food',aliases:['egg casserole','breakfast casserole'],refrigerator:'3–4 days',freezer:'2–3 months',condition:'After baking'},
  {food:'Vegetable or meat soups and stews',category:'Prepared food',aliases:['soup','stew','leftover soup'],refrigerator:'3–4 days',freezer:'2–3 months'},
  {food:'Cooked meat or poultry leftovers',category:'Leftovers',aliases:['leftovers','cooked chicken','cooked meat','roast chicken'],refrigerator:'3–4 days',freezer:'2–6 months'},
  {food:'Pizza',category:'Prepared food',aliases:['pizza','leftover pizza'],refrigerator:'3–4 days',freezer:'1–2 months'},
];

const normalize = (value: string) => value.normalize('NFKD').toLowerCase().replace(/[^\p{L}\p{N}]+/gu, ' ').trim();

export function searchStorageGuidance(query: string): StorageGuidance[] {
  const term = normalize(query);
  if (!term) return storageGuidance;
  return storageGuidance.filter(entry => [entry.food, entry.category, ...entry.aliases].some(value => {
    const candidate = normalize(value);
    return candidate.includes(term) || term.includes(candidate);
  }));
}

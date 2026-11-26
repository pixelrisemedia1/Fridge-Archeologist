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
  {food:'Ham',category:'Meat & seafood',aliases:['fresh ham','uncooked ham'],refrigerator:'3–5 days',freezer:'6 months',condition:'Fresh, uncured, uncooked'},
  {food:'Ham',category:'Meat & seafood',aliases:['cooked ham'],refrigerator:'3–4 days',freezer:'3–4 months',condition:'Fresh, uncured, cooked'},
  {food:'Ham',category:'Meat & seafood',aliases:['cured ham'],refrigerator:'5–7 days or “use by” date',freezer:'3–4 months',condition:'Cured, cook-before-eating, uncooked'},
  {food:'Ham',category:'Meat & seafood',aliases:['vacuum sealed ham'],refrigerator:'2 weeks or “use by” date',freezer:'1–2 months',condition:'Fully cooked, plant-sealed, unopened'},
  {food:'Ham',category:'Meat & seafood',aliases:['whole cooked ham'],refrigerator:'1 week',freezer:'1–2 months',condition:'Cooked, store-wrapped, whole'},
  {food:'Ham',category:'Meat & seafood',aliases:['sliced ham','spiral ham'],refrigerator:'3–5 days',freezer:'1–2 months',condition:'Cooked, store-wrapped, sliced, half, or spiral cut'},
  {food:'Country ham',category:'Meat & seafood',aliases:['cooked country ham'],refrigerator:'1 week',freezer:'1 month',condition:'Cooked'},
  {food:'Canned ham',category:'Meat & seafood',aliases:['refrigerated canned ham'],refrigerator:'6–9 months',freezer:'Do not freeze',condition:'Labeled “Keep Refrigerated,” unopened'},
  {food:'Canned ham',category:'Meat & seafood',aliases:['opened canned ham'],refrigerator:'3–4 days',freezer:'1–2 months',condition:'Shelf-stable can, opened; unopened shelf-stable cans have separate pantry guidance'},
  {food:'Prosciutto, Parma, or Serrano ham',category:'Meat & seafood',aliases:['prosciutto','parma ham','serrano ham'],refrigerator:'2–3 months',freezer:'1 month',condition:'Dry type, cut'},
  {food:'Sausage purchased frozen',category:'Meat & seafood',aliases:['frozen sausage'],refrigerator:'After cooking, 3–4 days',freezer:'1–2 months from date of purchase'},
  {food:'Fresh crab meat',category:'Meat & seafood',aliases:['crab meat'],refrigerator:'2–4 days',freezer:'2–4 months'},
  {food:'Fresh lobster',category:'Meat & seafood',aliases:['lobster meat'],refrigerator:'2–4 days',freezer:'2–4 months'},
  {food:'Live crab or lobster',category:'Meat & seafood',aliases:['live crab','live lobster'],refrigerator:'1 day',freezer:'Not recommended'},
  {food:'Live clams, mussels, oysters, or scallops',category:'Meat & seafood',aliases:['live clams','live mussels','live oysters','live scallops'],refrigerator:'5–10 days',freezer:'Not recommended'},
  {food:'Shrimp or crayfish',category:'Meat & seafood',aliases:['shrimp','crayfish'],refrigerator:'3–5 days',freezer:'6–18 months'},
  {food:'Shucked clams, mussels, oysters, or scallops',category:'Meat & seafood',aliases:['shucked clams','shucked mussels','shucked oysters','shucked scallops'],refrigerator:'3–10 days',freezer:'3–4 months'},
  {food:'Squid',category:'Meat & seafood',aliases:['calamari'],refrigerator:'1–3 days',freezer:'6–18 months'},
  {food:'Raw egg whites or yolks',category:'Dairy & eggs',aliases:['egg whites','egg yolks'],refrigerator:'2–4 days',freezer:'12 months',condition:'Yolks do not freeze well'},
  {food:'Raw egg accidentally frozen in shell',category:'Dairy & eggs',aliases:['frozen egg in shell'],refrigerator:'Use immediately after thawing',freezer:'Keep frozen, then thaw in the refrigerator; discard if shell is cracked'},
  {food:'Liquid egg substitute',category:'Dairy & eggs',aliases:['liquid egg substitute'],refrigerator:'1 week',freezer:'Do not freeze',condition:'Unopened'},
  {food:'Liquid egg substitute',category:'Dairy & eggs',aliases:['opened liquid egg substitute'],refrigerator:'3 days',freezer:'Do not freeze',condition:'Opened'},
  {food:'Frozen egg substitute',category:'Dairy & eggs',aliases:['frozen egg substitute'],refrigerator:'After thawing, 1 week or refer to “use by” date',freezer:'12 months',condition:'Unopened'},
  {food:'Frozen egg substitute',category:'Dairy & eggs',aliases:['opened frozen egg substitute'],refrigerator:'After thawing, 3–4 days or refer to “use by” date',freezer:'Do not freeze',condition:'Opened'},
  {food:'Commercial eggnog',category:'Dairy & eggs',aliases:['store-bought eggnog'],refrigerator:'3–5 days',freezer:'6 months'},
  {food:'Homemade eggnog',category:'Dairy & eggs',aliases:['home made eggnog'],refrigerator:'2–4 days',freezer:'Do not freeze'},
  {food:'Pumpkin or pecan pie',category:'Prepared food',aliases:['pumpkin pie','pecan pie'],refrigerator:'After baking, 3–4 days',freezer:'After baking, 1–2 months'},
  {food:'Custard or chiffon pie',category:'Prepared food',aliases:['custard pie','chiffon pie'],refrigerator:'After baking, 3–4 days',freezer:'Do not freeze'},
  {food:'Quiche with filling',category:'Prepared food',aliases:['quiche'],refrigerator:'After baking, 3–5 days',freezer:'After baking, 2–3 months'},
  {food:'Chicken nuggets or patties',category:'Leftovers',aliases:['chicken nuggets','chicken patties'],refrigerator:'3–4 days',freezer:'1–3 months'},
];

const normalize = (value: string) => value.normalize('NFKD').toLowerCase().replace(/[^\p{L}\p{N}]+/gu, ' ').trim();

export function searchStorageGuidance(query: string): StorageGuidance[] {
  const term = normalize(query);
  if (!term) return storageGuidance;
  return storageGuidance.filter(entry => [entry.food, ...entry.aliases].some(value => {
    const candidate = normalize(value);
    return candidate.includes(term);
  }));
}

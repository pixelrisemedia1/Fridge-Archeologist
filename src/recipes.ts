type Amount = { quantity: number; unit: string };

// Approximate home-cooking amounts for the original recipe set, at each recipe's listed base servings.
export const recipeAmounts: Record<string, Amount[]> = {
  frittata: [{quantity:4,unit:'eggs'},{quantity:60,unit:'g spinach'},{quantity:40,unit:'g cheese'},{quantity:.5,unit:'onion'}],
  'fried-rice': [{quantity:450,unit:'g cooked rice'},{quantity:2,unit:'eggs'},{quantity:1,unit:'carrot'},{quantity:75,unit:'g peas'},{quantity:30,unit:'ml soy sauce'}],
  'tomato-beans': [{quantity:400,unit:'g tomato'},{quantity:400,unit:'g white beans'},{quantity:1,unit:'onion'},{quantity:2,unit:'garlic cloves'},{quantity:500,unit:'ml broth'}],
  'apple-oats': [{quantity:1,unit:'apple'},{quantity:80,unit:'g oats'},{quantity:250,unit:'ml milk'},{quantity:2,unit:'g cinnamon'}],
  'chickpea-salad': [{quantity:240,unit:'g chickpeas'},{quantity:.5,unit:'cucumber'},{quantity:1,unit:'tomato'},{quantity:.5,unit:'lemon'},{quantity:60,unit:'g yogurt'}],
};

export function scaledRecipeIngredient(recipeId: string, ingredientIndex: number, baseServings: number, servings: number): string | null {
  const amount = recipeAmounts[recipeId]?.[ingredientIndex];
  if (!amount || !Number.isFinite(baseServings) || baseServings <= 0 || !Number.isFinite(servings) || servings <= 0) return null;
  const scaled = amount.quantity * servings / baseServings;
  const quantity = Number.isInteger(scaled) ? String(scaled) : String(Number(scaled.toFixed(2)));
  return `${quantity} ${amount.unit}`;
}

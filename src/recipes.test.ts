import { describe, expect, it } from 'vitest';
import { scaledRecipeIngredient } from './recipes';

describe('recipe serving adjustments', () => {
  it('scales quantities from the recipe base servings', () => {
    expect(scaledRecipeIngredient('frittata',0,2,4)).toBe('8 eggs');
    expect(scaledRecipeIngredient('apple-oats',2,2,1)).toBe('125 ml milk');
  });

  it('formats fractional ingredients and leaves the original amount at base servings', () => {
    expect(scaledRecipeIngredient('frittata',3,2,2)).toBe('0.5 onion');
    expect(scaledRecipeIngredient('frittata',1,2,2)).toBe('60 g spinach');
  });

  it('returns no invented amount when recipe, ingredient, or serving input is invalid', () => {
    expect(scaledRecipeIngredient('unknown',0,2,4)).toBeNull();
    expect(scaledRecipeIngredient('frittata',100,2,4)).toBeNull();
    expect(scaledRecipeIngredient('frittata',0,0,4)).toBeNull();
  });
});

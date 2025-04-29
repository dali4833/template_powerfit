import { Recipe } from "./Recipe";

export interface SuggestedRecipe {
    id: number;
    dietType: string;
    date: string; 
    recipes: Recipe[];
  }
  
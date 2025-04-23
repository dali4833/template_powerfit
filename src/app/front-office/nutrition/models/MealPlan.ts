import { DietProgram } from "./DietProgram";
import { Recipe } from "./Recipe";

export class MealPlan {
  idMealPlan?: number;
  dayOfWeek: string;
  description: string;
  userId: number;
  dietProgramId?: number; 
  dietProgram?: DietProgram;
  recipe?: Recipe;
  recipeId?:number;

  constructor() {
    this.dayOfWeek = '';
    this.description = '';
    this.userId = 0;
  }
}

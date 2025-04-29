// weekly-analytics.model.ts
export interface WeeklyAnalytics {
  id?: number; 
  week: number;      
  totalRecipes: number;
  totalMealPlans: number;
  mostUsedDietType?: string;
}
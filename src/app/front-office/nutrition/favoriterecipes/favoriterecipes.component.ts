import { Component, OnInit } from '@angular/core';
import { FavoriteRecipeService } from '../../services/favorite-recipe.service';
import { AuthService } from '../../services/auth.service';
import { User } from '../models/User';
import { RecipeService } from '../../services/recipe.service';
import { WeeklyAnalyticsService } from '../../services/weeklyanalysis.service';
import { WeeklyAnalytics } from '../models/WeeklyAnalytics';

@Component({
  selector: 'app-favoriterecipes',
  templateUrl: './favoriterecipes.component.html',
  styleUrls: ['./favoriterecipes.component.css']
})
export class FavoriterecipesComponent implements OnInit{
 
  favoriteRecipes: any[] = [];
  userId: number | null = null;
  user:any;
  isLoading = false;
  analyticsData: WeeklyAnalytics[] = [];


  constructor(private FavoriteRecipeService:FavoriteRecipeService,
    private AuthService:AuthService,
    private recipeService: RecipeService,
    private WeeklyAnalyticsService: WeeklyAnalyticsService
  ){}
  ngOnInit(): void {
    this.getCurrentUser();
    this.loadAnalytics();
  }
  loadFavorites() {
  
      this.FavoriteRecipeService.getFavoritesByUser(this.user?.id).subscribe({
        next: (recipes: any) => {
          this.favoriteRecipes = recipes;
          console.log(this.favoriteRecipes);
          this. isLoading = false;
          
        },
        error: (err) => {
          console.error('Error loading favorites:', err);
          
        }
      });
  }

  getCurrentUser(){
    this.AuthService.getCurrentUser().subscribe(
      (res)=>{
      this.user = res;
      console.log(this.user)
      this.loadFavorites();
    }
  )
  }
  removeFavorite(recipeId: number) {
    this.FavoriteRecipeService.removeFavorite(recipeId).subscribe({
      next: () => {
        this.favoriteRecipes = this.favoriteRecipes.filter(recipe => recipe.id !== recipeId);
      },
      error: (err) => {
        console.error('Error removing favorite:', err);
      }
    });
  }
  getMaxRecipes(): number {
    return Math.max(...this.analyticsData.map(data => data.totalRecipes), 10);
  }
  
  getMaxMealPlans(): number {
    return Math.max(...this.analyticsData.map(data => data.totalMealPlans), 10);
  }
  //analytic partie
  loadAnalytics(): void {
    this.WeeklyAnalyticsService.getAllWeeklyAnalytics().subscribe({
      next: (data) => {
        this.analyticsData = data;
      },
      error: (err) => {
        console.error('Error fetching analytics data', err);
      }
    });
  }


}

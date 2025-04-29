import { Component, OnInit } from '@angular/core';
import { FavoriteRecipeService } from '../../services/favorite-recipe.service';
import { AuthService } from '../../services/auth.service';
import { User } from '../models/User';
import { RecipeService } from '../../services/recipe.service';

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
  


  constructor(private FavoriteRecipeService:FavoriteRecipeService,
    private AuthService:AuthService,
    private recipeService: RecipeService,
  ){}
  ngOnInit(): void {
    this.getCurrentUser();
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

}

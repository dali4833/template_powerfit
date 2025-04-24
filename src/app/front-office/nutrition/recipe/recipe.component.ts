import { Component, OnInit } from '@angular/core';
import { RecipeService } from '../../services/recipe.service';
import { Recipe } from '../models/Recipe';
import { FavoriteRecipeService } from '../../services/favorite-recipe.service';
import { SuggestedRecipe } from '../models/SuggestedRecipes';
import { SuggestedRecipesService } from '../../services/suggested-recipes.service';
import { HeaderService } from '../../services/header.service';
import { DomSanitizer } from '@angular/platform-browser';





@Component({
  selector: 'app-recipe',
  templateUrl: './recipe.component.html',
  styleUrls: ['./recipe.component.css']
})
export class RecipeComponent implements OnInit {
 
  recipes: Recipe[] = [];
  suggestedRecipes: SuggestedRecipe[] = [];
  filteredRecipes: Recipe[] = [];
   searchTerm: string = '';
   visibleRecipesCount = 3;



  constructor(private recipeService: RecipeService,
    private FavoriteRecipeService: FavoriteRecipeService,
     private suggestedRecipeService: SuggestedRecipesService,
     private headerService: HeaderService,
     private sanitizer: DomSanitizer
  ) {}

  // 🧺 Panier par recette : clé = idRecipe, valeur = liste d'ingrédients personnalisés
  customIngredientsMap: { [recipeId: number]: string[] } = {};
  newIngredientsMap: { [recipeId: number]: string } = {};

 

  ngOnInit(): void {
    this.getAll();
    this.getSuggestedRecipes();
    this.filteredRecipes = this.recipes;

  }
  

  getAll() {
    this.recipeService.getAll().subscribe((data) => {
      // trie taa les recette hasb l callories 
      const sortedRecipes = data.sort((a, b) => b.calories - a.calories);
  
      // bch nkho ken top 10
      this.recipes = sortedRecipes.slice(0, 10);
      console.log('Top 10 Recipes: ', this.recipes);
  
      // hedhy lel map taa les rectee lkol affichage aady 
      for (let recipe of this.recipes) {
        this.customIngredientsMap[recipe.idRecipe] = [];
        this.newIngredientsMap[recipe.idRecipe] = '';
      }
      //fuse js pour le fuzzy search lel ingredients wel recipe name 
      this.filteredRecipes = this.recipes;
      
      
    });
  }
  //pour le vd youtube
  sanitizeYoutubeUrl(url: string) {
  return this.sanitizer.bypassSecurityTrustResourceUrl(url.replace("watch?v=", "embed/"));
}
  loadMore() {
    this.visibleRecipesCount += 3;
  }
  
  getReadableDuration(duration: string): string {
    const match = duration.match(/PT(?:(\d+)H)?(?:(\d+)M)?/);
    if (!match) return '';
    const hours = match[1] ? `${match[1]}h` : '';
    const minutes = match[2] ? `${match[2]}m` : '';
    return `${hours} ${minutes}`.trim();
  }
  getSuggestedRecipes() {
    this.suggestedRecipeService.getSuggestedRecipes().subscribe((data) => {
      this.suggestedRecipes = data;
      console.log('Suggested Recipes: ', this.suggestedRecipes);
    });
  }
  addIngredient(recipeId: number): void {
    const newIng = this.newIngredientsMap[recipeId]?.trim();
    if (newIng) {
      this.customIngredientsMap[recipeId].push(newIng);
      this.newIngredientsMap[recipeId] = '';
    }
  }
  getInstructionsAsList(instructions: string): string[] {
  return instructions
    .split('.')
    .map(instr => instr.trim())
    .filter(instr => instr.length > 0);
}


  removeIngredient(recipeId: number, ingredient: string): void {
    this.customIngredientsMap[recipeId] = this.customIngredientsMap[
      recipeId
    ].filter((ing) => ing !== ingredient);
  }
  toggleFavorite(recipe: any) {
    const userEmail = localStorage.getItem('email') || 'nosnos@gmail.com';
    const recipeId = recipe.idRecipe || recipe.recipe?.id;
  
    if (!recipeId) {
      console.error("ID unfound:", recipe);
      return;
    }
  
    if (!recipe.isFavorite) {
      this.FavoriteRecipeService.addFavorite(userEmail, recipeId).subscribe((response: any) => {
        recipe.isFavorite = true;
        recipe.favoriteId = response.id;
      }, error => {
        console.error("Error to add to favorites :", error);
      });
    } else {
      this.FavoriteRecipeService.removeFavorite(recipe.favoriteId).subscribe(() => {
        recipe.isFavorite = false;
        recipe.favoriteId = null;
      }, error => {
        console.error("error to remove from favorites:", error);
      });
    }
  }
  
  
  
  expandedRecipeIds: number[] = [];

  toggleInstructions(recipeId: number): void {
    const index = this.expandedRecipeIds.indexOf(recipeId);
    if (index === -1) {
      // Si l'ID n'est pas encore dans le tableau, on l'ajoute
      this.expandedRecipeIds.push(recipeId);
    } else {
      // Si l'ID est déjà dans le tableau, on le retire
      this.expandedRecipeIds.splice(index, 1);
    }
  }
  recipesPerPage = 3;
currentPage = 1;

get paginatedRecipes() {
  const start = (this.currentPage - 1) * this.recipesPerPage;
  return this.recipes.slice(start, start + this.recipesPerPage);
}

get totalPages() {
  return Math.ceil(this.recipes.length / this.recipesPerPage);
}

changePage(page: number) {
  if (page >= 1 && page <= this.totalPages) {
    this.currentPage = page;
  }
}
onSearch(term: string): void {
  if (!term || term.trim() === '') {
    this.filteredRecipes = this.recipes;
  } else {
    const lowerTerm = term.toLowerCase();
    this.filteredRecipes = this.recipes.filter(recipe =>
      recipe.name.toLowerCase().includes(lowerTerm) ||
      recipe.ingredients.toLowerCase().includes(lowerTerm) ||
      recipe.mealType.toLowerCase().includes(lowerTerm)  // Ajout du filtrage par mealType
    );
    this.visibleRecipesCount = 3;
  }
}



  
  




}

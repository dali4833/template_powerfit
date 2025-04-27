import { Component, OnInit } from '@angular/core';
import { RecipeService } from '../../services/recipe.service';
import { Recipe } from '../models/Recipe';
import { FavoriteRecipeService } from '../../services/favorite-recipe.service';
import { SuggestedRecipe } from '../models/SuggestedRecipes';
import { SuggestedRecipesService } from '../../services/suggested-recipes.service';
import { HeaderService } from '../../services/header.service';
import { DomSanitizer } from '@angular/platform-browser';
import { NutritionService } from '../../services/nutrition.service';
import { AuthService } from '../../services/auth.service';


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
   nutritionRecipes: any[] = [];
   nutritionPage = 4;
   nutritionPageSize = 10;
   nutritionDetail: any=null; 
   searchNutritionTerm = ''; 
   roles :any;
   searchTermNutrition: string = '';



  constructor(private recipeService: RecipeService,
    private FavoriteRecipeService: FavoriteRecipeService,
     private suggestedRecipeService: SuggestedRecipesService,
     private headerService: HeaderService,
     private sanitizer: DomSanitizer,
     private nutritionService: NutritionService,
     private authService:AuthService
  ) {}

  // 🧺 Panier par recette : clé = idRecipe, valeur = liste d'ingrédients personnalisés
  customIngredientsMap: { [recipeId: number]: string[] } = {};
  newIngredientsMap: { [recipeId: number]: string } = {};


 

  ngOnInit(): void {
    this.getAll();
    this.getSuggestedRecipes();
    this.filteredRecipes = this.recipes;
    this.getCurrentUser();
    

  
  }
  //laffichage formulaire selon role nutritionist 
getCurrentUser(){
  this.authService.getCurrentUser().subscribe((res)=>{
    console.log(res);
    this.roles = res?.user_type;
  })
}
  showNutritionModal = false;
  onSearchNutritionRecipe(term: string) {
    if (term.trim() !== '') {
      this.getNutritionRecipes(term.trim());
    } else {
      this.nutritionRecipes = []; // Vide si rien tapé
    }
  }
  //pour l'affichage des recette de l api 
  hoverEffect(event: MouseEvent): void {
    const image = event.target as HTMLImageElement;
    image.style.transform = 'scale(1.05)';
  }
  
  removeHoverEffect(event: MouseEvent): void {
    const image = event.target as HTMLImageElement;
    image.style.transform = 'scale(1)';
  }
  

  openNutritionModal(id: number) {
    this.nutritionService.getRecipeDetails(id).subscribe(
      detail => {
        this.nutritionDetail = detail;
        this.showNutritionModal = true;  // déclenche l’affichage du modal
      },
      err => console.error('Erreur détails nutrition:', err)
    );
  }

  closeNutritionModal() {
    this.showNutritionModal = false;
    this.nutritionDetail = null;
  }

  onSearchNutrition(term: string) {
    if (!term.trim()) {
      this.nutritionRecipes = [];
      return;
    }
    this.nutritionService.getRecipes(term.trim())
      .subscribe(data => {
        this.nutritionRecipes = data.results;
        this.nutritionPage = 1;  // reset pagination
      });
  }
  get paginatedNutritionRecipes() {
    const start = (this.nutritionPage - 1) * this.nutritionPageSize;
    return this.nutritionRecipes.slice(start, start + this.nutritionPageSize);
  }

  loadMoreNutrition() {
    if (this.nutritionPage * this.nutritionPageSize < this.nutritionRecipes.length) {
      this.nutritionPage++;
    }
  }

  // Méthode pour récupérer les recettes nutritionnelles
  getNutritionRecipes(goal: string): void {
    this.nutritionService.getRecipes(goal).subscribe((data) => {
      this.nutritionRecipes = data.results; // Récupérer les recettes à partir de la réponse
      console.log('Nutrition Recipes:', this.nutritionRecipes);
    });
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
  this.filteredRecipes = this.recipes.filter(recipe =>
    recipe.name.toLowerCase().includes(term.toLowerCase()) ||
    recipe.ingredients.toLowerCase().includes(term.toLowerCase()) ||
    recipe.mealType.toLowerCase().includes(term.toLowerCase())
  );
  this.currentPage = 1; // Réinitialiser la page à 1 après chaque recherche
}


}

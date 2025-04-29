import { HttpClient, HttpParams, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, map, retry } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class NutritionService {
  // Configuration API
  private readonly API_CONFIG = {
    spoonacular: {
      baseUrl: 'https://api.spoonacular.com',
      apiKey: '3b2329d1785d4e4b9b103cd5580f67ba',
      endpoints: {
        search: '/recipes/complexSearch',
        recipeDetail: '/recipes/{id}/information',
        recommendations: '/food/recommendations',  // Exemple d'endpoint pour recommandations
        mealPlans: '/mealplanner/generate'
      }
    },
    local: {
      baseUrl: 'http://localhost:8089/api/nutrition'
    }
  };

  constructor(private http: HttpClient) { }

  /**
   * Récupère des recettes basées sur un objectif nutritionnel
   * @param goal Objectif nutritionnel
   * @param limit Nombre de recettes à retourner (défaut: 5)
   */
  getRecipes(goal: string, limit: number = 5): Observable<any> {
    const params = new HttpParams()
      .set('apiKey', this.API_CONFIG.spoonacular.apiKey)
      .set('diet', this.mapGoalToDiet(goal))
      .set('number', limit.toString());

    return this.http.get<any>(
      `${this.API_CONFIG.spoonacular.baseUrl}${this.API_CONFIG.spoonacular.endpoints.search}`,
      { params }
    ).pipe(
      retry(2), // Réessaie 2 fois en cas d'échec
      catchError(this.handleError)
    );
  }

  /**
   * Récupère les détails d'une recette
   * @param id ID de la recette
   */
  getRecipeDetails(id: number): Observable<any> {
    const url = this.API_CONFIG.spoonacular.endpoints.recipeDetail.replace('{id}', id.toString());
    
    return this.http.get<any>(
      `${this.API_CONFIG.spoonacular.baseUrl}${url}`,
      { params: new HttpParams().set('apiKey', this.API_CONFIG.spoonacular.apiKey) }
    ).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * Récupère des recommandations nutritionnelles
   * @param goal Objectif (weight-loss, muscle-gain, etc.)
   */
  getRecommendation(goal: string): Observable<any> {
    // D'abord essayer l'API locale
    return this.http.get(`${this.API_CONFIG.local.baseUrl}/recommendation/${goal}`).pipe(
      catchError(() => {
        // Fallback vers Spoonacular si l'API locale échoue
        return this.getSpoonacularRecommendation(goal);
      })
    );
  }

  /**
   * Récupère des recommandations depuis Spoonacular
   * @param goal Objectif nutritionnel
   */
  private getSpoonacularRecommendation(goal: string): Observable<any> {
    const params = new HttpParams()
      .set('apiKey', this.API_CONFIG.spoonacular.apiKey)
      .set('diet', this.mapGoalToDiet(goal));

    return this.http.get<any>(
      `${this.API_CONFIG.spoonacular.baseUrl}${this.API_CONFIG.spoonacular.endpoints.recommendations}`,
      { params }
    ).pipe(
      map(response => this.formatSpoonacularResponse(response)),
      catchError(this.handleError)
    );
  }

  /**
   * Gère les erreurs HTTP
   */
  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'Une erreur inconnue est survenue';
    
    if (error.error instanceof ErrorEvent) {
      // Erreur côté client
      errorMessage = `Erreur: ${error.error.message}`;
    } else {
      // Erreur côté serveur
      errorMessage = `Code ${error.status}: ${error.message}`;
    }
    
    console.error(errorMessage);
    return throwError(errorMessage);
  }

  /**
   * Transforme les objectifs de l'application en paramètres d'API Spoonacular
   */
  private mapGoalToDiet(goal: string): string {
    const goalMapping: {[key: string]: string} = {
      'WEIGHT_LOSS': 'low-calorie',
      'WEIGHT_GAIN': 'high-protein',
      'MUSCLE_GAIN': 'high-protein',
      'FAT_LOSS': 'low-fat',
      'VEGAN_DIET': 'vegan',
      'LOW_CARB': 'low-carb',
      'HIGH_PROTEIN': 'high-protein',
      'DIABETES_MANAGEMENT': 'low-sugar',
      'CHOLESTEROL_CONTROL': 'low-cholesterol'
    };

    return goalMapping[goal] || 'balanced';
  }

  /**
   * Formate la réponse de Spoonacular pour notre application
   */
  private formatSpoonacularResponse(response: any): any {
    // Adaptez cette méthode selon la structure de réponse de Spoonacular
    return {
      nutritionAdvice: response.nutrition?.advice || 'Consultez un nutritionniste pour des conseils personnalisés.',
      exerciseRecommendations: response.exercise?.tips || '30 minutes d\'activité physique quotidienne recommandée.',
      sampleMealPlan: response.meals?.plan || 'Plan de repas non disponible.'
    };
  }
}
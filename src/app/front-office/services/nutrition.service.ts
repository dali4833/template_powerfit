import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NutritionService {

  private baseUrl = 'http://localhost:8089/api/nutrition';
  private apiUrl = 'https://api.spoonacular.com/recipes/complexSearch';
  private apiKey = '3b2329d1785d4e4b9b103cd5580f67ba'; 
  private recipeDetailUrl = 'https://api.spoonacular.com/recipes';  // <-- Nouvelle base correcte


  constructor(private http: HttpClient) {}

  //nrecuperie recipes mel api 
  getRecipes(goal: string): Observable<any> {
    const params = new HttpParams()
      .set('apiKey', this.apiKey)
      .set('diet', goal)  // Objectif nutritionnel (par exemple "vegan", "high-protein", etc.)
      .set('number', '5');  // Nombre de recettes à récupérer (5 ici, mais tu peux ajuster)

    return this.http.get<any>(this.apiUrl, { params });
  }
  getRecipeDetails(id: number): Observable<any> {
    return this.http.get<any>(`${this.recipeDetailUrl}/${id}/information`, {
      params: new HttpParams().set('apiKey', this.apiKey)
    });
  }
  

  getRecommendation(goal: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/recommendation/${goal}`);
  }
}

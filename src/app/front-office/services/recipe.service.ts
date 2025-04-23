import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Recipe } from '../nutrition/models/Recipe';
import { HeaderService } from './header.service';
import { WeeklyAnalytics } from 'src/app/front-office/nutrition/models/WeeklyAnalytics';

@Injectable({
  providedIn: 'root'
})
export class RecipeService {
  private apiUrl = 'http://localhost:8089/Powfit/recipe';

  constructor(private http: HttpClient, private headerService: HeaderService) {}

  //  bch trécupéries les recettes lkol
  getAll(): Observable<Recipe[]> {
    return this.http.get<Recipe[]>(`${this.apiUrl}/retrieveAllRecipes`, {
      headers: this.headerService.getHeader(),
    });
  }

  // trécupérie recette bel id
  getById(id: number): Observable<Recipe> {
    return this.http.get<Recipe>(`${this.apiUrl}/retrieve-recipe/${id}`, {
      headers: this.headerService.getHeader(),
    });
  }

  // POST: tajouty recette
  create(recipe: Recipe): Observable<any> {
    return this.http.post(`${this.apiUrl}/add-recipe`, recipe, {
      responseType: 'text', 
        headers: this.headerService.getHeader(),
    });
  }

  //  tmodifie fy recette
  update(recipe: Recipe): Observable<any> {
    return this.http.put(`${this.apiUrl}/update-recipe`, recipe, {
      responseType: 'text', 
        headers: this.headerService.getHeader(),
    });
  }

  //  Supprimer un recipe
  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/remove-recipe/${id}`, {
      headers: this.headerService.getHeader(),
    });
  }

  //  tzyd barcha recettet
  addMany(recipes: Recipe[]): Observable<Recipe[]> {
    return this.http.post<Recipe[]>(`${this.apiUrl}/add-manyrecipes`, recipes, {
      headers: this.headerService.getHeader(),
    });
  }

  //  taaml search bbarcha userids
  findByMultipleUserIds(userIds: number[]): Observable<Recipe[]> {
    const params = userIds.map((id) => `userIds=${id}`).join('&');
    return this.http.get<Recipe[]>(
      `${this.apiUrl}/findByMultipleUserIds?${params}`
    , {
      headers: this.headerService.getHeader(),
    });
  }

  //  Rechercher par userId
  findByUserId(userId: number): Observable<Recipe[]> {
    return this.http.get<Recipe[]>(
      `${this.apiUrl}/findByUserId?userId=${userId}`
    , {
      headers: this.headerService.getHeader(),
    });
  }
  getWeeklyAnalytics() {
    return this.http.get<WeeklyAnalytics[]>('/api/weekly-analytics');
  }
  searchRecipes(query: string): Observable<Recipe[]> {
    return this.http.get<Recipe[]>(`${this.apiUrl}/recipes/search?q=${query}`);
  }
  
}


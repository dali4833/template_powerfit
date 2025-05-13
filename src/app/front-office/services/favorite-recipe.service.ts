import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { HeaderService } from './header.service';
import {environment} from "../../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class FavoriteRecipeService {

  private baseUrl = `${environment.apiUrl}/recipe/favorites`;

  constructor(private http: HttpClient, private headerService: HeaderService) {}

  // ajout
  addFavorite(email: string, recipeId: number) {
   /* const params = {
      email: email,
      recipeId: recipeId.toString()

    };*/

    return this.http.post(`${this.baseUrl}/addfav/${email}/${recipeId}`, null, {
     /* params,*/
      headers: this.headerService.getHeader()
    });
  }

  // Méthode pour récupérer les favoris d'un utilisateur
  getFavoritesByUser(userId: number) {
    return this.http.get(`${this.baseUrl}/recipeget/${userId}`, {
      headers: this.headerService.getHeader()
    });
  }

  // Méthode pour retirer un favori
  removeFavorite(id: number) {
    return this.http.delete(`${this.baseUrl}/removefav/${id}`, {
      headers: this.headerService.getHeader()
    });
  }
}

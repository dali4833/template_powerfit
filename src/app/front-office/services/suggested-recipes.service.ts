import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { SuggestedRecipe } from '../nutrition/models/SuggestedRecipes';
import { HeaderService } from './header.service';

@Injectable({
  providedIn: 'root'
})
export class SuggestedRecipesService {

  constructor(private http: HttpClient ,
    private headerService: HeaderService
   ) { }

  getSuggestedRecipes(): Observable<any[]> {
    return this.http.get<any[]>('http://localhost:8089/Powfit/recipe/suggestedrecipes',{
      headers: this.headerService.getHeader(),
    });
  }
  
  
}

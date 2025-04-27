import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {map, Observable} from 'rxjs';
import { Category } from '../models/category.model'; // Adjust the path

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  private apiUrl = 'http://localhost:8080/api/categories'; // Adjust based on your backend URL

  constructor(private http: HttpClient) {}

  // Fetch all categories
  getAllCategories(): Observable<Category[]> {
    return this.http.get<Category[]>(this.apiUrl).pipe(
      map(categories => categories.map(category => {
        // Prepend the base URL if the imageUrl is relative
        if (category.imageUrl && !category.imageUrl.startsWith('http')) {
          category.imageUrl = `http://localhost:8080${category.imageUrl}`;
        }
        return category;
      }))
    );
  }
}

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {map, Observable} from 'rxjs';
import { Category } from './categorie.module'; // Adjust the path if necessary

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  private apiUrl = 'http://localhost:8089/api/categories'; // Adjust based on your backend URL

  constructor(private http: HttpClient) {}

  // Fetch all categories
  getAllCategories(): Observable<Category[]> {
    return this.http.get<Category[]>(this.apiUrl).pipe(
      map(categories => categories.map(category => {
        // Prepend the base URL if the imageUrl is relative
        if (category.imageUrl && !category.imageUrl.startsWith('http')) {
          category.imageUrl = `http://localhost:8089${category.imageUrl}`;
        }
        return category;
      }))
    );
  }

  // Add a new category
  addCategory(categoryData: FormData): Observable<Category> {
    return this.http.post<Category>(this.apiUrl, categoryData);
  }

  // Edit an existing category
  editCategory(categoryId: string | undefined, categoryData: FormData):  Observable<Category> {
    return this.http.put<Category>(`${this.apiUrl}/${categoryId}`, categoryData);
  }

  // Delete a category
  deleteCategory(categoryId: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${categoryId}`);
  }
}

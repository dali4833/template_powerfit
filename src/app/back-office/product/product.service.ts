import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable, map, catchError, of} from 'rxjs';
import { Product } from './product.model';
import {Category} from "../categorie/categorie.module";
import {ProductStatistics} from "../models/product-statistics.model";
import {environment} from "../../../environments/environment";


@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private apiUrl = `${environment.apiUrl}/api/products`;

  constructor(private http: HttpClient) {}

  getAllProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(this.apiUrl).pipe(
      map(products => products.map(product => {
        // Format image URL if needed
        if (product.imageUrl && !product.imageUrl.startsWith('http')) {
          product.imageUrl = `http://localhost:8089${product.imageUrl}`;
        }
        return product;
      }))
    );
  }

  // In product.service.ts
  getProductStatistics(): Observable<ProductStatistics> {
    return this.http.get<ProductStatistics>(`${this.apiUrl}/statistics`).pipe(
      catchError(error => {
        console.error('Error fetching statistics:', error);
        return of({
          totalProducts: 0,
          totalQuantity: 0,
          averagePrice: 0,
          lowStockCount: 0,
          topSellingProducts: []
        });
      })
    );
  }

// In category.service.ts
  getAllCategories(): Observable<Category[]> {
    return this.http.get<Category[]>('/api/categories'); // Adjust if necessary
  }

  addProduct(formData: FormData): Observable<Product> {
    // Make sure your backend expects all these fields
    return this.http.post<Product>(this.apiUrl, formData);
  }

  editProduct(productId: string, formData: FormData): Observable<Product> {
    return this.http.put<Product>(`${this.apiUrl}/${productId}`, formData);
  }

  deleteProduct(productId: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${productId}`);
  }
}

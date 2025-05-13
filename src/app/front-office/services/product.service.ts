import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Product } from '../models/product.model';
import { map } from 'rxjs/operators';
import {environment} from "../../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private apiUrl = `${environment.apiUrl}/api/products`; // Adjust the API URL as necessary

  constructor(private http: HttpClient) {}

  getProductsByCategory(categoryId: number): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.apiUrl}/category/${categoryId}`).pipe(
      map(products => products.map(product => {
        // Prepend the base URL if the imageUrl is relative
        if (product.imageUrl && !product.imageUrl.startsWith('http')) {
          product.imageUrl = `http://localhost:8089${product.imageUrl}`;
        }
        return product;
      }))
    );
  }
}

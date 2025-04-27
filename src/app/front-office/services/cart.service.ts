import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import {AuthService} from "./auth.service";
import {NotificationService} from "./notification.service";

interface Command {
  id: number;
  product: {
    id: number;
    name: string;
    price: number;
    imageUrl?: string;
  };
  quantity: number;
}

@Injectable({ providedIn: 'root' })
export class CartService {
  private apiUrl = 'http://localhost:8080/api/commands';
  public cartItemsSubject = new BehaviorSubject<Command[]>([]);
  private cartCountSubject = new BehaviorSubject<number>(0);

  cartItems$ = this.cartItemsSubject.asObservable();
  cartCount$ = this.cartCountSubject.asObservable();

  constructor(private http: HttpClient ,private authService: AuthService ,private notificationService: NotificationService) { }

  // Initialize cart for the current user
  initializeCart(): void {
    if (this.authService.isLoggedIn()) {
      this.getCommandsForUser().subscribe();
    } else {
      console.error('User is not authenticated. Cannot initialize cart.');
    }
  }

  getCommandsForUser(): Observable<Command[]> {
    return this.http.get<Command[]>(`${this.apiUrl}/user`, {
      headers: this.authService.getAuthHeaders() // Include token in headers
    }).pipe(
      tap(commands => {
        const processedCommands = commands.map(command => ({
          ...command,
          product: {
            ...command.product,
            imageUrl: this.processImageUrl(command.product.imageUrl)
          }
        }));
        this.cartItemsSubject.next(processedCommands);
        this.updateCartCount(processedCommands);
      }),
      catchError(error => {
        console.error('Error retrieving commands for user:', error);
        return throwError(error); // Rethrow the error for further handling if needed
      })
    );
  }

  addToCart(productId: number, quantity: number = 1): Observable<Command> {
    if (!this.authService.isLoggedIn()) {
      this.notificationService.showLoginRequired(); // Show login notification
      return throwError(() => new Error('User not logged in'));
    }

    const body = { productId, quantity };
    return this.http.post<Command>(this.apiUrl, body, {
      headers: this.authService.getAuthHeaders() // Use AuthService to get headers
    }).pipe(
      tap(() => {
        this.getCommandsForUser().subscribe(); // Refresh cart
      }),
      catchError(error => {
        console.error('Error adding to cart:', error);
        return throwError(error);
      })
    );
  }

  updateQuantity(commandId: number, newQuantity: number): Observable<any> {
    const currentItem = this.cartItemsSubject.value.find(item => item.id === commandId);

    if (!currentItem) {
      return throwError(() => new Error('Item not found in cart'));
    }

    const body = {
      quantity: newQuantity,
      productId: currentItem.product.id,
    };

    return this.http.put(`${this.apiUrl}/${commandId}`, body).pipe(
      tap(() => {
        const updatedItems = this.cartItemsSubject.value.map(item =>
          item.id === commandId ? { ...item, quantity: newQuantity } : item
        );
        this.cartItemsSubject.next(updatedItems);
        this.updateCartCount(updatedItems);
      }),
      catchError(error => {
        console.error('Error updating quantity:', error);
        return throwError(error);
      })
    );
  }

  removeItem(commandId: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${commandId}`).pipe(
      tap(() => {
        const updatedItems = this.cartItemsSubject.value.filter(item => item.id !== commandId);
        this.cartItemsSubject.next(updatedItems);
        this.updateCartCount(updatedItems);
      }),
      catchError(error => {
        console.error('Error removing item:', error);
        return throwError(() => new Error('Failed to remove item. Please try again.'));
      })
    );
  }

  private processImageUrl(url?: string): string | undefined {
    if (!url) return undefined;
    return url.startsWith('http') ? url : `http://localhost:8080${url}`;
  }

  private updateCartCount(items: Command[]): void {
    const count = items.length; // Count distinct products
    this.cartCountSubject.next(count);
  }

  updateLocalItemQuantity(itemId: number, newQuantity: number): void {
    const items = this.cartItemsSubject.value.map(item => {
      if (item.id === itemId) {
        return { ...item, quantity: newQuantity };
      }
      return item;
    });
    this.cartItemsSubject.next(items);
  }

  removeLocalItem(itemId: number): void {
    const items = this.cartItemsSubject.value.filter(item => item.id !== itemId);
    this.cartItemsSubject.next(items);
  }

  addLocalItem(item: any): void {
    const currentItems = this.cartItemsSubject.value;
    this.cartItemsSubject.next([...currentItems, item]);
  }

}

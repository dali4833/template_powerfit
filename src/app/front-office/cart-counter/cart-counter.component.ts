
import { CartService } from '../services/cart.service';
import { NotificationService } from "../services/notification.service";
import { StripeCheckoutService } from "../services/stripe-checkout.service";
import {Component, OnInit} from "@angular/core";

@Component({
  selector: 'app-cart-counter',
  templateUrl: './cart-counter.component.html',
  styleUrls: ['./cart-counter.component.css']
})
export class CartCounterComponent implements OnInit {
  isCartVisible = false;
  isCheckingOut = false; // Loading state for checkout

  constructor(
    public cartService:CartService,
    private stripeCheckoutService: StripeCheckoutService,
    private notificationService: NotificationService
  ) {}

  ngOnInit(): void {
    this.cartService.initializeCart(); // No userId needed
  }

  increaseQuantity(event: Event, item: any): void {
    event.preventDefault();
    event.stopPropagation();

    // Optimistic UI update - update locally first
    const newQuantity = item.quantity + 1;
    this.cartService.updateLocalItemQuantity(item.id, newQuantity);

    // Then sync with backend
    this.cartService.updateQuantity(item.id, newQuantity)
      .subscribe({
        error: (err) => {
          // Revert if there's an error
          this.cartService.updateLocalItemQuantity(item.id, item.quantity);
          console.error('Failed to update quantity:', err);
        }
      });
  }

  decreaseQuantity(event: Event, item: any): void {
    event.preventDefault();
    event.stopPropagation();

    if (item.quantity > 1) {
      // Optimistic UI update
      const newQuantity = item.quantity - 1;
      this.cartService.updateLocalItemQuantity(item.id, newQuantity);

      // Sync with backend
      this.cartService.updateQuantity(item.id, newQuantity)
        .subscribe({
          error: (err) => {
            // Revert if error
            this.cartService.updateLocalItemQuantity(item.id, item.quantity);
            console.error('Failed to update quantity:', err);
          }
        });
    }
  }

  removeItem(event: Event, item: any): void {
    event.preventDefault();
    event.stopPropagation();

    // Optimistic removal
    this.cartService.removeLocalItem(item.id);

    // Sync with backend
    this.cartService.removeItem(item.id).subscribe({
      error: (err) => {
        // Revert if error
        this.cartService.addLocalItem(item);
        console.error('Failed to remove item:', err);
      }
    });
  }

  toggleCart(event?: Event): void {
    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }
    this.isCartVisible = !this.isCartVisible;
    if (this.isCartVisible) {
      this.cartService.getCommandsForUser().subscribe(); // No userId needed
    }
  }

  showCart(event?: Event): void {
    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }
    this.isCartVisible = true;
    this.cartService.getCommandsForUser().subscribe(); // No userId needed
  }

  hideCart(event?: Event): void {
    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }
    this.isCartVisible = false;
  }

  getTotalPrice(): number {
    const items = this.cartService.cartItemsSubject.value;
    return items.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
  }

  async proceedToCheckout(): Promise<void> {
    if (this.getTotalPrice() <= 0 || !this.cartService.cartItemsSubject.value.length) {
      this.notificationService.showError('Your cart is empty');
      return;
    }

    this.isCheckingOut = true;

    try {
      const cartItems = this.cartService.cartItemsSubject.value.map(item => ({
        id: item.product.id,
        name: item.product.name,
        price: item.product.price,
        quantity: item.quantity,
        imageUrl: item.product.imageUrl
      }));

      await this.stripeCheckoutService.redirectToCheckout(cartItems);
    } catch (error: unknown) {
      let errorMessage = 'Checkout failed. Please try again.';

      if (error instanceof Error) {
        errorMessage = error.message;
      } else if (typeof error === 'string') {
        errorMessage = error;
      }

      this.notificationService.showError(errorMessage);
      console.error('Checkout error:', error);
    } finally {
      this.isCheckingOut = false;
    }
  }
}

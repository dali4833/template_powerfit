import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProductService } from '../../services/product.service';
import { Product } from '../../models/product.model';
import { NotificationService } from "../../services/notification.service";
import { CartService } from "../../services/cart.service";
import {StripeCheckoutService} from "../../services/stripe-checkout.service";

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css']
})
export class ProductsComponent implements OnInit {
  products: Product[] = [];
  categoryId: number = 0;
  cartCount: number = 0;
  currentUserId: number = 1; // Hardcoded for now (replace with actual user ID)
  cartItems: Product[] = []; // Track items for checkout

  constructor(
    private route: ActivatedRoute,
    private productService: ProductService,
    private notificationService: NotificationService,
    private cartService: CartService,
  private stripeCheckoutService: StripeCheckoutService // Add this
  ) {
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.categoryId = +params['categoryId'];
      this.loadProducts();
    });



  }

  loadProducts(): void {
    this.productService.getProductsByCategory(this.categoryId).subscribe({
      next: (products) => this.products = products,
      error: (error) => this.notificationService.showError('Failed to load products')
    });
  }

  addToCart(product: Product): void {
    this.cartService.addToCart(product.id, this.currentUserId).subscribe({
      next: () => {
        this.notificationService.showSuccess(`${product.name} added to cart!`);
        this.cartItems.push(product);
      },

        // Rollback is already handled in the service

    });
  }

  async proceedToCheckout(): Promise<void> {
    if (this.cartItems.length === 0) {
      this.notificationService.showError('Your cart is empty');
      return;
    }

    try {
      await this.stripeCheckoutService.redirectToCheckout(
        this.cartItems.map(item => ({
          id: item.id,
          name: item.name,
          price: item.price * 100, // Convert to cents for Stripe
          quantity: 1
        }))
      );
    } catch (error) {
      this.notificationService.showError('Checkout failed. Please try again.');
      console.error('Checkout error:', error);
    }
  }




}

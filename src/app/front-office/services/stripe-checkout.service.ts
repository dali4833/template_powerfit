import { Injectable } from '@angular/core';
import { loadStripe, Stripe } from '@stripe/stripe-js';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

interface CartItem {
  id: string | number;
  name: string;
  price: number;
  quantity: number;
}

@Injectable({
  providedIn: 'root'
})
export class StripeCheckoutService {
  private stripePromise: Promise<Stripe | null>;

  constructor(private http: HttpClient) {
    this.stripePromise = loadStripe(environment.stripePublishableKey);
  }

  async redirectToCheckout(cartItems: CartItem[]): Promise<void> {
    try {
      // Health check with proper response type
      const healthCheck = await this.http.get<{status: string}>(
        `${environment.apiUrl}/api/payments/health`,
        { responseType: 'json' }
      ).toPromise();
      console.log('Service status:', healthCheck?.status);
    } catch (error: unknown) {
      console.error('Health check failed:', error);
      throw new Error('Service unavailable. Please try again later.');
    }

      // Create session
      const response = await this.http.post<{ sessionId: string }>(
        `${environment.apiUrl}/api/payments/create-session`,
        cartItems,
        { observe: 'response' }
      ).toPromise();

      if (!response || !response.body) {
        throw new Error('Invalid server response');
      }

      const stripe = await this.stripePromise;
      if (!stripe) {
        throw new Error('Stripe not loaded');
      }

      const { error } = await stripe.redirectToCheckout({
        sessionId: response.body.sessionId
      });

      if (error) throw error;

    } catch (error: unknown) {
      console.error('Checkout error:', error);

      // Proper error type handling
      if (isStripeError(error)) {
        throw new Error(error.message);
      } else if (isHttpError(error)) {
        throw new Error(error.error?.message || 'Payment service error');
      } else if (error instanceof Error) {
        throw error;
      } else {
        throw new Error('Checkout failed. Please try again.');
      }
    }

}

// Type guards for error handling
function isStripeError(error: unknown): error is { message: string } {
  return typeof error === 'object' && error !== null && 'message' in error;
}

function isHttpError(error: unknown): error is { error: { message?: string } } {
  return typeof error === 'object' && error !== null && 'error' in error;
}

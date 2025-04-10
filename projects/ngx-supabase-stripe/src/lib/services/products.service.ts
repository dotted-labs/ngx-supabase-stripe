import { Injectable, inject } from '@angular/core';
import { ProductsStore, StripeProductPublic } from '../store/products.store';

@Injectable({
  providedIn: 'root'
})
export class ProductsService {
  private readonly productsStore = inject(ProductsStore);

  public products = this.productsStore.products;

  constructor() {
    console.log('🚀 [ProductsService]: Initialized');
  }

  /**
   * Load products from Stripe
   */
  public async loadProducts(): Promise<void> {
    await this.productsStore.loadProducts();
  }

  /**
   * Check if products are being loaded
   */
  public isLoading(): boolean {
    return this.productsStore.isStatusLoading();
  }

  /**
   * Check if products have loaded successfully
   */
  public isSuccess(): boolean {
    return this.productsStore.isStatusSuccess();
  }

  /**
   * Check if there was an error loading products
   */
  public isError(): boolean {
    return this.productsStore.isStatusError();
  }

  /**
   * Get the error message if any
   */
  public getError(): string | null {
    return this.productsStore.isError();
  }

  /**
   * Check if there are products available
   */
  public hasProducts(): boolean {
    return this.productsStore.hasProducts();
  }
} 
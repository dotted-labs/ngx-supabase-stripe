import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { EmbeddedCheckoutComponent, ProductListComponent, ProductsStore, StripePricePublic, StripeProductPublic } from '@ngx-supabase-stripe';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterLink,
    EmbeddedCheckoutComponent, 
    ProductListComponent
  ],
  templateUrl: './checkout.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CheckoutComponent {
  public readonly productsStore = inject(ProductsStore);

  public readonly selectedPrice = signal<string | null>(null);
  public readonly selectedProduct = signal<StripeProductPublic | null>(null);
  public readonly useStripeProducts = signal(false);

  public readonly products = computed(() => this.productsStore.oneTimeProducts());

  public customerEmail = signal<string | null>(null);

  public selectPrice(price: StripePricePublic): void {
    this.selectedPrice.set(price.id);
  }

  public selectProduct(product: StripeProductPublic): void {
    this.selectedProduct.set(product);
  }

  public resetSelection(): void {
    this.selectedPrice.set(null);
  }

  public toggleProductView(): void {
    this.useStripeProducts.update(value => !value);
    this.resetSelection();
  }

  public startCheckout(email: string): void {
    this.customerEmail.set(email);
  }
} 
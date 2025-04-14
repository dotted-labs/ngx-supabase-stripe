import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { EmbeddedCheckoutComponent, ProductListComponent, StripePricePublic, StripeProductPublic } from '@ngx-supabase-stripe';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    EmbeddedCheckoutComponent, 
    ProductListComponent
  ],
  templateUrl: './checkout.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CheckoutComponent {
  public readonly selectedPrice = signal<string | null>(null);
  public readonly selectedProduct = signal<StripeProductPublic | null>(null);
  public readonly isLoading = signal(false);
  public readonly error = signal<string | null>(null);
  public readonly useStripeProducts = signal(false);

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
} 
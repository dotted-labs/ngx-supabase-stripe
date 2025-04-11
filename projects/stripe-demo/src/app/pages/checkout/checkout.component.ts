import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { EmbeddedCheckoutComponent, ProductListComponent, StripeProductPublic } from '@ngx-supabase-stripe';

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
  public readonly isLoading = signal(false);
  public readonly error = signal<string | null>(null);
  public readonly useStripeProducts = signal(false);

  public selectPrice(product: StripeProductPublic): void {
    this.selectedPrice.set(product.price_details?.id || product.default_price);
  }

  public resetSelection(): void {
    this.selectedPrice.set(null);
  }

  public onProductSelected(product: StripeProductPublic): void {
    this.selectPrice(product);
  }

  public toggleProductView(): void {
    this.useStripeProducts.update(value => !value);
    this.resetSelection();
  }
} 
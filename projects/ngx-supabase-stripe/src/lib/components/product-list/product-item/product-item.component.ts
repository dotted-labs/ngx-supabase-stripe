import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StripePricePublic, StripeProductPublic } from '../../../store/products.store';

@Component({
  selector: 'lib-product-item',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './product-item.component.html'
})
export class ProductItemComponent {
  public readonly product = input.required<StripeProductPublic>();
  public readonly buttonText = input<string>('Select');

  public readonly productSelected = output<StripeProductPublic>();
  public readonly priceSelected = output<StripePricePublic>();

  formatPrice(price: any): string {
    if (!price || !price.unit_amount) {
      return 'Price unavailable';
    }

    const amount = price.unit_amount / 100;
    const currency = price.currency?.toUpperCase() || 'USD';
    
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
    }).format(amount);
  }

  onSelect(price: StripePricePublic) {
    this.productSelected.emit(this.product());
    this.priceSelected.emit(price);
  }
} 
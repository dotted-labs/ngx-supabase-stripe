import { CommonModule } from '@angular/common';
import { Component, computed, inject, input, output } from '@angular/core';
import { UtilsService } from '../../../services/utils.service';
import { StripePricePublic, StripeProductPublic } from '../../../store/products.store';
import { Currency } from '../../../models/currency.model';

@Component({
  selector: 'lib-product-item',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './product-item.component.html'
})
export class ProductItemComponent {
  public readonly product = input.required<StripeProductPublic>();
  public readonly currency = input<Currency>(Currency.EUR);

  public readonly productSelected = output<StripeProductPublic>();
  public readonly priceSelected = output<StripePricePublic>();

  public readonly utils = inject(UtilsService);

  public price = computed(() => this.product().prices.find(price => price.details.currency === this.currency()));

  onSelect() {
    this.productSelected.emit(this.product());
    this.priceSelected.emit(this.price()?.details as StripePricePublic);
  }
} 
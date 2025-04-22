import { CommonModule } from '@angular/common';
import { Component, inject, input, output } from '@angular/core';
import { UtilsService } from '../../../services/utils.service';
import { StripePricePublic, StripeProductPublic } from '../../../store/products.store';

@Component({
  selector: 'lib-product-item',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './product-item.component.html'
})
export class ProductItemComponent {
  public readonly product = input.required<StripeProductPublic>();
  
  public readonly productSelected = output<StripeProductPublic>();
  public readonly priceSelected = output<StripePricePublic>();

  public readonly utils = inject(UtilsService);

  onSelect(price: StripePricePublic) {
    this.productSelected.emit(this.product());
    this.priceSelected.emit(price);
  }
} 
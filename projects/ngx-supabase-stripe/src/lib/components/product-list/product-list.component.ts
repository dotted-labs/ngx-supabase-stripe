import { CommonModule } from '@angular/common';
import { Component, inject, input, output } from '@angular/core';
import { ProductsStore, StripePricePublic, StripeProductPublic } from '../../store/products.store';
import { ProductItemSkeletonComponent } from './product-item-skeleton/product-item-skeleton.component';
import { ProductItemComponent } from './product-item/product-item.component';

@Component({
  selector: 'lib-product-list',
  standalone: true,
  imports: [CommonModule, ProductItemComponent, ProductItemSkeletonComponent],
  templateUrl: './product-list.component.html'
})
export class ProductListComponent {
  public readonly productsStore = inject(ProductsStore);

  public readonly products = input<StripeProductPublic[]>([]);
  
  public readonly productSelected = output<StripeProductPublic>();
  public readonly priceSelected = output<StripePricePublic>();

  onProductSelect(product: StripeProductPublic) {
    this.productSelected.emit(product);
  }

  onPriceSelect(price: StripePricePublic) {
    this.priceSelected.emit(price);
  }
} 
import { CommonModule } from '@angular/common';
import { Component, computed, inject, input, OnInit, output } from '@angular/core';
import { ProductsStore, StripePricePublic, StripeProductPublic } from '../../store/products.store';
import { ProductItemSkeletonComponent } from './product-item-skeleton/product-item-skeleton.component';
import { ProductItemComponent } from './product-item/product-item.component';

@Component({
  selector: 'lib-product-list',
  standalone: true,
  imports: [CommonModule, ProductItemComponent, ProductItemSkeletonComponent],
  templateUrl: './product-list.component.html'
})
export class ProductListComponent implements OnInit {
  public readonly productsStore = inject(ProductsStore);

  productType = input<'one_time' | 'recurring'>('one_time');

  public readonly products = computed(() => this.getProductsByType(this.productType()));
  
  public readonly productSelected = output<StripeProductPublic>();
  public readonly priceSelected = output<StripePricePublic>();

  ngOnInit(): void {
    if (!this.productsStore.hasProducts()) {
      this.productsStore.loadProducts();
    }
  }

  onProductSelect(product: StripeProductPublic) {
    this.productSelected.emit(product);
  }

  onPriceSelect(price: StripePricePublic) {
    this.priceSelected.emit(price);
  }

  public getProductsByType(type: 'one_time' | 'recurring'): StripeProductPublic[] {
    if(type === 'one_time') {
      return this.productsStore.oneTimeProducts();
    }

    if (type === 'recurring') {
      return this.productsStore.recurringProducts();
    }

    return [];
  }
} 
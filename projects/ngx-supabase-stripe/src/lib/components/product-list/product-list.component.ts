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

  productIds = input<string[]>([]);

  public readonly products = computed(() => this.getProducts(this.productType(), this.productIds()));
  
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

  public getProducts(type: 'one_time' | 'recurring', ids: string[]): StripeProductPublic[] {
    if(ids.length > 0) {
      return this.productsStore.getProductsByIds(ids);
    }

    if(type === 'one_time') {
      return this.productsStore.oneTimeProducts();
    }

    if (type === 'recurring') {
      return this.productsStore.recurringProducts();
    }

    return [];
  }
} 
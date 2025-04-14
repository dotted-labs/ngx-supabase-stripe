import { CommonModule } from '@angular/common';
import { Component, OnInit, computed, inject, input, output } from '@angular/core';
import { ProductsService } from '../../services/products.service';
import { StripePricePublic, StripeProductPublic } from '../../store/products.store';
import { ProductItemSkeletonComponent } from './product-item-skeleton/product-item-skeleton.component';
import { ProductItemComponent } from './product-item/product-item.component';

@Component({
  selector: 'lib-product-list',
  standalone: true,
  imports: [CommonModule, ProductItemComponent, ProductItemSkeletonComponent],
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.scss']
})
export class ProductListComponent implements OnInit {
  productType = input<'one_time' | 'recurring'>('one_time');

  public readonly productsService = inject(ProductsService);

  public readonly products = computed(() => this.productsService.getProductsByType(this.productType()));
  
  /**
   * Button text for product selection
   */
  public buttonText = input<string>('Select');
  
  /**
   * Event emitted when a product is selected
   */
  public readonly productSelected = output<StripeProductPublic>();
  public readonly priceSelected = output<StripePricePublic>();

  ngOnInit(): void {
    this.productsService.loadProducts();
  }

  onProductSelect(product: StripeProductPublic) {
    this.productSelected.emit(product);
  }

  onPriceSelect(price: StripePricePublic) {
    this.priceSelected.emit(price);
  }

  formatPrice(price: StripePricePublic): string {
    if (!price || !price.unit_amount) {
      return 'Price unavailable';
    }

    const amount = price.unit_amount / 100; // Convert cents to dollars/euros
    const currency = price.currency?.toUpperCase() || 'USD';
    
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
    }).format(amount);
  }
} 
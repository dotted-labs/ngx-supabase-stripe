import { CommonModule } from '@angular/common';
import { Component, input, inject, output, OnInit, computed } from '@angular/core';
import { ProductsService } from '../../services/products.service';
import { StripeProductPublic } from '../../store/products.store';

@Component({
  selector: 'lib-product-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.scss']
})
export class ProductListComponent implements OnInit {
  public readonly productsService = inject(ProductsService);

  public readonly products = computed(() => this.productsService.products() || []);
  
  /**
   * Button text for product selection
   */
  public buttonText = input<string>('Select');
  
  /**
   * Event emitted when a product is selected
   */
  public readonly productSelected = output<StripeProductPublic>();

  ngOnInit(): void {
    this.productsService.loadProducts();
  }

  onProductSelect(product: StripeProductPublic) {
    console.log('Selected product:', product);
    this.productSelected.emit(product);
  }

  formatPrice(price: any): string {
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
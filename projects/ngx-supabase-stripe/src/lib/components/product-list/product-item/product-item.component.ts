import { CommonModule } from '@angular/common';
import { Component, computed, inject, input, output } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
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
  private readonly sanitizer = inject(DomSanitizer);

  public price = computed(() => this.product().prices.find(price => price.details.currency === this.currency()));

  public sanitizedImage = computed(() => {
    const imageUrl = this.product().images?.[0];
    return imageUrl ? this.sanitizer.bypassSecurityTrustUrl(imageUrl) : null;
  });

  onSelect() {
    this.productSelected.emit(this.product());
    this.priceSelected.emit(this.price()?.details as StripePricePublic);
  }
} 
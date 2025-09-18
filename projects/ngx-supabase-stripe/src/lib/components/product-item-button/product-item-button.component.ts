import { CommonModule } from '@angular/common';
import { Component, computed, inject, input, output } from '@angular/core';
import { UtilsService } from '../../services/utils.service';
import { StripePricePublic, StripeProductPublic } from '../../store/products.store';
import { Currency } from '../../models/currency.model';

@Component({
  selector: 'lib-product-item-button',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './product-item-button.component.html'
})
export class ProductItemButtonComponent {
  public readonly product = input.required<StripeProductPublic>();
  public readonly currency = input<Currency>(Currency.EUR);
  public readonly buttonText = input<string>('Buy now');
  public readonly buttonClass = input<string>('btn btn-primary');
  public readonly showPrice = input<boolean>(true);
  public readonly disabled = input<boolean>(false);

  public readonly productSelected = output<StripeProductPublic>();
  public readonly priceSelected = output<StripePricePublic>();

  public readonly utils = inject(UtilsService);

  public readonly price = computed(() => 
    this.product().prices.find(price => price.details.currency === this.currency())
  );

  public readonly isDisabled = computed(() => 
    this.disabled() || !this.product().active
  );

  public readonly displayText = computed(() => {
    if (!this.product().active) {
      return 'Inactive';
    }
    
    if (!this.showPrice()) {
      return this.buttonText();
    }

    const priceInfo = this.price();
    if (!priceInfo) {
      return this.buttonText();
    }

    const formattedPrice = this.utils.formatAmount(
      priceInfo.details?.unit_amount ?? 0, 
      priceInfo.details?.currency ?? 'EUR'
    );

    const suffix = priceInfo.details?.type === 'recurring' 
      ? `/${priceInfo.recurringInterval === 'month' ? 'mo' : 'yr'}`
      : '';

    return `${this.buttonText()} - ${formattedPrice}${suffix}`;
  });

  public onSelect(): void {
    if (this.isDisabled()) {
      return;
    }

    this.productSelected.emit(this.product());
    this.priceSelected.emit(this.price()?.details as StripePricePublic);
  }
}

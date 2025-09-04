import { Directive, ElementRef, input, effect } from '@angular/core';
import type { Stripe as StripeTypes } from 'stripe';

@Directive({
  selector: '[ngxBrandIcon]',
  standalone: true
})
export class BrandIconDirective {
  public readonly paymentMethod = input.required<StripeTypes.PaymentMethod>({ alias: 'ngxBrandIcon' });

  constructor(private readonly el: ElementRef<HTMLElement>) {

    effect(() => {
      const icon = this.getBrandIcon();
      this.el.nativeElement.textContent = icon;
    });
  }

  private getBrandIcon(): string {
    const brand = this.paymentMethod().card?.brand;
    const brandIcons: Record<string, string> = {
      'visa': '💳',
      'mastercard': '💳', 
      'amex': '💳',
      'discover': '💳',
      'diners': '💳',
      'jcb': '💳',
      'unionpay': '💳',
      'unknown': '💳'
    };
    return brandIcons[brand || 'unknown'] || '💳';
  }
}

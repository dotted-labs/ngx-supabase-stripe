import { Directive, ElementRef, input, effect } from '@angular/core';
import type { Stripe as StripeTypes } from 'stripe';

@Directive({
  selector: '[ngxBrandName]',
  standalone: true
})
export class BrandNameDirective {
  public readonly paymentMethod = input.required<StripeTypes.PaymentMethod>({ alias: 'ngxBrandName' });

  constructor(private readonly el: ElementRef<HTMLElement>) {

    effect(() => {
      const name = this.getBrandName();
      this.el.nativeElement.textContent = name;
    });
  }

  private getBrandName(): string {
    const brand = this.paymentMethod().card?.brand;
    const brandNames: Record<string, string> = {
      'visa': 'Visa',
      'mastercard': 'Mastercard',
      'amex': 'American Express',
      'discover': 'Discover',
      'diners': 'Diners Club',
      'jcb': 'JCB',
      'unionpay': 'UnionPay',
      'unknown': 'Tarjeta'
    };
    return brandNames[brand || 'unknown'] || 'Tarjeta';
  }
}

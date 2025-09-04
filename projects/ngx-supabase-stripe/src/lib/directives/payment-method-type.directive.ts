import { Directive, ElementRef, input, effect } from '@angular/core';
import type { Stripe as StripeTypes } from 'stripe';

@Directive({
  selector: '[ngxPaymentMethodType]',
  standalone: true
})
export class PaymentMethodTypeDirective {
  public readonly paymentMethod = input.required<StripeTypes.PaymentMethod>({ alias: 'ngxPaymentMethodType' });

  constructor(private readonly el: ElementRef<HTMLElement>) {

    effect(() => {
      const type = this.getPaymentMethodType();
      this.el.nativeElement.textContent = type;
    });
  }

  private getPaymentMethodType(): string {
    const typeNames: Record<string, string> = {
      'card': 'Tarjeta',
      'paypal': 'PayPal',
      'klarna': 'Klarna',
      'afterpay_clearpay': 'Afterpay',
      'alipay': 'Alipay',
      'bancontact': 'Bancontact',
      'eps': 'EPS',
      'giropay': 'Giropay',
      'ideal': 'iDEAL',
      'p24': 'Przelewy24',
      'sepa_debit': 'SEPA Direct Debit',
      'sofort': 'Sofort',
      'wechat_pay': 'WeChat Pay'
    };
    return typeNames[this.paymentMethod().type] || 'Método de pago';
  }
}

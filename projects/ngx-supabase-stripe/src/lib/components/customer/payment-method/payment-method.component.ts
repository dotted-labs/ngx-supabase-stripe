import { Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import type { Stripe as StripeTypes } from 'stripe';

export type PaymentMethodDisplayMode = 'detailed' | 'compact';

@Component({
  selector: 'ngx-payment-method',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './payment-method.component.html'
})
export class PaymentMethodComponent {
  public readonly paymentMethod = input.required<StripeTypes.PaymentMethod>();
  public readonly mode = input<PaymentMethodDisplayMode>('detailed');

  public get brandIcon(): string {
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

  public get brandName(): string {
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

  public get paymentMethodType(): string {
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

  public get last4(): string {
    return this.paymentMethod().card?.last4 || '****';
  }

  public get expirationDate(): string {
    const card = this.paymentMethod().card;
    if (!card?.exp_month || !card?.exp_year) return '';
    return `${card.exp_month.toString().padStart(2, '0')}/${card.exp_year.toString().slice(-2)}`;
  }

  public get holderName(): string {
    return this.paymentMethod().billing_details?.name || 'N/A';
  }

  public get isExpired(): boolean {
    const card = this.paymentMethod().card;
    if (!card?.exp_month || !card?.exp_year) return false;
    
    const now = new Date();
    const expDate = new Date(card.exp_year, card.exp_month - 1);
    return expDate < now;
  }

  public get cardFunding(): string | undefined {
    return this.paymentMethod().card?.funding;
  }

  public get cardCountry(): string | undefined {
    return this.paymentMethod().card?.country || undefined;
  }

  public get billingEmail(): string | undefined {
    return this.paymentMethod().billing_details?.email || undefined;
  }

  public get billingPhone(): string | undefined {
    return this.paymentMethod().billing_details?.phone || undefined;
  }

  public get billingAddress() {
    return this.paymentMethod().billing_details?.address;
  }
}

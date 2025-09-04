import { Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import type { Stripe as StripeTypes } from 'stripe';
import { BrandIconDirective } from '../../../directives/brand-icon.directive';
import { BrandNameDirective } from '../../../directives/brand-name.directive';
import { PaymentMethodTypeDirective } from '../../../directives/payment-method-type.directive';

export type PaymentMethodDisplayMode = 'detailed' | 'compact';

@Component({
  selector: 'ngx-payment-method',
  standalone: true,
  imports: [CommonModule, BrandIconDirective, BrandNameDirective, PaymentMethodTypeDirective],
  templateUrl: './payment-method.component.html'
})
export class PaymentMethodComponent {
  public readonly paymentMethod = input.required<StripeTypes.PaymentMethod>();
  public readonly mode = input<PaymentMethodDisplayMode>('detailed');

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

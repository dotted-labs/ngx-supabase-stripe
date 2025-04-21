import { CommonModule } from '@angular/common';
import { Component, input, output, signal } from '@angular/core';
import { StripePaymentIntentsPublic } from '../../../../../store/customer.store';

@Component({
  selector: 'lib-payment-intent-item',
  templateUrl: './payment-intent-item.component.html',
  styleUrls: ['./payment-intent-item.component.css'],
  standalone: true,
  imports: [CommonModule]
})
export class PaymentIntentItemComponent {
  public readonly paymentIntent = input.required<StripePaymentIntentsPublic>();

  public readonly isExpanded = signal(false);
  
  /**
   * Format the price amount from cents to dollars/euros with currency symbol
   */
  public formatAmount(amount: number, currency = 'EUR'): string {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: currency
    }).format(amount / 100);
  }
  
  /**
   * Format a date timestamp to a readable format
   */
  public formatDate(timestamp: number | string): string {
    if (!timestamp) return 'N/A';
    
    const date = typeof timestamp === 'number'
      ? new Date(timestamp * 1000)
      : new Date(timestamp);
      
    return date.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  }
  
  /**
   * Get status badge classes based on payment status
   */
  public getStatusBadgeClass(status: string): string {
    switch (status) {
      case 'active':
      case 'succeeded':
      case 'paid':
        return 'badge-success';
      case 'failed':
      case 'canceled':
        return 'badge-error';
      case 'pending':
      case 'processing':
        return 'badge-warning';
      default:
        return 'badge-ghost';
    }
  }
  
  /**
   * Toggle expanded state of the payment details
   */
  public toggleExpand(): void {
    this.isExpanded.update(value => !value);
  }
} 
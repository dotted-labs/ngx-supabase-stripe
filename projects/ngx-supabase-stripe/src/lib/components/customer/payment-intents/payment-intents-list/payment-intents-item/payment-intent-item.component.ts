import { CommonModule } from '@angular/common';
import { Component, input, signal } from '@angular/core';
import { StripePaymentIntentsPublic } from '../../../../../store/customer.store';

@Component({
  selector: 'lib-payment-intent-item',
  templateUrl: './payment-intent-item.component.html',
  standalone: true,
  imports: [CommonModule]
})
export class PaymentIntentItemComponent {
  public readonly paymentIntent = input.required<StripePaymentIntentsPublic>();

  public readonly isExpanded = signal(false);
  
  public formatAmount(amount: number, currency = 'EUR'): string {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: currency
    }).format(amount / 100);
  }
  
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
  
  public toggleExpand(): void {
    this.isExpanded.update(value => !value);
  }
} 
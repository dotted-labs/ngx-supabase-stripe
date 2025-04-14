import { CommonModule } from '@angular/common';
import { Component, EventEmitter, inject, input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { StripeSubscriptionPublic, SubscriptionsStore } from '../../../store/subscriptions.store';

@Component({
  selector: 'lib-subscription-item',
  templateUrl: './subscription-item.component.html',
  styleUrls: ['./subscription-item.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule],
})
export class SubscriptionItemComponent {
  public readonly subscriptionsStore = inject(SubscriptionsStore);
  
  // Input for the subscription data
  public readonly subscription = input.required<StripeSubscriptionPublic>();
  
  // Output events
  @Output() onManageSubscription = new EventEmitter<string>();

  // UI state
  public isExpanded = false;
  
  /**
   * Toggle expanded state
   */
  public toggleExpand(): void {
    this.isExpanded = !this.isExpanded;
  }
  
  /**
   * Manage subscription
   */
  public async manageSubscription(): Promise<void> {
    this.onManageSubscription.emit(this.subscription().id ?? '');
  }
  
  /**
   * Format date
   */
  public formatDate(timestamp: string): string {
    const timestampNumber = parseInt(timestamp);
    if (!timestampNumber) return 'N/A';
    return new Date(timestampNumber * 1000).toLocaleDateString();
  }
  
  /**
   * Format currency amount
   */
  public formatAmount(amount: number, currency: string): string {
    if (!amount) return 'N/A';
    
    const formatter = new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: currency || 'USD',
    });
    
    return formatter.format(amount / 100);
  }
} 
import { CommonModule } from '@angular/common';
import { Component, computed, inject, input, output } from '@angular/core';
import { StripeSubscriptionPublic, SubscriptionsStore } from '../../../../../store/subscriptions.store';
import { PortalAccountStore } from '../../../../../store/portal-account.store';
@Component({
  selector: 'lib-subscription-item',
  templateUrl: './subscription-item.component.html',
  styleUrls: ['./subscription-item.component.css'],
  standalone: true,
  imports: [CommonModule],
})
export class SubscriptionItemComponent {
  public readonly subscriptionsStore = inject(SubscriptionsStore);
  public readonly portalAccountStore = inject(PortalAccountStore);
  
  // Input for the subscription data
  public readonly subscription = input.required<StripeSubscriptionPublic>();
  
  // Output events
  public readonly onManageSubscription = output<string>();

  public readonly isStatusLoading = computed(() => this.portalAccountStore.isStatusLoading());
  
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
    this.onManageSubscription.emit(this.subscription().customer ?? '');
  }
  
  /**
   * Format date
   */
  public formatDate(timestamp: string): string {
    if (!timestamp) return 'N/A';
    return new Date(timestamp).toLocaleDateString();
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
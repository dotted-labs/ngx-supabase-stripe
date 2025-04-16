import { CommonModule } from '@angular/common';
import { Component, inject, input } from '@angular/core';
import { StripeSubscriptionPublic } from '../../../../store/subscriptions.store';
import { PortalAccountStore } from '../../../../store/portal-account.store';

@Component({
  selector: 'lib-subscription-card',
  templateUrl: './subscription-card.component.html',
  standalone: true,
  imports: [CommonModule],
})
export class SubscriptionCardComponent {
  public readonly portalAccountStore = inject(PortalAccountStore);
  
  public readonly subscription = input.required<StripeSubscriptionPublic>();
  public readonly redirectUrl = input<string>(window.location.origin + '/payments/account');
  
  /**
   * Format the price amount from cents to dollars/euros
   */
  public formatAmount(amount: number): string {
    return (amount / 100).toFixed(2);
  }
  
  /**
   * Get the status badge class based on subscription status
   */
  public getStatusBadgeClass(status: string): string {
    switch (status) {
      case 'active': 
        return 'badge-success';
      case 'canceled': 
      case 'unpaid':
        return 'badge-error';
      case 'trialing': 
        return 'badge-warning';
      case 'past_due': 
        return 'badge-warning';
      default: 
        return 'badge-ghost';
    }
  }
  
  /**
   * Create portal session for the customer to manage subscription
   */
  public manageSubscription(): void {
    if (!this.subscription().customer) {
      console.error('🚨 [SubscriptionCardComponent] No customer ID provided');
    } else {
      this.portalAccountStore.createPortalSession(this.subscription().customer as string, this.redirectUrl());
    }
  }
} 
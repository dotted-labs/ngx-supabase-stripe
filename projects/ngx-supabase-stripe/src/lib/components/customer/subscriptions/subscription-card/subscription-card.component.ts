import { CommonModule } from '@angular/common';
import { Component, input, output } from '@angular/core';
import { StripeSubscriptionPublic } from '../../../../store/subscriptions.store';

@Component({
  selector: 'lib-subscription-card',
  templateUrl: './subscription-card.component.html',
  standalone: true,
  imports: [CommonModule],
})
export class SubscriptionCardComponent {
  public readonly subscription = input.required<StripeSubscriptionPublic>();
  public readonly loading = input<boolean>(false);
  public readonly error = input<string | null>(null);
 
  public readonly onManageSubscription = output<string>();
  
  /**
   * Check if product has valid images
   */
  public hasValidProductImages(): boolean {
    const subscription = this.subscription();
    return !!subscription?.product && Array.isArray(subscription.product.images) && subscription.product.images.length > 0;
  }

  /**
   * Get product image safely
   */
  public getProductImage(): string {
    return this.subscription()?.product?.images?.[0] || '';
  }

  /**
   * Get product name safely
   */
  public getProductName(): string {
    return this.subscription()?.product?.name || '';
  }
  
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
   * Emit the customer ID to manage subscription
   */
  public manageSubscription(): void {
    this.onManageSubscription.emit(this.subscription().customer as string);
  }
} 
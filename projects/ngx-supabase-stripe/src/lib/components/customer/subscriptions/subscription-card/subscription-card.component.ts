import { CommonModule } from '@angular/common';
import { Component, inject, input, output } from '@angular/core';
import { StripeSubscriptionPublic } from '../../../../store/subscriptions.store';
import { SubscriptionCardSkeletonComponent } from './subscription-card-skeleton/subscription-card-skeleton.component';
import { UtilsService } from '../../../../services/utils.service';

@Component({
  selector: 'lib-subscription-card',
  templateUrl: './subscription-card.component.html',
  standalone: true,
  imports: [CommonModule, SubscriptionCardSkeletonComponent],
})
export class SubscriptionCardComponent {
  public readonly subscription = input.required<StripeSubscriptionPublic>();
  public readonly loading = input<boolean>(false);
  public readonly error = input<string | null>(null);

  public readonly utils = inject(UtilsService);
 
  public readonly onManageSubscription = output<string>();
  
  public hasValidProductImages(): boolean {
    const subscription = this.subscription();
    return !!subscription?.product && Array.isArray(subscription.product.images) && subscription.product.images.length > 0;
  }

  public getProductImage(): string {
    return this.subscription()?.product?.images?.[0] || '';
  }

  public getProductName(): string {
    return this.subscription()?.product?.name || '';
  }
  
  /**
   * Emit the customer ID to manage subscription
   */
  public manageSubscription(): void {
    this.onManageSubscription.emit(this.subscription().customer as string);
  }
} 
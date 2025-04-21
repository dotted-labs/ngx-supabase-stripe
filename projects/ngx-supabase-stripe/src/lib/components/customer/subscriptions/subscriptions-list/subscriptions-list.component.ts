import { CommonModule } from '@angular/common';
import { Component, input, output } from '@angular/core';
import { StripeSubscriptionPublic } from '../../../../store/subscriptions.store';
import { SubscriptionItemSkeletonComponent } from './subscription-item-skeleton/subscription-item-skeleton.component';
import { SubscriptionItemComponent } from './subscription-item/subscription-item.component';

@Component({
  selector: 'lib-subscriptions-list',
  templateUrl: './subscriptions-list.component.html',
  standalone: true,
  imports: [CommonModule, SubscriptionItemComponent, SubscriptionItemSkeletonComponent],
})
export class SubscriptionsListComponent {
  public readonly subscriptions = input.required<StripeSubscriptionPublic[]>();
  public readonly loading = input<boolean>(false);
  public readonly error = input<string | null>(null);
  public readonly withEmptyState = input<boolean>(true);

  public readonly onManageSubscription = output<string>();

  public refreshSubscriptions(): void {
    console.log('🚩 [SubscriptionsListComponent] refreshSubscriptions');
  }

  public manageSubscription(customerId: string): void {
    this.onManageSubscription.emit(customerId);
  }
} 
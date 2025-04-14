import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { StripeSubscriptionPublic, SubscriptionsStore } from '../../store/subscriptions.store';
import { SubscriptionItemSkeletonComponent } from './subscription-item-skeleton/subscription-item-skeleton.component';
import { SubscriptionItemComponent } from './subscription-item/subscription-item.component';

@Component({
  selector: 'lib-subscriptions-list',
  templateUrl: './subscriptions-list.component.html',
  styleUrls: ['./subscriptions-list.component.css'],
  standalone: true,
  imports: [CommonModule, SubscriptionItemComponent, SubscriptionItemSkeletonComponent],
})
export class SubscriptionsListComponent implements OnInit {
  public readonly subscriptionsStore = inject(SubscriptionsStore);
  
  ngOnInit() {
    this.loadSubscriptions();
  }
  
  private async loadSubscriptions() {
    await this.subscriptionsStore.loadSubscriptions();
  }

  public manageSubscription(subscriptionId: string): void {
    if (!subscriptionId) {
      console.error('🚨 [SubscriptionsListComponent] subscription has no id');
      return;
    }

    // TODO: Create Customer Portal Stripe
    //this.subscriptionsStore.manageSubscription(subscription.id);
  }
  
  public refreshSubscriptions(): void {
    this.loadSubscriptions();
  }
  
  public trackBySubscriptionId(index: number, subscription: StripeSubscriptionPublic): string | null {
    return subscription.id;
  }
} 
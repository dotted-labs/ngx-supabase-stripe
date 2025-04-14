import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { StripeSubscription } from '../../models/database.model';
import { SubscriptionsStore } from '../../store/subscriptions.store';
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

  public cancelSubscription(subscription: StripeSubscription): void {
    if (!subscription.id) {
      console.error('🚨 [SubscriptionsListComponent] subscription has no id');
      return;
    }
    this.subscriptionsStore.cancelSubscription(subscription.id);
  }
  
  public refreshSubscriptions(): void {
    this.loadSubscriptions();
  }
  
  public trackBySubscriptionId(index: number, subscription: StripeSubscription): string | null {
    return subscription.id;
  }
} 
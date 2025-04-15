import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { StripeSubscriptionPublic, SubscriptionsStore } from '../../store/subscriptions.store';
import { SubscriptionItemSkeletonComponent } from './subscription-item-skeleton/subscription-item-skeleton.component';
import { SubscriptionItemComponent } from './subscription-item/subscription-item.component';
import { PortalAccountStore } from '../../store/portal-account.store';

@Component({
  selector: 'lib-subscriptions-list',
  templateUrl: './subscriptions-list.component.html',
  styleUrls: ['./subscriptions-list.component.css'],
  standalone: true,
  imports: [CommonModule, SubscriptionItemComponent, SubscriptionItemSkeletonComponent],
})
export class SubscriptionsListComponent implements OnInit {
  public readonly subscriptionsStore = inject(SubscriptionsStore);
  public readonly portalAccountStore = inject(PortalAccountStore);
  
  ngOnInit() {
    this.loadSubscriptions();
  }
  
  private async loadSubscriptions() {
    await this.subscriptionsStore.loadSubscriptions();
  }

  public manageSubscription(customerId: string): void {
    if (!customerId) {
      console.error('🚨 [SubscriptionsListComponent] subscription has no customer id');
      return;
    }

    // Create portal session for the customer
    const returnUrl = `${window.location.origin}/subscriptions`;
    this.portalAccountStore.createPortalSession(customerId, returnUrl);
  }
  
  public refreshSubscriptions(): void {
    this.loadSubscriptions();
  }
  
  public trackBySubscriptionId(index: number, subscription: StripeSubscriptionPublic): string | null {
    return subscription.id;
  }
} 
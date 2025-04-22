import { CommonModule } from '@angular/common';
import { Component, inject, input } from '@angular/core';
import { CustomerStore } from '../../../store/customer.store';
import { PortalAccountStore } from '../../../store/portal-account.store';
import { SubscriptionCardComponent } from './subscription-card/subscription-card.component';
import { SubscriptionsListComponent } from './subscriptions-list/subscriptions-list.component';

@Component({
  selector: 'lib-subscriptions',
  templateUrl: './subscriptions.component.html',
  standalone: true,
  imports: [CommonModule, SubscriptionCardComponent, SubscriptionsListComponent],
})
export class SubscriptionsComponent {
  public readonly customerStore = inject(CustomerStore);
  public readonly portalAccountStore = inject(PortalAccountStore);

  public readonly returnUrl = input<string>(window.location.origin + '/account');

  public manageSubscription(customerId: string): void {
    this.portalAccountStore.createPortalSession(customerId, this.returnUrl());
  }

  public refreshSubscriptions(): void {
    console.log('🚩 [CustomerDashboardComponent] refreshSubscriptions');
  }
}


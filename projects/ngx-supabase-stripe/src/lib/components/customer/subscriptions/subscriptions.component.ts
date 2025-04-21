import { CommonModule } from '@angular/common';
import { Component, inject, input} from '@angular/core';
import { SubscriptionCardComponent } from './subscription-card/subscription-card.component';
import { SubscriptionsListComponent } from './subscriptions-list/subscriptions-list.component';
import { CustomerStore } from '../../../store/customer.store';
import { PortalAccountStore } from '../../../store/portal-account.store';

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

  /**
   * Manage customer account via portal
   */
  public manageSubscription(customerId: string): void {
    this.portalAccountStore.createPortalSession(customerId, this.returnUrl());
  }

  /**
   * Refresh subscriptions
   */
  public refreshSubscriptions(): void {
    console.log('🚩 [CustomerDashboardComponent] refreshSubscriptions');
  }
}


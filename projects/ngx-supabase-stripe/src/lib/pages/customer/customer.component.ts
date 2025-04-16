import { CommonModule } from '@angular/common';
import { Component, effect, inject, input } from '@angular/core';
import { PaymentIntentsListComponent } from '../../components/customer/payment-intents/payment-intents-list/payment-intents-list.component';
import { CustomerStore } from '../../store/customer.store';
import { PortalAccountStore } from '../../store/portal-account.store';
import { SubscriptionCardComponent } from '../../components/customer/subscriptions/subscription-card/subscription-card.component';
import { SubscriptionsListComponent } from '../../components/customer/subscriptions/subscriptions-list/subscriptions-list.component';
@Component({
  selector: 'lib-customer-dashboard',
  templateUrl: './customer.component.html',
  standalone: true,
  imports: [
    CommonModule,
    PaymentIntentsListComponent,
    SubscriptionCardComponent,
    SubscriptionsListComponent
  ]
})  
export class CustomerDashboardComponent {
  public readonly customerStore = inject(CustomerStore);
  public readonly portalAccountStore = inject(PortalAccountStore);
  
  public readonly customerEmail = input.required<string>();
  public readonly returnUrl = input<string>(window.location.origin + '/account');
  
  public previousCustomerEmail = '';
  
  constructor() {
    effect(() => {
      console.log('🚩 [CustomerDashboardComponent] customer email: ', this.customerEmail());

      if (this.customerEmail() && this.previousCustomerEmail !== this.customerEmail()) {
        this.loadCustomerData();
      }
    });
  }

  /**
   * Load all customer data (subscriptions and payment intents)
   */
  public loadCustomerData(): void {
    this.customerStore.loadCustomer(this.customerEmail());
  }
  
  /**
   * Refresh all customer data
   */
  public refreshData(): void {
    //this.loadCustomerData();
  }
  
  /**
   * Manage customer account via portal
   */
  public manageSubscription(customerId: string): void {
    this.portalAccountStore.createPortalSession(customerId, this.returnUrl());
  }
}

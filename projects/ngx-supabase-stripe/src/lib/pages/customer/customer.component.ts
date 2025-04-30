import { CommonModule } from '@angular/common';
import { Component, computed, inject, input, signal } from '@angular/core';
import { PaymentIntentsListComponent } from '../../components/customer/payment-intents/payment-intents-list/payment-intents-list.component';
import { PaymentIntentsTableComponent } from '../../components/customer/payment-intents/payment-intents-table/payment-intents-table.component';
import { SubscriptionsComponent } from '../../components/customer/subscriptions/subscriptions.component';
import { CustomerStore, StripePaymentIntentsPublic } from '../../store/customer.store';

@Component({
  selector: 'lib-customer-dashboard',
  templateUrl: './customer.component.html',
  standalone: true,
  imports: [
    CommonModule,
    PaymentIntentsListComponent,
    PaymentIntentsTableComponent,
    SubscriptionsComponent
  ]
})  
export class CustomerDashboardComponent {
  public readonly customerStore = inject(CustomerStore);

  public readonly returnUrl = input<string>(window.location.origin + '/account');
  
  public readonly customer = computed(() => this.customerStore.customer().data);
  
  public readonly activeTab = signal<'list' | 'table'>('list');
    
  public previousCustomerEmail = '';

  public refreshPaymentIntents(): void {
    this.customerStore.loadPaymentIntents(this.customerStore.customer().data?.id as string);
  }
  
  public setActiveTab(tab: 'list' | 'table'): void {
    this.activeTab.set(tab);
  }

  public exportSelectedPaymentIntents(paymentIntents: StripePaymentIntentsPublic[]): void {
    console.log('[💰 CustomerDashboardComponent] exportSelectedPaymentIntents: ', paymentIntents);
  }
}

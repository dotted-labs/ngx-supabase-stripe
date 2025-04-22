import { CommonModule } from '@angular/common';
import { Component, computed, inject, input } from '@angular/core';
import { PaymentIntentsListComponent } from '../../components/customer/payment-intents/payment-intents-list/payment-intents-list.component';
import { SubscriptionsComponent } from '../../components/customer/subscriptions/subscriptions.component';
import { CustomerStore } from '../../store/customer.store';

@Component({
  selector: 'lib-customer-dashboard',
  templateUrl: './customer.component.html',
  standalone: true,
  imports: [
    CommonModule,
    PaymentIntentsListComponent,
    SubscriptionsComponent
  ]
})  
export class CustomerDashboardComponent {
  public readonly customerStore = inject(CustomerStore);

  public readonly returnUrl = input<string>(window.location.origin + '/account');
  
  public readonly customer = computed(() => this.customerStore.customer().data);
    
  public previousCustomerEmail = '';

  public refreshData(): void {
    console.log('🚩 [CustomerDashboardComponent] refreshData');
  }
}

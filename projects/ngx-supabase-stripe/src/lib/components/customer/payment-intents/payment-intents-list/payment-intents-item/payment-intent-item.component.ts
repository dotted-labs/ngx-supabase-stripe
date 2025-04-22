import { CommonModule } from '@angular/common';
import { Component, inject, input, signal } from '@angular/core';
import { StripePaymentIntentsPublic } from '../../../../../store/customer.store';
import { UtilsService } from '../../../../../services/utils.service';

@Component({
  selector: 'lib-payment-intent-item',
  templateUrl: './payment-intent-item.component.html',
  standalone: true,
  imports: [CommonModule]
})
export class PaymentIntentItemComponent {
  public readonly paymentIntent = input.required<StripePaymentIntentsPublic>();
  
  public readonly utils = inject(UtilsService);
  
  public readonly isExpanded = signal(false);
  
  public toggleExpand(): void {
    this.isExpanded.update(value => !value);
  }
} 
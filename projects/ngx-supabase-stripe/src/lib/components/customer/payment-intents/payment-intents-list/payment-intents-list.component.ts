import { CommonModule } from '@angular/common';
import { Component, input, output } from '@angular/core';
import { PaymentIntentItemSkeletonComponent } from './payment-intents-item-skeleton/payment-intent-item-skeleton.component';
import { StripePaymentIntentsPublic } from '../../../../store/customer.store';
import { PaymentIntentItemComponent } from './payment-intents-item/payment-intent-item.component';
@Component({
  selector: 'lib-payment-intents-list',
  templateUrl: './payment-intents-list.component.html',
  standalone: true,
  imports: [
    CommonModule,
    PaymentIntentItemSkeletonComponent,
    PaymentIntentItemComponent
  ]
})
export class PaymentIntentsListComponent {
  public readonly paymentIntents = input.required<StripePaymentIntentsPublic[]>();
  public readonly loading = input<boolean>(false);
  public readonly error = input<string | null>(null);
  public readonly withControls = input<boolean>(true);
  
  public readonly onRefresh = output<void>();
  
  protected readonly trackByPaymentIntentId = (index: number, item: StripePaymentIntentsPublic) => item.id;
  
  /**
   * Refresh payment intents list
   */
  public refreshPaymentIntents(): void {
    this.onRefresh.emit();
  }
} 
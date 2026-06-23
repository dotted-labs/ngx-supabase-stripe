import { CommonModule } from '@angular/common';
import { Component, inject, input, signal } from '@angular/core';
import { StripePaymentIntentsPublic } from '../../../../../store/customer.store';
import { UtilsService } from '../../../../../services/utils.service';
import { PaymentMethodComponent } from '../../../payment-method/payment-method.component';

@Component({
  selector: 'lib-payment-intent-item',
  templateUrl: './payment-intent-item.component.html',
  standalone: true,
  imports: [CommonModule, PaymentMethodComponent]
})
export class PaymentIntentItemComponent {
  public readonly paymentIntent = input.required<StripePaymentIntentsPublic>();
  
  public readonly utils = inject(UtilsService);

  protected readonly liveModeLabel = $localize`:@@stripe.payment_intents.mode.live:Live`;
  protected readonly testModeLabel = $localize`:@@stripe.payment_intents.mode.test:Test`;
  protected readonly notAvailableLabel = $localize`:@@stripe.common.not_available:N/A`;
  
  public readonly isExpanded = signal(false);
  
  public toggleExpand(): void {
    this.isExpanded.update(value => !value);
  }
} 
import { Component, inject, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StripePaymentIntentsPublic } from '../../../../store/customer.store';
import { UtilsService } from '../../../../services/utils.service';
import { PaymentMethodComponent } from '../../payment-method/payment-method.component';

@Component({
  selector: 'lib-payment-intents-dialog',
  standalone: true,
  imports: [CommonModule, PaymentMethodComponent],
  templateUrl: './payment-intents-dialog.component.html'
})
export class PaymentIntentsDialogComponent {
  public readonly paymentIntent = input.required<StripePaymentIntentsPublic>();
  public readonly dialogId = input.required<string>();
  
  public readonly utils = inject(UtilsService);

  protected readonly liveModeLabel = $localize`:@@stripe.payment_intents.mode.live:Live`;
  protected readonly testModeLabel = $localize`:@@stripe.payment_intents.mode.test:Test`;
  protected readonly notAvailableLabel = $localize`:@@stripe.common.not_available:N/A`;
}

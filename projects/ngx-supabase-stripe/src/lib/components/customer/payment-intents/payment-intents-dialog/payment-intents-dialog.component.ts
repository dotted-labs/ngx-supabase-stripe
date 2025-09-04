import { Component, input } from '@angular/core';
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
  
  public readonly utils = new UtilsService();
}

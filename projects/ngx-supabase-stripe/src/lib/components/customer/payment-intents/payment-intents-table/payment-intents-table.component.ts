import { CommonModule } from '@angular/common';
import { Component, computed, inject, input, output } from '@angular/core';
import { StripePaymentIntentsPublic } from '../../../../store/customer.store';
import { UtilsService } from '../../../../services/utils.service';

@Component({
  selector: 'lib-payment-intents-table',
  templateUrl: './payment-intents-table.component.html',
  standalone: true,
  imports: [
    CommonModule
  ]
})
export class PaymentIntentsTableComponent {
  public readonly paymentIntents = input.required<StripePaymentIntentsPublic[]>();
  public readonly loading = input<boolean>(false);
  public readonly error = input<string | null>(null);
  public readonly withControls = input<boolean>(true);
  
  public readonly onRefresh = output<void>();
  
  public readonly utils = inject(UtilsService);
  
  public readonly hasPaymentIntents = computed(() => 
    this.paymentIntents() && this.paymentIntents().length > 0
  );
  
  protected readonly trackByPaymentIntentId = (index: number, item: StripePaymentIntentsPublic) => item.id;
  
  public refreshPaymentIntents(): void {
    this.onRefresh.emit();
  }

  public showDetails(id: string): void {
    const modalElement = document.getElementById(`modal-${id}`) as HTMLDialogElement;
    if (modalElement) {
      modalElement.showModal();
    }
  }  
} 
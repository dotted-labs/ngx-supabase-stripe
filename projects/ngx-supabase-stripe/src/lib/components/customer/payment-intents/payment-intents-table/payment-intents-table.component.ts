import { CommonModule } from '@angular/common';
import { Component, computed, inject, input, output } from '@angular/core';
import { UtilsService } from '../../../../services/utils.service';
import { StripePaymentIntentsPublic } from '../../../../store/customer.store';
import { PaymentMethodComponent } from '../../payment-method/payment-method.component';
import { PaymentIntentsDialogComponent } from '../payment-intents-dialog/payment-intents-dialog.component';

@Component({
  selector: 'lib-payment-intents-table',
  templateUrl: './payment-intents-table.component.html',
  standalone: true,
  imports: [
    CommonModule,
    PaymentMethodComponent,
    PaymentIntentsDialogComponent
  ]
})
export class PaymentIntentsTableComponent {
  public readonly paymentIntents = input.required<StripePaymentIntentsPublic[]>();

  public paymentIntentsTable = computed(() => {
    return this.paymentIntents().map(paymentIntent => ({
      ...paymentIntent,
      selected: false
    }));
  });

  public readonly loading = input<boolean>(false);
  public readonly error = input<string | null>(null);
  public readonly withControls = input<boolean>(true);
  
  public readonly exportSelected = output<StripePaymentIntentsPublic[]>();
  public readonly onRefresh = output<void>();
  
  public readonly utils = inject(UtilsService);
  
  public readonly hasPaymentIntents = computed(() => 
    this.paymentIntents() && this.paymentIntents().length > 0
  );
  
  protected readonly trackByPaymentIntentId = (index: number, item: StripePaymentIntentsPublic) => item.id;
  
  public refreshPaymentIntents(): void {
    this.onRefresh.emit();
  }

  public allPaymentIntentsSelected(): boolean {
    return this.paymentIntentsTable().every(paymentIntent => paymentIntent.selected);
  }

  public somePaymentIntentsSelected(): boolean {
    return this.paymentIntentsTable().some(paymentIntent => paymentIntent.selected);
  }

  public toggleAllPaymentIntents(event: Event): void {
    const checkbox = event.target as HTMLInputElement;
    const isChecked = checkbox.checked;
    this.paymentIntentsTable().forEach(paymentIntent => {
      paymentIntent.selected = isChecked;
    });
  }

  public togglePaymentIntent(event: Event, id: string): void {
    const checkbox = event.target as HTMLInputElement;
    const isChecked = checkbox.checked;
    const paymentIntent = this.paymentIntentsTable().find(paymentIntent => paymentIntent.id === id);
    if (paymentIntent) {
      paymentIntent.selected = isChecked;
    }
  }

  public showDetails(id: string): void {
    const modalElement = document.getElementById(`modal-${id}`) as HTMLDialogElement;
    if (modalElement) {
      modalElement.showModal();
    }
  }  

  public exportSelectedPaymentIntents(): void {
    this.exportSelected.emit(this.paymentIntentsTable().filter(paymentIntent => paymentIntent.selected));
  }
} 
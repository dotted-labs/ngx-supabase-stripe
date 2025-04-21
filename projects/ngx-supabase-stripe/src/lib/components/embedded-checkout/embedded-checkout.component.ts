import { CommonModule } from '@angular/common';
import { Component, computed, inject, input, OnInit } from '@angular/core';
import { CheckoutStore } from '../../store/checkout.store';
import { CustomerStore } from '../../store/customer.store';
import { EmbeddedSkeletonComponent } from '../embedded-skeleton/embedded-skeleton.component';

@Component({
  selector: 'lib-embedded-checkout',
  templateUrl: './embedded-checkout.component.html',
  standalone: true,
  imports: [CommonModule, EmbeddedSkeletonComponent],
})
export class EmbeddedCheckoutComponent implements OnInit {
  public readonly checkoutStore = inject(CheckoutStore);
  public readonly customerStore = inject(CustomerStore);
  
  public readonly priceId = input.required<string>();
  public readonly returnPagePath = input<string>('/return');
  
  public readonly customer = computed(() => this.customerStore.customer().data);

  async ngOnInit() {
    this.createCheckoutSession();
  }

  private createCheckoutSession() {
    const baseUrl = window.location.origin;
    const returnPath = `${baseUrl}${this.returnPagePath()}`;

    // Create the checkout session
    this.checkoutStore.createCheckoutSession({
      priceId: this.priceId(),
      returnPagePath: returnPath,
      customerEmail: this.customer()?.email ?? ''
    });
  }

  ngOnDestroy() {
    this.checkoutStore.destroyEmbeddedCheckout();
  }
} 
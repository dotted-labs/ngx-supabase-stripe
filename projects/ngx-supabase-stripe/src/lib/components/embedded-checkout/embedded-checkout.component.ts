import { CommonModule } from '@angular/common';
import { Component, inject, input, OnInit } from '@angular/core';
import { CheckoutStore } from '../../store/checkout.store';
import { EmbeddedSkeletonComponent } from '../embedded-skeleton/embedded-skeleton.component';

@Component({
  selector: 'lib-embedded-checkout',
  templateUrl: './embedded-checkout.component.html',
  styleUrls: ['./embedded-checkout.component.css'],
  standalone: true,
  imports: [CommonModule, EmbeddedSkeletonComponent],
})
export class EmbeddedCheckoutComponent implements OnInit {
  public readonly checkoutStore = inject(CheckoutStore);
  
  public readonly priceId = input.required<string>();
  public readonly returnPagePath = input<string>('/return');

  async ngOnInit() {
    this.createCheckoutSession();
  }

  private createCheckoutSession() {
    const baseUrl = window.location.origin;
    const returnPath = `${baseUrl}${this.returnPagePath()}`;

    // Create the checkout session
    this.checkoutStore.createCheckoutSession({
      priceId: this.priceId(),
      returnPagePath: returnPath
    });
  }

  ngOnDestroy() {
    this.checkoutStore.destroyEmbeddedCheckout();
  }
} 
import { CommonModule } from '@angular/common';
import { Component, effect, inject, input, OnInit } from '@angular/core';
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
  public readonly customerEmail = input<string | null>(null);
  public readonly returnPagePath = input<string>('/return');

  private firstRun = true;
  private previousInputs = {
    priceId: '',
    customerEmail: null as string | null,
    returnPath: ''
  };

  constructor() {
    effect(() => {
      const currentPriceId = this.priceId();
      const currentEmail = this.customerEmail();
      const currentReturnPath = this.returnPagePath();

      if (!this.firstRun && 
          (this.previousInputs.priceId !== currentPriceId ||
           this.previousInputs.customerEmail !== currentEmail ||
           this.previousInputs.returnPath !== currentReturnPath)) {
        
        console.log('🔄 [EmbeddedCheckoutComponent] Inputs changed, recreating checkout');
        
        this.checkoutStore.destroyEmbeddedCheckout();
        
        this.updatePreviousInputs(currentPriceId, currentEmail, currentReturnPath);
        
        this.createCheckoutSession();
      } else if (this.firstRun) {
        this.updatePreviousInputs(currentPriceId, currentEmail, currentReturnPath);
        this.firstRun = false;
      }
    });
  }

  private updatePreviousInputs(priceId: string, email: string | null, returnPath: string) {
    this.previousInputs = {
      priceId,
      customerEmail: email,
      returnPath
    };
  }

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
      customerEmail: this.customerEmail()
    });
  }

  ngOnDestroy() {
    this.checkoutStore.destroyEmbeddedCheckout();
  }
} 
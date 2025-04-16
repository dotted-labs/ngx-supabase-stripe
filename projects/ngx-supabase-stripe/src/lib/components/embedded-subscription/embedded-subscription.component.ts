import { CommonModule } from '@angular/common';
import { Component, effect, inject, input, OnInit } from '@angular/core';
import { SubscriptionsStore } from '../../store/subscriptions.store';
import { EmbeddedSkeletonComponent } from '../embedded-skeleton/embedded-skeleton.component';

@Component({
  selector: 'lib-embedded-subscription',
  templateUrl: './embedded-subscription.component.html',
  styleUrls: ['./embedded-subscription.component.css'],
  standalone: true,
  imports: [CommonModule, EmbeddedSkeletonComponent]
})
export class EmbeddedSubscriptionComponent implements OnInit {
  public readonly subscriptionsStore = inject(SubscriptionsStore);
  
  public readonly priceId = input.required<string>();
  public readonly customerEmail = input<string | null>(null);
  public readonly returnPagePath = input<string>('/subscription-return');


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
        
        console.log('🔄 [EmbeddedSubscriptionComponent] Inputs changed, recreating subscription');
        
        this.subscriptionsStore.destroyEmbeddedSubscription();
        
        this.updatePreviousInputs(currentPriceId, currentEmail, currentReturnPath);
        
        this.createSubscription();
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
    this.createSubscription();
  }

  private createSubscription() {
    const baseUrl = window.location.origin;
    const returnPath = `${baseUrl}${this.returnPagePath()}`;
    this.subscriptionsStore.createSubscription(this.priceId(), returnPath, this.customerEmail());
  }

  ngOnDestroy() {
    this.subscriptionsStore.destroyEmbeddedSubscription();
  }
} 
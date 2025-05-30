import { CommonModule } from '@angular/common';
import { Component, computed, inject, input, OnInit, effect } from '@angular/core';
import { CustomerStore } from '../../store/customer.store';
import { SubscriptionsStore } from '../../store/subscriptions.store';
import { EmbeddedSkeletonComponent } from '../embedded-skeleton/embedded-skeleton.component';

@Component({
  selector: 'lib-embedded-subscription',
  templateUrl: './embedded-subscription.component.html',
  standalone: true,
  imports: [CommonModule, EmbeddedSkeletonComponent]
})
export class EmbeddedSubscriptionComponent implements OnInit {
  public readonly subscriptionsStore = inject(SubscriptionsStore);
  public readonly customerStore = inject(CustomerStore);

  public readonly priceId = input.required<string>();
  public readonly returnPagePath = input<string>('/subscription-return');
  
  public readonly customer = computed(() => this.customerStore.customer().data);

  constructor() {
    effect(() => {
      const embeddedSubscription = this.subscriptionsStore.embeddedSubscription();
      
      if (embeddedSubscription) {
        console.log('🎯 [EmbeddedSubscriptionComponent] Mounting embedded subscription');
        embeddedSubscription.mount('#embedded-checkout');
      }
    }, { allowSignalWrites: false });
  }

  async ngOnInit() {
    this.createSubscription();
  }

  private createSubscription() {
    const baseUrl = window.location.origin;
    const returnPath = `${baseUrl}${this.returnPagePath()}`;
    this.subscriptionsStore.createSubscription(this.priceId(), returnPath, this.customer()?.email ?? '');
  }

  ngOnDestroy() {
    this.subscriptionsStore.destroyEmbeddedSubscription();
  }
} 
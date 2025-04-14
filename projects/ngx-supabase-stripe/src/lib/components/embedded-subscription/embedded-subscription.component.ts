import { Component, inject, input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SubscriptionsStore } from '../../store/subscriptions.store';

@Component({
  selector: 'lib-embedded-subscription',
  templateUrl: './embedded-subscription.component.html',
  styleUrls: ['./embedded-subscription.component.css'],
  standalone: true,
  imports: [CommonModule],
})
export class EmbeddedSubscriptionComponent implements OnInit {
  public readonly subscriptionsStore = inject(SubscriptionsStore);
  
  public readonly priceId = input.required<string>();
  public readonly returnPagePath = input<string>('/subscription-return');

  async ngOnInit() {
    this.createSubscription();
  }

  private createSubscription() {
    const baseUrl = window.location.origin;
    const returnPath = `${baseUrl}${this.returnPagePath()}`;
    this.subscriptionsStore.createSubscription(this.priceId(), returnPath);
  }

  ngOnDestroy() {
    this.subscriptionsStore.destroyEmbeddedSubscription();
  }
} 
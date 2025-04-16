import { CommonModule } from '@angular/common';
import { Component, inject, input, OnInit } from '@angular/core';
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
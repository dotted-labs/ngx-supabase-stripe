import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { SubscriptionsStore } from '../../store/subscriptions.store';
import { SubscriptionItemSkeletonComponent } from './subscription-item-skeleton/subscription-item-skeleton.component';
import { SubscriptionItemComponent } from './subscription-item/subscription-item.component';

@Component({
  selector: 'lib-subscriptions-list',
  templateUrl: './subscriptions-list.component.html',
  styleUrls: ['./subscriptions-list.component.css'],
  standalone: true,
  imports: [CommonModule, SubscriptionItemComponent, SubscriptionItemSkeletonComponent],
})
export class SubscriptionsListComponent implements OnInit {
  public readonly subscriptionsStore = inject(SubscriptionsStore);
  
  ngOnInit() {
    this.loadSubscriptions();
  }
  
  private async loadSubscriptions() {
    await this.subscriptionsStore.loadSubscriptions();
  }
  
  /**
   * Refresh the list of subscriptions
   */
  public refreshSubscriptions() {
    this.loadSubscriptions();
  }
  
  /**
   * Track by function for ngFor
   */
  public trackBySubscriptionId(index: number, subscription: any) {
    return subscription.id;
  }
} 
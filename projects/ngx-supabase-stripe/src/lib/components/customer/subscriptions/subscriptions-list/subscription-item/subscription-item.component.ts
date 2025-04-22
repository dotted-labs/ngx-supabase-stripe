import { CommonModule } from '@angular/common';
import { Component, computed, inject, input, output } from '@angular/core';
import { UtilsService } from '../../../../../services/utils.service';
import { PortalAccountStore } from '../../../../../store/portal-account.store';
import { StripeSubscriptionPublic, SubscriptionsStore } from '../../../../../store/subscriptions.store';

@Component({
  selector: 'lib-subscription-item',
  templateUrl: './subscription-item.component.html',
  standalone: true,
  imports: [CommonModule],
})
export class SubscriptionItemComponent {
  public readonly subscriptionsStore = inject(SubscriptionsStore);
  public readonly portalAccountStore = inject(PortalAccountStore);
  public readonly utils = inject(UtilsService);
  
  public readonly subscription = input.required<StripeSubscriptionPublic>();
  public readonly onManageSubscription = output<string>();

  public readonly isStatusLoading = computed(() => this.portalAccountStore.isStatusLoading());
  
  public isExpanded = false;
  
  public toggleExpand(): void {
    this.isExpanded = !this.isExpanded;
  }
  
  public async manageSubscription(): Promise<void> {
    this.onManageSubscription.emit(this.subscription().customer ?? '');
  }
} 
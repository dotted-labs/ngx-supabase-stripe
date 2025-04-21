import { CommonModule } from '@angular/common';
import { Component, computed, inject, input, output } from '@angular/core';
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
  
  public formatDate(timestamp: string): string {
    if (!timestamp) return 'N/A';
    return new Date(timestamp).toLocaleDateString();
  }
  
  public formatAmount(amount: number, currency: string): string {
    if (!amount) return 'N/A';
    
    const formatter = new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: currency || 'USD',
    });
    
    return formatter.format(amount / 100);
  }
} 
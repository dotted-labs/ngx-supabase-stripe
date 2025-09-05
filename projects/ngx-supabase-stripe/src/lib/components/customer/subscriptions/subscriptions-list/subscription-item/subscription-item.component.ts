import { CommonModule } from '@angular/common';
import { Component, computed, inject, input, output } from '@angular/core';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
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
  private readonly sanitizer = inject(DomSanitizer);
  
  public readonly subscription = input.required<StripeSubscriptionPublic>();
  public readonly onManageSubscription = output<string>();

  public readonly isStatusLoading = computed(() => this.portalAccountStore.isStatusLoading());

  public readonly productImage = computed(() => {
    return this.subscription().product?.images?.[0] || 'https://img.daisyui.com/images/profile/demo/yellingcat@192.webp';
  });
  
  public isExpanded = false;
  
  public toggleExpand(): void {
    this.isExpanded = !this.isExpanded;
  }
  
  public manageSubscription(): void {
    this.onManageSubscription.emit(this.subscription().customer ?? '');
  }

  public sanitizeImageUrl(imageUrl: string): SafeUrl {
    return this.sanitizer.bypassSecurityTrustUrl(imageUrl);
  }
} 
import { CommonModule } from '@angular/common';
import { Component, OnInit, computed, inject, input } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CheckoutStore } from '../../../store/checkout.store';
import { SubscriptionsStore } from '../../../store/subscriptions.store';

@Component({
  selector: 'lib-subscription-return-page',
  templateUrl: './subscription-return-page.component.html',
  standalone: true,
  imports: [CommonModule],
})
export class SubscriptionReturnPageComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  public readonly checkoutStore = inject(CheckoutStore);
  public readonly subscriptionsStore = inject(SubscriptionsStore);

  public readonly sessionStatus = computed(() => this.checkoutStore.sessionStatus());
  
  public readonly returnUrl = input<string>('/');
  
  async ngOnInit() {
    this.route.queryParams.subscribe(async params => {
      const sessionId = params['session_id'];
      this.getSessionStatus(sessionId);
    });
  }

  private async getSessionStatus(sessionId: string) {
    if (sessionId) {
      await this.checkoutStore.getSessionStatus({ sessionId });
    } else {
      console.error('Missing session_id parameter in URL');
    }
  }
  
  public navigate(): void {
    this.router.navigateByUrl(this.returnUrl());
  }
} 
import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import {
  EmbeddedSubscriptionComponent,
  ProductListComponent,
  StripeProductPublic,
  SubscriptionsListComponent
} from '@ngx-supabase-stripe';

@Component({
  selector: 'app-subscriptions',
  standalone: true,
  imports: [
    CommonModule, 
    RouterLink, 
    EmbeddedSubscriptionComponent, 
    SubscriptionsListComponent,
    ProductListComponent
  ],
  templateUrl: './subscriptions.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SubscriptionsComponent {
  public readonly activeTab = signal<'list' | 'new'>('list');
  public readonly selectedPrice = signal<string | null>(null);

  public resetSelection(): void {
    this.selectedPrice.set(null);
  }

  public onProductSelected(product: StripeProductPublic): void {
    this.selectPrice(product);
  }

  public selectPrice(product: StripeProductPublic): void {
    this.selectedPrice.set(product.price_details?.id || product.default_price);
  }

  setActiveTab(tab: 'list' | 'new'): void {
    this.activeTab.set(tab);
  }
} 
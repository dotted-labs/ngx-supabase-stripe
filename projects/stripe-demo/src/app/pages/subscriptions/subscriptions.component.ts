import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import {
  EmbeddedSubscriptionComponent,
  ProductListComponent,
  StripePricePublic,
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
  public readonly selectedProduct = signal<StripeProductPublic | null>(null);

   public customerEmail = signal<string | null>(null);

  public resetSelection(): void {
    this.selectedPrice.set(null);
  }

  public selectProduct(product: StripeProductPublic): void {
    this.selectedProduct.set(product);
  }

  public selectPrice(price: StripePricePublic): void {
    this.selectedPrice.set(price.id);
  }

  public startCreateSubscription(email: string): void {
    this.customerEmail.set(email);
  }

  setActiveTab(tab: 'list' | 'new'): void {
    this.activeTab.set(tab);
  }
} 
import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import {
  EmbeddedSubscriptionComponent,
  ProductListComponent,
  ProductsStore,
  StripePricePublic,
  StripeProductPublic,
  SubscriptionsListComponent,
  SubscriptionsStore
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
export class SubscriptionsComponent implements OnInit {
  public readonly subscriptionsStore = inject(SubscriptionsStore);
  public readonly productsStore = inject(ProductsStore);

  public readonly activeTab = signal<'list' | 'new'>('list');
  public readonly selectedPrice = signal<string | null>(null);
  public readonly selectedProduct = signal<StripeProductPublic | null>(null);

  public readonly products = computed(() => this.productsStore.recurringProducts());
  public readonly communityProducts = computed(() => this.productsStore.getProductsByIds(['prod_S3tbbZzfLyJUQv', 'prod_S6ebpZ1C1ndUFD']));

  public customerEmail = signal<string | null>(null);

  ngOnInit(): void {
    this.subscriptionsStore.loadSubscriptions();
  }

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
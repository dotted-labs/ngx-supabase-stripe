import { Component, inject } from '@angular/core';
import { SubscriptionReturnPageComponent } from '@ngx-supabase-stripe';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-subscriptions-result',
  standalone: true,
  imports: [SubscriptionReturnPageComponent, RouterModule],
  templateUrl: './subscriptions-result.component.html',
  styleUrl: './subscriptions-result.component.css'
})
export class SubscriptionsResultComponent {
  private readonly router = inject(Router);
  
  goToSubscriptions() {
    this.router.navigate(['/subscriptions']);
  }
} 
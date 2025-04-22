import { Component, inject } from '@angular/core';
import { ReturnPageComponent } from '@ngx-supabase-stripe';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-checkout-result',
  standalone: true,
  imports: [ReturnPageComponent, RouterModule],
  templateUrl: './checkout-result.component.html',
})
export class CheckoutResultComponent {
  private readonly router = inject(Router);
  
  goToHome() {
    this.router.navigate(['/']);
  }
} 
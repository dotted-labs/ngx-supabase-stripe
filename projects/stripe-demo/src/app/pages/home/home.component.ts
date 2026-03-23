import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthStore } from '@dotted-labs/ngx-supabase-auth';
import { CustomerStore } from '@ngx-supabase-stripe';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './home.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HomeComponent {
  public readonly customerStore = inject(CustomerStore);
  public readonly authStore = inject(AuthStore);
  
  /**
   * Load all customer data (subscriptions and payment intents)
   */
  public loadCustomer(email: string): void {
    //TODO: move this into the main page, this is the function that will be called in the main app when the customer is logged in
    this.customerStore.loadCustomer(email);
  }

  public signOut(): void {
    void this.authStore.signOut();
  }
} 
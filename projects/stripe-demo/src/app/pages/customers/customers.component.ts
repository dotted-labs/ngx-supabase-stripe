import { CommonModule } from '@angular/common';
import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { CustomerDashboardComponent } from '@ngx-supabase-stripe';

@Component({
  selector: 'app-customers',
  templateUrl: './customers.component.html',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    CustomerDashboardComponent
  ]
})
export class CustomersComponent {
  public readonly customerEmail = signal<string>('');
  public readonly returnUrl = window.location.href;

  /**
   * Maneja el evento de input del campo de email
   */
  public handleEmailInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.customerEmail.set(input.value);
  }

  /**
   * Carga el cliente con el email proporcionado
   */
  public loadCustomer(email: string): void {    
    this.customerEmail.set(email);
  }

} 
# ngx-supabase-stripe Demo Application

This is a demo application that shows how to use the ngx-supabase-stripe library in an Angular project, demonstrating how to integrate Stripe payments and subscriptions with Supabase.

## Features

* Product catalog with Stripe products and prices
* One-time payment checkout integration
* Subscription management
* Customer portal for managing payment methods and subscriptions
* Payment history view
* Protected routes with authentication
* Implementation of reactive state with NgRx signals

## Project Structure

```
/stripe-demo
  /src
    /app
      /pages
        /home               - Landing page with product showcase
        /checkout           - Payment checkout page
        /subscription       - Subscription management page
        /payment-success    - Success page after payment
        /customer-portal    - Customer account management
        /payment-history    - View past payments
      /components           - Reusable components
      /services             - Application services
      /guards               - Route protection
      app.component.ts      - Root application component
      app.config.ts         - Application configuration, including Supabase and Stripe setup
      app.routes.ts         - Route configuration with authentication guards
```

## How to Run

To run this demo application:

1. Make sure you have Node.js and npm installed
2. Set up a Supabase project with Stripe integration
3. Configure your Supabase credentials and Stripe API keys in `app.config.ts`
4. Run the following commands:

```bash
# Navigate to the project root directory
cd ngx-supabase-stripe

# Install dependencies
npm install

# Run the demo application
npm run start:stripe-demo
```

5. Open your browser at `http://localhost:4200`

## Prerequisites

Before running this demo, you need to:

1. Create a Stripe account and obtain your API keys
2. Set up a Supabase project
3. Install the Stripe extension in your Supabase project
4. Create the necessary Edge Functions in your Supabase project (as described in the main README)
5. Create test products and prices in your Stripe dashboard

## Usage Examples

### Displaying Products

The application demonstrates how to display Stripe products and prices:

```typescript
// In a component
import { ProductListComponent } from '@dotted-labs/ngx-supabase-stripe';

@Component({
  imports: [ProductListComponent],
  template: `
    <stripe-product-list 
      [productType]="'recurring'" 
      (priceSelected)="onPriceSelected($event)">
    </stripe-product-list>
  `
})
export class ProductsPageComponent {
  onPriceSelected(price: any) {
    // Handle price selection
  }
}
```

### Processing Payments

Example of integrating the embedded checkout component:

```typescript
// In a component
import { EmbeddedCheckoutComponent } from '@dotted-labs/ngx-supabase-stripe';

@Component({
  imports: [EmbeddedCheckoutComponent],
  template: `
    <lib-embedded-checkout 
      [priceId]="selectedPriceId"
      [returnPagePath]="'/payment-success'">
    </lib-embedded-checkout>
  `
})
export class CheckoutPageComponent {
  selectedPriceId = 'price_123456789';
}
```

### Managing Subscriptions

Example of displaying user subscriptions:

```typescript
// In a component
import { SubscriptionsListComponent } from '@dotted-labs/ngx-supabase-stripe';

@Component({
  imports: [SubscriptionsListComponent],
  template: `<lib-subscriptions-list></lib-subscriptions-list>`
})
export class SubscriptionsPageComponent {}
```

### Using State Management

Example of using the state management:

```typescript
// In a component
import { Component, inject } from '@angular/core';
import { ProductsStore, CustomerStore } from '@dotted-labs/ngx-supabase-stripe';

@Component({
  // ...
})
export class MyComponent {
  private productsStore = inject(ProductsStore);
  private customerStore = inject(CustomerStore);
  
  // Access state
  products = this.productsStore.products();
  customer = this.customerStore.customer();
  
  // Handle loading states
  isLoading = this.productsStore.isStatusLoading();
}
```

## Notes

This is a demo application intended for testing and demonstration purposes only.

## Contributing

Contributions to improve the demo application are welcome. Please feel free to submit issues or pull requests to the main repository.

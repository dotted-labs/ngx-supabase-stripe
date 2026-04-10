# NgxSupabaseStripe

An Angular library for integrating Supabase and Stripe into your applications, providing ready-to-use components that simplify the implementation of payments and subscriptions.

## Features

- **Payment Processing** - Components to manage one-time payments through Stripe Checkout
- **Subscription Management** - Complete support for Stripe recurring subscriptions
- **Product Listing** - Component to display Stripe products with their prices
- **Customer Management** - Components to display customer information, payment history, and subscriptions
- **Supabase Integration** - Automatic synchronization between Stripe and the Supabase database
- **Reactive State** - State management using NgRx signals
- **Responsive** - Components designed to work on mobile and desktop devices
- **Highly Customizable** - Ability to adapt the style and behavior of components

## Installation

### Step 1: Install the package

```bash
npm install @dotted-labs/ngx-supabase-stripe
```

### Step 2: Configuration in app.config.ts

```typescript
import { ApplicationConfig } from '@angular/core';
import { provideHttpClient } from '@angular/common/http';
import { provideNgxSupabaseStripeConfig } from '@dotted-labs/ngx-supabase-stripe';

export const appConfig: ApplicationConfig = {
  providers: [
    provideHttpClient(),
    provideNgxSupabaseStripeConfig({
      supabaseConfig: {
        supabaseUrl: 'YOUR_SUPABASE_URL',
        supabaseKey: 'YOUR_SUPABASE_ANON_KEY',
        supabaseSchema: 'public',
      },
      stripeConfig: {
        publishableKey: 'YOUR_STRIPE_PUBLISHABLE_KEY',
      }
    })
  ]
};
```

If you use [@dotted-labs/ngx-supabase-auth](https://github.com/dotted-labs/ngx-supabase-auth) (or any second `createClient` call), provide the **same** `SupabaseClient` instance with `SUPABASE_BROWSER_CLIENT` so `SupabaseClientService` does not create a duplicate client:

`{ provide: SUPABASE_BROWSER_CLIENT, useValue: yourSharedClient }`

### Step 3: Supabase Foreign Tables and Public Functions Setup

To properly integrate Stripe with Supabase, you need to set up foreign tables through the Stripe wrapper extension and create several public functions in Supabase's SQL editor.

#### Install the Stripe Wrapper Extension

1. Go to **SQL Editor** in your Supabase dashboard
2. Run the following commands:

```sql
-- Install wrappers extension
DROP EXTENSION IF EXISTS wrappers CASCADE;
CREATE EXTENSION IF NOT EXISTS wrappers WITH SCHEMA extensions;

-- Create the foreign data wrapper
CREATE FOREIGN DATA WRAPPER wasm_wrapper
  HANDLER extensions.wasm_fdw_handler
  VALIDATOR extensions.wasm_fdw_validator;
```

3. Create the `stripe` schema:

```sql
DROP SCHEMA IF EXISTS stripe CASCADE;
CREATE SCHEMA IF NOT EXISTS stripe;
```

4. Install the Stripe Wrappers from the Supabase dashboard. Select the `stripe` schema when prompted.

> **Warning**: Follow the above steps to install the Stripe Wrappers. Creating the Stripe extension manually can cause a `permission denied for table wrappers_fdw_stats` error. See [this GitHub issue](https://github.com/supabase/wrappers/issues/203) for details.

#### Create Public Functions

Execute the file `projects/supabase/seed.sql` in the SQL Editor to create the following functions in the `public` schema so the library can access Stripe data.

### Step 4: Supabase Edge Functions Setup

The library relies on several Supabase Edge Functions to handle Stripe API interactions. These functions live in `projects/supabase/functions/` and share a common Stripe logic layer located in `functions/_shared/stripe-core/`.

#### Project structure

```
supabase/functions/
├── deno.json                     # Shared import map: { "stripe": "npm:stripe@^18.1.1" }
├── _shared/
│   ├── api.ts                    # corsHeaders + APIResponse helper
│   └── stripe-core/              # Stripe logic shared across all functions
│       ├── types.ts
│       ├── utils.ts              # createStripeInstance factory
│       ├── checkout-session.ts
│       ├── create-customer.ts
│       ├── create-portal-session.ts
│       ├── create-subscription.ts
│       ├── session-status.ts
│       ├── customer-payment-method.ts
│       └── customer-payment-methods.ts
├── checkout_session/index.ts
├── create_subscription/index.ts
├── session_status/index.ts
├── create_portal_session/index.ts
├── create_customer/index.ts
├── customer_payment_method/index.ts
└── customer_payment_methods/index.ts
```

#### Available Edge Functions

| Function | Description | Required Body Parameters |
|---|---|---|
| `checkout_session` | Creates a Stripe Checkout session for one-time payments | `priceId`, `resultPagePath`, `customer?` |
| `create_subscription` | Creates a Stripe Checkout session for recurring subscriptions | `priceId`, `resultPagePath`, `customer?` |
| `session_status` | Retrieves the status and details of a Stripe session | `sessionId` |
| `create_portal_session` | Creates a Stripe Customer Portal session | `customerId`, `returnUrl` |
| `create_customer` | Creates a new Stripe customer | `customerEmail` |
| `customer_payment_method` | Retrieves a specific payment method for a customer | `customerId`, `paymentMethodId` |
| `customer_payment_methods` | Lists all payment methods for a customer | `customerId`, `type?`, `limit?` |

#### Deploying the Edge Functions

1. **Install the Supabase CLI**:
   ```bash
   npm install -g supabase
   ```

2. **Link your project**:
   ```bash
   supabase login
   supabase link --project-ref YOUR_PROJECT_REF
   ```

3. **Deploy all functions**:
   ```bash
   supabase functions deploy checkout_session
   supabase functions deploy create_subscription
   supabase functions deploy session_status
   supabase functions deploy create_portal_session
   supabase functions deploy create_customer
   supabase functions deploy customer_payment_method
   supabase functions deploy customer_payment_methods
   ```

4. **Set the required environment variable** in your Supabase dashboard under **Settings > Edge Functions**:
   - `STRIPE_SECRET_KEY` — your Stripe secret key

#### Edge Function Examples

All edge functions follow the same pattern: they delegate to the corresponding module in `_shared/stripe-core/` and use the shared `APIResponse` helper.

```typescript
// functions/checkout_session/index.ts
import { createCheckoutSession, type StripeCheckoutSession } from '../_shared/stripe-core/checkout-session.ts';
import { APIResponse } from '../_shared/api.ts';
import { serveWithAuth } from '../_shared/auth-middleware.ts';

Deno.serve(serveWithAuth(async (req: Request, ctx) => {
  try {
    const { priceId, resultPagePath, customer } = await req.json();

    const { data, error }: StripeCheckoutSession = await createCheckoutSession(
      { priceId, resultPagePath, customer, supabaseUserId: ctx.userId },
      { stripeSecretKey: Deno.env.get('STRIPE_SECRET_KEY')! }
    );

    if (error) {
      return APIResponse<StripeCheckoutSession['error']>(error, 500);
    }
    return APIResponse<StripeCheckoutSession['data']>(data, 200);
  } catch (error) {
    return APIResponse(error, 500);
  }
}));
```

The `functions/deno.json` import map resolves the `stripe` and `@supabase/supabase-js` specifiers for all functions and shared modules:

```json
{
  "imports": {
    "stripe": "npm:stripe@^18.1.1",
    "@supabase/supabase-js": "npm:@supabase/supabase-js@^2.98.0"
  }
}
```

Edge functions validate the caller with `functions/_shared/auth-middleware.ts` (`supabase.auth.getClaims`); set `verify_jwt = false` on each function in `config.toml` so the gateway does not double-check (recommended with [JWT Signing Keys](https://supabase.com/docs/guides/auth/signing-keys)).

Each function entry in `supabase/config.toml` points to this shared import map:

```toml
[functions.checkout_session]
verify_jwt = false
import_map = "./functions/deno.json"
entrypoint = "./functions/checkout_session/index.ts"
```

Edge functions require a **Supabase Auth** session: the library sends `Authorization: Bearer <access_token>` on every `functions.invoke`. Sign the user in first (`signInWithPassword`, OAuth, magic link, etc.). If there is no session, you get a clear client error instead of `{ "msg": "Invalid JWT" }` from the server.

## Available Components

### Embedded Checkout (EmbeddedCheckoutComponent)

Integrates a Stripe Checkout flow directly into your application:

```typescript
import { EmbeddedCheckoutComponent } from '@dotted-labs/ngx-supabase-stripe';

@Component({
  selector: 'app-payment',
  standalone: true,
  imports: [EmbeddedCheckoutComponent],
  template: `
    <lib-embedded-checkout
      [priceId]="'price_1234567890'"
      [returnPagePath]="'/payment-success'">
    </lib-embedded-checkout>
  `
})
export class PaymentComponent {}
```

**Inputs:**
- `priceId` (required): Stripe price ID to charge
- `returnPagePath` (optional): Path to redirect after payment (default: `'/return'`)

**Stripe config:** set `embeddedCheckoutBaseUrl` (e.g. `https://your-app.com`) when the app does not run on `http(s)` (Electron `file://`, etc.). Stripe requires an absolute `https` return URL; the component builds `embeddedCheckoutBaseUrl + returnPagePath` for the edge function.

### Embedded Subscription (EmbeddedSubscriptionComponent)

For implementing recurring Stripe subscriptions:

```typescript
import { EmbeddedSubscriptionComponent } from '@dotted-labs/ngx-supabase-stripe';

@Component({
  selector: 'app-subscription',
  standalone: true,
  imports: [EmbeddedSubscriptionComponent],
  template: `
    <lib-embedded-subscription
      [priceId]="'price_1234567890'"
      [returnPagePath]="'/subscription-success'">
    </lib-embedded-subscription>
  `
})
export class SubscriptionComponent {}
```

**Inputs:**
- `priceId` (required): Stripe subscription price ID
- `returnPagePath` (optional): Path to redirect after subscription activation (default: `'/subscription-return'`)

### Product List (ProductListComponent)

Displays a list of Stripe products with price selection:

```typescript
import { ProductListComponent, StripeProductPublic, StripePricePublic } from '@dotted-labs/ngx-supabase-stripe';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [ProductListComponent],
  template: `
    <stripe-product-list
      [productType]="'recurring'"
      (productSelected)="onProductSelect($event)"
      (priceSelected)="onPriceSelect($event)">
    </stripe-product-list>
  `
})
export class ProductsComponent {
  onProductSelect(product: StripeProductPublic) { }
  onPriceSelect(price: StripePricePublic) { }
}
```

**Inputs:**
- `productType` (optional): `'one_time'` or `'recurring'` (default: `'one_time'`)

**Outputs:**
- `productSelected`: Emitted when a product is selected
- `priceSelected`: Emitted when a price is selected

### Subscriptions List (SubscriptionsListComponent)

Displays the customer's active subscriptions:

```typescript
import { SubscriptionsListComponent } from '@dotted-labs/ngx-supabase-stripe';

@Component({
  selector: 'app-my-subscriptions',
  standalone: true,
  imports: [SubscriptionsListComponent],
  template: `<lib-subscriptions-list></lib-subscriptions-list>`
})
export class MySubscriptionsComponent {}
```

### Customer Page (CustomerComponent)

Full-page component with customer information, payment history, and subscriptions:

```typescript
import { CustomerComponent } from '@dotted-labs/ngx-supabase-stripe';

@Component({
  selector: 'app-customer-page',
  standalone: true,
  imports: [CustomerComponent],
  template: `<lib-customer></lib-customer>`
})
export class CustomerPageComponent {}
```

## State Management

The library uses NgRx Signals for reactive state. Inject any store directly into your components:

```typescript
import { Component, inject } from '@angular/core';
import {
  ProductsStore,
  CheckoutStore,
  SubscriptionsStore,
  CustomerStore
} from '@dotted-labs/ngx-supabase-stripe';

@Component({ /* ... */ })
export class MyComponent {
  private productsStore = inject(ProductsStore);
  private checkoutStore = inject(CheckoutStore);
  private subscriptionsStore = inject(SubscriptionsStore);
  private customerStore = inject(CustomerStore);

  products = this.productsStore.products();
  checkoutSession = this.checkoutStore.session();
  subscriptions = this.subscriptionsStore.subscriptions();
  customer = this.customerStore.customer();
}
```

## License

MIT

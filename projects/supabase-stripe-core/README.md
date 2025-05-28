# Supabase Stripe Core

A TypeScript core library for Supabase and Stripe integration, designed for optimal performance in both Node.js and Deno environments (Supabase Edge Functions).

## 🚀 Key Features

- **Modular Architecture**: Import only what you need for smaller bundle sizes
- **Edge Functions Optimized**: Designed specifically for Supabase Edge Functions
- **TypeScript First**: Full type safety with comprehensive TypeScript definitions
- **Cross-Platform**: Works in Node.js, Deno, and browser environments
- **Zero Framework Dependencies**: Completely framework-agnostic
- **Production Ready**: Battle-tested functions replicated from real Edge Functions

## 📦 Build and npm publish

```bash
npm run build:supabase-stripe-core
npm run publish:supabase-stripe-core
```

## 📦 Installation

```bash
npm install supabase-stripe-core
```

**Peer Dependency**: You must also install Stripe:
```bash
npm install stripe@^17.7.0
```

## 🏗️ Project Structure

```
supabase-stripe-core/
├── src/
│   └── supabase/
│       ├── functions/           # Core payment functions
│       │   ├── checkout-session/
│       │   ├── create-subscription/
│       │   ├── create-portal-session/
│       │   ├── session-status/
│       │   └── utils.ts
│       ├── shared/              # Shared utilities
│       └── types/               # TypeScript definitions
└── dist/                        # Compiled output
    ├── checkout-session/        # Individual modules
    ├── create-subscription/
    ├── create-portal-session/
    └── session-status/
```

## 🎯 Available Functions

### Payment Functions
- **`createCheckoutSession`** - Create one-time payment sessions
- **`createSubscription`** - Create subscription payment sessions  
- **`createPortalSession`** - Create customer billing portal sessions
- **`getSessionStatus`** - Retrieve payment session status

### Utility Functions
- **`createStripeInstance`** - Create configured Stripe instances

## 📊 Bundle Size Optimization

### Traditional Import (Node.js)
```typescript
// Imports entire library (~280KB with Stripe bundled)
import { createCheckoutSession } from 'supabase-stripe-core';
```

### Modular Import (Edge Functions - Recommended)
```typescript
// Imports only specific module (~5KB + external Stripe)
import { createCheckoutSession } from 'supabase-stripe-core/checkout-session';
```

## 🔧 Usage

### Node.js Environment

```typescript
import { createCheckoutSession } from 'supabase-stripe-core';

const response = await createCheckoutSession(
  {
    priceId: 'price_1234567890',
    resultPagePath: 'https://myapp.com/success',
    customer: { email: 'user@example.com' }
  },
  request,
  {
    stripeSecretKey: process.env.STRIPE_SECRET_KEY!,
    apiVersion: '2025-02-24.acacia'
  }
);
```

### Supabase Edge Functions (Deno)

**1. Create `deno.json` in your Edge Function directory:**

```json
{
  "imports": {
    "supabase-stripe-core/checkout-session": "../../../supabase-stripe-core/dist/checkout-session/index.esm.js"
  }
}
```

**2. Edge Function Implementation:**

```typescript
// supabase/functions/checkout_session/index.ts
import { createCheckoutSession } from 'supabase-stripe-core/checkout-session';
import Stripe from 'npm:stripe@17.7.0';

const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY')!, {
  apiVersion: '2025-02-24.acacia',
  httpClient: Stripe.createFetchHttpClient()
});

Deno.serve(async (req: Request) => {
  const { priceId, resultPagePath, customer } = await req.json();

  const sessionOptions: Stripe.Checkout.SessionCreateParams = {
    ui_mode: 'embedded',
    line_items: [{ price: priceId, quantity: 1 }],
    mode: 'payment',
    payment_method_types: ['card', 'paypal', 'amazon_pay', 'alipay'],
    return_url: `${resultPagePath}?session_id={CHECKOUT_SESSION_ID}`,
  };

  // Configure customer options
  if (customer?.id) {
    sessionOptions.customer = customer.id;
  } else {
    if (customer?.email) {
      sessionOptions.customer_email = customer.email;
    }
    sessionOptions.customer_creation = 'always';
  }

  return await createCheckoutSession(
    req,
    { stripe, sessionOptions }
  );
});
```

## 📚 API Reference

### Function Signatures

#### createCheckoutSession
```typescript
createCheckoutSession(
  params: CheckoutSessionParams,
  request: Request,
  stripeConfig: StripeEnvironmentConfig
): Promise<Response>
```

#### createSubscription
```typescript
createSubscription(
  params: SubscriptionParams,
  request: Request,
  stripeConfig: StripeEnvironmentConfig
): Promise<Response>
```

#### createPortalSession
```typescript
createPortalSession(
  params: PortalSessionParams,
  request: Request,
  stripeConfig: StripeEnvironmentConfig
): Promise<Response>
```

#### getSessionStatus
```typescript
getSessionStatus(
  params: SessionStatusParams,
  request: Request,
  stripeConfig: StripeEnvironmentConfig
): Promise<Response>
```

### TypeScript Types

```typescript
interface CheckoutSessionParams {
  priceId: string;
  resultPagePath: string;
  customer?: {
    id?: string;
    email?: string;
  };
}

interface StripeEnvironmentConfig {
  stripeSecretKey: string;
  apiVersion?: string;
}
```

## 🏷️ Modular Exports

Each function is available as an individual export for optimal bundle size:

```typescript
// Individual imports
import { createCheckoutSession } from 'supabase-stripe-core/checkout-session';
import { createSubscription } from 'supabase-stripe-core/create-subscription';
import { createPortalSession } from 'supabase-stripe-core/create-portal-session';
import { getSessionStatus } from 'supabase-stripe-core/session-status';
import { createStripeInstance } from 'supabase-stripe-core/utils';
```

## 🎯 Best Practices

### For Edge Functions
1. **Use modular imports** for smaller bundle sizes
2. **Import Stripe externally** using `npm:stripe@17.7.0`
3. **Configure import maps** in `deno.json`
4. **Handle Stripe instances** in your Edge Function

### For Node.js Applications
1. **Use full imports** for simplicity
2. **Let the library manage** Stripe instances
3. **Configure environment variables** properly

## 📄 License

MIT License - see [LICENSE](LICENSE) file for details.

## 🤝 Contributing

Contributions are welcome! Please read our contributing guidelines and submit pull requests for any improvements.

## 📞 Support

For issues and questions:
- Create an issue on GitHub
- Check existing documentation
- Review Stripe's official documentation for payment-related questions 
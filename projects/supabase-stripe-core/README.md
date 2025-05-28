# Supabase Stripe Core

A TypeScript core library for Supabase and Stripe integration, designed for optimal performance in both Node.js and Deno environments (Supabase Edge Functions).

## 🚀 Key Features

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

## 🏷️ IMPORTANT: Edge Functions Types

```typescript
type StripeCheckoutSession = SupabaseStripeResponse<Stripe.Checkout.Session>;
type StripeSubscriptionSession = SupabaseStripeResponse<Stripe.Checkout.Session>;
type StripePortalSession = SupabaseStripeResponse<Stripe.BillingPortal.Session>;
type StripeSessionStatus = SupabaseStripeResponse<Stripe.Checkout.Session>;
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

## 📄 License

MIT License - see [LICENSE](LICENSE) file for details.

## 🤝 Contributing

Contributions are welcome! Please read our contributing guidelines and submit pull requests for any improvements.

## 📞 Support

For issues and questions:
- Create an issue on GitHub
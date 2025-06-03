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
- **`createCustomer`** - Create a customer

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

#### createCustomer
```typescript
createCustomer(
  customerEmail: string,
  stripeConfig: StripeEnvironmentConfig
): Promise<Response>
```

## 📦 How to use this functions in supabase edge functions

When the package will be published, you can install it from npm.

1. Install the dependencies
```bash
npm install supabase-stripe-core
```

Or if you want to use the local version, you can do it by:

1. Generate the build
```bash
npm run build:supabase-stripe-core
```

2. Import the index.esm.js file in your edge function (checkout_session example)
```bash
import { createCheckoutSession } from 'supabase-stripe-core/checkout-session';
```

3. Import the types in your deno.json file
```typescript
{
  "imports": {
    "supabase-stripe-core": "../../../supabase-stripe-core/dist/index.esm.js",
    "supabase-stripe-core/types": "../../../supabase-stripe-core/dist/types/index.d.ts"
  }
}
```

4. Use the function in your edge function
```typescript
const { data, error } = await createCheckoutSession(params, request, stripeConfig);
```


## 🏷️ IMPORTANT: Edge Functions Types

The following types are used to ensure type safety in the Edge Functions. The are exported from the `types` folder of this project and can be used in your project. As an example how to implement them, see the `supabase` project how the checkout session import the types by deno.json.

```typescript
type StripeCheckoutSession = SupabaseStripeResponse<Stripe.Checkout.Session>;
type StripeSubscriptionSession = SupabaseStripeResponse<Stripe.Checkout.Session>;
type StripePortalSession = SupabaseStripeResponse<Stripe.BillingPortal.Session>;
type StripeSessionStatus = SupabaseStripeResponse<Stripe.Checkout.Session>;
type StripeCustomer = SupabaseStripeResponse<Stripe.Customer>;

// In the deno.json file of your edge function, apart of the index.esm.js file, add the following imports:

{
  "imports": {
    "supabase-stripe-core": "../../../supabase-stripe-core/dist/index.esm.js",
    "supabase-stripe-core/types": "../../../supabase-stripe-core/dist/types/index.d.ts"
  }
} 

```

## 📄 License

MIT License - see [LICENSE](LICENSE) file for details.

## 🤝 Contributing

Contributions are welcome! Please read our contributing guidelines and submit pull requests for any improvements.

## 📞 Support

For issues and questions:
- Create an issue on GitHub
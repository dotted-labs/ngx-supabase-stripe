# Supabase Stripe Core

A TypeScript core library for Supabase and Stripe integration.

## Installation

```bash
npm install supabase-stripe-core
```

## Usage

```typescript
import { /* your exports */ } from 'supabase-stripe-core';

// Your implementation here
```

## Features

- TypeScript support
- Supabase integration
- Stripe payments handling
- Subscription management

## Requirements

- Node.js 16+
- Stripe ^17.7.0

## License

MIT 



# Supabase Stripe Core - Implementación

## ✅ Librería TypeScript Independiente Completada

Se ha creado exitosamente una librería TypeScript independiente que replica exactamente la funcionalidad de las edge functions de Supabase para Stripe. La librería expone únicamente las funciones necesarias sin dependencias adicionales.

## 🏗️ Estructura del Proyecto

```
projects/supabase-stripe-core/
├── src/
│   ├── supabase/
│   │   └── functions/    # Edge Functions
│   │       ├── checkout-session.ts
│   │       ├── create-subscription.ts
│   │       ├── create-portal-session.ts
│   │       ├── session-status.ts
│   │       ├── utils.ts
│   │       └── index.ts
│   ├── types/            # Tipos TypeScript
│   │   ├── database.types.ts
│   │   └── index.ts
│   └── index.ts          # Exportación principal
├── dist/                 # Build output
├── package.json
├── tsconfig.json
├── rollup.config.js
└── README.md
```

## 🎯 Funcionalidades Implementadas

### Edge Functions Replicadas

✅ **`createCheckoutSession`** - Replica `checkout_session`
- Crea sesiones de pago únicas
- Soporte para clientes existentes o nuevos
- Configuración flexible de métodos de pago

✅ **`createSubscription`** - Replica `create_subscription`  
- Crea sesiones de suscripción
- Manejo automático de clientes
- Configuración de períodos y precios

✅ **`createPortalSession`** - Replica `create_portal_session`
- Crea portales de facturación
- Gestión de suscripciones por parte del cliente
- URLs de retorno personalizables

✅ **`getSessionStatus`** - Replica `session_status`
- Obtiene estado de sesiones de checkout
- Información completa de pagos
- Manejo de errores robusto

### Arquitectura Modular

✅ **Funciones Individuales**
- Cada edge function en su propio archivo
- Separación clara de responsabilidades
- Reutilización de utilidades comunes

✅ **Tipos TypeScript Robustos**
- Interfaces completas para parámetros
- Manejo consistente de respuestas
- Configuración de Stripe tipada

## 🔧 Configuración y Uso

### Instalación
```bash
npm install supabase-stripe-core stripe
```

### Uso Directo
```typescript
import { createCheckoutSession } from 'supabase-stripe-core';

const result = await createCheckoutSession(
  {
    priceId: 'price_1234567890',
    resultPagePath: 'https://myapp.com/success',
    customer: { email: 'user@example.com' }
  },
  {
    stripeSecretKey: process.env.STRIPE_SECRET_KEY!
  }
);
```

## 📦 Build y Distribución

### Build Process
- ✅ Rollup para bundling
- ✅ TypeScript compilación
- ✅ Múltiples formatos (CJS, ESM)
- ✅ Definiciones de tipos

### Output
```
dist/
├── index.js          # CommonJS
├── index.esm.js      # ES Modules
└── index.d.ts        # TypeScript definitions
```

## 🎨 Características Técnicas

### Dependencias
- **Peer Dependencies**: Solo `stripe`
- **Zero Framework Dependencies**: Completamente independiente
- **TypeScript First**: Tipos robustos y autocompletado

### Compatibilidad
- ✅ Node.js (server-side)
- ✅ Deno (edge functions)
- ✅ Browsers (client-side)
- ✅ React, Vue, Angular, Vanilla JS

### Error Handling
- ✅ Interfaz consistente `SupabaseStripeResponse<T>`
- ✅ Manejo robusto de errores
- ✅ Logging detallado

## 🚀 Integración con Edge Functions

Las funciones pueden ser consumidas directamente por las edge functions existentes:

```typescript
// En una edge function de Supabase
import { createCheckoutSession } from 'supabase-stripe-core';

Deno.serve(async (req) => {
  const { priceId, resultPagePath, customer } = await req.json();
  
  const result = await createCheckoutSession(
    { priceId, resultPagePath, customer },
    { stripeSecretKey: Deno.env.get('STRIPE_SECRET_KEY')! }
  );
  
  return Response.json(result.data);
});
```

## 📊 Beneficios

1. **Reutilización**: Misma lógica en diferentes contextos
2. **Mantenimiento**: Un solo lugar para la lógica de negocio
3. **Testing**: Funciones fácilmente testeable
4. **Flexibilidad**: Sin dependencias de framework
5. **TypeScript**: Tipos robustos y autocompletado

## 🔄 Scripts de Build

Desde el proyecto principal:
```bash
npm run build:core  # Construye la librería TypeScript
npm run build:lib   # Construye la librería Angular
```

## ✨ Estado del Proyecto

**✅ COMPLETADO**: La librería TypeScript independiente está funcional y lista para uso en producción.

La implementación replica exactamente la funcionalidad de las edge functions originales, proporcionando una solución limpia y reutilizable para integrar Supabase con Stripe sin dependencias de Angular. 
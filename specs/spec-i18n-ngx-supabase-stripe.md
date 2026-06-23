# Spec: i18n en `ngx-supabase-stripe`

## Objetivo
Internacionalizar el paquete con `$localize` de Angular para que herede el cambio de idioma runtime de la app consumidora. El paquete **aporta** mensajes; no gestiona runtime.

## Namespace
Todos los IDs bajo `@@stripe.*`.

## Pasos

### 1. Dependencias
- `package.json`: añadir `@angular/localize` a **`peerDependencies`** (`^21.0.0`). Nunca `dependencies`.

### 2. Marcar textos con IDs custom
Recorrer todos los componentes/templates del paquete y marcar cada string con ID namespaced.

Plantillas:
```html
<button i18n="@@stripe.checkout.pay">Pagar ahora</button>
<p i18n="@@stripe.checkout.processing">Procesando pago…</p>
```
TypeScript:
```ts
const err = $localize`:@@stripe.checkout.declined:El pago fue rechazado`;
```

Convención de IDs: `stripe.<feature>.<elemento>` (p.ej. `stripe.checkout.total`, `stripe.subscription.cancel`, `stripe.errors.network`).

### 3. Extraer mensajes
```bash
ng extract-i18n ngx-supabase-stripe --output-path src/i18n --format json
```
Genera `messages.json` (source). Traducir a `messages.es.json`, `messages.en.json`, etc.

### 4. Publicar traducciones en el paquete
- Ubicar los JSON en `src/i18n/` y configurar `ng-packagr` / assets para que se copien al `dist` publicado.
- Estructura final en el paquete publicado: `@vendor/ngx-supabase-stripe/i18n/messages.{locale}.json`.

### 5. Exportar loader (entry point `i18n`)
```ts
// ngx-supabase-stripe/i18n/index.ts
export const STRIPE_LOCALES = ['es', 'en'] as const;

export const loadStripeMessages = async (locale: string) => {
  try { return await import(`./messages.${locale}.json`); }
  catch { return await import('./messages.en.json'); } // fallback
};
```
Configurar secondary entry point en `ng-package.json` para `i18n`.

### 6. No registrar nada
El paquete **no** llama a `loadTranslations` ni inicializa `LOCALE_ID`. Solo expone `loadStripeMessages`.

## Consideración específica de Stripe
- Textos generados por Stripe Elements/Checkout (campos de tarjeta, errores de Stripe.js) se localizan vía la opción `locale` del SDK de Stripe, **no** vía `$localize`. Sincronizar ese `locale` con el de la app por separado.
- `$localize` cubre solo los textos propios del paquete (botones, labels, mensajes de estado, errores propios).

## Reglas
- IDs siempre `@@stripe.*` (sin autogenerados por hash → evita colisión con la app).
- `@angular/localize` = peerDependency.
- La app fusiona `loadStripeMessages(locale)` en su `loadTranslations` existente.
- `$localize` evalúa una vez por render: el cambio en caliente lo controla la app.

## Entregable de cara a la app consumidora
Documentar en el README: entry point `@vendor/ngx-supabase-stripe/i18n`, locales disponibles, fusión en `loadTranslations` antes del bootstrap, y la sincronización aparte del `locale` de Stripe SDK.

-- =====================================================
-- SUPABASE STRIPE WRAPPER CONFIGURATION
-- =====================================================
-- This script sets up the Stripe Foreign Data Wrapper
-- and creates the necessary public functions to access
-- Stripe data from your Angular application.
-- =====================================================

-- Step 1: Install wrappers extension
DROP EXTENSION IF EXISTS wrappers CASCADE;

CREATE EXTENSION IF NOT EXISTS wrappers WITH SCHEMA extensions;

-- Step 2: Create the WASM Foreign Data Wrapper
-- Note: This creates the wrapper globally, not at schema level
CREATE FOREIGN DATA WRAPPER wasm_wrapper 
  HANDLER extensions.wasm_fdw_handler 
  VALIDATOR extensions.wasm_fdw_validator;

-- Step 3: Create stripe schema
DROP SCHEMA IF EXISTS stripe CASCADE;

CREATE SCHEMA IF NOT EXISTS stripe;

-- =====================================================
-- IMPORTANT: After running this script, you need to:
-- 1. Go to your Supabase Dashboard
-- 2. Navigate to Database > Wrappers
-- 3. Install the Stripe wrappers and select the 'stripe' schema
-- 4. This will create the following foreign tables:
--    - stripe.accounts
--    - stripe.checkout_sessions
--    - stripe.customers
--    - stripe.payment_intents
--    - stripe.prices
--    - stripe.products
--    - stripe.subscriptions
-- =====================================================

-- Step 4: Create public functions to access Stripe data
-- These functions are used by the Angular library

-- Get customer by email
CREATE OR REPLACE FUNCTION public.get_stripe_customer(customer_email text)
RETURNS TABLE (
  id text,
  email text,
  name text,
  description text,
  created timestamp,
  attrs jsonb
)
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = ''
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    c.id,
    c.email,
    c.name,
    c.description,
    c.created,
    c.attrs
  FROM stripe.customers c
  WHERE c.email = customer_email;
END;
$$;

-- Get customer payment intents
CREATE OR REPLACE FUNCTION public.get_stripe_customer_payment_intents(customer_id text)
RETURNS TABLE (
  id text,
  customer text,
  amount bigint,
  currency text,
  payment_method text,
  created timestamp,
  attrs jsonb
)
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = ''
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    p.id,
    p.customer,
    p.amount,
    p.currency,
    p.payment_method,
    p.created,
    p.attrs
  FROM stripe.payment_intents p
  WHERE p.customer = customer_id;
END;
$$;

-- Get customer subscriptions
CREATE OR REPLACE FUNCTION public.get_stripe_customer_subscriptions(customer_id text)
RETURNS TABLE (
  id text,
  customer text,
  currency text,
  current_period_start timestamp,
  current_period_end timestamp,
  attrs jsonb
)
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = ''
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    s.id,
    s.customer,
    s.currency,
    s.current_period_start,
    s.current_period_end,
    s.attrs
  FROM stripe.subscriptions s
  WHERE s.customer = customer_id;
END;
$$;

-- Get stripe prices
CREATE OR REPLACE FUNCTION public.get_stripe_prices()
RETURNS TABLE (
  id text,
  active boolean,
  currency text,
  product text,
  unit_amount bigint,
  type text,
  attrs jsonb
)
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = ''
AS $$
BEGIN
  RETURN QUERY
  SELECT
    t.id,
    t.active,
    t.currency,
    t.product,
    t.unit_amount,
    t.type,
    t.attrs
  FROM
    stripe.prices t;
END;
$$;

-- Get stripe product by id
CREATE OR REPLACE FUNCTION public.get_stripe_product(product_id text)
RETURNS TABLE (
  id text,
  name text,
  active boolean,
  default_price text,
  description text,
  attrs jsonb
)
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = ''
AS $$
BEGIN
  RETURN QUERY
  SELECT
    t.id,
    t.name,
    t.active,
    t.default_price,
    t.description,
    t.attrs
  FROM
    stripe.products t
  WHERE
    t.id = product_id;
END;
$$;

-- Get stripe products
CREATE OR REPLACE FUNCTION public.get_stripe_products()
RETURNS TABLE (
  id text,
  name text,
  active boolean,
  default_price text,
  description text,
  attrs jsonb
)
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = ''
AS $$
BEGIN
  RETURN QUERY
  SELECT
    t.id,
    t.name,
    t.active,
    t.default_price,
    t.description,
    t.attrs
  FROM
    stripe.products t;
END;
$$;

-- Get stripe subscriptions
CREATE OR REPLACE FUNCTION public.get_stripe_subscriptions()
RETURNS TABLE (
  id text,
  customer text,
  currency text,
  current_period_start timestamp,
  current_period_end timestamp,
  attrs jsonb
)
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = ''
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    s.id,
    s.customer,
    s.currency,
    s.current_period_start,
    s.current_period_end,
    s.attrs
  FROM stripe.subscriptions s;
END;
$$;

-- Get stripe subscription by id
CREATE OR REPLACE FUNCTION public.get_stripe_subscription(subscription_id text)
RETURNS TABLE (
  id text,
  customer text,
  currency text,
  current_period_start timestamp,
  current_period_end timestamp,
  attrs jsonb
)
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = ''
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    s.id,
    s.customer,
    s.currency,
    s.current_period_start,
    s.current_period_end,
    s.attrs
  FROM stripe.subscriptions s
  WHERE s.id = subscription_id;
END;
$$;

-- =====================================================
-- SETUP COMPLETE
-- =====================================================
-- Next steps:
-- 1. Run: supabase db reset
-- 2. Go to Supabase Dashboard > Database > Wrappers
-- 3. Install Stripe wrappers in the 'stripe' schema
-- 4. Configure your Stripe API keys in the wrapper settings
-- =====================================================

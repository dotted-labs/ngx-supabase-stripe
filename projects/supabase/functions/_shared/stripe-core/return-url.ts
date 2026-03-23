/**
 * Stripe embedded Checkout requires return_url to be an absolute http(s) URL
 * containing the literal placeholder {CHECKOUT_SESSION_ID}.
 * @see https://stripe.com/docs/error-codes/url-invalid
 */
export function buildEmbeddedCheckoutReturnUrl(resultPagePath: string): string {
  const trimmed = resultPagePath.trim();
  if (!trimmed) {
    throw new Error('resultPagePath is required');
  }

  let url: URL;
  try {
    url = new URL(trimmed);
  } catch {
    throw new Error(
      'resultPagePath must be a full URL (e.g. https://app.example.com/return). Relative paths are invalid for Stripe return_url.',
    );
  }

  if (url.protocol !== 'http:' && url.protocol !== 'https:') {
    throw new Error(
      `resultPagePath must use http or https; got "${url.protocol}" (file:// and custom schemes are invalid for Stripe).`,
    );
  }

  const queryJoin = url.search ? `${url.search}&` : '?';
  return `${url.origin}${url.pathname}${queryJoin}session_id={CHECKOUT_SESSION_ID}`;
}

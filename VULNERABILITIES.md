# Vulnerabilities

This file is the single source of truth for the intentionally vulnerable training issues. All examples assume the lab is running locally with `docker compose up --build`.

1. **JWT expiry race condition** — CWE-287  
   Location: `backend/src/auth/jwt.strategy.ts:18`, `backend/src/auth/guards/jwt-auth.guard.ts:16`  
   Reproduce: log in with a future `clientIssuedAt`, wait past normal expiry, then call an authenticated endpoint with the old token.  
   Fix: verify JWT expiration server-side only, remove `ignoreExpiration`, and never trust client-issued time.

2. **Session fixation after password reset** — CWE-613  
   Location: `backend/src/users/users.service.ts:38`  
   Reproduce: log in, change the password through `PATCH /api/v1/users/:id/password`, then reuse the old JWT.  
   Fix: rotate token versions on password change and reject tokens with stale versions or maintain a revocation list.

3. **Auth bypass via path traversal** — CWE-384  
   Location: `backend/src/common/middleware/admin-traversal.middleware.ts:5`, `backend/src/main.ts:9`  
   Reproduce: request `/api/v1/admin/users/../orders` and observe the middleware rewrites the path before normal auth routing.  
   Fix: normalize paths before middleware decisions and register auth before route-specific rewrites.

4. **Off-by-one pagination** — CWE-200  
   Location: `backend/src/products/products.service.ts:11`  
   Reproduce: compare `/api/v1/products?page=0&limit=1` and `page=1`; records are skipped because offset is `page * limit`.  
   Fix: calculate offset as `(page - 1) * limit` after validating `page >= 1`.

5. **Race condition in inventory** — CWE-362  
   Location: `backend/src/products/products.service.ts:20`, `backend/src/orders/orders.service.ts:16`  
   Reproduce: submit two parallel purchases for the seeded product with stock `1`; both can decrement successfully.  
   Fix: use a transaction with row-level locking or atomic `UPDATE ... WHERE stock >= quantity`.

6. **Soft delete ghost reads** — CWE-200  
   Location: `backend/src/products/products.service.ts:15`  
   Reproduce: search for `Ghost Product`; soft-deleted rows are returned by `withDeleted: true`.  
   Fix: keep `deletedAt IS NULL` in search queries unless explicitly viewing the recycle bin.

7. **Timezone mismatch** — CWE-200  
   Location: `backend/src/orders/orders.service.ts:24`  
   Reproduce: create orders around midnight UTC, then query `GET /api/v1/orders?day=YYYY-MM-DD`; IST boundaries classify orders differently.  
   Fix: store and query consistently in UTC or pass explicit timezone-aware ranges from the client.

8. **N+1 query in cart** — CWE-400  
   Location: `backend/src/cart/cart.service.ts:15`  
   Reproduce: send a large cart to `/api/v1/cart/summary`; each item performs product and coupon work serially.  
   Fix: batch product and coupon lookups by ID/code.

9. **Floating point cart error** — CWE-840  
   Location: `backend/src/cart/cart.service.ts:18`, `backend/src/orders/orders.service.ts:20`  
   Reproduce: combine prices like `199.1` and `799.2`; raw totals show fractional drift.  
   Fix: represent money as integer paise or use a decimal library.

10. **Order state machine bypass** — CWE-840  
    Location: `backend/src/orders/orders.service.ts:34`, `backend/src/orders/orders.controller.ts:20`  
    Reproduce: call `PATCH /api/v1/orders/:id/status` with any status, such as `refunded` from `pending`.  
    Fix: enforce allowed transitions with a state machine.

11. **Coupon double-apply** — CWE-362  
    Location: `backend/src/payments/payments.service.ts:27`  
    Reproduce: retry payment confirmation with the same coupon after a failed attempt; redemption is recorded only after confirmation.  
    Fix: reserve coupon redemption atomically before payment and release it on definitive failure.

12. **Webhook replay** — CWE-294  
    Location: `backend/src/payments/payments.service.ts:37`  
    Reproduce: post the same body twice to `/api/v1/payments/webhook`; duplicate orders are created.  
    Fix: store and enforce unique provider event IDs.

13. **Prototype pollution** — CWE-1321  
    Location: `frontend/pages/profile.tsx:5`  
    Reproduce: visit `/profile?__proto__[isAdmin]=true` and inspect polluted object behavior in the console.  
    Fix: use a hardened parser and reject `__proto__`, `constructor`, and `prototype` keys.

14. **Cache key injection** — CWE-915  
    Location: `backend/src/cache/redis.service.ts:8`, `backend/src/users/users.controller.ts:21`  
    Reproduce: request crafted `/api/v1/users/profile-cache/:key` values that collide with another user's cache key.  
    Fix: derive cache keys from authenticated user IDs and encode untrusted segments.

15. **Async error suppression** — CWE-755  
    Location: `backend/src/payments/payments.service.ts:32`  
    Reproduce: confirm a payment with an email containing `fail`; the receipt promise rejects after success is returned.  
    Fix: `await` the email promise and handle failure explicitly.

16. **Cart state desync** — CWE-362  
    Location: `frontend/components/Header.tsx:6`, `frontend/store/cartStore.ts:20`, `frontend/services/cart.ts:4`  
    Reproduce: add an item and apply a coupon; the Zustand count and service count can diverge.  
    Fix: keep one cart source of truth shared through context/store.

17. **Stale closure price capture** — CWE-362  
    Location: `frontend/pages/products/[id].tsx:9`  
    Reproduce: load a product, receive a `price:update` socket event, then checkout; the original price is submitted.  
    Fix: read current price at submit time or include live price in callback dependencies.

18. **Observable memory leak** — CWE-400  
    Location: `frontend/hooks/useWebSocket.ts:7`  
    Reproduce: navigate between product pages; each mount adds a socket listener with no cleanup.  
    Fix: remove listeners in the effect cleanup.

19. **Search race condition** — CWE-362  
    Location: `frontend/hooks/useSearch.ts:7`  
    Reproduce: type rapidly in search; older slower responses can overwrite newer ones.  
    Fix: debounce and cancel stale requests with `AbortController`.

20. **SSR hydration mismatch** — CWE-116  
    Location: `frontend/pages/products/[id].tsx:14`, `frontend/pages/products/[id].tsx:25`  
    Reproduce: SSR returns GST-included price while client render uses live or base price.  
    Fix: compute the same value on server and client.

21. **Click intercept z-index bug** — CWE-400  
    Location: `frontend/styles/globals.css:18`  
    Reproduce: on a mobile viewport, tap Add to Cart near the top; an invisible header overlay intercepts it.  
    Fix: remove invisible overlays or disable pointer events.

22. **Float-to-display mismatch** — CWE-116  
    Location: `frontend/components/OrderSummary.tsx:21`, `frontend/pages/checkout.tsx:8`  
    Reproduce: checkout shows `toFixed(2)` while submitting the raw float total.  
    Fix: round once to integer paise before display and submission.

23. **Async guard timing** — CWE-602  
    Location: `frontend/components/AuthGuard.tsx:6`  
    Reproduce: open `/admin` unauthenticated on a slow device; protected content flashes before validation.  
    Fix: default to loading/denied until auth validation completes.

24. **Frontend-only role check** — CWE-284  
    Location: `frontend/pages/admin.tsx:7`, `backend/src/orders/orders.controller.ts:38`  
    Reproduce: authenticate as any user and call `/api/admin/orders`; no backend role guard exists.  
    Fix: enforce roles on the server.

25. **localStorage XSS** — CWE-79  
    Location: `frontend/pages/wishlist.tsx:8`  
    Reproduce: set `localStorage.lastViewedProduct` to HTML with a scriptable payload, then open `/wishlist`.  
    Fix: render as text or sanitize with a vetted sanitizer.

26. **Cart merge index collision** — CWE-915  
    Location: `backend/src/cart/cart.service.ts:28`  
    Reproduce: merge guest and saved carts with different product ordering; quantities attach to the wrong item.  
    Fix: merge by product ID and variant ID.

27. **Username timing attack** — CWE-208  
    Location: `backend/src/users/users.service.ts:25`  
    Reproduce: measure login latency for invalid username vs valid username with wrong password.  
    Fix: run a constant-time dummy hash compare for missing users.

28. **CORS credentials wildcard** — CWE-942  
    Location: `frontend/pages/api/profile.ts:4`, `frontend/next.config.js:8`  
    Reproduce: call `/api/profile` cross-origin with credentials; wildcard origin and credentials are both set.  
    Fix: use an explicit allowlist and never combine credentials with `*`.

29. **Dual bcrypt dependency** — CWE-477  
    Location: `backend/package.json:17`, `backend/package.json:18`, `backend/src/users/users.service.ts:34`  
    Reproduce: use the OAuth login path; `bcryptjs.compare` checks hashes generated by native `bcrypt`.  
    Fix: standardize on one bcrypt implementation and test all auth paths.

30. **Silent DB fallback** — CWE-477  
    Location: `backend/src/config/database.config.ts:6`, `.env.example:6`  
    Reproduce: unset `PROD_DB_URL`; the app silently connects to `DEV_DB_URL`.  
    Fix: fail startup when a required production DB URL is missing.

31. **Undefined price access** — CWE-476  
    Location: `frontend/components/ProductCard.tsx:18`  
    Reproduce: render a cache-shaped product without `variants`; `product.variants[0].price` throws.  
    Fix: validate product shape and use safe fallbacks.

32. **Circular reference serialization** — CWE-674  
    Location: `backend/src/products/products.service.ts:31`  
    Reproduce: request `/api/v1/products/featured`; circular product/category references break serialization.  
    Fix: return DTOs without object cycles.

33. **ChunkLoadError retry loop** — CWE-755  
    Location: `frontend/components/ErrorBoundary.tsx:10`  
    Reproduce: simulate a broken Next chunk; the boundary calls `Router.reload()` on every failure.  
    Fix: cap retries and show a recovery UI.

34. **Swallowed payment promise** — CWE-755  
    Location: `frontend/services/payment.ts:7`, `backend/src/payments/payments.service.ts:12`  
    Reproduce: create a mock Razorpay order with a negative total; the rejection is nested and not returned.  
    Fix: return or rethrow promise failures.

35. **Analytics error masking** — CWE-755  
    Location: `frontend/services/analytics.ts:2`, `frontend/pages/checkout.tsx:13`  
    Reproduce: click Pay; the real null reference is replaced with an analytics-looking error.  
    Fix: preserve original errors and use error `cause`.

36. **Conditional state update loop** — CWE-674  
    Location: `frontend/components/OrderSummary.tsx:10`  
    Reproduce: use 3+ cart items, a discount, and checkout step active; layout effect updates state during render cycles.  
    Fix: derive totals without setting state in layout effects.

37. **Polyfill date conflict** — CWE-477  
    Location: `frontend/services/datePolyfill.ts:1`  
    Reproduce: emulate Safari iOS 15; moment locale and date-fns logic patch `Date.prototype`.  
    Fix: avoid global date prototype mutation.

38. **Swapped date format** — CWE-116  
    Location: `backend/src/orders/orders.service.ts:43`  
    Reproduce: orders with day `<= 12` return `YYYY-DD-MM`; client date parsing is wrong or throws later.  
    Fix: emit ISO 8601 dates only.

39. **Synchronous localStorage in click handler** — CWE-400  
    Location: `frontend/services/cart.ts:14`, `frontend/components/ProductCard.tsx:23`  
    Reproduce: add large cart data, then click Add to Cart on mid-range mobile; synchronous serialization blocks UI.  
    Fix: keep state in memory and persist asynchronously.

40. **Layout thrash loop** — CWE-400  
    Location: `frontend/components/ProductCard.tsx:11`  
    Reproduce: render the product grid; each card alternates `offsetHeight` reads with style writes.  
    Fix: avoid forced reflow and use CSS layout.

41. **Scroll listener accumulation** — CWE-772  
    Location: `frontend/components/OrderSummary.tsx:17`  
    Reproduce: navigate through cart/checkout repeatedly; scroll listeners accumulate.  
    Fix: add the listener once and remove it in cleanup.

42. **Private field mangled by minifier** — CWE-477  
    Location: `frontend/services/encryption.ts:2`, `frontend/next.config.js:4`  
    Reproduce: enable an unsafe terser private-field transform in production and use `EncryptionBox`.  
    Fix: avoid unsafe minifier options and test production bundles.

43. **Math.random in render** — CWE-362  
    Location: `frontend/components/ProductCard.tsx:20`  
    Reproduce: reload the product page with stock warning; sponsored badge can differ between SSR and hydration.  
    Fix: precompute randomness server-side or use deterministic flags.

44. **Duplicate service instances** — CWE-400  
    Location: `frontend/components/Header.tsx:3`, `frontend/services/cart.ts:3`  
    Reproduce: compare header service count with Zustand cart count after navigation.  
    Fix: inject one shared cart service or use a single store.

45. **Circular service imports** — CWE-674  
    Location: `frontend/services/auth.ts:10`, `frontend/services/cart.ts:2`  
    Reproduce: trigger `authService.me()` during logout or HMR; circular module initialization can fail.  
    Fix: invert dependencies or move shared ownership logic to a third module.

46. **Synchronous XHR** — CWE-400  
    Location: `frontend/services/payment.ts:17`  
    Reproduce: click Pay; the legacy SDK check uses synchronous XHR.  
    Fix: use async fetch and non-blocking SDK initialization.

47. **CDN signature failure every 20th request** — CWE-703  
    Location: `backend/src/products/products.service.ts:40`  
    Reproduce: request `/api/v1/products/:id/image` twenty times; the twentieth signature is invalid.  
    Fix: generate stateless signatures without request counters.

48. **429 no Retry-After + immediate retry** — CWE-400  
    Location: `backend/src/common/middleware/rate-limit.middleware.ts:7`, `frontend/services/api.ts:13`  
    Reproduce: make 47 requests to `/api/v1/search-pressure`; response lacks `Retry-After`, and client retry patterns can loop.  
    Fix: include `Retry-After` and use exponential backoff.

49. **401 refresh race** — CWE-362  
    Location: `frontend/services/api.ts:15`  
    Reproduce: fire parallel requests with an expired token; every 401 starts an independent refresh.  
    Fix: guard refresh with a mutex and replay queued requests.

50. **CORS gap on v2 endpoint** — CWE-942  
    Location: `nginx.conf:15`  
    Reproduce: access `/api/v2/recommendations` through nginx; it is treated differently from the original allowlist.  
    Fix: centralize CORS policy and include new endpoint groups in tests.

51. **Service worker caches Set-Cookie response** — CWE-703  
    Location: `frontend/public/sw.js:4`  
    Reproduce: fetch a response containing `Set-Cookie`; `cache.put()` fails and fallback is silent.  
    Fix: skip caching credentialed or `Set-Cookie` responses.

52. **HTTP 200 on payment failure** — CWE-436  
    Location: `backend/src/payments/payments.service.ts:22`, `frontend/pages/checkout.tsx:19`  
    Reproduce: confirm payment with `forceFailure`; backend returns 200 and frontend treats any response as success.  
    Fix: return non-2xx for failed payments and inspect semantic status.

53. **Wrong Content-Type on JSON** — CWE-116  
    Location: `backend/src/orders/orders.controller.ts:26`  
    Reproduce: request `/api/v1/orders/export`; JSON is sent as `text/html`.  
    Fix: use `application/json`.

54. **Chunked stream stall** — CWE-400  
    Location: `backend/src/products/products.controller.ts:29`  
    Reproduce: request `/api/v1/products/stream/chunks?size=1024`; exact chunk multiple never calls `end()`.  
    Fix: always end streams in `finally`.

55. **Second-precision ETag collision** — CWE-436  
    Location: `backend/src/common/interceptors/etag.interceptor.ts:9`  
    Reproduce: update a product twice within one second; both responses share the same ETag.  
    Fix: include a version column or millisecond/hash precision.

56. **Gzip without Content-Encoding** — CWE-116  
    Location: `backend/src/common/filters/all-exceptions.filter.ts:10`  
    Reproduce: trigger a 500; response body is gzipped without `Content-Encoding: gzip`.  
    Fix: let framework compression middleware set encoding headers.

57. **Preflight cached for 24hrs** — CWE-436  
    Location: `backend/src/main.ts:14`  
    Reproduce: inspect OPTIONS responses; `Access-Control-Max-Age` is `86400`.  
    Fix: use short max-age during rollout and version CORS changes.

58. **WSS certificate mismatch** — CWE-772  
    Location: `frontend/services/socket.ts:8`, `nginx.conf:27`  
    Reproduce: connect Firefox to `wss://localhost:3443`; socket cert differs from main HTTPS path.  
    Fix: terminate HTTPS and WSS with the same trusted certificate.

59. **Exponential reconnect timer flood** — CWE-400  
    Location: `frontend/services/socket.ts:9`  
    Reproduce: repeatedly disconnect/reconnect the socket; each disconnect registers another connect handler.  
    Fix: register reconnect handlers once and clear timers.

60. **CLOSING state socket reuse** — CWE-772  
    Location: `frontend/services/socket.ts:3`  
    Reproduce: navigate during a websocket handshake; cached socket can be reused while closing.  
    Fix: check socket state and create a fresh instance after close begins.

61. **Triple-hop CSS waterfall** — CWE-400  
    Location: `frontend/styles/globals.css:1`, `nginx.conf:5`  
    Reproduce: load through nginx and inspect CSS requests; redirects plus imports create a waterfall.  
    Fix: serve a single bundled stylesheet.

62. **DNS prefetch wrong domain** — CWE-400  
    Location: `frontend/pages/_document.tsx:7`  
    Reproduce: inspect the network tab; browser prefetches `old-cdn.vulnshop.invalid`.  
    Fix: remove stale resource hints.

63. **CDN personalized cache leak** — CWE-200  
    Location: `backend/src/orders/orders.controller.ts:43`  
    Reproduce: call `/api/v2/recommendations` as two users through a shared cache; no `Vary: Authorization` is present.  
    Fix: set `Vary: Authorization` or mark personalized responses private.

64. **Double @import font deadlock** — CWE-400  
    Location: `frontend/public/styles/redirect.css:1`, `frontend/public/styles/fonts.css:1`  
    Reproduce: throttle network and load the app; chained imports delay first render.  
    Fix: self-host fonts with direct preload links and avoid nested CSS imports.

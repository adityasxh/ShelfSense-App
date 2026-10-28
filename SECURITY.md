# ShelfSense security checklist

## Implemented in this repository
- [x] Security response headers configured in `next.config.ts`: HSTS, nosniff, referrer policy, permissions policy, frame protection and CSP.
- [x] Shared Zod product-input schema with name/category length limits, character allow-list, numeric bounds and calendar-date validation.
- [x] Expired stock is explicitly classified as **Expired / Do not sell** by the existing risk assessment; the simulator returns no selling scenarios for expired stock.
- [x] Existing calculation tests cover expired inventory and invalid dates; additional zero-stock/zero-sales and expired-discount assertions are included.

## Requires verification / manual action
- [ ] Confirm live Supabase RLS is enabled for every table used by the app (including `products`, `inventory_batches`, and shop/profile tables), and that SELECT/INSERT/UPDATE/DELETE policies restrict rows to the authenticated user's shop. The repository does not contain the complete live schema or shop ownership DDL, so no guessed ownership policy was applied.
- [ ] The app currently calls Supabase Auth and PostgREST directly from browser code. There are no Next.js API routes or server actions in the inspected source. Login/register throttling must be enforced by Supabase Auth/provider configuration or a trusted server-side rate limiter; client-only throttling is not security.
- [ ] Review Supabase Auth rate limits, CAPTCHA/bot protection, password policy, email confirmation and redirect allow-list.
- [ ] Confirm no service-role/private key is exposed. `NEXT_PUBLIC_SUPABASE_ANON_KEY` is a public browser key by design; RLS is mandatory. Rotate any private key if one was ever committed.
- [ ] Run production build, lint, tests, Lighthouse and manual responsive/keyboard checks at 360px, 768px and 1280px.
- [ ] Validate the CSP against deployed Vercel/Supabase requests; tighten script allowances further if possible after checking production behavior.
- [ ] Replace the contact email placeholder on the landing page with a monitored address before public launch.
- [ ] Replace the illustrative landing dashboard preview with a captured screenshot from the running app if a real screenshot is required.

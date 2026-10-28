# ShelfSense

**Rescue Stock Before It Becomes Waste.**

ShelfSense is a functional prototype for independent grocery shops. It estimates expiry-driven stock risk, supports basic inventory management, compares simple rescue scenarios, and can explain results with Gemini when a server-side key is configured.

> Demo inventory is fictional. Estimates are based on user-entered average daily sales and are not a reliable forecast, guaranteed saving, or actual realized profit. Follow applicable food-safety rules; expired items must not be recommended for resale.

## Requirements

- Node.js 20 or later
- npm

## Run locally

```bash
npm install
cp .env.example .env.local
npm run dev
```

Open http://localhost:3000. The app works without environment variables and starts with fictional demo inventory. Inventory is saved in the current browser's localStorage; it is not cloud-backed. Do not expect browser data to sync across devices.

## Features

- **Loss Radar:** dynamic inventory values, high/urgent counts, risk explanations, estimated leftovers and a priority queue.
- **Inventory:** create, edit and delete products; search by name; filter risk; sort by expiry; reset fictional sample data; clear inventory; browser persistence.
- **Stock Rescue Simulator:** compare keep-price and discount assumptions; optionally compare a two-product bundle; update results immediately; show revenue, variable costs, contribution, margin, leftover units/value and warnings.
- **AI Decision Explainer:** click to request up to three recommendations. Uses a server-side Gemini route when configured and validated rule-based guidance otherwise.
- **Calculation tests:** pure risk and scenario logic covered with Vitest.

## Optional Gemini

Add a real API key only to `.env.local`:

```dotenv
GEMINI_API_KEY=your_key_here
GEMINI_MODEL=gemini-2.5-flash
```

Restart the dev server after setting environment variables. The key is server-only; never use `NEXT_PUBLIC_GEMINI_API_KEY` or commit `.env.local`. If no key is configured or the API fails, the endpoint returns clearly labelled rule-based recommendations. The model's output is structurally validated, and product risk/scenario figures are recomputed on the server.

## Commands

```bash
npm run dev       # local development
npm run typecheck # TypeScript type check
npm run lint      # ESLint
npm test          # calculation tests
npm run build     # production build
```

## Important financial assumptions

- Expiry date is included as an eligible selling day; a product is marked expired only once the local calendar date is later than its expiry date.
- Baseline estimated units sold = min(stock quantity, floor(average daily sales × eligible days).
- Estimated leftover = max(0, quantity − estimated units sold).
- Contribution = revenue − purchase cost of units sold − additional variable costs associated with units sold. Purchase cost is counted once, not twice.
- Revenue, contribution, on-hand inventory purchase value, and estimated leftover purchase value are separate measures. Overheads, spoilage variation, taxes, and actual customer response are not modeled.
- Discount/bundle demand-response multipliers are hypothetical user-entered assumptions, not ML predictions or learned elasticities.
- Bundle modelling treats one bundle as one unit of each selected product and checks availability/expiry; the simulation does not change inventory.

## Storage and future Supabase work

This version uses browser localStorage and displays that state in the header. A sample SQL schema is in `supabase/migrations/0001_products.sql`, but Supabase integration is **not connected or verified**. Add an explicit user/shop ownership model and appropriate RLS policies before enabling cloud writes; do not expose service-role credentials in the browser.

## Known prototype limitations

- One local browser profile, no authentication or multi-shop support.
- No real sales history, automated demand forecasting, barcode scanning, CSV export, or historical analytics.
- The Gemini SDK route has a reasonable timeout; API availability and model access depend on the user's key/project.
- Inventory date calculations use the browser's local calendar date.
- This prototype has not been validated with real retailers.

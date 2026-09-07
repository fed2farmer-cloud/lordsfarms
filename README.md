# Lords Farms Website Rebuild

A deployable, mobile-first static website rebuilt from the public structure of `lordsfarms.store`, with cleaner product sourcing, staged agritourism language, centralized business data, and no public test products.

## What is included

- Home page
- Farm Store with filters, local-storage cart and email order request
- Experiences page with phase/status labels
- Our Story page
- Veteran Farm / Homegrown By Heroes status-safe page
- Contact / wholesale / partnership form
- Shared navigation, mobile menu and cart drawer
- Central editable data file: `assets/site-data.js`

## Edit the business information

Open `assets/site-data.js` and update the `business` and `status` objects first.

Important switches:

- `acceptOrders`: keep `false` until checkout/fulfillment is ready.
- `acceptBookings`: keep `false` until scheduling, permits, insurance and staffing are ready.
- `organicCertification`: change only after certification/label language is verified.
- `homegrownByHeroes`: change only after current authorization is verified.

## Deploy

This build needs no compilation. Upload the folder contents to any static host (Vercel, Netlify, Cloudflare Pages, GitHub Pages, cPanel, etc.). Point `lordsfarms.store` to that deployment when ready.

## Next recommended coding phase

1. Connect a real contact/order database (Supabase works well).
2. Add admin login and inventory editor.
3. Add Stripe/Square only after shipping/pickup rules and product availability are set.
4. Add booking calendar after experience readiness is confirmed.
5. Replace remote stock photos with real Lords Farms construction/farm photos as they become available.
6. Add analytics, Search Console and structured product/local-business schema.

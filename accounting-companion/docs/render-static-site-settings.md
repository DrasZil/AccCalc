# Render Static-Site Update Profile

AccCalc now uses an intentional client-side update lifecycle, but Render still controls the HTTP headers that determine how quickly browsers revalidate `index.html`, `sw.js`, and the manifest. These settings should be applied in the Render Dashboard for the deployed static site.

## Recommended response headers

Use Render's **Static Site > Headers** settings with rules equivalent to the following:

1. Path: `/index.html`
   Name: `Cache-Control`
   Value: `no-cache, no-store, must-revalidate`

2. Path: `/`
   Name: `Cache-Control`
   Value: `no-cache, no-store, must-revalidate`

3. Path: `/sw.js`
   Name: `Cache-Control`
   Value: `no-cache, no-store, must-revalidate`

4. Path: `/manifest.webmanifest`
   Name: `Cache-Control`
   Value: `no-cache`

5. Path: `/assets/*`
   Name: `Cache-Control`
   Value: `public, max-age=31536000, immutable`

6. Path: `/icon-192.png`
   Name: `Cache-Control`
   Value: `public, max-age=86400`

7. Path: `/icon-512.png`
   Name: `Cache-Control`
   Value: `public, max-age=86400`

## Recommended rewrite

If the site is served as a Render static site and you want direct non-hash route requests to recover into the SPA shell cleanly, add a rewrite:

- Type: `rewrite`
- Source: `/*`
- Destination: `/index.html`

This is mainly defensive because AccCalc already normalizes direct path loads into hash routes on the client.

## Why these headers matter

- `index.html` must stay fresh so new build manifests and hashed asset references are discovered quickly.
- `sw.js` must stay fresh so the browser notices that a new service worker exists.
- hashed Vite assets can stay aggressively cached because file names change each release.
- the manifest should revalidate so install metadata and shortcuts stay current.

## Deployment note

Render applies these static-site headers in the platform layer, so changing React code alone does not guarantee the best update behavior if the deployed site still serves cache-friendly HTML or service-worker responses.

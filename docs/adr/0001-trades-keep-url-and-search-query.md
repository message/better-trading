# Trades keep their URL and also store the Search Query

Short trade-site slugs expire and GGG has changed the URL format before (3.30). New slugs are self-contained (gzip + base64url of the `query` object), but that format may change again, so the slug alone is not a durable record. From export format `4:` on, a Trade keeps its Search Location (still the primary way to open it) and additionally an optional Search Query (`{ query, sort }`, the shape the site accepts in `?q=`), captured by decoding the slug locally when the Trade is saved. If the URL stops working, the user opens the Trade "from saved query".

## Considered Options

- **Replace the Search Location with the Search Query.** Rejected: opening by URL is the cheapest path, Legacy Trades with short slugs can never be given a query, and PoE 2 / `exchange` behaviour of `?q=` was not verified.
- **Store only the slug (status quo).** Rejected: this is what breaks.

## Consequences

- The 2.0.0 release only ports the Ember extension and keeps writing `3:` with unchanged storage; `4:` and the `query` field ship in 2.1.0.
- `4:` export strings cannot be read by old extension versions. Import must keep reading `1`-`4`.
- Saving never fails when the slug cannot be decoded; the Trade is stored without a Search Query.

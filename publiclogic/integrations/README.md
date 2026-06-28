# integrations/ — External system adapters

Adapters to outside systems. Per doctrine, **sources are not the record**: these
feed signals into CaseSpaces and are launch targets, never the operating record.
Credentials/URLs come from env/config only — never committed.

Planned adapters:

- `airbnb/` — official iCal export ingestion (no scraping, no unofficial API)
- `google/` · `stripe/` · `twilio/` · `openai/`
- `resend/` · `github/` · `icloud/` · `webhooks/`

First extraction target: `airbnb/` from `packages/kpl-casespace` (the iCal fetch).

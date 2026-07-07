# Landlord Portal Demo — Project Reference

Demonstration prototype. **Not a production application.** No real authentication, no data collection, no external submissions.

---

## Quick facts

| Item | Value |
|------|-------|
| **GitHub** | https://github.com/PHWFDL-DEMOS/landlord-portal-demo |
| **Live demo** | https://phwfdl-demos.github.io/landlord-portal-demo/ |
| **Stack** | Static HTML / CSS / vanilla JS (ES modules) |
| **Entry** | `index.html` → `scripts/app.js` |
| **State** | `sessionStorage` key `landlord-portal-state` |
| **Routing** | Hash-based (`#/dashboard`, `#/portfolio/summary`, etc.) |

---

## Demo entry

1. **Access code** — enter PIN `777212` on the demo access screen.
2. **Login** — click-through only; sets `state.loggedIn = true`.
3. **Dashboard** — create portfolio or view existing.

State fields: `accessGranted`, `loggedIn`, `portfolio`, `draftPortfolio`.

---

## Key routes

| Route | Purpose |
|-------|---------|
| `#/dashboard` | Home — create or view portfolio |
| `#/portfolio/create` | Name portfolio, choose add method |
| `#/portfolio/add` | Manual property entry |
| `#/portfolio/upload` | CSV bulk import |
| `#/portfolio/summary` | Portfolio overview and opportunities |
| `#/portfolio/property/{n}/{tab}` | Property detail tabs |
| `#/portfolio/marketplace` | Investment listings |
| `#/portfolio/marketplace/quote/{id}` | Indicative acquisition quote |

Legacy `#/login` redirects to dashboard when already signed in.

---

## Branding

- ACME Lettings demo branding
- Logo: `assets/image.png`
- Favicon: `assets/icon.png`
- CSS design tokens: `--portal-*` in `styles/main.css`

---

## Safe browsing notes

Avoid re-introducing patterns that trigger browser warnings:

- Real bank logos or financial institution impersonation
- “Apply now” or banking CTAs that mimic live lender journeys
- E-mail collection forms that mimic outbound messaging

The demo access code and click-through login are intentional — keep clear fictional disclaimers on both screens.

---

## Core files

| File | Role |
|------|------|
| `scripts/app.js` | UI, routing, render functions |
| `scripts/data.js` | Data model, metrics, demo seeding, persistence |
| `styles/main.css` | Layout and components |

---

## Opportunities (demo seeded)

| Property index | Opportunity | Trigger |
|----------------|-------------|---------|
| 0 | Payment saving (refinance) | Prefill single tenancy |
| 1 | Mortgage renewal + rent review | Prefill property 1 |
| 2 | EPC improvement | Open ESG tab |

Use **Prefill single tenancy** on Financials to seed demo scenarios.

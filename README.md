# Investor Landlord Portfolio Portal

Demonstration prototype for buy-to-let portfolio management. All data is fictional.

**Live demo:** https://phwfdl-demos.github.io/landlord-portal-demo/

**Repository:** https://github.com/PHWFDL-DEMOS/landlord-portal-demo

**Agent / developer reference:** see [`PROJECT_REFERENCE.md`](PROJECT_REFERENCE.md).

## Run locally

```bash
python3 -m http.server 8080
```

Then open http://localhost:8080

## Demo flow

1. **Access code** — enter the demo PIN on the access screen.
2. **Log in** — click *Continue to demo* (no real authentication).
3. **Dashboard** — create a portfolio or view an existing one.
4. **Create portfolio** — give your portfolio a name.
5. **Add properties** — manual entry or bulk CSV import.
6. **Portfolio summary** — overview, opportunities, and property table.
7. **Property detail** — tabs for overview, financials, risk, ESG, and market analytics.

## Publishing to GitHub Pages

Static HTML/CSS/JS — enable GitHub Pages on `main` with root `/` as the source.

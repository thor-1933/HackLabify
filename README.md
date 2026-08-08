# React + TypeScript + Vite

Signal is a React dashboard backed by FastAPI for live product search, review collection, sentiment classification, and product analysis.

## Run locally

Install frontend dependencies and start Vite:

```bash
npm install
npm run dev
```

Configure the live scraper token before starting the API. Copy `.env.example` to `.env` and set `APIFY_TOKEN`, or set it directly in your shell:

```powershell
$env:APIFY_TOKEN = "your_apify_token"
python -m uvicorn backend.main:app --reload --port 8000
```

The dashboard calls `/api/chat` for live products and reviews, then `/api/analyze` for the detailed verdict, sentiment breakdown, pros, cons, platform counts, and included reviews.

This template provides a minimal setup to get React working in Vite with HMR and some Oxlint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the Oxlint configuration

If you are developing a production application, we recommend enabling type-aware lint rules by installing `oxlint-tsgolint` and editing `.oxlintrc.json`:

```json
{
  "$schema": "./node_modules/oxlint/configuration_schema.json",
  "plugins": ["react", "typescript", "oxc"],
  "options": {
    "typeAware": true
  },
  "rules": {
    "react/rules-of-hooks": "error",
    "react/only-export-components": ["warn", { "allowConstantExport": true }]
  }
}
```

See the [Oxlint rules documentation](https://oxc.rs/docs/guide/usage/linter/rules) for the full list of rules and categories.

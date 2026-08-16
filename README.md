# The Good and The Bad

**The Good and The Bad** is an evidence-led static website about where humanity
is heading. It puts positive and negative trends next to each other without
turning either into a slogan.

The first release contains two chart-driven stories:

- **World hunger**: FAO prevalence of undernourishment since 2000, paired with
  the longer FAO food-availability series since 1961.
- **The CEO pay gap**: Economic Policy Institute CEO-to-worker compensation
  ratios for the United States since 1965.

Other ideas are available as clearly labelled "Coming next" routes. They are
catalogued, but do not make trend claims until a comparable source is ready.

## Stack

- React and TypeScript
- Vite
- React Router hash routes for GitHub Pages compatibility
- Vega-Lite through `react-vega`
- Vitest and Testing Library
- Playwright smoke tests

## Local development

### Requirements

- Node.js 20 or newer
- npm 10 or newer

### Clone and install

```bash
git clone git@github.com-zadect:zadect/zadect.github.io.git
cd zadect.github.io
npm ci
```

### Run locally

```bash
npm run dev
```

Open the local URL printed by Vite. The app uses hash routes, so the published
stories are available at:

- `/#/good/world-hunger`
- `/#/bad/ceo-pay-gap`

### Production build and preview

```bash
npm run build
npm run preview
```

The build output is written to `dist/`. GitHub Pages deploys this directory
through `.github/workflows/deploy-pages.yml`.

## Verification

Run the fast checks before opening a pull request:

```bash
npm run lint
npm run typecheck
npm test
npm run build
```

Playwright smoke tests require a browser installation:

```bash
npx playwright install chromium
npm run test:e2e
```

### Manual test checklist

1. Open the overview at desktop width and confirm that Good and Bad have
   distinct visual treatments.
2. Follow the World hunger card and confirm both charts render, their axes
   name the units, the data table opens, and each chart has source links.
3. Follow the CEO pay gap card and confirm both compensation measures are
   distinguishable in the legend and table.
4. Open a Coming next route such as `/#/bad/climate-change` and confirm it
   contains no unsupported chart or trend claim.
5. Resize to a narrow mobile viewport. Confirm navigation, cards, chart
   scrolling, focus states, and source links remain usable.
6. Test keyboard-only navigation and verify that the visible focus indicator
   remains clear.

## Data provenance

Chart data is stored in `src/data/` as small, versioned extracts. The source
catalogue in `src/content/sources.ts` records the publisher, source links,
coverage, retrieval date, and measurement notes.

The hunger story intentionally uses two separate charts:

- FAO prevalence of undernourishment is the direct measure, but the globally
  comparable series in this release begins in 2000.
- Daily calorie supply is a longer context series from 1961. It describes
  average food available in the food system, not actual consumption or equal
  access.

Do not update a data file without updating its source metadata and the story
copy if the coverage, methodology, or interpretation changes.

## Developer guidelines

- Add a story to `src/content/stories.ts` before creating a route-specific
  component.
- Keep deferred stories in `coming-soon` status until a reliable, comparable
  dataset and methodology note are available.
- Prefer primary or research-backed sources. Link to both the data and the
  methodology.
- Keep charts honest: label units, preserve the time range, avoid mixing
  incompatible measures on one axis, and provide a data-table alternative.
- Use semantic headings, keyboard-accessible links, readable contrast, and
  reduced-motion-friendly interactions.
- Keep Good and Bad distinct through layout, surface, and tone as well as
  color; color must never be the only category cue.
- Use focused conventional commits, for example:
  `feat: add world hunger story`.

## GitHub Pages

The deployment workflow runs on pushes to `main`. In repository settings,
configure **Pages > Build and deployment > Source** as **GitHub Actions**.
The Vite build uses relative asset paths and hash routing so it works on the
root `zadect.github.io` Pages site without server-side rewrites.

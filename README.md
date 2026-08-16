# The Good and The Bad

**The Good and The Bad** is an evidence-led static website about where humanity
is heading. It puts positive and negative trends next to each other without
turning either into a slogan.

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

## Data provenance

Chart data is stored in `src/data/` as small, versioned extracts. The source
catalogue in `src/content/sources.ts` records the full citation, original
publisher, processor, source links, coverage, retrieval date, units,
transformation, version, and measurement notes.

Do not update a data file without updating its source metadata and the story
copy if the coverage, methodology, or interpretation changes.


### Citation and comparability rules

- Credit the original publisher and any processor separately. For OWID
  extracts, cite both the underlying publisher (such as FAO) and Our World in
  Data’s processing, and retain the OWID variable ID.
- Prefer a version-pinned download or published table over a floating `latest`
  URL. Keep the local extract small, ordered, and traceable to that release.
- Cite the data, methodology, and metadata links in
  `src/content/sources.ts`; include the access date and the exact unit and
  coverage used by the chart.
- Define every numerator and denominator in the story. Do not combine country
  series unless company scope, worker population, compensation measure,
  aggregation, and time basis are demonstrably compatible.

## Developer guidelines

- Add a story to `src/content/stories.ts` before creating a route-specific
  component.
- Keep deferred stories in `coming-soon` status until a reliable, comparable
  dataset and methodology note are available.
- Prefer primary or research-backed sources. Link to both the data and the
  methodology.
- Keep charts honest: label units, preserve the time range, avoid mixing
  incompatible measures on one axis, and provide a data-table alternative.
- Treat source metadata as part of the feature, not as an afterthought:
  citation quality, definitions, and transformations must be reviewed with the
  chart.
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

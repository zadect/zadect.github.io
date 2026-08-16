# The Good and The Bad

**The Good and The Bad** is an evidence-led static website about where humanity
is heading. It puts positive and negative trends next to each other, then
documents the forces likely to shape the years ahead without turning any of
them into a slogan.

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

Published story routes use hash navigation:

- `/#/good/world-hunger`
- `/#/good/literacy`
- `/#/bad/ceo-pay-gap`
- `/#/bad/democratic-backsliding`
- `/#/future/tech-and-ai`
- `/#/future/housing-cities-and-infrastructure`

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

### Future catalogue

The Future category now contains two published stories — AI & Tech and Housing,
Cities & Infrastructure — plus deliberately data-free placeholders. The
published stories use Eurostat enterprise adoption and OECD
house-price-to-income extracts. Their separate “Study context” cards link
research that helps frame the question but is not copied into chart rows or
stat cards. The remaining placeholders keep “Likely sources” as research
directions, not citations for a chart or evidence of a trend.

Do not publish another Future story or make a numerical claim until a
compatible, versioned dataset and its methodology have been reviewed.

### Future story scope

- **AI & Tech** uses Eurostat dataset `isoc_eb_ai` for enterprises with 10 or
  more employees in covered non-financial activities. The extract keeps the
  reported years 2021, 2023, 2024, and 2025; the missing 2022 observation is
  shown as a gap rather than interpolated.
- **Housing, Cities & Infrastructure** currently measures only the OECD
  `HPI_YDH` house-price-to-income index and its
  `HPI_YDH_AVG` within-country long-term benchmark for eight countries from
  2000–2024. It does not claim to measure rents, mortgage costs, city-level
  affordability, construction supply, or infrastructure capacity.

### Map coverage and no-data treatment

- The literacy map uses the latest adult-literacy observation from 2018
  onward. Many developed countries stopped reporting basic literacy after
  rates approached universal levels; their older OWID observations are not
  presented as current.
- A World Bank/UNESCO indicator cross-check is cited on the Literacy page.
  It confirms that the missing recent observations are a source-coverage
  issue, not a reason to invent or merge incompatible values.
- Country polygons remain visible even without a qualifying value. They use a
  stronger grey fill and outline, and the map states that they are no-data
  countries. The data table contains only rows with plotted observations.
- The democracy map requires both 2020 and 2025 V-Dem endpoint values.
  Countries missing either endpoint remain drawn and outlined rather than
  being treated as zero change.
- Map geometry is pinned locally from World Atlas/Natural Earth and joined by
  ISO numeric code. Small territories may not have a polygon at the selected
  110m map scale; that geometry limitation is cited separately.


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
- Keep Good, Bad, and Future distinct through layout, surface, and tone as
  well as color; color must never be the only category cue.
- Use focused conventional commits, for example:
  `feat: add world hunger story`.

## GitHub Pages

The deployment workflow runs on pushes to `main`. In repository settings,
configure **Pages > Build and deployment > Source** as **GitHub Actions**.
The Vite build uses relative asset paths and hash routing so it works on the
root `zadect.github.io` Pages site without server-side rewrites.

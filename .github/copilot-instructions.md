Build, test, and lint commands

- Install: npm ci
- Dev server: npm run dev (Vite)
- Build: npm run build
- Preview built site: npm run preview
- Run tests: npm run test (Vitest)
- Run linter: npm run lint
- Run a single test: vitest run <file> or use pattern: npm run test -- -t "test name"

High-level architecture

- Frontend: React + Vite. App entry: src/main.jsx. Routing handled with react-router-dom in src/App.jsx.
- Pages: src/pages/Landing.jsx, StoryGallery.jsx, StoryPage.jsx. Each story references data in /data and renders charts via src/components/Chart.jsx.
- Data: /data contains raw CSV/JSON plus metadata files. Charts read raw files and must include a metadata object listing title, source, and url.
- Styling: CSS variables in src/styles/variables.css and global CSS in src/styles/global.css. Theme switching is data-theme attribute based.
- CI: .github/workflows/ci.yml runs install, lint, tests, and build on push/PR.

Key conventions

- Stories are identified by id strings (kebab-case) and live in the Story lookup in src/pages/StoryPage.jsx during scaffolding; move to a JSON manifest (data/stories.json) as the site grows.
- Data files: store raw CSV/JSON in /data and add a corresponding metadata JSON file named <dataset>.meta.json with keys: title, source, url, license, last_updated.
- Charts: use a dedicated Chart component. Time-series must use years on the x-axis and display units in axis titles. Keep textual narrative to 1–2 short sentences.
- Good vs Bad: tag stories with kind: 'good' | 'bad'. Use CSS classes .good and .bad for coloring.
- Commits & branches: use feature/* branches and small focused commits. CI runs tests and build; include Co-authored-by trailer for Copilot commits if used.

Repository notes

- Initial scaffold created on branch feature/site-scaffold. No data files included yet.
- Add datasets under /data and reference them in the Story manifest.

If helpful, Copilot sessions can start by locating data files in /data, then implementing charts in src/components/Chart.jsx using Vega-Lite (recommended) or Chart.js.

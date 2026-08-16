import type { TopLevelSpec } from 'vega-lite';
import { ChartCard } from '../../components/ChartCard';
import { ComparisonCard } from '../../components/ComparisonCard';
import { SourceList } from '../../components/SourceList';
import { StoryFrame } from '../../components/StoryFrame';
import type { StoryDefinition } from '../../content/stories';
import { getSources } from '../../content/sources';
import { forcedDisplacementSeries } from './data';

interface ForcedDisplacementStoryProps {
  story: StoryDefinition;
}

const refugeeSpec: TopLevelSpec = {
  $schema: 'https://vega.github.io/schema/vega-lite/v6.json',
  width: 'container',
  height: 340,
  data: { name: 'series' },
  layer: [
    {
      mark: { type: 'area', color: '#a66f63', opacity: 0.38 },
      encoding: {
        x: {
          field: 'year',
          type: 'quantitative',
          title: 'Year',
          axis: { format: 'd', tickCount: 10 },
        },
        y: {
          field: 'refugees',
          type: 'quantitative',
          title: 'People counted at year-end',
          scale: { domain: [0, 35_000_000] },
        },
        tooltip: [
          { field: 'year', type: 'quantitative', title: 'Year', format: 'd' },
          { field: 'refugees', type: 'quantitative', title: 'Refugees', format: ',.0f' },
        ],
      },
    },
    {
      mark: { type: 'line', color: '#efad95', strokeWidth: 3 },
      encoding: {
        x: { field: 'year', type: 'quantitative', title: 'Year' },
        y: {
          field: 'refugees',
          type: 'quantitative',
          title: 'People counted at year-end',
          scale: { domain: [0, 35_000_000] },
        },
      },
    },
    {
      mark: { type: 'point', filled: true, color: '#ffd0bc', size: 22 },
      encoding: {
        x: { field: 'year', type: 'quantitative', title: 'Year' },
        y: {
          field: 'refugees',
          type: 'quantitative',
          title: 'People counted at year-end',
          scale: { domain: [0, 35_000_000] },
        },
      },
    },
  ],
};

const categorySpec: TopLevelSpec = {
  $schema: 'https://vega.github.io/schema/vega-lite/v6.json',
  width: 'container',
  height: 360,
  data: { name: 'series' },
  transform: [
    {
      fold: ['refugees', 'asylumSeekers', 'idps', 'otherProtection'],
      as: ['category', 'people'],
    },
    { filter: 'isValid(datum.people)' },
  ],
  mark: { type: 'line', point: { filled: true, size: 34 }, strokeWidth: 2.5 },
  encoding: {
    x: {
      field: 'year',
      type: 'quantitative',
      title: 'Year',
      axis: { format: 'd', tickCount: 9 },
    },
    y: {
      field: 'people',
      type: 'quantitative',
      title: 'People counted at year-end',
      scale: { domain: [0, 80_000_000] },
    },
    color: {
      field: 'category',
      type: 'nominal',
      title: 'UNHCR category',
      scale: {
        domain: ['refugees', 'asylumSeekers', 'idps', 'otherProtection'],
        range: ['#efad95', '#f2cf8a', '#c9867f', '#a9b1db'],
      },
      legend: {
        labelExpr:
          "datum.label === 'refugees' ? 'Refugees' : datum.label === 'asylumSeekers' ? 'Asylum-seekers' : datum.label === 'idps' ? 'Internally displaced people' : 'Other people in need of international protection'",
      },
    },
    detail: { field: 'category' },
    tooltip: [
      { field: 'category', type: 'nominal', title: 'UNHCR category' },
      { field: 'year', type: 'quantitative', title: 'Year', format: 'd' },
      { field: 'people', type: 'quantitative', title: 'People', format: ',.0f' },
    ],
  },
};

const formatMillions = (value: number) => `${(value / 1_000_000).toFixed(1)}m`;
const formatPeople = (value: number) => new Intl.NumberFormat('en-US').format(value);

export function ForcedDisplacementStory({ story }: ForcedDisplacementStoryProps) {
  if (!story.comparison) {
    throw new Error('Forced displacement story is missing its comparison definition');
  }

  const first = forcedDisplacementSeries[0];
  const last = forcedDisplacementSeries.at(-1);
  const comparableStart = forcedDisplacementSeries.find((point) => point.year === 1993);

  if (
    !first ||
    !last ||
    !comparableStart ||
    last.asylumSeekers === undefined ||
    last.idps === undefined ||
    last.otherProtection === undefined
  ) {
    throw new Error('Forced displacement story data is incomplete');
  }

  const trackedLatest =
    last.refugees + last.asylumSeekers + last.idps + last.otherProtection;
  const internalShare = (last.idps / trackedLatest) * 100;

  const chartSources = getSources(['unhcr-population-api']);
  const sources = getSources(['unhcr-population-api', 'unhcr-global-trends-2024']);
  const categoryData = forcedDisplacementSeries.filter((point) => point.year >= 1993);

  return (
    <StoryFrame story={story}>
      <section className="story-lede">
        <p className="lede">
          Forced displacement is measured here as a stock: people counted at the end of each year,
          not the number who crossed a border or left home during that year. The long line starts
          with refugees; the comparable category panel begins in 1993, when UNHCR reports the
          broader set consistently.
        </p>
        <div className="stat-grid">
          <div className="stat-card">
            <span className="stat-card__value">
              {formatMillions(first.refugees)} → {formatMillions(last.refugees)}
            </span>
            <span className="stat-card__label">
              refugees counted worldwide at year-end, from {first.year} to {last.year}
            </span>
          </div>
          <div className="stat-card">
            <span className="stat-card__value">{formatMillions(trackedLatest)}</span>
            <span className="stat-card__label">
              people in the four plotted UNHCR categories in {last.year}; this is not the broader
              headline total
            </span>
          </div>
          <div className="stat-card">
            <span className="stat-card__value">{internalShare.toFixed(0)}%</span>
            <span className="stat-card__label">
              of that four-category total were internally displaced people in {last.year}
            </span>
          </div>
        </div>
      </section>

      <ComparisonCard title={story.comparison.title} fields={story.comparison.fields} />

      <ChartCard
        eyebrow="World · UNHCR Refugee Data Finder"
        title="The refugee stock has grown over the long run"
        description="This is the longest annual series in the extract. It counts refugees present at year-end, not new arrivals or applications during the year."
        spec={refugeeSpec}
        data={forcedDisplacementSeries.map((point) => ({
          year: point.year,
          refugees: point.refugees,
        }))}
        columns={[
          { key: 'year', label: 'Year' },
          { key: 'refugees', label: 'Refugees' },
        ]}
        sources={chartSources}
        tone="bad"
        definition="People recorded as refugees in the UNHCR global aggregate at the end of each year."
      />

      <ChartCard
        eyebrow="World · four UNHCR categories · 1993–2024"
        title="Internal displacement now dominates the comparable panel"
        description="The lines keep the categories separate. Blank values mean that the category was not reported in the source yet; they are not zeros."
        spec={categorySpec}
        data={categoryData.map((point) => ({
          year: point.year,
          refugees: point.refugees,
          asylumSeekers: point.asylumSeekers,
          idps: point.idps,
          otherProtection: point.otherProtection,
        }))}
        columns={[
          { key: 'year', label: 'Year' },
          { key: 'refugees', label: 'Refugees' },
          { key: 'asylumSeekers', label: 'Asylum-seekers' },
          { key: 'idps', label: 'Internally displaced people' },
          { key: 'otherProtection', label: 'Other people in need of international protection' },
        ]}
        sources={chartSources}
        tone="bad"
        definition="Year-end population stocks in the four categories, shown separately so their different coverage and trajectories remain visible."
      />

      <section className="method-note">
        <p className="eyebrow">Read the evidence carefully</p>
        <h2>The headline number depends on the accounting boundary.</h2>
        <p>
          UNHCR’s 2024 Global Trends report gives a broader headline total than the four-category
          API extract plotted here. It brings together UNHCR, UNRWA, and IDMC accounting; this page
          does not add those systems together because their populations and methods are not
          interchangeable. The chart also leaves out stateless people, others of concern, and host
          communities. The four-category total shown above is {formatPeople(trackedLatest)} people,
          while internal displacement accounts for {formatPeople(last.idps)} of them.
        </p>
      </section>

      <section className="sources-section">
        <p className="eyebrow">Sources and definitions</p>
        <h2>Where the displacement measures come from</h2>
        <SourceList sources={sources} />
      </section>
    </StoryFrame>
  );
}

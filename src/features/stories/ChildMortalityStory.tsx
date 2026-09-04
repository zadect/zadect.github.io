import type { TopLevelSpec } from 'vega-lite';
import { ChartCard } from '../../components/ChartCard';
import { ComparisonCard } from '../../components/ComparisonCard';
import { SourceList } from '../../components/SourceList';
import type { StoryDefinition } from '../../content/stories';
import { getSources } from '../../content/sources';
import { StoryFrame } from '../../components/StoryFrame';
import {
  childMortalityLongRunSeries,
  childMortalityPanelSeries,
} from './data';

interface ChildMortalityStoryProps {
  story: StoryDefinition;
}

const longRunSpec: TopLevelSpec = {
  $schema: 'https://vega.github.io/schema/vega-lite/v6.json',
  width: 'container',
  height: 340,
  data: { name: 'series' },
  layer: [
    {
      transform: [{ filter: "datum.phase === 'Historical reconstruction'" }],
      mark: { type: 'line', color: '#2d746a', strokeWidth: 3, strokeDash: [4, 3] },
      encoding: {
        x: {
          field: 'year',
          type: 'quantitative',
          title: 'Year',
          axis: { format: 'd', tickCount: 9 },
        },
        y: {
          field: 'rate',
          type: 'quantitative',
          title: 'Deaths before age five (%)',
          scale: { domain: [0, 45] },
        },
      },
    },
    {
      transform: [{ filter: "datum.phase === 'UN IGME estimate'" }],
      mark: { type: 'point', filled: true, size: 56, color: '#2d746a' },
      encoding: {
        x: { field: 'year', type: 'quantitative', title: 'Year' },
        y: {
          field: 'rate',
          type: 'quantitative',
          title: 'Deaths before age five (%)',
          scale: { domain: [0, 45] },
        },
      },
    },
    {
      mark: { type: 'point', filled: true, size: 24, color: '#2d746a' },
      encoding: {
        x: { field: 'year', type: 'quantitative', title: 'Year' },
        y: { field: 'rate', type: 'quantitative', title: 'Deaths before age five (%)' },
        shape: {
          field: 'phase',
          type: 'nominal',
          title: 'Evidence',
          scale: { domain: ['Historical reconstruction', 'UN IGME estimate'] },
        },
        tooltip: [
          { field: 'year', type: 'quantitative', title: 'Year', format: 'd' },
          { field: 'rate', type: 'quantitative', title: 'Rate', format: '.2f' },
          { field: 'phase', type: 'nominal', title: 'Evidence' },
        ],
      },
    },
  ],
};

const panelSpec: TopLevelSpec = {
  $schema: 'https://vega.github.io/schema/vega-lite/v6.json',
  width: 'container',
  height: 360,
  data: { name: 'series' },
  mark: {
    type: 'line',
    point: { filled: true, size: 42 },
    strokeWidth: 2.5,
    strokeDash: [3, 3],
  },
  encoding: {
    x: {
      field: 'year',
      type: 'quantitative',
      title: 'Checkpoint year',
      axis: { format: 'd', values: [1965, 1985, 2005, 2024] },
    },
    y: {
      field: 'rate',
      type: 'quantitative',
      title: 'Deaths before age five (%)',
      scale: { domain: [0, 35] },
    },
    color: {
      field: 'country',
      type: 'nominal',
      title: 'Country',
      scale: { scheme: 'tableau20' },
    },
    detail: { field: 'country' },
    tooltip: [
      { field: 'country', type: 'nominal', title: 'Country' },
      { field: 'year', type: 'quantitative', title: 'Year', format: 'd' },
      { field: 'rate', type: 'quantitative', title: 'Rate', format: '.2f' },
    ],
  },
};

export function ChildMortalityStory({ story }: ChildMortalityStoryProps) {
  if (!story.comparison) {
    throw new Error('Child mortality story is missing its comparison definition');
  }

  const first = childMortalityLongRunSeries[0];
  const last = childMortalityLongRunSeries.at(-1);
  const latestPanel = childMortalityPanelSeries.filter((point) => point.year === 2024);
  if (!first || !last || latestPanel.length === 0) {
    throw new Error('Child mortality story data is incomplete');
  }
  const highestLatest = latestPanel.reduce((current, point) =>
    point.rate > current.rate ? point : current,
  );
  const lowestLatest = latestPanel.reduce((current, point) =>
    point.rate < current.rate ? point : current,
  );
  const sources = getSources(['child-mortality-long-run', 'child-mortality-igme']);

  return (
    <StoryFrame story={story}>
      <section className="story-lede">
        <p className="lede">
          The estimated global under-five mortality rate fell from {first.rate.toFixed(1)}% in{' '}
          {first.year} to {last.rate.toFixed(1)}% in {last.year}. Country estimates still differ
          widely at the latest checkpoint.
        </p>
        <div className="stat-grid">
          <div className="stat-card">
            <span className="stat-card__value">{first.rate.toFixed(1)}% → {last.rate.toFixed(1)}%</span>
            <span className="stat-card__label">
              estimated global under-five mortality from {first.year} to {last.year}
            </span>
          </div>
          <div className="stat-card">
            <span className="stat-card__value">{highestLatest.rate.toFixed(1)}%</span>
            <span className="stat-card__label">
              2024 rate in {highestLatest.entity}, versus {lowestLatest.rate.toFixed(1)}% in{' '}
              {lowestLatest.entity}
            </span>
          </div>
        </div>
      </section>

      <ComparisonCard title={story.comparison.title} fields={story.comparison.fields} />

      <ChartCard
        eyebrow="World · Gapminder + UN IGME"
        title="The global risk fell across two centuries"
        description="The dashed line joins historical reconstruction checkpoints. The 2024 UN IGME estimate is shown as a separate point so the source transition is visible."
        spec={longRunSpec}
        data={childMortalityLongRunSeries.map((point) => ({
          year: point.year,
          rate: point.rate,
          phase: point.year < 2024 ? 'Historical reconstruction' : 'UN IGME estimate',
        }))}
        columns={[
          { key: 'year', label: 'Year' },
          { key: 'rate', label: 'Deaths before age five (%)' },
        ]}
        sources={getSources(['child-mortality-long-run'])}
        definition="Estimated probability that a newborn dies before age five, expressed as deaths per 100 live births."
      />

      <ChartCard
        eyebrow="Selected countries · UN IGME"
        title="Progress did not close every gap"
        description="These shared checkpoints use UN IGME country estimates. Dashed connectors help show that the four points are selected observations, not annual measurements."
        spec={panelSpec}
        data={childMortalityPanelSeries.map((point) => ({
          country: point.entity,
          year: point.year,
          rate: point.rate,
        }))}
        columns={[
          { key: 'country', label: 'Country' },
          { key: 'year', label: 'Checkpoint year' },
          { key: 'rate', label: 'Deaths before age five (%)' },
        ]}
        sources={getSources(['child-mortality-igme'])}
        definition="UN IGME estimate at the selected checkpoint; values are not a count of deaths in that year."
      />

      <section className="method-note">
        <p className="eyebrow">Scope and limits</p>
        <h2>The historical reconstruction and modern estimates are not identical.</h2>
        <p>
          Child mortality reflects many conditions at once: maternal health, nutrition, vaccines,
          clean water, sanitation, medical care, and living standards. The estimates are designed
          for comparisons over time, but uncertainty is larger where direct registration and
          survey data are scarce. The chart shows the direction clearly without pretending every
          country is measured with the same precision.
        </p>
      </section>

      <section className="sources-section">
        <p className="eyebrow">Sources and definitions</p>
        <h2>Sources and methodology</h2>
        <SourceList sources={sources} />
      </section>
    </StoryFrame>
  );
}

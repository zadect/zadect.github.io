import type { TopLevelSpec } from 'vega-lite';
import { ChartCard } from '../../components/ChartCard';
import { ComparisonCard } from '../../components/ComparisonCard';
import { SourceList } from '../../components/SourceList';
import { StoryFrame } from '../../components/StoryFrame';
import type { StoryDefinition } from '../../content/stories';
import { getSources } from '../../content/sources';
import {
  wealthDistributionInequalityPanelSeries,
  wealthDistributionInequalityWorldSeries,
} from './data';

interface WealthDistributionInequalityStoryProps {
  story: StoryDefinition;
}

const worldSpec: TopLevelSpec = {
  $schema: 'https://vega.github.io/schema/vega-lite/v6.json',
  width: 'container',
  height: 340,
  data: { name: 'series' },
  layer: [
    {
      mark: { type: 'area', color: '#8e7bb5', opacity: 0.18 },
      encoding: {
        x: {
          field: 'year',
          type: 'quantitative',
          title: 'Year',
          axis: { format: 'd', tickCount: 9 },
        },
        y: {
          field: 'share',
          type: 'quantitative',
          title: 'Top 1% wealth share (%)',
          scale: { domain: [0, 70] },
        },
        y2: { datum: 0 },
      },
    },
    {
      mark: { type: 'line', color: '#8e7bb5', strokeWidth: 3 },
      encoding: {
        x: { field: 'year', type: 'quantitative', title: 'Year' },
        y: {
          field: 'share',
          type: 'quantitative',
          title: 'Top 1% wealth share (%)',
          scale: { domain: [0, 70] },
        },
      },
    },
    {
      mark: { type: 'point', filled: true, color: '#d7c7ff', size: 32 },
      encoding: {
        x: { field: 'year', type: 'quantitative', title: 'Year' },
        y: {
          field: 'share',
          type: 'quantitative',
          title: 'Top 1% wealth share (%)',
          scale: { domain: [0, 70] },
        },
        tooltip: [
          { field: 'year', type: 'quantitative', title: 'Year', format: 'd' },
          { field: 'share', type: 'quantitative', title: 'Top 1% wealth share', format: '.1f' },
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
  mark: { type: 'line', point: { filled: true, size: 34 }, strokeWidth: 2.5 },
  encoding: {
    x: {
      field: 'year',
      type: 'quantitative',
      title: 'Checkpoint year',
      scale: { domain: [1820, 2024] },
      axis: { format: 'd', tickCount: 8 },
    },
    y: {
      field: 'share',
      type: 'quantitative',
      title: 'Top 1% wealth share (%)',
      scale: { domain: [0, 70] },
    },
    color: {
      field: 'entity',
      type: 'nominal',
      title: 'Country',
      scale: { scheme: 'tableau20' },
    },
    detail: { field: 'entity' },
    tooltip: [
      { field: 'entity', type: 'nominal', title: 'Country' },
      { field: 'year', type: 'quantitative', title: 'Year', format: 'd' },
      { field: 'share', type: 'quantitative', title: 'Top 1% wealth share', format: '.1f' },
    ],
  },
};

export function WealthDistributionInequalityStory({
  story,
}: WealthDistributionInequalityStoryProps) {
  if (!story.comparison) {
    throw new Error('Wealth Distribution & Inequality story is missing its comparison definition');
  }

  const first = wealthDistributionInequalityWorldSeries[0];
  const last = wealthDistributionInequalityWorldSeries.at(-1);
  const latestPanel = wealthDistributionInequalityPanelSeries.filter((point) => point.year === 2024);
  const highestLatest = latestPanel.reduce((current, point) =>
    point.share > current.share ? point : current,
  );
  const lowestLatest = latestPanel.reduce((current, point) =>
    point.share < current.share ? point : current,
  );

  if (!first || !last || !highestLatest || !lowestLatest) {
    throw new Error('Wealth Distribution & Inequality story data is incomplete');
  }

  const sources = getSources(['wid-wealth-top-1-owid']);
  const worldPeak = wealthDistributionInequalityWorldSeries.reduce((current, point) =>
    point.share > current.share ? point : current,
  );

  return (
    <StoryFrame story={story}>
      <section className="story-lede">
        <p className="lede">
          Wealth is not income, and its distribution can move on a different timetable. This
          measure follows the share held by the richest 1%: a concentrated slice of the balance
          sheet, shown with the gaps and estimates left intact.
        </p>
        <div className="stat-grid">
          <div className="stat-card">
            <span className="stat-card__value">{last.share.toFixed(1)}%</span>
            <span className="stat-card__label">
              world wealth held by the richest 1% in {last.year}
            </span>
          </div>
          <div className="stat-card">
            <span className="stat-card__value">
              {worldPeak.share.toFixed(1)}% · {worldPeak.year}
            </span>
            <span className="stat-card__label">
              highest observed world point in this extract
            </span>
          </div>
          <div className="stat-card">
            <span className="stat-card__value">{highestLatest.share.toFixed(1)}%</span>
            <span className="stat-card__label">
              2024 share in {highestLatest.entity}, highest in this selected panel
            </span>
          </div>
          <div className="stat-card">
            <span className="stat-card__value">{lowestLatest.share.toFixed(1)}%</span>
            <span className="stat-card__label">
              2024 share in {lowestLatest.entity}, lowest in this selected panel
            </span>
          </div>
        </div>
      </section>

      <ComparisonCard
        title={story.comparison.title}
        fields={story.comparison.fields}
        tone="future"
      />

      <ChartCard
        eyebrow="World · World Inequality Database via OWID"
        title="The global line is not a one-way climb"
        description="Each point is an available WID observation. The spacing is uneven by design: missing years are not filled with invented values."
        spec={worldSpec}
        data={wealthDistributionInequalityWorldSeries.map((point) => ({
          year: point.year,
          share: point.share,
        }))}
        columns={[
          { key: 'year', label: 'Year' },
          { key: 'share', label: 'Top 1% wealth share (%)' },
        ]}
        sources={sources}
        tone="future"
        definition="Share of total household net wealth held by the richest 1% of the population."
      />

      <ChartCard
        eyebrow="Six selected countries · shared checkpoints"
        title="The same slice of wealth has different histories"
        description="The country lines connect common checkpoints rather than filling the years between them. They show contrasting paths, not a definitive country ranking."
        spec={panelSpec}
        data={wealthDistributionInequalityPanelSeries.map((point) => ({
          entity: point.entity,
          year: point.year,
          share: point.share,
        }))}
        columns={[
          { key: 'entity', label: 'Country' },
          { key: 'year', label: 'Year' },
          { key: 'share', label: 'Top 1% wealth share (%)' },
        ]}
        sources={sources}
        tone="future"
        definition="The same estimated share of household net wealth held by the richest 1% in China, France, Germany, India, South Africa, and the United States."
      />

      <section className="method-note method-note--future">
        <p className="eyebrow">Read the evidence carefully</p>
        <h2>A wealth share is one window, not the whole distribution.</h2>
        <p>
          The line says how much wealth sits with the richest 1%; it does not tell us what the
          bottom 50% owns, how people move between groups, or whether incomes and living costs are
          keeping pace. WID combines several sources and models where direct balance-sheet data is
          limited, so historical comparisons should be read as estimates.
        </p>
      </section>

      <section className="sources-section">
        <p className="eyebrow">Sources and definitions</p>
        <h2>Where the wealth-distribution signal comes from</h2>
        <SourceList sources={sources} />
      </section>
    </StoryFrame>
  );
}

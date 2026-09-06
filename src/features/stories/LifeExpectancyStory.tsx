import type { TopLevelSpec } from 'vega-lite';
import { ChartCard } from '../../components/ChartCard';
import { ComparisonCard } from '../../components/ComparisonCard';
import { SourceList } from '../../components/SourceList';
import { StoryFrame } from '../../components/StoryFrame';
import type { StoryDefinition } from '../../content/stories';
import { getSources } from '../../content/sources';
import {
  lifeExpectancyLongRunSeries,
  lifeExpectancyPanelSeries,
} from './data';

interface LifeExpectancyStoryProps {
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
          field: 'years',
          type: 'quantitative',
          title: 'Life expectancy (years)',
          scale: { domain: [20, 85] },
        },
      },
    },
    {
      transform: [{ filter: "datum.phase === 'UN WPP estimate'" }],
      mark: { type: 'line', color: '#2d746a', strokeWidth: 3 },
      encoding: {
        x: { field: 'year', type: 'quantitative', title: 'Year' },
        y: {
          field: 'years',
          type: 'quantitative',
          title: 'Life expectancy (years)',
          scale: { domain: [20, 85] },
        },
      },
    },
    {
      mark: { type: 'point', filled: true, size: 24, color: '#2d746a' },
      encoding: {
        x: { field: 'year', type: 'quantitative', title: 'Year' },
        y: { field: 'years', type: 'quantitative', title: 'Life expectancy (years)' },
        shape: {
          field: 'phase',
          type: 'nominal',
          title: 'Evidence',
          scale: { domain: ['Historical reconstruction', 'UN WPP estimate'] },
        },
        tooltip: [
          { field: 'year', type: 'quantitative', title: 'Year', format: 'd' },
          { field: 'years', type: 'quantitative', title: 'Years', format: '.1f' },
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
      axis: { format: 'd', values: [1950, 1980, 2000, 2023] },
    },
    y: {
      field: 'years',
      type: 'quantitative',
      title: 'Life expectancy (years)',
      scale: { domain: [30, 90] },
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
      { field: 'years', type: 'quantitative', title: 'Years', format: '.1f' },
    ],
  },
};

export function LifeExpectancyStory({ story }: LifeExpectancyStoryProps) {
  if (!story.comparison) {
    throw new Error('Life expectancy story is missing its comparison definition');
  }

  const first = lifeExpectancyLongRunSeries[0];
  const last = lifeExpectancyLongRunSeries.at(-1);
  const latestPanel = lifeExpectancyPanelSeries.filter((point) => point.year === 2023);
  if (!first || !last || latestPanel.length === 0) {
    throw new Error('Life expectancy story data is incomplete');
  }

  const highestLatest = latestPanel.reduce((current, point) =>
    point.years > current.years ? point : current,
  );
  const lowestLatest = latestPanel.reduce((current, point) =>
    point.years < current.years ? point : current,
  );

  return (
    <StoryFrame story={story}>
      <section className="story-lede">
        <p className="lede">
          Estimated world life expectancy rose from {first.years.toFixed(0)} years in {first.year}{' '}
          to {last.years.toFixed(0)} years in {last.year}. The average fell during the pandemic,
          and country gaps remain.
        </p>
        <div className="stat-grid">
          <div className="stat-card">
            <span className="stat-card__value">
              {first.years.toFixed(0)} → {last.years.toFixed(0)}
            </span>
            <span className="stat-card__label">
              estimated world life expectancy from {first.year} to {last.year}
            </span>
          </div>
          <div className="stat-card">
            <span className="stat-card__value">{highestLatest.years.toFixed(1)} years</span>
            <span className="stat-card__label">
              2023 life expectancy in {highestLatest.entity}, versus{' '}
              {lowestLatest.years.toFixed(1)} in {lowestLatest.entity}
            </span>
          </div>
        </div>
      </section>

      <ComparisonCard title={story.comparison.title} fields={story.comparison.fields} />

      <ChartCard
        eyebrow="World · OWID long-run compilation"
        title="Estimated life expectancy rose over the long run"
        description="The dashed segment is the historical reconstruction; the solid segment uses UN World Population Prospects estimates from 1950 onward."
        spec={longRunSpec}
        data={lifeExpectancyLongRunSeries.map((point) => ({
          year: point.year,
          years: point.years,
          phase: point.year < 1950 ? 'Historical reconstruction' : 'UN WPP estimate',
        }))}
        columns={[
          { key: 'year', label: 'Year' },
          { key: 'years', label: 'Life expectancy (years)' },
        ]}
        sources={getSources(['life-expectancy-owid'])}
        definition="Period life expectancy at birth, expressed in years."
      />

      <ChartCard
        eyebrow="Selected countries · UN WPP"
        title="Country estimates at selected checkpoints"
        description="The country panel keeps four selected checkpoints for each country. Dashed connectors are visual guides between observations, not annual estimates."
        spec={panelSpec}
        data={lifeExpectancyPanelSeries.map((point) => ({
          country: point.entity,
          year: point.year,
          years: point.years,
        }))}
        columns={[
          { key: 'country', label: 'Country' },
          { key: 'year', label: 'Checkpoint year' },
          { key: 'years', label: 'Life expectancy (years)' },
        ]}
        sources={getSources(['life-expectancy-owid'])}
        definition="UN World Population Prospects life expectancy estimate at each checkpoint; not a forecast of individual lifespan."
      />

      <section className="method-note">
        <p className="eyebrow">Scope and limits</p>
        <h2>Life expectancy summarizes a population.</h2>
        <p>
          It describes the average years a newborn would live if that year’s age-specific death
          rates stayed constant. Large gaps by income, sex, region, or cause of death can remain
          inside the average. Historical values also combine sources with different coverage; the
          source notes identify those transitions.
        </p>
      </section>

      <SourceList sources={getSources(['life-expectancy-owid'])} />
    </StoryFrame>
  );
}

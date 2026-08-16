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
  mark: { type: 'line', point: { filled: true, size: 24 }, strokeWidth: 3 },
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
    color: { value: '#2d746a' },
    tooltip: [
      { field: 'year', type: 'quantitative', title: 'Year', format: 'd' },
      { field: 'years', type: 'quantitative', title: 'Years', format: '.1f' },
    ],
  },
};

const panelSpec: TopLevelSpec = {
  $schema: 'https://vega.github.io/schema/vega-lite/v6.json',
  width: 'container',
  height: 360,
  data: { name: 'series' },
  mark: { type: 'line', point: { filled: true, size: 42 }, strokeWidth: 2.5 },
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
          Longer lives are not an abstract promise. They are the result of fewer children dying,
          better treatment, safer work, and healthier everyday conditions — with setbacks still
          visible in the line.
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
        title="The average human life became much longer"
        description="The series combines historical mortality research with modern UN estimates. The dip around the pandemic is a reminder that progress is a direction, not a guarantee."
        spec={longRunSpec}
        data={lifeExpectancyLongRunSeries.map((point) => ({
          year: point.year,
          years: point.years,
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
        title="Longer lives arrived at different speeds"
        description="The country panel keeps the same four checkpoints for each country. The lines rise together, but the distance between them remains meaningful."
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
        <p className="eyebrow">Read the evidence carefully</p>
        <h2>One average hides many different lives.</h2>
        <p>
          Life expectancy is an average across a population. It does not say that people die at
          that age, and it can improve while large gaps by income, sex, region, or cause of death
          remain. Historical values also combine sources with different coverage; the source notes
          make those transitions visible.
        </p>
      </section>

      <section className="sources-section">
        <p className="eyebrow">Sources and definitions</p>
        <h2>Where the life-expectancy estimates come from</h2>
        <SourceList sources={getSources(['life-expectancy-owid'])} />
      </section>
    </StoryFrame>
  );
}

import type { TopLevelSpec } from 'vega-lite';
import { ChartCard } from '../../components/ChartCard';
import { SourceList } from '../../components/SourceList';
import { StoryFrame } from '../../components/StoryFrame';
import { getSources } from '../../content/sources';
import {
  earliest,
  foodAvailabilitySeries,
  hungerSeries,
  latest,
} from './data';
import type { StoryDefinition } from '../../content/stories';

interface HungerStoryProps {
  story: StoryDefinition;
}

const hungerSpec: TopLevelSpec = {
  $schema: 'https://vega.github.io/schema/vega-lite/v6.json',
  width: 'container',
  height: 320,
  data: { name: 'series' },
  mark: { type: 'line', point: { filled: true, size: 36 }, strokeWidth: 3 },
  encoding: {
    x: {
      field: 'year',
      type: 'quantitative',
      title: 'Year',
      axis: { format: 'd', tickCount: 6 },
    },
    y: {
      field: 'prevalence',
      type: 'quantitative',
      title: 'Share of people (%)',
      scale: { zero: false },
    },
    tooltip: [
      { field: 'year', type: 'quantitative', title: 'Year', format: 'd' },
      { field: 'prevalence', type: 'quantitative', title: 'Undernourished', format: '.1f' },
    ],
    color: { value: '#2d746a' },
  },
  config: {
    axis: { labelColor: '#5b635f', titleColor: '#35403d', gridColor: '#d8ded8' },
    view: { stroke: 'transparent' },
  },
};

const foodSpec: TopLevelSpec = {
  $schema: 'https://vega.github.io/schema/vega-lite/v6.json',
  width: 'container',
  height: 320,
  data: { name: 'series' },
  mark: { type: 'line', point: { filled: true, size: 28 }, strokeWidth: 3 },
  encoding: {
    x: {
      field: 'year',
      type: 'quantitative',
      title: 'Year',
      axis: { format: 'd', tickCount: 7 },
    },
    y: {
      field: 'calories',
      type: 'quantitative',
      title: 'Kilocalories per person / day',
      scale: { zero: false },
    },
    tooltip: [
      { field: 'year', type: 'quantitative', title: 'Year', format: 'd' },
      { field: 'calories', type: 'quantitative', title: 'Calories', format: ',.0f' },
    ],
    color: { value: '#8da65a' },
  },
  config: {
    axis: { labelColor: '#5b635f', titleColor: '#35403d', gridColor: '#d8ded8' },
    view: { stroke: 'transparent' },
  },
};

export function HungerStory({ story }: HungerStoryProps) {
  const firstHunger = earliest(hungerSeries);
  const lastHunger = latest(hungerSeries);
  const firstFood = earliest(foodAvailabilitySeries);
  const lastFood = latest(foodAvailabilitySeries);
  const hungerSources = getSources(['fao-undernourishment']);
  const foodSources = getSources(['fao-food-availability']);
  const allSources = getSources(['fao-undernourishment', 'fao-food-availability']);

  return (
    <StoryFrame story={story}>
      <section className="story-lede">
        <p className="lede">
          The world has made more food available per person, while the share of people living with
          insufficient dietary energy has fallen in the period covered by the direct FAO measure.
          Those are related signals, not interchangeable ones.
        </p>
        <div className="stat-grid">
          <div className="stat-card">
            <span className="stat-card__value">{lastHunger.prevalence.toFixed(1)}%</span>
            <span className="stat-card__label">
              undernourished in {lastHunger.year}, down from {firstHunger.prevalence.toFixed(1)}% in{' '}
              {firstHunger.year}
            </span>
          </div>
          <div className="stat-card">
            <span className="stat-card__value">
              {Math.round(lastFood.calories).toLocaleString()}
            </span>
            <span className="stat-card__label">
              calories available per person / day in {lastFood.year}, up from{' '}
              {Math.round(firstFood.calories).toLocaleString()} in {firstFood.year}
            </span>
          </div>
        </div>
      </section>

      <div className="chart-stack">
        <ChartCard
          eyebrow="Direct measure · FAO"
          title="Fewer people are undernourished"
          description="The prevalence of undernourishment estimates the share of people whose habitual food intake is not enough for a normal, active, healthy life."
          spec={hungerSpec}
          data={hungerSeries.map((point) => ({
            year: point.year,
            prevalence: Number(point.prevalence.toFixed(2)),
          }))}
          columns={[
            { key: 'year', label: 'Year' },
            { key: 'prevalence', label: 'Undernourished (%)' },
          ]}
          sources={hungerSources}
        />
        <ChartCard
          eyebrow="Longer context · FAO"
          title="More calories have entered the food supply"
          description="Average food availability has risen since 1961. This is supply, not consumption: waste, inequality, diet quality, and access still matter."
          spec={foodSpec}
          data={foodAvailabilitySeries.map((point) => ({
            year: point.year,
            calories: Math.round(point.calories),
          }))}
          columns={[
            { key: 'year', label: 'Year' },
            { key: 'calories', label: 'Kilocalories / person / day' },
          ]}
          sources={foodSources}
        />
      </div>

      <section className="method-note">
        <p className="eyebrow">Read the evidence carefully</p>
        <h2>One line starts in 2000. The other starts in 1961.</h2>
        <p>
          A centuries-long, globally comparable direct hunger series is not available. The first
          chart therefore stays with FAO&apos;s standardized undernourishment estimates. The longer
          calorie series gives historical context, but it should never be read as a direct count of
          hunger.
        </p>
      </section>

      <section className="sources-section">
        <p className="eyebrow">Sources and definitions</p>
        <h2>Where the numbers come from</h2>
        <SourceList sources={allSources} />
      </section>
    </StoryFrame>
  );
}

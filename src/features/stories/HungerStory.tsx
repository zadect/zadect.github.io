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
          More food has been available per person, while the direct undernourishment estimate has
          fallen over its shorter comparable series. They are related signals, not the same measure.
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
          eyebrow="Direct measure · FAO + OWID"
          title="Fewer people are undernourished"
          description="FAO’s prevalence estimate is the share of people whose habitual food intake is not enough for an active, healthy life. The series is downloaded through Our World in Data."
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
          definition="Share of the population estimated to be undernourished; percent, not a count of people."
        />
        <ChartCard
          eyebrow="Longer context · FAO, OWID, and other sources"
          title="More calories have entered the food supply"
          description="Average calories available in the food supply have risen since 1961. This is supply, not consumption, and the OWID series combines FAO with other historical sources."
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
          definition="Kilocalories available in the national food supply per person per day; not equal access or actual intake."
        />
      </div>

      <section className="method-note">
        <p className="eyebrow">Read the evidence carefully</p>
        <h2>The two lines answer different questions.</h2>
        <p>
          The undernourishment estimate is the direct measure, but the globally comparable series
          in this release begins in 2000. The calorie series reaches back to 1961 and gives useful
          context, but it should not be read as a direct count of hunger.
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

import type { TopLevelSpec } from 'vega-lite';
import { ChartCard } from '../../components/ChartCard';
import { ComparisonCard } from '../../components/ComparisonCard';
import { SourceList } from '../../components/SourceList';
import { StoryFrame } from '../../components/StoryFrame';
import type { StoryDefinition } from '../../content/stories';
import { getSources } from '../../content/sources';
import {
  inflationPanelSeries,
  inflationWorldSeries,
  renewableElectricityWorldSeries,
} from './data';

interface InflationPricesEnergyStoryProps {
  story: StoryDefinition;
}

const inflationWorldSpec: TopLevelSpec = {
  $schema: 'https://vega.github.io/schema/vega-lite/v6.json',
  width: 'container',
  height: 340,
  data: { name: 'series' },
  layer: [
    {
      mark: { type: 'area', color: '#8e7bb5', opacity: 0.16 },
      encoding: {
        x: {
          field: 'year',
          type: 'quantitative',
          title: 'Year',
          axis: { format: 'd', tickCount: 9 },
        },
        y: {
          field: 'value',
          type: 'quantitative',
          title: 'Consumer inflation (%)',
          scale: { domain: [0, 14] },
        },
        y2: { datum: 0 },
      },
    },
    {
      mark: { type: 'line', color: '#6f5a9e', strokeWidth: 3 },
      encoding: {
        x: { field: 'year', type: 'quantitative', title: 'Year' },
        y: {
          field: 'value',
          type: 'quantitative',
          title: 'Consumer inflation (%)',
          scale: { domain: [0, 14] },
        },
      },
    },
    {
      mark: { type: 'point', filled: true, color: '#d7c7ff', size: 30 },
      encoding: {
        x: { field: 'year', type: 'quantitative', title: 'Year' },
        y: {
          field: 'value',
          type: 'quantitative',
          title: 'Consumer inflation (%)',
          scale: { domain: [0, 14] },
        },
        tooltip: [
          { field: 'year', type: 'quantitative', title: 'Year', format: 'd' },
          { field: 'value', type: 'quantitative', title: 'Inflation', format: '.1f' },
        ],
      },
    },
    {
      mark: { type: 'rule', color: '#8f84a6', strokeDash: [5, 4], strokeWidth: 1.5 },
      encoding: { y: { datum: 2 } },
    },
  ],
};

const inflationPanelSpec: TopLevelSpec = {
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
      scale: { domain: [2000, 2024] },
      axis: { format: 'd', values: [2000, 2010, 2020, 2024] },
    },
    y: {
      field: 'value',
      type: 'quantitative',
      title: 'Consumer inflation (%)',
      scale: { domain: [0, 14] },
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
      { field: 'value', type: 'quantitative', title: 'Inflation', format: '.1f' },
    ],
  },
};

const renewableSpec: TopLevelSpec = {
  $schema: 'https://vega.github.io/schema/vega-lite/v6.json',
  width: 'container',
  height: 340,
  data: { name: 'series' },
  layer: [
    {
      mark: { type: 'area', color: '#a898d0', opacity: 0.2 },
      encoding: {
        x: {
          field: 'year',
          type: 'quantitative',
          title: 'Year',
          axis: { format: 'd', tickCount: 9 },
        },
        y: {
          field: 'value',
          type: 'quantitative',
          title: 'Renewable electricity (%)',
          scale: { domain: [0, 60] },
        },
        y2: { datum: 0 },
      },
    },
    {
      mark: { type: 'line', color: '#4e8b78', strokeWidth: 3 },
      encoding: {
        x: { field: 'year', type: 'quantitative', title: 'Year' },
        y: {
          field: 'value',
          type: 'quantitative',
          title: 'Renewable electricity (%)',
          scale: { domain: [0, 60] },
        },
      },
    },
    {
      mark: { type: 'point', filled: true, color: '#b5e1cf', size: 28 },
      encoding: {
        x: { field: 'year', type: 'quantitative', title: 'Year' },
        y: {
          field: 'value',
          type: 'quantitative',
          title: 'Renewable electricity (%)',
          scale: { domain: [0, 60] },
        },
        tooltip: [
          { field: 'year', type: 'quantitative', title: 'Year', format: 'd' },
          {
            field: 'value',
            type: 'quantitative',
            title: 'Renewable electricity',
            format: '.1f',
          },
        ],
      },
    },
  ],
};

export function InflationPricesEnergyStory({ story }: InflationPricesEnergyStoryProps) {
  if (!story.comparison) {
    throw new Error('Inflation, Prices & Energy story is missing its comparison definition');
  }

  const peakInflation = inflationWorldSeries.reduce((current, point) =>
    point.value > current.value ? point : current,
  );
  const lowestInflation = inflationWorldSeries.reduce((current, point) =>
    point.value < current.value ? point : current,
  );
  const firstRenewables = renewableElectricityWorldSeries[0];
  const lowestRenewables = renewableElectricityWorldSeries.reduce((current, point) =>
    point.value < current.value ? point : current,
  );
  const latestRenewables = renewableElectricityWorldSeries.at(-1);
  const latestInflation = inflationWorldSeries.at(-1);

  if (
    !peakInflation ||
    !lowestInflation ||
    !firstRenewables ||
    !lowestRenewables ||
    !latestRenewables ||
    !latestInflation
  ) {
    throw new Error('Inflation, Prices & Energy story data is incomplete');
  }

  const inflationSource = getSources(['imf-consumer-inflation-owid']);
  const energySource = getSources(['ember-renewable-electricity-owid']);
  const sources = [...inflationSource, ...energySource];

  return (
    <StoryFrame story={story}>
      <section className="story-lede">
        <p className="lede">
          Prices do not rise in a straight line. Energy systems do not change on the same clock.
          Put together, the lines show a future shaped by short shocks and slow infrastructure.
        </p>
        <div className="stat-grid">
          <div className="stat-card">
            <span className="stat-card__value">{peakInflation.value.toFixed(1)}%</span>
            <span className="stat-card__label">
              world consumer inflation in {peakInflation.year}, the highest point in this series
            </span>
          </div>
          <div className="stat-card">
            <span className="stat-card__value">{latestInflation.value.toFixed(1)}%</span>
            <span className="stat-card__label">
              world consumer inflation in {latestInflation.year}
            </span>
          </div>
          <div className="stat-card">
            <span className="stat-card__value">{lowestRenewables.value.toFixed(1)}%</span>
            <span className="stat-card__label">
              renewable share of world electricity in {lowestRenewables.year}, the series low
            </span>
          </div>
          <div className="stat-card">
            <span className="stat-card__value">{latestRenewables.value.toFixed(1)}%</span>
            <span className="stat-card__label">
              renewable share of world electricity in {latestRenewables.year}
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
        eyebrow="World · IMF International Financial Statistics via World Bank and OWID"
        title="Inflation arrives in waves"
        description="The line is the annual change in consumer prices. A dashed reference at 2% is a visual benchmark, not a universal definition of price stability."
        spec={inflationWorldSpec}
        data={inflationWorldSeries.map((point) => ({
          year: point.year,
          value: point.value,
        }))}
        columns={[
          { key: 'year', label: 'Year' },
          { key: 'value', label: 'Consumer inflation (%)' },
        ]}
        sources={inflationSource}
        tone="future"
        definition="Annual percentage change in the consumer-price index for the world."
      />

      <ChartCard
        eyebrow="Six selected countries · shared checkpoints"
        title="The same years, different price paths"
        description="The country lines use four common checkpoints. They show differences in timing and magnitude without pretending that one basket or policy experience is universal."
        spec={inflationPanelSpec}
        data={inflationPanelSeries.map((point) => ({
          entity: point.entity,
          year: point.year,
          value: point.value,
        }))}
        columns={[
          { key: 'entity', label: 'Country' },
          { key: 'year', label: 'Year' },
          { key: 'value', label: 'Consumer inflation (%)' },
        ]}
        sources={inflationSource}
        tone="future"
        definition="Annual consumer-price inflation for Brazil, Germany, India, Sweden, the United Kingdom, and the United States at shared checkpoints."
      />

      <ChartCard
        eyebrow="World · Ember and historical electricity sources via OWID"
        title="The electricity mix turns slowly, then accelerates"
        description="Renewable electricity was already a large part of the early power system because hydropower dominated it. The long dip and recent rise are both part of the story."
        spec={renewableSpec}
        data={renewableElectricityWorldSeries.map((point) => ({
          year: point.year,
          value: point.value,
        }))}
        columns={[
          { key: 'year', label: 'Year' },
          { key: 'value', label: 'Renewable electricity (%)' },
        ]}
        sources={energySource}
        tone="future"
        definition="Share of world electricity generation from renewable sources, not renewable energy’s share of all energy use."
      />

      <section className="method-note method-note--future">
        <p className="eyebrow">Read the evidence carefully</p>
        <h2>Different clocks, not a single forecast.</h2>
        <p>
          Inflation measures a yearly change in prices; it does not tell us how expensive a life
          feels to every household. Renewable electricity is a generation share, so it can rise
          while total energy demand, fossil-fuel use, or emissions remain high. The charts belong
          in the same conversation, but they do not explain one another.
        </p>
      </section>

      <section className="sources-section">
        <p className="eyebrow">Sources and definitions</p>
        <h2>Where the price and energy signals come from</h2>
        <SourceList sources={sources} />
      </section>
    </StoryFrame>
  );
}

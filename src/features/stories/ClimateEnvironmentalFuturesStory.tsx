import type { TopLevelSpec } from 'vega-lite';
import { ChartCard } from '../../components/ChartCard';
import { ComparisonCard } from '../../components/ComparisonCard';
import { SourceList } from '../../components/SourceList';
import { StoryFrame } from '../../components/StoryFrame';
import type { StoryDefinition } from '../../content/stories';
import { getSources } from '../../content/sources';
import {
  climatePanelPerCapitaSeries,
  climatePanelTotalSeries,
  climateWorldPerCapitaSeries,
  climateWorldTotalSeries,
} from './data';

interface ClimateEnvironmentalFuturesStoryProps {
  story: StoryDefinition;
}

const worldTotalSpec: TopLevelSpec = {
  $schema: 'https://vega.github.io/schema/vega-lite/v6.json',
  width: 'container',
  height: 340,
  data: { name: 'series' },
  layer: [
    {
      mark: { type: 'area', color: '#8e7bb5', opacity: 0.17 },
      encoding: {
        x: {
          field: 'year',
          type: 'quantitative',
          title: 'Year',
          scale: { domain: [1850, 2024] },
          axis: { format: 'd', values: [1850, 1900, 1950, 2000, 2024] },
        },
        y: {
          field: 'value',
          type: 'quantitative',
          title: 'Fossil CO₂ emissions (million tonnes)',
          scale: { domain: [0, 42_000] },
          axis: { format: ',.0f' },
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
          title: 'Fossil CO₂ emissions (million tonnes)',
          scale: { domain: [0, 42_000] },
        },
      },
    },
    {
      mark: { type: 'point', filled: true, color: '#d7c7ff', size: 34 },
      encoding: {
        x: { field: 'year', type: 'quantitative', title: 'Year' },
        y: {
          field: 'value',
          type: 'quantitative',
          title: 'Fossil CO₂ emissions (million tonnes)',
          scale: { domain: [0, 42_000] },
        },
        tooltip: [
          { field: 'year', type: 'quantitative', title: 'Year', format: 'd' },
          {
            field: 'value',
            type: 'quantitative',
            title: 'Emissions',
            format: ',.0f',
          },
        ],
      },
    },
  ],
};

const worldPerCapitaSpec: TopLevelSpec = {
  $schema: 'https://vega.github.io/schema/vega-lite/v6.json',
  width: 'container',
  height: 320,
  data: { name: 'series' },
  layer: [
    {
      mark: { type: 'area', color: '#b5e1cf', opacity: 0.24 },
      encoding: {
        x: {
          field: 'year',
          type: 'quantitative',
          title: 'Year',
          scale: { domain: [1850, 2024] },
          axis: { format: 'd', values: [1850, 1900, 1950, 2000, 2024] },
        },
        y: {
          field: 'value',
          type: 'quantitative',
          title: 'Fossil CO₂ per person (tonnes)',
          scale: { domain: [0, 5.5] },
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
          title: 'Fossil CO₂ per person (tonnes)',
          scale: { domain: [0, 5.5] },
        },
      },
    },
    {
      mark: { type: 'point', filled: true, color: '#b5e1cf', size: 34 },
      encoding: {
        x: { field: 'year', type: 'quantitative', title: 'Year' },
        y: {
          field: 'value',
          type: 'quantitative',
          title: 'Fossil CO₂ per person (tonnes)',
          scale: { domain: [0, 5.5] },
        },
        tooltip: [
          { field: 'year', type: 'quantitative', title: 'Year', format: 'd' },
          {
            field: 'value',
            type: 'quantitative',
            title: 'Per-person emissions',
            format: '.2f',
          },
        ],
      },
    },
  ],
};

const panelTotalSpec: TopLevelSpec = {
  $schema: 'https://vega.github.io/schema/vega-lite/v6.json',
  width: 'container',
  height: 370,
  data: { name: 'series' },
  mark: { type: 'line', point: { filled: true, size: 34 }, strokeWidth: 2.5 },
  encoding: {
    x: {
      field: 'year',
      type: 'quantitative',
      title: 'Checkpoint year',
      scale: { domain: [1950, 2024] },
      axis: { format: 'd', values: [1950, 1970, 1990, 2010, 2020, 2024] },
    },
    y: {
      field: 'value',
      type: 'quantitative',
      title: 'Fossil CO₂ emissions (million tonnes)',
      scale: { domain: [0, 13_500] },
      axis: { format: ',.0f' },
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
      { field: 'value', type: 'quantitative', title: 'Emissions', format: ',.0f' },
    ],
  },
};

const panelPerCapitaSpec: TopLevelSpec = {
  $schema: 'https://vega.github.io/schema/vega-lite/v6.json',
  width: 'container',
  height: 370,
  data: { name: 'series' },
  mark: { type: 'line', point: { filled: true, size: 34 }, strokeWidth: 2.5 },
  encoding: {
    x: {
      field: 'year',
      type: 'quantitative',
      title: 'Checkpoint year',
      scale: { domain: [1950, 2024] },
      axis: { format: 'd', values: [1950, 1970, 1990, 2010, 2020, 2024] },
    },
    y: {
      field: 'value',
      type: 'quantitative',
      title: 'Fossil CO₂ per person (tonnes)',
      scale: { domain: [0, 23] },
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
      { field: 'value', type: 'quantitative', title: 'Per-person emissions', format: '.2f' },
    ],
  },
};

export function ClimateEnvironmentalFuturesStory({
  story,
}: ClimateEnvironmentalFuturesStoryProps) {
  if (!story.comparison) {
    throw new Error('Climate & Environmental Futures story is missing its comparison definition');
  }

  const firstTotal = climateWorldTotalSeries[0];
  const latestTotal = climateWorldTotalSeries.at(-1);
  const firstPerCapita = climateWorldPerCapitaSeries[0];
  const latestPerCapita = climateWorldPerCapitaSeries.at(-1);
  const latestPanelTotal = climatePanelTotalSeries.filter((point) => point.year === 2024);
  const latestPanelPerCapita = climatePanelPerCapitaSeries.filter((point) => point.year === 2024);
  const highestTotal = latestPanelTotal.reduce((current, point) =>
    point.value > current.value ? point : current,
  );
  const highestPerCapita = latestPanelPerCapita.reduce((current, point) =>
    point.value > current.value ? point : current,
  );

  if (
    !firstTotal ||
    !latestTotal ||
    !firstPerCapita ||
    !latestPerCapita ||
    !highestTotal ||
    !highestPerCapita
  ) {
    throw new Error('Climate & Environmental Futures story data is incomplete');
  }

  const source = getSources(['owid-global-carbon-budget']);

  return (
    <StoryFrame story={story}>
      <section className="story-lede">
        <p className="lede">
          The climate signal has two scales. Humanity’s total fossil CO₂ output keeps setting new
          highs, while per-person emissions reveal a much more divided world.
        </p>
        <div className="stat-grid">
          <div className="stat-card">
            <span className="stat-card__value">
              {firstTotal.value.toLocaleString()} → {latestTotal.value.toLocaleString()}
            </span>
            <span className="stat-card__label">
              million tonnes of fossil CO₂ from 1850 to 2024
            </span>
          </div>
          <div className="stat-card">
            <span className="stat-card__value">
              {firstPerCapita.value.toFixed(2)} → {latestPerCapita.value.toFixed(2)}
            </span>
            <span className="stat-card__label">tonnes of fossil CO₂ per person worldwide</span>
          </div>
          <div className="stat-card">
            <span className="stat-card__value">{highestTotal.value.toLocaleString()}</span>
            <span className="stat-card__label">
              million tonnes in 2024 from {highestTotal.entity}, highest in this panel
            </span>
          </div>
          <div className="stat-card">
            <span className="stat-card__value">{highestPerCapita.value.toFixed(2)}</span>
            <span className="stat-card__label">
              tonnes per person in 2024 from {highestPerCapita.entity}, highest in this panel
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
        eyebrow="World · annual series · 1850–2024"
        title="The total keeps climbing"
        description="The long line is the global fossil-carbon story: each year’s territorial emissions from coal, oil, gas, flaring, and cement."
        spec={worldTotalSpec}
        data={climateWorldTotalSeries.map((point) => ({
          year: point.year,
          value: point.value,
        }))}
        columns={[
          { key: 'year', label: 'Year' },
          { key: 'value', label: 'Million tonnes of CO₂' },
        ]}
        sources={source}
        tone="future"
        definition="Annual fossil CO₂ emissions, excluding land-use change, measured where the emissions occur."
      />

      <ChartCard
        eyebrow="World · annual series · 1850–2024"
        title="Per-person emissions tell a different story"
        description="The world average is not a measure of equal responsibility. It is the total divided by the number of people alive in each year."
        spec={worldPerCapitaSpec}
        data={climateWorldPerCapitaSeries.map((point) => ({
          year: point.year,
          value: point.value,
        }))}
        columns={[
          { key: 'year', label: 'Year' },
          { key: 'value', label: 'Tonnes per person' },
        ]}
        sources={source}
        tone="future"
        definition="World fossil CO₂ emissions divided by world population in the same year."
      />

      <ChartCard
        eyebrow="Eight selected countries · shared checkpoints"
        title="Scale and speed are not the same"
        description="Country totals reflect population as well as energy use. China and India rise in scale; Germany, Japan, the UK, and the US show different peaks and reversals."
        spec={panelTotalSpec}
        data={climatePanelTotalSeries.map((point) => ({
          entity: point.entity,
          year: point.year,
          value: point.value,
        }))}
        columns={[
          { key: 'entity', label: 'Country' },
          { key: 'year', label: 'Year' },
          { key: 'value', label: 'Million tonnes of CO₂' },
        ]}
        sources={source}
        tone="future"
        definition="Territorial fossil CO₂ emissions for the selected countries at six shared checkpoints."
      />

      <ChartCard
        eyebrow="Eight selected countries · shared checkpoints"
        title="The gap between people remains wide"
        description="Per-person lines change the ranking. In 2024, the highest value in this panel was more than twenty times Nigeria’s, even before counting emissions embodied in trade."
        spec={panelPerCapitaSpec}
        data={climatePanelPerCapitaSeries.map((point) => ({
          entity: point.entity,
          year: point.year,
          value: point.value,
        }))}
        columns={[
          { key: 'entity', label: 'Country' },
          { key: 'year', label: 'Year' },
          { key: 'value', label: 'Tonnes per person' },
        ]}
        sources={source}
        tone="future"
        definition="Territorial fossil CO₂ emissions per person for the selected countries at six shared checkpoints."
      />

      <section className="method-note method-note--future">
        <p className="eyebrow">Read the evidence carefully</p>
        <h2>One emissions ledger cannot answer every climate question.</h2>
        <p>
          These charts show where fossil CO₂ was produced, not who consumed the resulting goods,
          who caused historic emissions, or what happens next. They exclude land-use change and
          are not a forecast. The country panel is a deliberately small set of comparable
          checkpoints, not a ranking of every country.
        </p>
      </section>

      <section className="sources-section">
        <p className="eyebrow">Sources and definitions</p>
        <h2>Where the emissions signal comes from</h2>
        <SourceList sources={source} />
      </section>
    </StoryFrame>
  );
}

import type { TopLevelSpec } from 'vega-lite';
import { ChartCard } from '../../components/ChartCard';
import { ComparisonCard } from '../../components/ComparisonCard';
import { SourceList } from '../../components/SourceList';
import { StoryFrame } from '../../components/StoryFrame';
import type { StoryDefinition } from '../../content/stories';
import { getSources } from '../../content/sources';
import {
  healthSpendingPanelSeries,
  healthSpendingWorldSeries,
  healthyLifeExpectancyPanelSeries,
  healthyLifeExpectancyWorldSeries,
} from './data';

interface HealthLongevityHumanCapitalStoryProps {
  story: StoryDefinition;
}

const haleWorldSpec: TopLevelSpec = {
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
          axis: { format: 'd', tickCount: 8 },
        },
        y: {
          field: 'value',
          type: 'quantitative',
          title: 'Healthy life expectancy (years)',
          scale: { domain: [55, 65] },
        },
        y2: { datum: 55 },
      },
    },
    {
      mark: { type: 'line', color: '#6f5a9e', strokeWidth: 3 },
      encoding: {
        x: { field: 'year', type: 'quantitative', title: 'Year' },
        y: {
          field: 'value',
          type: 'quantitative',
          title: 'Healthy life expectancy (years)',
          scale: { domain: [55, 65] },
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
          title: 'Healthy life expectancy (years)',
          scale: { domain: [55, 65] },
        },
        tooltip: [
          { field: 'year', type: 'quantitative', title: 'Year', format: 'd' },
          { field: 'value', type: 'quantitative', title: 'Healthy life expectancy', format: '.1f' },
        ],
      },
    },
  ],
};

const halePanelSpec: TopLevelSpec = {
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
      scale: { domain: [2000, 2021] },
      axis: { format: 'd', values: [2000, 2010, 2020, 2021] },
    },
    y: {
      field: 'value',
      type: 'quantitative',
      title: 'Healthy life expectancy (years)',
      scale: { domain: [40, 76] },
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
      { field: 'value', type: 'quantitative', title: 'Healthy life expectancy', format: '.1f' },
    ],
  },
};

const spendingWorldSpec: TopLevelSpec = {
  $schema: 'https://vega.github.io/schema/vega-lite/v6.json',
  width: 'container',
  height: 340,
  data: { name: 'series' },
  layer: [
    {
      mark: { type: 'area', color: '#9a83c7', opacity: 0.16 },
      encoding: {
        x: {
          field: 'year',
          type: 'quantitative',
          title: 'Year',
          axis: { format: 'd', tickCount: 8 },
        },
        y: {
          field: 'value',
          type: 'quantitative',
          title: 'Health spending per person (current international $)',
          scale: { domain: [0, 2_000] },
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
          title: 'Health spending per person (current international $)',
          scale: { domain: [0, 2_000] },
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
          title: 'Health spending per person (current international $)',
          scale: { domain: [0, 2_000] },
        },
        tooltip: [
          { field: 'year', type: 'quantitative', title: 'Year', format: 'd' },
          {
            field: 'value',
            type: 'quantitative',
            title: 'Health spending per person',
            format: ',.0f',
          },
        ],
      },
    },
  ],
};

const spendingPanelSpec: TopLevelSpec = {
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
      scale: { domain: [2000, 2023] },
      axis: { format: 'd', values: [2000, 2010, 2020, 2023] },
    },
    y: {
      field: 'value',
      type: 'quantitative',
      title: 'Health spending per person (current international $)',
      scale: { domain: [0, 14_000] },
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
      {
        field: 'value',
        type: 'quantitative',
        title: 'Health spending per person',
        format: ',.0f',
      },
    ],
  },
};

export function HealthLongevityHumanCapitalStory({
  story,
}: HealthLongevityHumanCapitalStoryProps) {
  if (!story.comparison) {
    throw new Error('Health, Longevity & Human Capital story is missing its comparison definition');
  }

  const firstHale = healthyLifeExpectancyWorldSeries[0];
  const latestHale = healthyLifeExpectancyWorldSeries.at(-1);
  const peakHale = healthyLifeExpectancyWorldSeries.reduce((current, point) =>
    point.value > current.value ? point : current,
  );
  const firstSpending = healthSpendingWorldSeries[0];
  const latestSpending = healthSpendingWorldSeries.at(-1);
  const latestHalePanel = healthyLifeExpectancyPanelSeries.filter((point) => point.year === 2021);
  const highestHale = latestHalePanel.reduce((current, point) =>
    point.value > current.value ? point : current,
  );
  const latestSpendingPanel = healthSpendingPanelSeries.filter((point) => point.year === 2023);
  const highestSpending = latestSpendingPanel.reduce((current, point) =>
    point.value > current.value ? point : current,
  );

  if (
    !firstHale ||
    !latestHale ||
    !peakHale ||
    !firstSpending ||
    !latestSpending ||
    !highestHale ||
    !highestSpending
  ) {
    throw new Error('Health, Longevity & Human Capital story data is incomplete');
  }

  const haleSource = getSources(['who-healthy-life-expectancy-owid']);
  const spendingSource = getSources(['who-health-expenditure-owid']);
  const sources = [...haleSource, ...spendingSource];

  return (
    <StoryFrame story={story}>
      <section className="story-lede">
        <p className="lede">
          A longer life is not the whole health story. The useful question is how many of those
          years are lived in good health, and what societies spend to make that possible.
        </p>
        <div className="stat-grid">
          <div className="stat-card">
            <span className="stat-card__value">
              {firstHale.value.toFixed(1)} → {latestHale.value.toFixed(1)}
            </span>
            <span className="stat-card__label">
              world healthy life expectancy from {firstHale.year} to {latestHale.year}
            </span>
          </div>
          <div className="stat-card">
            <span className="stat-card__value">{peakHale.value.toFixed(1)}</span>
            <span className="stat-card__label">
              world healthy life expectancy peak in {peakHale.year}, before the latest decline
            </span>
          </div>
          <div className="stat-card">
            <span className="stat-card__value">
              ${(latestSpending.value / firstSpending.value).toFixed(1)}×
            </span>
            <span className="stat-card__label">
              increase in world health spending per person from {firstSpending.year} to{' '}
              {latestSpending.year}
            </span>
          </div>
          <div className="stat-card">
            <span className="stat-card__value">{highestHale.value.toFixed(1)}</span>
            <span className="stat-card__label">
              2021 healthy life expectancy in {highestHale.entity}, highest in this panel
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
        eyebrow="World · WHO Global Health Observatory via OWID"
        title="Healthy years rose, then the pandemic cut into them"
        description="Healthy life expectancy increased through 2019 before falling in 2020 and 2021. The line is a population estimate, not a count of diagnoses."
        spec={haleWorldSpec}
        data={healthyLifeExpectancyWorldSeries.map((point) => ({
          year: point.year,
          value: point.value,
        }))}
        columns={[
          { key: 'year', label: 'Year' },
          { key: 'value', label: 'Healthy life expectancy (years)' },
        ]}
        sources={haleSource}
        tone="future"
        definition="Estimated average years lived in full health at birth after adjusting for disease and injury burden."
      />

      <ChartCard
        eyebrow="Six selected countries · shared checkpoints"
        title="The same shock lands on different health baselines"
        description="Country lines use 2000, 2010, 2020, and 2021. They show different levels and changes, not a complete ranking of health systems."
        spec={halePanelSpec}
        data={healthyLifeExpectancyPanelSeries.map((point) => ({
          entity: point.entity,
          year: point.year,
          value: point.value,
        }))}
        columns={[
          { key: 'entity', label: 'Country' },
          { key: 'year', label: 'Year' },
          { key: 'value', label: 'Healthy life expectancy (years)' },
        ]}
        sources={haleSource}
        tone="future"
        definition="Healthy life expectancy at birth for Brazil, Germany, India, Japan, Nigeria, and the United States."
      />

      <ChartCard
        eyebrow="World · WHO Global Health Expenditure Database via World Bank and OWID"
        title="Health spending kept climbing"
        description="The world total combines public and private current health expenditure per person. It is expressed in current international dollars, so it is not an inflation-adjusted real-spending series."
        spec={spendingWorldSpec}
        data={healthSpendingWorldSeries.map((point) => ({
          year: point.year,
          value: point.value,
        }))}
        columns={[
          { key: 'year', label: 'Year' },
          { key: 'value', label: 'Health spending per person (current international $)' },
        ]}
        sources={spendingSource}
        tone="future"
        definition="Public and private current health expenditure per person, adjusted for purchasing power parity."
      />

      <ChartCard
        eyebrow="Six selected countries · shared checkpoints"
        title="Spending levels remain widely separated"
        description="These lines use the same four checkpoints. Current international dollars make cross-country purchasing power more comparable, but they do not make health systems equivalent."
        spec={spendingPanelSpec}
        data={healthSpendingPanelSeries.map((point) => ({
          entity: point.entity,
          year: point.year,
          value: point.value,
        }))}
        columns={[
          { key: 'entity', label: 'Country' },
          { key: 'year', label: 'Year' },
          { key: 'value', label: 'Health spending per person (current international $)' },
        ]}
        sources={spendingSource}
        tone="future"
        definition="Current health expenditure per person for Brazil, Germany, India, Japan, Nigeria, and the United States."
      />

      <section className="method-note method-note--future">
        <p className="eyebrow">Read the evidence carefully</p>
        <h2>More spending is not a guarantee of more healthy years.</h2>
        <p>
          Healthy life expectancy blends mortality and disability estimates. Spending combines
          public and private outlays and is reported in current international dollars. Neither
          measure tells us how fairly care is distributed, which treatments work, or whether one
          caused the other. The charts show capacity and outcomes as separate signals.
        </p>
      </section>

      <section className="sources-section">
        <p className="eyebrow">Sources and definitions</p>
        <h2>Where the health signals come from</h2>
        <SourceList sources={sources} />
      </section>
    </StoryFrame>
  );
}

import type { TopLevelSpec } from 'vega-lite';
import { ChartCard } from '../../components/ChartCard';
import { ComparisonCard } from '../../components/ComparisonCard';
import { SourceList } from '../../components/SourceList';
import { StoryFrame } from '../../components/StoryFrame';
import type { StoryDefinition } from '../../content/stories';
import { getSources } from '../../content/sources';
import {
  medianAgeObservedWorldSeries,
  medianAgePanelSeries,
  medianAgeProjectionWorldSeries,
  migrationPanelSeries,
  migrationWorldSeries,
} from './data';

interface DemographicsMigrationStoryProps {
  story: StoryDefinition;
}

const medianWorldSpec: TopLevelSpec = {
  $schema: 'https://vega.github.io/schema/vega-lite/v6.json',
  width: 'container',
  height: 340,
  data: { name: 'series' },
  layer: [
    {
      transform: [{ filter: "datum.phase === 'Observed estimate'" }],
      mark: { type: 'line', color: '#6f5a9e', strokeWidth: 3 },
      encoding: {
        x: {
          field: 'year',
          type: 'quantitative',
          title: 'Year',
          scale: { domain: [1950, 2100] },
          axis: { format: 'd', tickCount: 9 },
        },
        y: {
          field: 'value',
          type: 'quantitative',
          title: 'Median age (years)',
          scale: { domain: [15, 45] },
        },
      },
    },
    {
      transform: [{ filter: "datum.phase === 'UN medium scenario'" }],
      mark: { type: 'line', color: '#9a83c7', strokeWidth: 3, strokeDash: [7, 5] },
      encoding: {
        x: { field: 'year', type: 'quantitative', title: 'Year' },
        y: {
          field: 'value',
          type: 'quantitative',
          title: 'Median age (years)',
          scale: { domain: [15, 45] },
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
          title: 'Median age (years)',
          scale: { domain: [15, 45] },
        },
        tooltip: [
          { field: 'phase', type: 'nominal', title: 'Series' },
          { field: 'year', type: 'quantitative', title: 'Year', format: 'd' },
          { field: 'value', type: 'quantitative', title: 'Median age', format: '.1f' },
        ],
      },
    },
  ],
};

const medianPanelSpec: TopLevelSpec = {
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
      scale: { domain: [1950, 2023] },
      axis: { format: 'd', values: [1950, 1980, 2000, 2023] },
    },
    y: {
      field: 'value',
      type: 'quantitative',
      title: 'Median age (years)',
      scale: { domain: [10, 55] },
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
      { field: 'value', type: 'quantitative', title: 'Median age', format: '.1f' },
    ],
  },
};

const migrationWorldSpec: TopLevelSpec = {
  $schema: 'https://vega.github.io/schema/vega-lite/v6.json',
  width: 'container',
  height: 320,
  data: { name: 'series' },
  layer: [
    {
      mark: { type: 'area', color: '#8e7bb5', opacity: 0.16 },
      encoding: {
        x: {
          field: 'year',
          type: 'quantitative',
          title: 'Year',
          scale: { domain: [1990, 2024] },
          axis: { format: 'd', values: [1990, 2000, 2010, 2020, 2024] },
        },
        y: {
          field: 'value',
          type: 'quantitative',
          title: 'Foreign-born population (%)',
          scale: { domain: [0, 5] },
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
          title: 'Foreign-born population (%)',
          scale: { domain: [0, 5] },
        },
      },
    },
    {
      mark: { type: 'point', filled: true, color: '#d7c7ff', size: 45 },
      encoding: {
        x: { field: 'year', type: 'quantitative', title: 'Year' },
        y: {
          field: 'value',
          type: 'quantitative',
          title: 'Foreign-born population (%)',
          scale: { domain: [0, 5] },
        },
        tooltip: [
          { field: 'year', type: 'quantitative', title: 'Year', format: 'd' },
          { field: 'value', type: 'quantitative', title: 'Foreign-born population', format: '.1f' },
        ],
      },
    },
  ],
};

const migrationPanelSpec: TopLevelSpec = {
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
      scale: { domain: [1990, 2024] },
      axis: { format: 'd', values: [1990, 2000, 2010, 2020, 2024] },
    },
    y: {
      field: 'value',
      type: 'quantitative',
      title: 'Foreign-born population (%)',
      scale: { domain: [0, 22] },
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
      { field: 'value', type: 'quantitative', title: 'Foreign-born population', format: '.1f' },
    ],
  },
};

export function DemographicsMigrationStory({ story }: DemographicsMigrationStoryProps) {
  if (!story.comparison) {
    throw new Error('Demographics & Migration story is missing its comparison definition');
  }

  const firstMedian = medianAgeObservedWorldSeries[0];
  const latestMedian = medianAgeObservedWorldSeries.at(-1);
  const projectedMedian = medianAgeProjectionWorldSeries.at(-1);
  const latestMigration = migrationWorldSeries.at(-1);
  const latestMigrationPanel = migrationPanelSeries.filter((point) => point.year === 2024);
  const highestMigration = latestMigrationPanel.reduce((current, point) =>
    point.value > current.value ? point : current,
  );

  if (!firstMedian || !latestMedian || !projectedMedian || !latestMigration || !highestMigration) {
    throw new Error('Demographics & Migration story data is incomplete');
  }

  const medianSource = getSources(['un-wpp-median-age-owid']);
  const migrationSource = getSources(['un-desa-migrant-stock-owid']);
  const sources = [...medianSource, ...migrationSource];

  return (
    <StoryFrame story={story}>
      <section className="story-lede">
        <p className="lede">
          Population change is not one thing. Age moves over generations; migration can shift the
          composition of a country much faster. These lines show both clocks without turning either
          into a forecast of social outcomes.
        </p>
        <div className="stat-grid">
          <div className="stat-card">
            <span className="stat-card__value">
              {firstMedian.value.toFixed(1)} → {latestMedian.value.toFixed(1)}
            </span>
            <span className="stat-card__label">
              world median age from {firstMedian.year} to {latestMedian.year}
            </span>
          </div>
          <div className="stat-card">
            <span className="stat-card__value">{projectedMedian.value.toFixed(1)}</span>
            <span className="stat-card__label">
              UN medium-scenario world median age in {projectedMedian.year}
            </span>
          </div>
          <div className="stat-card">
            <span className="stat-card__value">{latestMigration.value.toFixed(1)}%</span>
            <span className="stat-card__label">
              world population born abroad in {latestMigration.year}
            </span>
          </div>
          <div className="stat-card">
            <span className="stat-card__value">{highestMigration.value.toFixed(1)}%</span>
            <span className="stat-card__label">
              2024 foreign-born share in {highestMigration.entity}, highest in this panel
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
        eyebrow="World · UN World Population Prospects via OWID"
        title="The world gets older on a long arc"
        description="The solid line is the UN estimate through 2023. The dashed line is the medium scenario from 2024 onward; the change in line style marks a change in evidence."
        spec={medianWorldSpec}
        data={[
          ...medianAgeObservedWorldSeries.map((point) => ({
            phase: 'Observed estimate',
            year: point.year,
            value: point.value,
          })),
          ...medianAgeProjectionWorldSeries.map((point) => ({
            phase: 'UN medium scenario',
            year: point.year,
            value: point.value,
          })),
        ]}
        columns={[
          { key: 'phase', label: 'Series' },
          { key: 'year', label: 'Year' },
          { key: 'value', label: 'Median age (years)' },
        ]}
        sources={medianSource}
        tone="future"
        definition="The age that divides a population into two equal halves; half are younger and half are older."
      />

      <ChartCard
        eyebrow="Six selected countries · observed checkpoints"
        title="Countries reach old age at different speeds"
        description="The same four checkpoints reveal very different demographic starting points and trajectories. They are not a ranking of wellbeing."
        spec={medianPanelSpec}
        data={medianAgePanelSeries.map((point) => ({
          entity: point.entity,
          year: point.year,
          value: point.value,
        }))}
        columns={[
          { key: 'entity', label: 'Country' },
          { key: 'year', label: 'Year' },
          { key: 'value', label: 'Median age (years)' },
        ]}
        sources={medianSource}
        tone="future"
        definition="Observed median age for Brazil, Germany, India, Japan, Nigeria, and the United States at 1950, 1980, 2000, and 2023."
      />

      <ChartCard
        eyebrow="World · UN DESA International Migrant Stock 2024 via OWID"
        title="The global foreign-born share changed more slowly"
        description="The points keep the source’s five-year reporting rhythm. This is the share of residents born abroad, not the number who crossed a border during that year."
        spec={migrationWorldSpec}
        data={migrationWorldSeries.map((point) => ({
          year: point.year,
          value: point.value,
        }))}
        columns={[
          { key: 'year', label: 'Year' },
          { key: 'value', label: 'Foreign-born population (%)' },
        ]}
        sources={migrationSource}
        tone="future"
        definition="Share of the total population born in another country."
      />

      <ChartCard
        eyebrow="Six selected countries · shared checkpoints"
        title="Migration is much more uneven by country"
        description="Germany and the United States sit on a different scale from India, Nigeria, and Brazil in this panel. The lines show composition, not integration or social impact."
        spec={migrationPanelSpec}
        data={migrationPanelSeries.map((point) => ({
          entity: point.entity,
          year: point.year,
          value: point.value,
        }))}
        columns={[
          { key: 'entity', label: 'Country' },
          { key: 'year', label: 'Year' },
          { key: 'value', label: 'Foreign-born population (%)' },
        ]}
        sources={migrationSource}
        tone="future"
        definition="Share of residents born abroad for Brazil, Germany, India, Japan, Nigeria, and the United States at 1990, 2000, 2010, 2020, and 2024."
      />

      <section className="method-note method-note--future">
        <p className="eyebrow">Read the evidence carefully</p>
        <h2>Population structure is not destiny.</h2>
        <p>
          Median age responds to fertility, mortality, and migration across decades. The UN
          projection is one medium scenario, not a promise. Migrant stock describes where people
          were born, not how they arrived, how long they will stay, or how successfully societies
          integrate them. Those questions need different measures.
        </p>
      </section>

      <section className="sources-section">
        <p className="eyebrow">Sources and definitions</p>
        <h2>Where the demographic signals come from</h2>
        <SourceList sources={sources} />
      </section>
    </StoryFrame>
  );
}

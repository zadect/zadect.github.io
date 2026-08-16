import type { TopLevelSpec } from 'vega-lite';
import { ChartCard } from '../../components/ChartCard';
import { ComparisonCard } from '../../components/ComparisonCard';
import { SourceList } from '../../components/SourceList';
import { StoryFrame } from '../../components/StoryFrame';
import type { StoryDefinition } from '../../content/stories';
import { getSources } from '../../content/sources';
import { economicGrowthWorldSeries, publicDebtPanelSeries } from './data';

interface EconomicGrowthDebtStoryProps {
  story: StoryDefinition;
}

const growthSpec: TopLevelSpec = {
  $schema: 'https://vega.github.io/schema/vega-lite/v6.json',
  width: 'container',
  height: 340,
  data: { name: 'series' },
  layer: [
    {
      mark: { type: 'line', color: '#8e7bb5', strokeWidth: 3 },
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
          title: 'Annual real GDP growth (%)',
          scale: { domain: [-5, 8] },
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
          title: 'Annual real GDP growth (%)',
          scale: { domain: [-5, 8] },
        },
        tooltip: [
          { field: 'year', type: 'quantitative', title: 'Year', format: 'd' },
          { field: 'value', type: 'quantitative', title: 'Real GDP growth', format: '.1f' },
        ],
      },
    },
    {
      mark: { type: 'rule', color: '#66558c', strokeDash: [5, 4], strokeWidth: 1.5 },
      encoding: { y: { datum: 0 } },
    },
  ],
};

const debtSpec: TopLevelSpec = {
  $schema: 'https://vega.github.io/schema/vega-lite/v6.json',
  width: 'container',
  height: 360,
  data: { name: 'series' },
  mark: { type: 'line', point: { filled: true, size: 28 }, strokeWidth: 2.5 },
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
      title: 'Gross central-government debt (% of GDP)',
      scale: { domain: [0, 170] },
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
      { field: 'value', type: 'quantitative', title: 'Debt (% of GDP)', format: '.1f' },
    ],
  },
};

export function EconomicGrowthDebtStory({ story }: EconomicGrowthDebtStoryProps) {
  if (!story.comparison) {
    throw new Error('Economic Growth, Debt & Public Finance story is missing its comparison definition');
  }

  const firstGrowth = economicGrowthWorldSeries[0];
  const latestGrowth = economicGrowthWorldSeries.at(-1);
  const pandemicGrowth = economicGrowthWorldSeries.find((point) => point.year === 2020);
  const latestDebt = publicDebtPanelSeries.filter((point) => point.year === 2023);
  const highestDebt = latestDebt.reduce((current, point) =>
    point.value > current.value ? point : current,
  );
  const lowestDebt = latestDebt.reduce((current, point) =>
    point.value < current.value ? point : current,
  );

  if (
    !firstGrowth ||
    !latestGrowth ||
    !pandemicGrowth ||
    !highestDebt ||
    !lowestDebt
  ) {
    throw new Error('Economic Growth, Debt & Public Finance story data is incomplete');
  }

  const growthSource = getSources(['world-bank-annual-gdp-growth']);
  const debtSource = getSources(['world-bank-public-debt']);
  const sources = [...growthSource, ...debtSource];

  return (
    <StoryFrame story={story}>
      <section className="story-lede">
        <p className="lede">
          A growing economy can create room to act. Debt can narrow it. These are not two sides of
          one equation here, but two public signals that often sit in the same policy conversation.
        </p>
        <div className="stat-grid">
          <div className="stat-card">
            <span className="stat-card__value">{pandemicGrowth.value.toFixed(1)}%</span>
            <span className="stat-card__label">world real GDP growth in {pandemicGrowth.year}</span>
          </div>
          <div className="stat-card">
            <span className="stat-card__value">{latestGrowth.value.toFixed(1)}%</span>
            <span className="stat-card__label">
              world real GDP growth in {latestGrowth.year}, after the rebound
            </span>
          </div>
          <div className="stat-card">
            <span className="stat-card__value">{highestDebt.value.toFixed(1)}%</span>
            <span className="stat-card__label">
              2023 central-government debt in {highestDebt.entity}, highest in this panel
            </span>
          </div>
          <div className="stat-card">
            <span className="stat-card__value">{lowestDebt.value.toFixed(1)}%</span>
            <span className="stat-card__label">
              2023 central-government debt in {lowestDebt.entity}, lowest in this panel
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
        eyebrow="World · World Bank and OECD national accounts"
        title="Growth has a rhythm of shocks and rebounds"
        description="The line shows annual inflation-adjusted GDP growth. The dashed rule marks zero growth; it does not mark a healthy or unhealthy level."
        spec={growthSpec}
        data={economicGrowthWorldSeries.map((point) => ({
          year: point.year,
          value: point.value,
        }))}
        columns={[
          { key: 'year', label: 'Year' },
          { key: 'value', label: 'Annual real GDP growth (%)' },
        ]}
        sources={growthSource}
        tone="future"
        definition="Annual percentage change in inflation-adjusted world GDP."
      />

      <ChartCard
        eyebrow="Six selected countries · World Bank debt database"
        title="Debt paths separate after the same shocks"
        description="These lines show gross central-government debt as a share of GDP. They are fiscal signals, not a complete balance sheet or a ranking of sustainability."
        spec={debtSpec}
        data={publicDebtPanelSeries.map((point) => ({
          entity: point.entity,
          year: point.year,
          value: point.value,
        }))}
        columns={[
          { key: 'entity', label: 'Country' },
          { key: 'year', label: 'Year' },
          { key: 'value', label: 'Gross central-government debt (% of GDP)' },
        ]}
        sources={debtSource}
        tone="future"
        definition="Gross central-government debt divided by GDP, shown for Canada, France, Germany, Italy, the United Kingdom, and the United States."
      />

      <section className="method-note method-note--future">
        <p className="eyebrow">Read the evidence carefully</p>
        <h2>Two lines do not make a forecast.</h2>
        <p>
          GDP growth can reflect population, productivity, prices, and statistical revisions.
          Gross debt leaves out assets, interest costs, maturity, currency, and private
          liabilities. The charts place the measures near each other without claiming that one
          caused the other or that a single threshold defines fiscal health.
        </p>
      </section>

      <section className="sources-section">
        <p className="eyebrow">Sources and definitions</p>
        <h2>Where the growth and debt signals come from</h2>
        <SourceList sources={sources} />
      </section>
    </StoryFrame>
  );
}

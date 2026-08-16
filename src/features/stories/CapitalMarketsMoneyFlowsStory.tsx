import type { TopLevelSpec } from 'vega-lite';
import { ChartCard } from '../../components/ChartCard';
import { ComparisonCard } from '../../components/ComparisonCard';
import { SourceList } from '../../components/SourceList';
import { StoryFrame } from '../../components/StoryFrame';
import type { StoryDefinition } from '../../content/stories';
import { getSources } from '../../content/sources';
import {
  capitalMarketsAggregateSeries,
  capitalMarketsPanelSeries,
} from './data';

interface CapitalMarketsMoneyFlowsStoryProps {
  story: StoryDefinition;
}

const aggregateSpec: TopLevelSpec = {
  $schema: 'https://vega.github.io/schema/vega-lite/v6.json',
  width: 'container',
  height: 350,
  data: { name: 'series' },
  layer: [
    {
      mark: { type: 'area', color: '#8e7bb5', opacity: 0.18 },
      encoding: {
        x: {
          field: 'year',
          type: 'quantitative',
          title: 'Year',
          scale: { domain: [1999, 2025] },
          axis: { format: 'd', values: [1999, 2005, 2010, 2015, 2020, 2025] },
        },
        y: {
          field: 'value',
          type: 'quantitative',
          title: 'Credit-to-GDP ratio (%)',
          scale: { domain: [110, 190] },
        },
        y2: { datum: 110 },
      },
    },
    {
      mark: { type: 'line', color: '#6f5a9e', strokeWidth: 3 },
      encoding: {
        x: { field: 'year', type: 'quantitative', title: 'Year' },
        y: {
          field: 'value',
          type: 'quantitative',
          title: 'Credit-to-GDP ratio (%)',
          scale: { domain: [110, 190] },
        },
      },
    },
    {
      mark: { type: 'point', filled: true, color: '#d7c7ff', size: 42 },
      encoding: {
        x: { field: 'year', type: 'quantitative', title: 'Year' },
        y: {
          field: 'value',
          type: 'quantitative',
          title: 'Credit-to-GDP ratio (%)',
          scale: { domain: [110, 190] },
        },
        tooltip: [
          { field: 'year', type: 'quantitative', title: 'Year', format: 'd' },
          { field: 'value', type: 'quantitative', title: 'Credit-to-GDP ratio', format: '.1f' },
        ],
      },
    },
  ],
};

const panelSpec: TopLevelSpec = {
  $schema: 'https://vega.github.io/schema/vega-lite/v6.json',
  width: 'container',
  height: 390,
  data: { name: 'series' },
  mark: { type: 'line', point: { filled: true, size: 30 }, strokeWidth: 2.3 },
  encoding: {
    x: {
      field: 'year',
      type: 'quantitative',
      title: 'Year',
      scale: { domain: [2000, 2025] },
      axis: { format: 'd', values: [2000, 2005, 2010, 2015, 2020, 2025] },
    },
    y: {
      field: 'value',
      type: 'quantitative',
      title: 'Credit-to-GDP ratio (%)',
      scale: { domain: [0, 260] },
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
      { field: 'value', type: 'quantitative', title: 'Credit-to-GDP ratio', format: '.1f' },
    ],
  },
};

export function CapitalMarketsMoneyFlowsStory({
  story,
}: CapitalMarketsMoneyFlowsStoryProps) {
  if (!story.comparison) {
    throw new Error('Capital Markets & Money Flows story is missing its comparison definition');
  }

  const firstAggregate = capitalMarketsAggregateSeries[0];
  const latestAggregate = capitalMarketsAggregateSeries.at(-1);
  const peakAggregate = capitalMarketsAggregateSeries.reduce((current, point) =>
    point.value > current.value ? point : current,
  );
  const latestPanel = capitalMarketsPanelSeries.filter((point) => point.year === 2025);
  const highestPanel = latestPanel.reduce((current, point) =>
    point.value > current.value ? point : current,
  );
  const lowestPanel = latestPanel.reduce((current, point) =>
    point.value < current.value ? point : current,
  );

  if (
    !firstAggregate ||
    !latestAggregate ||
    !peakAggregate ||
    !highestPanel ||
    !lowestPanel
  ) {
    throw new Error('Capital Markets & Money Flows story data is incomplete');
  }

  const source = getSources(['bis-private-credit-gdp']);

  return (
    <StoryFrame story={story}>
      <section className="story-lede">
        <p className="lede">
          Credit can make the future easier to finance—or make the next shock harder to absorb.
          The BIS ratio shows the size of that bridge relative to the economy it serves.
        </p>
        <div className="stat-grid">
          <div className="stat-card">
            <span className="stat-card__value">
              {firstAggregate.value.toFixed(1)}% → {latestAggregate.value.toFixed(1)}%
            </span>
            <span className="stat-card__label">
              all-reporting-economies credit-to-GDP ratio from 1999 to 2025
            </span>
          </div>
          <div className="stat-card">
            <span className="stat-card__value">
              {peakAggregate.value.toFixed(1)}% · {peakAggregate.year}
            </span>
            <span className="stat-card__label">
              highest aggregate ratio in the observed series
            </span>
          </div>
          <div className="stat-card">
            <span className="stat-card__value">{highestPanel.value.toFixed(1)}%</span>
            <span className="stat-card__label">
              2025 ratio in {highestPanel.entity}, highest in this panel
            </span>
          </div>
          <div className="stat-card">
            <span className="stat-card__value">{lowestPanel.value.toFixed(1)}%</span>
            <span className="stat-card__label">
              2025 ratio in {lowestPanel.entity}, lowest in this panel
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
        eyebrow="BIS aggregate · fourth-quarter observations · 1999–2025"
        title="Credit rose, then pulled back"
        description="Across all reporting economies, private-sector credit reached a 2020 peak before falling back. The aggregate is a coverage group, not a world estimate."
        spec={aggregateSpec}
        data={capitalMarketsAggregateSeries.map((point) => ({
          year: point.year,
          value: point.value,
        }))}
        columns={[
          { key: 'year', label: 'Year' },
          { key: 'value', label: 'Credit-to-GDP ratio (%)' },
        ]}
        sources={source}
        tone="future"
        definition="Credit stock from all lender sectors to the private non-financial sector, divided by GDP."
      />

      <ChartCard
        eyebrow="Eight selected countries · fourth-quarter observations · 2000–2025"
        title="Countries do not share one credit cycle"
        description="The same measure produces very different levels and turning points. The lines show a signal about financial scale, not a league table of economic health."
        spec={panelSpec}
        data={capitalMarketsPanelSeries.map((point) => ({
          entity: point.entity,
          year: point.year,
          value: point.value,
        }))}
        columns={[
          { key: 'entity', label: 'Country' },
          { key: 'year', label: 'Year' },
          { key: 'value', label: 'Credit-to-GDP ratio (%)' },
        ]}
        sources={source}
        tone="future"
        definition="Break-adjusted BIS credit-to-GDP ratio for Brazil, China, France, Germany, India, Japan, the United Kingdom, and the United States."
      />

      <section className="method-note method-note--future">
        <p className="eyebrow">Read the evidence carefully</p>
        <h2>A large credit bridge is not a verdict.</h2>
        <p>
          Credit supports households and businesses, but the same ratio can reflect different
          institutions, asset prices, borrower mixes, and policy environments. These charts show
          the stock of credit at one point each year; they do not measure annual new lending,
          repayment capacity, interest costs, wealth concentration, or the probability of a
          crisis.
        </p>
      </section>

      <section className="sources-section">
        <p className="eyebrow">Sources and definitions</p>
        <h2>Where the credit signal comes from</h2>
        <SourceList sources={source} />
      </section>
    </StoryFrame>
  );
}

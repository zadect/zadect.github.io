import type { TopLevelSpec } from 'vega-lite';
import { ChartCard } from '../../components/ChartCard';
import { SourceList } from '../../components/SourceList';
import { StoryFrame } from '../../components/StoryFrame';
import type { StoryDefinition } from '../../content/stories';
import { getSources } from '../../content/sources';
import {
  ceoCompensationSeries,
  ceoPaySeries,
  earliest,
  latest,
  toChartSeries,
  toCompensationChartSeries,
  toWorkerCompensationChartSeries,
} from './data';

interface CeoPayStoryProps {
  story: StoryDefinition;
}

const ceoPaySpec: TopLevelSpec = {
  $schema: 'https://vega.github.io/schema/vega-lite/v6.json',
  width: 'container',
  height: 340,
  data: { name: 'series' },
  mark: { type: 'line', point: { filled: true, size: 30 }, strokeWidth: 3 },
  encoding: {
    x: {
      field: 'year',
      type: 'quantitative',
      title: 'Year',
      axis: { format: 'd', tickCount: 8 },
    },
    y: {
      field: 'ratio',
      type: 'quantitative',
      title: 'Times the compensation of a typical worker',
      scale: { zero: false },
    },
    color: {
      field: 'measure',
      type: 'nominal',
      title: 'Compensation measure',
      scale: { range: ['#ff9a7f', '#f0c56f'] },
    },
    tooltip: [
      { field: 'year', type: 'quantitative', title: 'Year', format: 'd' },
      { field: 'measure', type: 'nominal', title: 'Measure' },
      { field: 'ratio', type: 'quantitative', title: 'Ratio', format: '.1f' },
    ],
  },
};

const ceoCompensationSpec: TopLevelSpec = {
  $schema: 'https://vega.github.io/schema/vega-lite/v6.json',
  width: 'container',
  height: 320,
  data: { name: 'series' },
  mark: { type: 'line', point: { filled: true, size: 30 }, strokeWidth: 3 },
  encoding: {
    x: {
      field: 'year',
      type: 'quantitative',
      title: 'Year',
      axis: { format: 'd', tickCount: 7 },
    },
    y: {
      field: 'amount',
      type: 'quantitative',
      title: 'Thousands of 2024 dollars',
      scale: { zero: false },
    },
    color: {
      field: 'measure',
      type: 'nominal',
      title: 'Measure',
      scale: { range: ['#ff9a7f', '#f0c56f'] },
    },
    tooltip: [
      { field: 'year', type: 'quantitative', title: 'Year', format: 'd' },
      { field: 'measure', type: 'nominal', title: 'Measure' },
      { field: 'amount', type: 'quantitative', title: '2024 dollars ($ thousands)', format: ',.0f' },
      { field: 'status', type: 'nominal', title: 'Data status' },
    ],
  },
};

const workerCompensationSpec: TopLevelSpec = {
  $schema: 'https://vega.github.io/schema/vega-lite/v6.json',
  width: 'container',
  height: 320,
  data: { name: 'series' },
  mark: { type: 'line', point: { filled: true, size: 30 }, strokeWidth: 3 },
  encoding: {
    x: {
      field: 'year',
      type: 'quantitative',
      title: 'Year',
      axis: { format: 'd', tickCount: 7 },
    },
    y: {
      field: 'amount',
      type: 'quantitative',
      title: 'Thousands of 2024 dollars',
      scale: { zero: false },
    },
    color: { value: '#f0c56f' },
    tooltip: [
      { field: 'year', type: 'quantitative', title: 'Year', format: 'd' },
      { field: 'amount', type: 'quantitative', title: '2024 dollars ($ thousands)', format: ',.0f' },
      { field: 'status', type: 'nominal', title: 'Data status' },
    ],
  },
};

function formatMillions(thousands: number) {
  return `$${(thousands / 1000).toFixed(1)}m`;
}

export function CeoPayStory({ story }: CeoPayStoryProps) {
  const first = earliest(ceoPaySeries);
  const last = latest(ceoPaySeries);
  const latestAbsolute = ceoCompensationSeries.at(-1);
  const alignedAbsolute = ceoCompensationSeries.filter(
    (point) => point.workersIndustries !== undefined,
  );
  const storySources = getSources(['epi-ceo-pay']);
  const compensationSources = getSources(['epi-ceo-compensation']);
  const internationalSources = getSources([
    'uk-ceo-pay-context',
    'germany-ceo-pay-research',
    'france-ceo-pay-research',
  ]);
  const allSources = [...storySources, ...compensationSources, ...internationalSources];
  const chartSeries = toChartSeries(ceoPaySeries);
  const compensationChartSeries = toCompensationChartSeries(alignedAbsolute);
  const workerChartSeries = toWorkerCompensationChartSeries(alignedAbsolute);

  return (
    <StoryFrame story={story}>
      <section className="story-lede">
        <p className="lede">
          EPI’s comparison is an average-to-average ratio: compensation for CEOs at the largest US
          public companies against compensation for production and nonsupervisory workers. The
          ratio is far higher now than it was in the 1960s, with large swings when stock prices
          move.
        </p>
        <div className="stat-grid">
          <div className="stat-card stat-card--dark">
            <span className="stat-card__value">{Math.round(last.realized)}×</span>
            <span className="stat-card__label">
              realized CEO-to-worker ratio in {last.year}, versus {Math.round(first.realized)}× in{' '}
              {first.year}
            </span>
          </div>
          <div className="stat-card stat-card--dark">
            <span className="stat-card__value">
              {latestAbsolute ? formatMillions(latestAbsolute.realized) : '—'}
            </span>
            <span className="stat-card__label">
              realized CEO compensation in {latestAbsolute?.year ?? 'the latest table year'}; EPI
              marks that year as projected
            </span>
          </div>
        </div>
      </section>

      <section className="definition-card definition-card--dark" aria-labelledby="ceo-definition-title">
        <p className="eyebrow">What this compares</p>
        <h2 id="ceo-definition-title">A defined contrast, not a company-level pay ratio.</h2>
        <dl className="definition-grid">
          <div>
            <dt>Numerator</dt>
            <dd>
              Average annual compensation for CEOs of the largest US public companies ranked by
              sales in EPI’s sample.
            </dd>
          </div>
          <div>
            <dt>Denominator</dt>
            <dd>
              Average wages plus benefits for private-sector production and nonsupervisory workers
              on a full-time, full-year basis.
            </dd>
          </div>
          <div>
            <dt>Realized and granted</dt>
            <dd>
              Realized pay counts exercised options and vested awards. Granted pay values stock
              awards and options when they are granted.
            </dd>
          </div>
          <div>
            <dt>Limit</dt>
            <dd>
              The ratio compares two averages from different populations. It is not the pay ratio
              between a particular CEO and that company’s median employee.
            </dd>
          </div>
        </dl>
      </section>

      <ChartCard
        eyebrow="US ratio · EPI"
        title="The ratio is far above its 1960s level"
        description="Realized and granted compensation move differently because stock-based pay is counted at different points in time."
        spec={ceoPaySpec}
        data={chartSeries.map((point) => ({
          year: point.year,
          measure: point.measure,
          ratio: Number(point.ratio.toFixed(1)),
        }))}
        columns={[
          { key: 'year', label: 'Year' },
          { key: 'measure', label: 'Measure' },
          { key: 'ratio', label: 'Ratio (times)' },
        ]}
        sources={storySources}
        tone="bad"
        definition="Average annual CEO compensation divided by average annual compensation for private-sector production and nonsupervisory workers."
      />

      <section className="method-note method-note--dark">
        <p className="eyebrow">How to read it</p>
        <h2>Ratios show distance. The next charts show dollars.</h2>
        <p>
          A ratio can grow because the numerator rises, the denominator stalls, or both. The
          absolute views below keep those two series separate and use the same inflation-adjusted
          dollar basis as EPI’s published table.
        </p>
      </section>

      <div className="chart-stack">
        <ChartCard
          eyebrow="US absolute compensation · EPI"
          title="CEO compensation, measured in dollars"
          description="Annual realized and granted compensation for CEOs in EPI’s sample, in thousands of 2024 dollars. The aligned annual view begins in 1992; earlier CEO values in the source are selected years only."
          spec={ceoCompensationSpec}
          data={compensationChartSeries.map((point) => ({
            year: point.year,
            measure: point.measure,
            amount: point.amount,
            status: point.status,
          }))}
          columns={[
            { key: 'year', label: 'Year' },
            { key: 'measure', label: 'Measure' },
            { key: 'amount', label: '2024 dollars ($ thousands)' },
            { key: 'status', label: 'Status' },
          ]}
          sources={compensationSources}
          tone="bad"
          definition="Average annual CEO compensation for the largest 350 US firms ranked by sales; 2024 is projected by EPI."
        />
        <ChartCard
          eyebrow="US absolute compensation · EPI"
          title="Worker compensation in the same industries"
          description="Average annual compensation for production and nonsupervisory workers in the industries represented by the CEO sample. This is not a median employee wage."
          spec={workerCompensationSpec}
          data={workerChartSeries.map((point) => ({
            year: point.year,
            amount: point.amount,
            status: point.status,
          }))}
          columns={[
            { key: 'year', label: 'Year' },
            { key: 'amount', label: '2024 dollars ($ thousands)' },
            { key: 'status', label: 'Status' },
          ]}
          sources={compensationSources}
          tone="bad"
          definition="Average annual compensation for production and nonsupervisory workers in the firms’ industries, in thousands of 2024 dollars."
        />
      </div>

      <section className="international-context" aria-labelledby="international-title">
        <p className="eyebrow">International context</p>
        <h2 id="international-title">Country figures need matching definitions first.</h2>
        <p>
          The US series stays on its own. UK disclosures, German studies, and French research use
          different company populations, worker groups, and compensation rules, so they are
          documented here without putting them on a shared ranking.
        </p>
        <div className="research-grid">
          <article className="research-card">
            <h3>United Kingdom</h3>
            <p>
              UK rules cover qualifying quoted companies with more than 250 UK employees and
              compare the CEO’s single-figure remuneration with employee pay at the 25th, 50th,
              and 75th percentiles. A reproducible numeric export was not available for this
              release.
            </p>
          </article>
          <article className="research-card">
            <h3>Germany</h3>
            <p>
              DSW research is a useful starting point, but the available material does not yet
              provide an open series with definitions aligned to EPI’s US measure.
            </p>
          </article>
          <article className="research-card">
            <h3>France</h3>
            <p>
              Proxinvest publishes relevant executive-pay research, but no open, versionable
              series compatible with the US comparison was retained here.
            </p>
          </article>
        </div>
      </section>

      <section className="sources-section">
        <p className="eyebrow">Sources and definitions</p>
        <h2>Where the numbers come from</h2>
        <SourceList sources={allSources} />
      </section>
    </StoryFrame>
  );
}

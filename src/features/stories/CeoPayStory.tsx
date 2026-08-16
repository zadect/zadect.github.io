import type { TopLevelSpec } from 'vega-lite';
import { ChartCard } from '../../components/ChartCard';
import { SourceList } from '../../components/SourceList';
import { StoryFrame } from '../../components/StoryFrame';
import type { StoryDefinition } from '../../content/stories';
import { getSources } from '../../content/sources';
import { ceoPaySeries, earliest, latest, toChartSeries } from './data';

interface CeoPayStoryProps {
  story: StoryDefinition;
}

const ceoPaySpec: TopLevelSpec = {
  $schema: 'https://vega.github.io/schema/vega-lite/v6.json',
  width: 'container',
  height: 340,
  data: { name: 'series' },
  mark: { type: 'line', point: { filled: true, size: 28 }, strokeWidth: 3 },
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
      title: 'CEO compensation / typical worker compensation',
      scale: { zero: false },
    },
    color: {
      field: 'measure',
      type: 'nominal',
      title: 'Compensation measure',
      scale: { range: ['#c66c53', '#8f4037'] },
    },
    tooltip: [
      { field: 'year', type: 'quantitative', title: 'Year', format: 'd' },
      { field: 'measure', type: 'nominal', title: 'Measure' },
      { field: 'ratio', type: 'quantitative', title: 'Ratio', format: '.0f' },
    ],
  },
  config: {
    axis: { labelColor: '#d8d3cc', titleColor: '#f0ebe4', gridColor: '#494b4a' },
    legend: { labelColor: '#e5ded6', titleColor: '#f0ebe4' },
    view: { stroke: 'transparent' },
  },
};

export function CeoPayStory({ story }: CeoPayStoryProps) {
  const first = earliest(ceoPaySeries);
  const last = latest(ceoPaySeries);
  const storySources = getSources(['epi-ceo-pay']);
  const realizedGrowth = ((last.realized / first.realized - 1) * 100).toFixed(0);
  const grantedGrowth = ((last.granted / first.granted - 1) * 100).toFixed(0);
  const chartSeries = toChartSeries(ceoPaySeries);

  return (
    <StoryFrame story={story}>
      <section className="story-lede">
        <p className="lede">
          The distance between the chief executive and the typical worker is not a metaphor here.
          It is a ratio, measured year by year. The gap widens dramatically after the late 1970s,
          even though the two compensation measures tell slightly different stories.
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
            <span className="stat-card__value">+{realizedGrowth}%</span>
            <span className="stat-card__label">
              growth in the realized ratio since {first.year}; the granted ratio rose {grantedGrowth}%
            </span>
          </div>
        </div>
      </section>

      <ChartCard
        eyebrow="US compensation · EPI"
        title="The pay gap became a chasm"
        description="EPI reports both realized compensation, including exercised stock options, and granted compensation, based on stock awards when granted."
        spec={ceoPaySpec}
        data={chartSeries.map((point) => ({
          year: point.year,
          measure: point.measure,
          ratio: Number(point.ratio.toFixed(1)),
        }))}
        columns={[
          { key: 'year', label: 'Year' },
          { key: 'measure', label: 'Measure' },
          { key: 'ratio', label: 'Ratio' },
        ]}
        sources={storySources}
      />

      <section className="method-note method-note--dark">
        <p className="eyebrow">Read the evidence carefully</p>
        <h2>A ratio is not a salary.</h2>
        <p>
          This chart shows how many times larger CEO compensation was than compensation for a
          typical private-sector production or nonsupervisory worker. It does not say that every
          worker or every CEO earns the same amount, and it does not adjust away the difference
          between realized and granted stock compensation.
        </p>
      </section>

      <section className="sources-section">
        <p className="eyebrow">Sources and definitions</p>
        <h2>Where the numbers come from</h2>
        <SourceList sources={storySources} />
      </section>
    </StoryFrame>
  );
}

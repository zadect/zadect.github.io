import type { TopLevelSpec } from 'vega-lite';
import { ChartCard } from '../../components/ChartCard';
import { ComparisonCard } from '../../components/ComparisonCard';
import { SourceList } from '../../components/SourceList';
import { StoryFrame } from '../../components/StoryFrame';
import type { StoryDefinition } from '../../content/stories';
import { getSources } from '../../content/sources';
import { climateAnnualSeries, climateDecadeSeries } from './data';

interface ClimateChangeStoryProps {
  story: StoryDefinition;
}

const annualSpec: TopLevelSpec = {
  $schema: 'https://vega.github.io/schema/vega-lite/v6.json',
  width: 'container',
  height: 340,
  data: { name: 'series' },
  layer: [
    {
      mark: { type: 'line', color: '#e59a83', strokeWidth: 2.5 },
      encoding: {
        x: {
          field: 'year',
          type: 'quantitative',
          title: 'Year',
          axis: { format: 'd', tickCount: 10 },
        },
        y: {
          field: 'anomaly',
          type: 'quantitative',
          title: 'Temperature anomaly (°C)',
          scale: { domain: [-0.6, 1.5] },
        },
      },
    },
    {
      mark: { type: 'point', filled: true, size: 22, color: '#f2b19b' },
      encoding: {
        x: { field: 'year', type: 'quantitative', title: 'Year' },
        y: { field: 'anomaly', type: 'quantitative', title: 'Temperature anomaly (°C)' },
        tooltip: [
          { field: 'year', type: 'quantitative', title: 'Year', format: 'd' },
          { field: 'anomaly', type: 'quantitative', title: 'Anomaly (°C)', format: '.2f' },
        ],
      },
    },
  ],
};

const decadeSpec: TopLevelSpec = {
  $schema: 'https://vega.github.io/schema/vega-lite/v6.json',
  width: 'container',
  height: 340,
  data: { name: 'series' },
  layer: [
    {
      mark: { type: 'line', color: '#e59a83', strokeWidth: 3 },
      encoding: {
        x: {
          field: 'year',
          type: 'quantitative',
          title: 'Decade starting year',
          axis: { format: 'd', tickCount: 8 },
        },
        y: {
          field: 'anomaly',
          type: 'quantitative',
          title: 'Average anomaly (°C)',
          scale: { domain: [-0.4, 1.2] },
        },
      },
    },
    {
      mark: { type: 'point', filled: true, size: 56, color: '#f2b19b' },
      encoding: {
        x: { field: 'year', type: 'quantitative', title: 'Decade starting year' },
        y: { field: 'anomaly', type: 'quantitative', title: 'Average anomaly (°C)' },
        shape: {
          field: 'status',
          type: 'nominal',
          title: 'Period',
          scale: { domain: ['complete', 'partial'], range: ['circle', 'diamond'] },
        },
        tooltip: [
          { field: 'year', type: 'quantitative', title: 'Period starts', format: 'd' },
          { field: 'anomaly', type: 'quantitative', title: 'Average anomaly (°C)', format: '.3f' },
          { field: 'yearsInPeriod', type: 'quantitative', title: 'Years included', format: 'd' },
          { field: 'status', type: 'nominal', title: 'Period' },
        ],
      },
    },
  ],
};

export function ClimateChangeStory({ story }: ClimateChangeStoryProps) {
  if (!story.comparison) {
    throw new Error('Climate change story is missing its comparison definition');
  }

  const first = climateAnnualSeries[0];
  const last = climateAnnualSeries.at(-1);
  const warmest = climateAnnualSeries.reduce((current, point) =>
    point.anomaly > current.anomaly ? point : current,
  );
  const firstDecade = climateDecadeSeries[0];
  const recentDecade = climateDecadeSeries.at(-1);

  if (!first || !last || !warmest || !firstDecade || !recentDecade) {
    throw new Error('Climate change story data is incomplete');
  }

  const sources = getSources(['nasa-gistemp']);

  return (
    <StoryFrame story={story}>
      <section className="story-lede">
        <p className="lede">
          The climate signal is not hidden in a single hot year. It is the sustained shift in the
          baseline: recent years sit well above the range that shaped the first half of the
          record.
        </p>
        <div className="stat-grid">
          <div className="stat-card">
            <span className="stat-card__value">
              {first.anomaly.toFixed(2)}°C → {last.anomaly.toFixed(2)}°C
            </span>
            <span className="stat-card__label">
              NASA global land-ocean anomaly from {first.year} to {last.year}
            </span>
          </div>
          <div className="stat-card">
            <span className="stat-card__value">
              {warmest.anomaly.toFixed(2)}°C
            </span>
            <span className="stat-card__label">
              warmest full year in this extract: {warmest.year}
            </span>
          </div>
          <div className="stat-card">
            <span className="stat-card__value">
              +{(recentDecade.anomaly - firstDecade.anomaly).toFixed(2)}°C
            </span>
            <span className="stat-card__label">
              change from the 1880s average to the {recentDecade.year}s partial average
            </span>
          </div>
        </div>
      </section>

      <ComparisonCard title={story.comparison.title} fields={story.comparison.fields} />

      <ChartCard
        eyebrow="World · NASA GISTEMP v4"
        title="The annual signal keeps moving upward"
        description="Each point is NASA’s full-year global land-ocean temperature anomaly. The 2026 row is omitted because the current-year record is incomplete."
        spec={annualSpec}
        data={climateAnnualSeries.map((point) => ({
          year: point.year,
          anomaly: point.anomaly,
        }))}
        columns={[
          { key: 'year', label: 'Year' },
          { key: 'anomaly', label: 'Temperature anomaly (°C)' },
        ]}
        sources={sources}
        tone="bad"
        definition="Difference between the year’s global land-ocean surface temperature and the NASA 1951–1980 baseline mean."
      />

      <ChartCard
        eyebrow="Ten-year averages · derived from NASA annual values"
        title="The warming is a shift in the baseline"
        description="Averages make the direction easier to see. The 2020s point uses six complete years, 2020–2025, so it is marked as partial."
        spec={decadeSpec}
        data={climateDecadeSeries.map((point) => ({
          year: point.year,
          anomaly: point.anomaly,
          yearsInPeriod: point.yearsInPeriod,
          status: point.status,
        }))}
        columns={[
          { key: 'year', label: 'Period starting year' },
          { key: 'anomaly', label: 'Average anomaly (°C)' },
          { key: 'yearsInPeriod', label: 'Years included' },
          { key: 'status', label: 'Period' },
        ]}
        sources={sources}
        tone="bad"
        definition="Arithmetic mean of NASA’s annual global anomalies within each decade; no years are extrapolated locally."
      />

      <section className="method-note">
        <p className="eyebrow">Read the evidence carefully</p>
        <h2>A global average is a warning light, not a local forecast.</h2>
        <p>
          A temperature anomaly compares a year with a baseline; it is not the temperature
          outside your window or a prediction of tomorrow. The global mean also hides regional
          differences, seasonal extremes, and changes in the oceans and land surfaces. The chart
          shows the observed signal; it does not model the causes or the impacts.
        </p>
      </section>

      <section className="sources-section">
        <p className="eyebrow">Sources and definitions</p>
        <h2>Where the temperature record comes from</h2>
        <SourceList sources={sources} />
      </section>
    </StoryFrame>
  );
}

import type { TopLevelSpec } from 'vega-lite';
import { ChartCard } from '../../components/ChartCard';
import { ComparisonCard } from '../../components/ComparisonCard';
import { SourceList } from '../../components/SourceList';
import { StoryFrame } from '../../components/StoryFrame';
import type { StoryDefinition } from '../../content/stories';
import { getSources } from '../../content/sources';
import { extremePovertyPanelSeries, extremePovertyWorldSeries } from './data';

interface ExtremePovertyStoryProps {
  story: StoryDefinition;
}

const worldSpec: TopLevelSpec = {
  $schema: 'https://vega.github.io/schema/vega-lite/v6.json',
  width: 'container',
  height: 340,
  data: { name: 'series' },
  layer: [
    {
      mark: { type: 'line', strokeWidth: 3, color: '#2d746a' },
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
          title: 'Population below $3/day (%)',
          scale: { domain: [0, 50] },
        },
      },
    },
    {
      mark: { type: 'point', filled: true, size: 34, color: '#2d746a' },
      encoding: {
        x: { field: 'year', type: 'quantitative', title: 'Year' },
        y: { field: 'value', type: 'quantitative', title: 'Population below $3/day (%)' },
        shape: {
          field: 'status',
          type: 'nominal',
          title: 'Source status',
          scale: {
            domain: ['reported-or-survey-based', 'source-extrapolation'],
            range: ['circle', 'diamond'],
          },
        },
        tooltip: [
          { field: 'year', type: 'quantitative', title: 'Year', format: 'd' },
          { field: 'value', type: 'quantitative', title: 'Below $3/day (%)', format: '.1f' },
          { field: 'status', type: 'nominal', title: 'Source status' },
        ],
      },
    },
  ],
};

const panelSpec: TopLevelSpec = {
  $schema: 'https://vega.github.io/schema/vega-lite/v6.json',
  width: 'container',
  height: 360,
  data: { name: 'series' },
  mark: { type: 'line', point: { filled: true, size: 36 }, strokeWidth: 2.5 },
  encoding: {
    x: {
      field: 'year',
      type: 'quantitative',
      title: 'Survey year',
      axis: { format: 'd', tickCount: 8 },
    },
    y: {
      field: 'value',
      type: 'quantitative',
      title: 'Population below $3/day (%)',
      scale: { domain: [0, 65] },
    },
    color: {
      field: 'country',
      type: 'nominal',
      title: 'Country',
      scale: { scheme: 'tableau20' },
    },
    detail: { field: 'country' },
    tooltip: [
      { field: 'country', type: 'nominal', title: 'Country' },
      { field: 'year', type: 'quantitative', title: 'Survey year', format: 'd' },
      { field: 'value', type: 'quantitative', title: 'Below $3/day (%)', format: '.1f' },
    ],
  },
};

export function ExtremePovertyStory({ story }: ExtremePovertyStoryProps) {
  if (!story.comparison) {
    throw new Error('Extreme poverty story is missing its comparison definition');
  }

  const first = extremePovertyWorldSeries[0];
  const last = extremePovertyWorldSeries.at(-1);
  const latestSurveyBased = extremePovertyWorldSeries
    .filter((point) => point.status === 'reported-or-survey-based')
    .at(-1);
  const nigeria2022 = extremePovertyPanelSeries.find(
    (point) => point.entity === 'Nigeria' && point.year === 2022,
  );
  const germany2022 = extremePovertyPanelSeries.find(
    (point) => point.entity === 'Germany' && point.year === 2022,
  );

  if (!first || !last || !latestSurveyBased || !nigeria2022 || !germany2022) {
    throw new Error('Extreme poverty story data is incomplete');
  }

  const sources = getSources(['world-bank-pip-extreme-poverty']);

  return (
    <StoryFrame story={story}>
      <section className="story-lede">
        <p className="lede">
          Extreme poverty has fallen from a global majority to a minority. That is real progress,
          but the remaining burden is large — and the line does not fall at the same speed
          everywhere.
        </p>
        <div className="stat-grid">
          <div className="stat-card">
            <span className="stat-card__value">
              {first.value.toFixed(1)}% → {last.value.toFixed(1)}%
            </span>
            <span className="stat-card__label">
              world share below $3/day from {first.year} to {last.year}; the final points are
              source extrapolations
            </span>
          </div>
          <div className="stat-card">
            <span className="stat-card__value">{latestSurveyBased.value.toFixed(1)}%</span>
            <span className="stat-card__label">
              latest world point before the source-extrapolated tail ({latestSurveyBased.year})
            </span>
          </div>
          <div className="stat-card">
            <span className="stat-card__value">{nigeria2022.value.toFixed(1)}% vs. {germany2022.value.toFixed(1)}%</span>
            <span className="stat-card__label">
              Nigeria and Germany in the source’s 2022 country observations
            </span>
          </div>
        </div>
      </section>

      <ComparisonCard title={story.comparison.title} fields={story.comparison.fields} />

      <ChartCard
        eyebrow="World · World Bank Poverty and Inequality Platform"
        title="The global poverty line moved downward"
        description="The world series falls sharply, with a pandemic-era interruption. Diamond points mark the source-extrapolated 2023–2026 tail; they are not new household surveys."
        spec={worldSpec}
        data={extremePovertyWorldSeries.map((point) => ({
          year: point.year,
          value: point.value,
          status: point.status,
        }))}
        columns={[
          { key: 'year', label: 'Year' },
          { key: 'value', label: 'Population below $3/day (%)' },
          { key: 'status', label: 'Source status' },
        ]}
        sources={sources}
        definition="Share of people living in a household with income or consumption below $3 per person per day, in 2021 international dollars."
      />

      <ChartCard
        eyebrow="Selected countries · World Bank PIP observations"
        title="The same line leaves very different distances"
        description="Country observations are not annual or synchronized. The connecting lines are visual guides between reported points; no missing years have been filled."
        spec={panelSpec}
        data={extremePovertyPanelSeries.map((point) => ({
          country: point.entity,
          year: point.year,
          value: point.value,
        }))}
        columns={[
          { key: 'country', label: 'Country' },
          { key: 'year', label: 'Survey year' },
          { key: 'value', label: 'Population below $3/day (%)' },
        ]}
        sources={sources}
        definition="Country observations from the consolidated PIP series; years and data density differ by country."
      />

      <section className="method-note">
        <p className="eyebrow">Read the evidence carefully</p>
        <h2>A poverty line is a floor, not a full picture of hardship.</h2>
        <p>
          The $3 line is designed for international comparison, not to describe everything a
          household needs. The platform combines income data in some countries with consumption
          data in others, and survey methods can change over time. Global and regional points at
          the end of the series use extrapolation and forecasts documented by the source.
        </p>
      </section>

      <section className="sources-section">
        <p className="eyebrow">Sources and definitions</p>
        <h2>Where the poverty estimates come from</h2>
        <SourceList sources={sources} />
      </section>
    </StoryFrame>
  );
}

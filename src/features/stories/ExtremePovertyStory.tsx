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
      transform: [{ filter: "datum.status === 'reported-or-survey-based'" }],
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
      transform: [
        {
          filter: "datum.status === 'source-extrapolation' || datum.year === 2022",
        },
      ],
      mark: { type: 'line', strokeWidth: 3, strokeDash: [6, 4], color: '#2d746a' },
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
          The retained $3-a-day series starts at {first.value.toFixed(1)}% in {first.year}, more
          than two in five people. The latest survey-based global point is lower, while the final
          years are source extrapolations rather than new surveys.
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
        title="The global share below $3/day fell, with an extrapolated tail"
        description="The solid line ends with the 2022 reported-or-survey-based point. The dashed segment and diamond points cover the source-extrapolated 2023–2026 tail; they are not new household surveys."
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
        title="Country observations span different ranges"
        description="Country observations are not annual or synchronized. Connecting lines guide the eye between reported points; missing years remain empty."
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
        <p className="eyebrow">Scope and limits</p>
        <h2>The $3 line captures one part of hardship.</h2>
        <p>
          The $3 line is designed for international comparison, not to describe everything a
          household needs. The platform combines income data in some countries with consumption
          data in others, and survey methods can change over time. The source documents the
          extrapolation and forecasts used for the final global and regional points.
        </p>
      </section>

      <section className="sources-section">
        <p className="eyebrow">Sources and definitions</p>
        <h2>Sources and methodology</h2>
        <SourceList sources={sources} />
      </section>
    </StoryFrame>
  );
}

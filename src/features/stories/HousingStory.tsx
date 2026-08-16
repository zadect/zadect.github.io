import type { TopLevelSpec } from 'vega-lite';
import { ChartCard } from '../../components/ChartCard';
import { ComparisonCard } from '../../components/ComparisonCard';
import { SourceList } from '../../components/SourceList';
import { StudyContext } from '../../components/StudyContext';
import { StoryFrame } from '../../components/StoryFrame';
import type { StoryDefinition } from '../../content/stories';
import { getSources } from '../../content/sources';
import { housingBenchmarkSeries, housingPriceIncomeSeries } from './data';

interface HousingStoryProps {
  story: StoryDefinition;
}

const housingTrajectorySpec: TopLevelSpec = {
  $schema: 'https://vega.github.io/schema/vega-lite/v6.json',
  width: 'container',
  height: 370,
  data: { name: 'series' },
  mark: { type: 'line', point: { filled: true, size: 24 }, strokeWidth: 2.4 },
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
      title: 'House-price-to-income index (2015 = 100)',
      scale: { zero: false },
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
      { field: 'year', type: 'quantitative', title: 'Year', format: 'd' },
      {
        field: 'value',
        type: 'quantitative',
        title: 'House-price-to-income index',
        format: '.1f',
      },
    ],
  },
};

const housingBenchmarkSpec: TopLevelSpec = {
  $schema: 'https://vega.github.io/schema/vega-lite/v6.json',
  width: 'container',
  height: 350,
  data: { name: 'series' },
  layer: [
    {
      mark: { type: 'bar', cornerRadiusTopLeft: 4, cornerRadiusTopRight: 4 },
      encoding: {
        x: {
          field: 'country',
          type: 'nominal',
          title: 'Country',
          sort: '-y',
          axis: { labelAngle: -32 },
        },
        y: {
          field: 'value',
          type: 'quantitative',
          title: '2024 as % of own long-term average',
          scale: { domain: [0, 170] },
        },
        color: { value: '#6b5a98' },
        tooltip: [
          { field: 'country', type: 'nominal', title: 'Country' },
          {
            field: 'value',
            type: 'quantitative',
            title: '2024 as % of own long-term average',
            format: '.1f',
          },
        ],
      },
    },
    {
      mark: { type: 'rule', color: '#4e3d78', strokeDash: [5, 4], size: 2 },
      encoding: {
        y: { datum: 100 },
      },
    },
  ],
};

function latestByCountry() {
  return housingPriceIncomeSeries.filter((point) => point.year === 2024);
}

export function HousingStory({ story }: HousingStoryProps) {
  if (!story.comparison) {
    throw new Error('Housing story is missing its comparison definition');
  }

  const latest = latestByCountry();
  const highest = latest.reduce((current, point) => (point.value > current.value ? point : current));
  const lowest = latest.reduce((current, point) => (point.value < current.value ? point : current));
  const storySources = getSources(['oecd-house-price-income']);
  const contextSources = getSources([
    'imf-housing-affordability-context',
    'un-habitat-housing-context',
  ]);
  const allSources = [...storySources, ...contextSources];

  return (
    <StoryFrame story={story}>
      <section className="story-lede">
        <p className="lede">
          When house prices outrun household incomes, pressure builds. This first release tracks
          that national relationship — and keeps the missing pieces visible.
        </p>
        <div className="stat-grid">
          <div className="stat-card">
            <span className="stat-card__value">{highest.value.toFixed(1)}</span>
            <span className="stat-card__label">
              2024 house-price-to-income index in {highest.country}, the highest in this selected
              panel
            </span>
          </div>
          <div className="stat-card">
            <span className="stat-card__value">{lowest.value.toFixed(1)}</span>
            <span className="stat-card__label">
              2024 index in {lowest.country}, the lowest in this selected panel — not an absolute
              affordability ranking
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
        eyebrow="National trajectories · OECD"
        title="Prices and incomes did not move together"
        description="The index is 100 in 2015 for each country. A rising line means nominal house prices increased faster than nominal disposable household income per head relative to that base."
        spec={housingTrajectorySpec}
        data={housingPriceIncomeSeries.map((point) => ({
          country: point.country,
          year: point.year,
          value: point.value,
        }))}
        columns={[
          { key: 'country', label: 'Country' },
          { key: 'year', label: 'Year' },
          { key: 'value', label: 'House-price-to-income index' },
        ]}
        sources={storySources}
        tone="future"
        definition="OECD HPI_YDH: nominal house-price index divided by nominal disposable household income per head, with 2015 = 100."
      />

      <ChartCard
        eyebrow="Within-country benchmark · OECD"
        title="The latest point sits above or below each country’s own norm"
        description="This second view is deliberately within-country. A value of 100 means the 2024 index is at that country’s long-term average; it is not a ranking of absolute affordability across countries."
        spec={housingBenchmarkSpec}
        data={housingBenchmarkSeries.map((point) => ({
          country: point.country,
          year: point.year,
          value: point.value,
        }))}
        columns={[
          { key: 'country', label: 'Country' },
          { key: 'year', label: 'Year' },
          { key: 'value', label: '2024 as % of own long-term average' },
        ]}
        sources={storySources}
        tone="future"
        definition="OECD HPI_YDH_AVG with unit PT_AVG_L_TERM: 2024 relative to each country’s own long-term house-price-to-income average."
      />

      <section className="method-note method-note--future">
        <p className="eyebrow">Read the evidence carefully</p>
        <h2>A national index is a pressure signal, not a full housing diagnosis.</h2>
        <p>
          The OECD measure does not show what renters pay, how mortgages have changed, whether
          homes are adequate, how much is being built, or whether a particular city has become
          inaccessible. Those are the next measures to add when compatible coverage is available.
        </p>
      </section>

      <StudyContext
        items={[
          {
            title: 'Housing Affordability: A New Dataset',
            authorYear: 'Biljanovska, Fu & Igan · IMF WP 2023/247 / BIS WP 1149',
            purpose:
              'Build a broader cross-country affordability measure that includes financing conditions, not only prices and incomes.',
            method:
              'Covers 40 countries from 1970Q1 to 2021Q4 and combines prices, incomes, mortgage rates, loan-to-value limits, and household size.',
            limit:
              'It is a separate research measure and does not enter the OECD lines or the 2024 benchmark above.',
            source: contextSources[0],
          },
          {
            title: 'World Cities Report 2026',
            authorYear: 'UN-Habitat · 2026',
            purpose:
              'Place affordability inside a wider urban picture of informality, displacement, climate risk, services, and liveability.',
            method:
              'Synthesizes global urban evidence and policy pathways rather than constructing the country index shown here.',
            limit:
              'It is an evidence synthesis, not a forecast and not a substitute for city-level or infrastructure data.',
            source: contextSources[1],
          },
        ]}
      />

      <section className="sources-section">
        <p className="eyebrow">Sources and definitions</p>
        <h2>Where the housing evidence and wider research come from</h2>
        <SourceList sources={allSources} />
      </section>
    </StoryFrame>
  );
}

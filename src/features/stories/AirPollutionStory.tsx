import type { TopLevelSpec } from 'vega-lite';
import { ChartCard } from '../../components/ChartCard';
import { ComparisonCard } from '../../components/ComparisonCard';
import { SourceList } from '../../components/SourceList';
import { StoryFrame } from '../../components/StoryFrame';
import type { StoryDefinition } from '../../content/stories';
import { getSources } from '../../content/sources';
import { airPollutionSeries } from './data';

interface AirPollutionStoryProps {
  story: StoryDefinition;
}

const worldSpec: TopLevelSpec = {
  $schema: 'https://vega.github.io/schema/vega-lite/v6.json',
  width: 'container',
  height: 340,
  data: { name: 'series' },
  layer: [
    {
      mark: { type: 'line', color: '#efad95', strokeWidth: 3 },
      encoding: {
        x: {
          field: 'year',
          type: 'quantitative',
          title: 'Year',
          axis: { format: 'd', tickCount: 9 },
        },
        y: {
          field: 'pm25',
          type: 'quantitative',
          title: 'Annual mean PM2.5 (µg/m³)',
          scale: { domain: [0, 45] },
        },
      },
    },
    {
      mark: { type: 'point', filled: true, color: '#ffd0bc', size: 24 },
      encoding: {
        x: { field: 'year', type: 'quantitative', title: 'Year' },
        y: {
          field: 'pm25',
          type: 'quantitative',
          title: 'Annual mean PM2.5 (µg/m³)',
          scale: { domain: [0, 45] },
        },
        tooltip: [
          { field: 'year', type: 'quantitative', title: 'Year', format: 'd' },
          { field: 'pm25', type: 'quantitative', title: 'PM2.5 exposure', format: '.1f' },
        ],
      },
    },
    {
      mark: { type: 'rule', color: '#f2cf8a', strokeDash: [6, 5], strokeWidth: 2 },
      encoding: {
        y: {
          datum: 5,
          type: 'quantitative',
          title: 'Annual mean PM2.5 (µg/m³)',
          scale: { domain: [0, 45] },
        },
      },
    },
  ],
};

const countrySpec: TopLevelSpec = {
  $schema: 'https://vega.github.io/schema/vega-lite/v6.json',
  width: 'container',
  height: 360,
  data: { name: 'series' },
  layer: [
    {
      mark: { type: 'line', strokeWidth: 2.5 },
      encoding: {
        x: {
          field: 'year',
          type: 'quantitative',
          title: 'Year',
          axis: { format: 'd', tickCount: 9 },
        },
        y: {
          field: 'pm25',
          type: 'quantitative',
          title: 'Annual mean PM2.5 (µg/m³)',
          scale: { domain: [0, 80] },
        },
        color: {
          field: 'entity',
          type: 'nominal',
          title: 'Country',
          scale: { scheme: 'tableau20' },
        },
        detail: { field: 'entity' },
      },
    },
    {
      mark: { type: 'point', filled: true, size: 30 },
      encoding: {
        x: { field: 'year', type: 'quantitative', title: 'Year' },
        y: {
          field: 'pm25',
          type: 'quantitative',
          title: 'Annual mean PM2.5 (µg/m³)',
          scale: { domain: [0, 80] },
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
          { field: 'pm25', type: 'quantitative', title: 'PM2.5 exposure', format: '.1f' },
        ],
      },
    },
    {
      mark: { type: 'rule', color: '#f2cf8a', strokeDash: [6, 5], strokeWidth: 2 },
      encoding: {
        y: {
          datum: 5,
          type: 'quantitative',
          title: 'Annual mean PM2.5 (µg/m³)',
          scale: { domain: [0, 80] },
        },
      },
    },
  ],
};

export function AirPollutionStory({ story }: AirPollutionStoryProps) {
  if (!story.comparison) {
    throw new Error('Air pollution story is missing its comparison definition');
  }

  const worldSeries = airPollutionSeries.filter((point) => point.entity === 'World');
  const countrySeries = airPollutionSeries.filter((point) => point.entity !== 'World');
  const first = worldSeries[0];
  const last = worldSeries.at(-1);
  const latestCountries = countrySeries.filter((point) => point.year === 2023);
  const highestLatest = latestCountries.reduce((current, point) =>
    point.pm25 > current.pm25 ? point : current,
  );
  const lowestLatest = latestCountries.reduce((current, point) =>
    point.pm25 < current.pm25 ? point : current,
  );

  if (!first || !last || !highestLatest || !lowestLatest) {
    throw new Error('Air pollution story data is incomplete');
  }

  const sources = getSources(['gbd-pm25-owid', 'who-air-quality-guidelines']);
  const chartSources = getSources(['gbd-pm25-owid']);
  const worldChange = ((last.pm25 - first.pm25) / first.pm25) * 100;
  const guidelineMultiple = last.pm25 / 5;

  return (
    <StoryFrame story={story}>
      <section className="story-lede">
        <p className="lede">
          PM2.5 is small enough to travel deep into the lungs. The measure here is exposure, not
          emissions: it weights the estimate by where people live. The world average has eased
          since 1990, but it remains well above the WHO’s health-protection reference, and the
          country lines do not move together.
        </p>
        <div className="stat-grid">
          <div className="stat-card">
            <span className="stat-card__value">
              {first.pm25.toFixed(1)} → {last.pm25.toFixed(1)}
            </span>
            <span className="stat-card__label">
              world annual mean exposure in µg/m³ from {first.year} to {last.year} (
              {worldChange.toFixed(1)}%)
            </span>
          </div>
          <div className="stat-card">
            <span className="stat-card__value">{guidelineMultiple.toFixed(1)}×</span>
            <span className="stat-card__label">
              the WHO 5 µg/m³ annual guideline reference in the world series in {last.year}
            </span>
          </div>
          <div className="stat-card">
            <span className="stat-card__value">{highestLatest.pm25.toFixed(1)}</span>
            <span className="stat-card__label">
              highest 2023 exposure in this selected panel: {highestLatest.entity}
            </span>
          </div>
        </div>
      </section>

      <ComparisonCard title={story.comparison.title} fields={story.comparison.fields} />

      <ChartCard
        eyebrow="World · GBD 2023 via World Bank and Our World in Data"
        title="The global average remains far above the reference line"
        description="The line is the population-weighted annual mean PM2.5 exposure. The dashed line marks the WHO 2021 annual mean guideline recommendation of 5 µg/m³."
        spec={worldSpec}
        data={worldSeries.map((point) => ({
          year: point.year,
          pm25: point.pm25,
        }))}
        columns={[
          { key: 'year', label: 'Year' },
          { key: 'pm25', label: 'Annual mean PM2.5 (µg/m³)' },
        ]}
        sources={chartSources}
        tone="bad"
        definition="Population-weighted annual mean concentration of outdoor PM2.5 exposure, in micrograms per cubic metre."
      />

      <ChartCard
        eyebrow="Six selected countries · same annual series"
        title="The country lines tell different stories"
        description="Some selected countries move down over the period; others remain much higher. The dashed line is the WHO reference, not a legal threshold."
        spec={countrySpec}
        data={countrySeries.map((point) => ({
          entity: point.entity,
          year: point.year,
          pm25: point.pm25,
        }))}
        columns={[
          { key: 'entity', label: 'Country' },
          { key: 'year', label: 'Year' },
          { key: 'pm25', label: 'Annual mean PM2.5 (µg/m³)' },
        ]}
        sources={chartSources}
        tone="bad"
        definition="The same modeled, population-weighted annual PM2.5 exposure measure for Brazil, China, Germany, India, Nigeria, and the United States."
      />

      <section className="method-note">
        <p className="eyebrow">Read the evidence carefully</p>
        <h2>Exposure is not the same thing as emissions or deaths.</h2>
        <p>
          The series estimates the concentration people are exposed to, using population weighting
          and modeled data. It does not identify which sources caused the particles, measure what
          every monitoring station recorded, or count premature deaths. In this selected panel,
          {` ${lowestLatest.entity}`} has the lowest 2023 estimate at {lowestLatest.pm25.toFixed(1)}{' '}
          µg/m³, but a country average still hides neighborhood-level differences.
        </p>
      </section>

      <section className="sources-section">
        <p className="eyebrow">Sources and definitions</p>
        <h2>Where the air-pollution signal comes from</h2>
        <SourceList sources={sources} />
      </section>
    </StoryFrame>
  );
}

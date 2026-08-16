import type { TopLevelSpec } from 'vega-lite';
import { ChartCard } from '../../components/ChartCard';
import { ComparisonCard } from '../../components/ComparisonCard';
import { SourceList } from '../../components/SourceList';
import { StoryFrame } from '../../components/StoryFrame';
import type { StoryDefinition } from '../../content/stories';
import { getSources } from '../../content/sources';
import { biodiversityRegionSeries, biodiversityWorldSeries } from './data';

interface BiodiversityLossStoryProps {
  story: StoryDefinition;
}

const worldSpec: TopLevelSpec = {
  $schema: 'https://vega.github.io/schema/vega-lite/v6.json',
  width: 'container',
  height: 340,
  data: { name: 'series' },
  layer: [
    {
      mark: { type: 'area', color: '#a66f63', opacity: 0.4 },
      encoding: {
        x: {
          field: 'year',
          type: 'quantitative',
          title: 'Year',
          axis: { format: 'd', tickCount: 9 },
        },
        y: {
          field: 'lower',
          type: 'quantitative',
          title: 'Living Planet Index (1970 = 100)',
          scale: { domain: [0, 110] },
        },
        y2: { field: 'upper' },
        tooltip: [
          { field: 'year', type: 'quantitative', title: 'Year', format: 'd' },
          { field: 'lower', type: 'quantitative', title: 'Lower estimate', format: '.1f' },
          { field: 'upper', type: 'quantitative', title: 'Upper estimate', format: '.1f' },
        ],
      },
    },
    {
      mark: { type: 'line', color: '#efad95', strokeWidth: 3 },
      encoding: {
        x: { field: 'year', type: 'quantitative', title: 'Year' },
        y: {
          field: 'central',
          type: 'quantitative',
          title: 'Living Planet Index (1970 = 100)',
          scale: { domain: [0, 110] },
        },
        tooltip: [
          { field: 'year', type: 'quantitative', title: 'Year', format: 'd' },
          { field: 'central', type: 'quantitative', title: 'Central estimate', format: '.1f' },
        ],
      },
    },
    {
      mark: { type: 'point', filled: true, color: '#ffd0bc', size: 24 },
      encoding: {
        x: { field: 'year', type: 'quantitative', title: 'Year' },
        y: {
          field: 'central',
          type: 'quantitative',
          title: 'Living Planet Index (1970 = 100)',
          scale: { domain: [0, 110] },
        },
      },
    },
  ],
};

const regionSpec: TopLevelSpec = {
  $schema: 'https://vega.github.io/schema/vega-lite/v6.json',
  width: 'container',
  height: 360,
  data: { name: 'series' },
  mark: { type: 'line', point: { filled: true, size: 46 }, strokeWidth: 2.5 },
  encoding: {
    x: {
      field: 'year',
      type: 'quantitative',
      title: 'Checkpoint year',
      axis: { format: 'd', values: [1970, 1980, 1990, 2000, 2010, 2020] },
    },
    y: {
      field: 'central',
      type: 'quantitative',
      title: 'Living Planet Index (1970 = 100)',
      scale: { domain: [0, 140] },
    },
    color: {
      field: 'entity',
      type: 'nominal',
      title: 'Region',
      scale: { scheme: 'tableau20' },
    },
    detail: { field: 'entity' },
    tooltip: [
      { field: 'entity', type: 'nominal', title: 'Region' },
      { field: 'year', type: 'quantitative', title: 'Year', format: 'd' },
      { field: 'central', type: 'quantitative', title: 'Central estimate', format: '.1f' },
    ],
  },
};

export function BiodiversityLossStory({ story }: BiodiversityLossStoryProps) {
  if (!story.comparison) {
    throw new Error('Biodiversity loss story is missing its comparison definition');
  }

  const first = biodiversityWorldSeries[0];
  const last = biodiversityWorldSeries.at(-1);
  const latestRegions = biodiversityRegionSeries.filter((point) => point.year === 2020);
  const lowestLatestRegion = latestRegions.reduce((current, point) =>
    point.central < current.central ? point : current,
  );

  if (!first || !last || latestRegions.length === 0 || !lowestLatestRegion) {
    throw new Error('Biodiversity loss story data is incomplete');
  }

  const lowerLatest = last.lower ?? last.central;
  const upperLatest = last.upper ?? last.central;
  const declinePercent = (1 - last.central / first.central) * 100;
  const sources = getSources(['wwf-zsl-living-planet-index']);

  return (
    <StoryFrame story={story}>
      <section className="story-lede">
        <p className="lede">
          This is not a headcount of every wild animal. It is a signal from monitored vertebrate
          populations: the average index fell sharply after 1970, while the regional lines show
          that the loss has not been evenly distributed.
        </p>
        <div className="stat-grid">
          <div className="stat-card">
            <span className="stat-card__value">
              {first.central.toFixed(1)} → {last.central.toFixed(1)}
            </span>
            <span className="stat-card__label">
              global central estimate from {first.year} to {last.year}, an average decline of{' '}
              {declinePercent.toFixed(1)}%
            </span>
          </div>
          <div className="stat-card">
            <span className="stat-card__value">
              {lowerLatest.toFixed(1)}–{upperLatest.toFixed(1)}
            </span>
            <span className="stat-card__label">
              2020 lower-to-upper estimate around the global central value
            </span>
          </div>
          <div className="stat-card">
            <span className="stat-card__value">
              {lowestLatestRegion.central.toFixed(1)}
            </span>
            <span className="stat-card__label">
              2020 central estimate in {lowestLatestRegion.entity}, the lowest regional line in
              this panel
            </span>
          </div>
        </div>
      </section>

      <ComparisonCard title={story.comparison.title} fields={story.comparison.fields} />

      <ChartCard
        eyebrow="World · WWF / ZSL via Our World in Data"
        title="The monitored-population signal fell sharply"
        description="The index is set to 100 in 1970. The line is the central estimate; the shaded band shows the report’s lower and upper estimates."
        spec={worldSpec}
        data={biodiversityWorldSeries.map((point) => ({
          year: point.year,
          central: point.central,
          lower: point.lower,
          upper: point.upper,
        }))}
        columns={[
          { key: 'year', label: 'Year' },
          { key: 'central', label: 'Central estimate' },
          { key: 'lower', label: 'Lower estimate' },
          { key: 'upper', label: 'Upper estimate' },
        ]}
        sources={sources}
        tone="bad"
        definition="Average change in the abundance of monitored vertebrate populations relative to their 1970 level, indexed to 100."
      />

      <ChartCard
        eyebrow="Five broad regions · six shared checkpoints"
        title="The regional picture is not uniform"
        description="These checkpoints keep the comparison synchronized. They show broad regional patterns, not a ranking of every country or ecosystem."
        spec={regionSpec}
        data={biodiversityRegionSeries.map((point) => ({
          entity: point.entity,
          year: point.year,
          central: point.central,
        }))}
        columns={[
          { key: 'entity', label: 'Region' },
          { key: 'year', label: 'Checkpoint year' },
          { key: 'central', label: 'Central estimate' },
        ]}
        sources={sources}
        tone="bad"
        definition="Regional Living Planet Index central estimate at the shared checkpoint, relative to that region’s 1970 value."
      />

      <section className="method-note">
        <p className="eyebrow">Read the evidence carefully</p>
        <h2>A falling index is a warning about monitored populations, not a census of nature.</h2>
        <p>
          The Living Planet Index aggregates trends from thousands of monitored vertebrate
          populations. It does not say that every population declined by the same amount, and it
          does not directly count extinctions. Monitoring is uneven across places, species, and
          time; the uncertainty band is part of the result. The regional lines use the report’s
          central estimates at shared checkpoints, without local interpolation.
        </p>
      </section>

      <section className="sources-section">
        <p className="eyebrow">Sources and definitions</p>
        <h2>Where the biodiversity signal comes from</h2>
        <SourceList sources={sources} />
      </section>
    </StoryFrame>
  );
}

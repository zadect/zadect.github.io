import type { TopLevelSpec } from 'vega-lite';
import { ChartCard } from '../../components/ChartCard';
import { ComparisonCard } from '../../components/ComparisonCard';
import { MapCard } from '../../components/MapCard';
import { SourceList } from '../../components/SourceList';
import { StoryFrame } from '../../components/StoryFrame';
import type { StoryDefinition } from '../../content/stories';
import { getSources } from '../../content/sources';
import {
  democracyMapGeoJson,
  democracyMapSeries,
  democracySeries,
} from './data';

interface DemocraticBackslidingStoryProps {
  story: StoryDefinition;
}

const democracySpec: TopLevelSpec = {
  $schema: 'https://vega.github.io/schema/vega-lite/v6.json',
  width: 'container',
  height: 360,
  data: { name: 'series' },
  mark: { type: 'line', point: { filled: true, size: 30 }, strokeWidth: 2.5 },
  encoding: {
    x: {
      field: 'year',
      type: 'quantitative',
      title: 'Year',
      axis: { format: 'd', tickCount: 8 },
    },
    y: {
      field: 'index',
      type: 'quantitative',
      title: 'Liberal Democracy Index',
      scale: { domain: [0, 1] },
    },
    color: {
      field: 'country',
      type: 'nominal',
      title: 'Country',
      scale: { scheme: 'tableau20' },
    },
    tooltip: [
      { field: 'country', type: 'nominal', title: 'Country' },
      { field: 'year', type: 'quantitative', title: 'Year', format: 'd' },
      { field: 'index', type: 'quantitative', title: 'Index', format: '.3f' },
    ],
  },
  background: '#313535',
};

const democracyMapSpec: TopLevelSpec = {
  $schema: 'https://vega.github.io/schema/vega-lite/v6.json',
  width: 'container',
  height: 390,
  data: { values: democracyMapGeoJson.features },
  projection: { type: 'equalEarth' },
  mark: { type: 'geoshape', stroke: '#313535', strokeWidth: 0.45 },
  encoding: {
    color: {
      condition: {
        test: 'datum.properties.hasData === true',
        field: 'properties.change',
        type: 'quantitative',
        scale: {
          domain: [-0.4, 0, 0.4],
          range: ['#c66c53', '#f0c56f', '#4d9b87'],
          clamp: true,
        },
        legend: { title: 'Change in index' },
      },
      value: '#4a4f4d',
    },
    tooltip: [
      { field: 'properties.country', type: 'nominal', title: 'Country' },
      { field: 'properties.startValue', type: 'quantitative', title: '2020 index', format: '.3f' },
      { field: 'properties.endValue', type: 'quantitative', title: '2025 index', format: '.3f' },
      { field: 'properties.change', type: 'quantitative', title: 'Change', format: '+.3f' },
    ],
  },
  background: '#313535',
};

function mostExtreme(direction: 'low' | 'high') {
  return democracyMapSeries.reduce((current, point) => {
    if (!current) return point;
    return direction === 'low'
      ? point.change < current.change
        ? point
        : current
      : point.change > current.change
        ? point
        : current;
  }, democracyMapSeries[0]);
}

export function DemocraticBackslidingStory({ story }: DemocraticBackslidingStoryProps) {
  if (!story.comparison) {
    throw new Error('Democratic backsliding story is missing its comparison definition');
  }

  const largestDecline = mostExtreme('low');
  const largestImprovement = mostExtreme('high');
  const storySources = getSources(['vdem-liberal-democracy']);
  const mapSources = getSources([
    'vdem-liberal-democracy',
    'world-atlas-geometry',
    'iso-country-codes',
  ]);
  const allSources = getSources([
    'vdem-liberal-democracy',
    'world-atlas-geometry',
    'iso-country-codes',
  ]);

  return (
    <StoryFrame story={story}>
      <section className="story-lede">
        <p className="lede">
          Democracy did not move in one direction between 2020 and 2025. The map separates
          countries where the Liberal Democracy Index fell from countries where it rose, while the
          line chart keeps several trajectories visible.
        </p>
        <div className="stat-grid">
          <div className="stat-card stat-card--dark">
            <span className="stat-card__value">
              {largestDecline.change > 0 ? '+' : ''}
              {largestDecline.change.toFixed(3)}
            </span>
            <span className="stat-card__label">
              five-year index change in {largestDecline.country}, the largest decline in the map
            </span>
          </div>
          <div className="stat-card stat-card--dark">
            <span className="stat-card__value">
              {largestImprovement.change > 0 ? '+' : ''}
              {largestImprovement.change.toFixed(3)}
            </span>
            <span className="stat-card__label">
              five-year index change in {largestImprovement.country}, the largest improvement in the
              map
            </span>
          </div>
        </div>
      </section>

      <ComparisonCard
        title={story.comparison.title}
        fields={story.comparison.fields}
        tone="bad"
      />

      <ChartCard
        eyebrow="Selected countries · V-Dem + OWID"
        title="The trajectories do not move together"
        description="This balanced panel covers several regions and contrasting paths. It is not a ranking: the lines show how a model-based index changed over time."
        spec={democracySpec}
        data={democracySeries.map((point) => ({
          country: point.country,
          year: point.year,
          index: point.index,
        }))}
        columns={[
          { key: 'country', label: 'Country' },
          { key: 'year', label: 'Year' },
          { key: 'index', label: 'Liberal Democracy Index' },
        ]}
        sources={storySources}
        tone="bad"
        definition="V-Dem’s 0–1 Liberal Democracy Index; higher values indicate more of the measured liberal-democratic principles."
      />

      <MapCard
        eyebrow="Five-year change · V-Dem + OWID"
        title="Where the index fell — and where it recovered"
        description="The map shows 2025 minus 2020. Warm tones indicate a decline, green tones an increase, and grey countries lack one of the two endpoint observations."
        spec={democracyMapSpec}
        data={democracyMapSeries.map((point) => ({
          country: point.country,
          code: point.code,
          startIndex: point.startIndex,
          endIndex: point.endIndex,
          change: point.change,
        }))}
        columns={[
          { key: 'country', label: 'Country' },
          { key: 'code', label: 'ISO code' },
          { key: 'startIndex', label: '2020 index' },
          { key: 'endIndex', label: '2025 index' },
          { key: 'change', label: 'Change' },
        ]}
        sources={mapSources}
        tone="bad"
        definition="Difference between the 2025 and 2020 Liberal Democracy Index values; negative means the index declined."
        noDataLabel="Grey indicates that one of the 2020 or 2025 endpoint values is missing."
      />

      <section className="method-note method-note--dark">
        <p className="eyebrow">Read the evidence carefully</p>
        <h2>A falling index is a warning signal, not a full explanation.</h2>
        <p>
          V-Dem combines expert-coded evidence and factual indicators into a model-based estimate.
          A five-year decline can point to meaningful institutional deterioration, but it does not
          tell us why it happened or capture every part of political life.
        </p>
      </section>

      <section className="sources-section">
        <p className="eyebrow">Sources and definitions</p>
        <h2>Where the numbers and boundaries come from</h2>
        <SourceList sources={allSources} />
      </section>
    </StoryFrame>
  );
}

import type { TopLevelSpec } from 'vega-lite';
import { ChartCard } from '../../components/ChartCard';
import { ComparisonCard } from '../../components/ComparisonCard';
import { MapCard } from '../../components/MapCard';
import { SourceList } from '../../components/SourceList';
import { StoryFrame } from '../../components/StoryFrame';
import type { StoryDefinition } from '../../content/stories';
import { getSources } from '../../content/sources';
import {
  literacyMapGeoJson,
  literacyMapSeries,
  literacySeries,
} from './data';

interface LiteracyStoryProps {
  story: StoryDefinition;
}

const literacySpec: TopLevelSpec = {
  $schema: 'https://vega.github.io/schema/vega-lite/v6.json',
  width: 'container',
  height: 360,
  data: { name: 'series' },
  mark: { type: 'line', point: { filled: true, size: 34 }, strokeWidth: 2.5 },
  encoding: {
    x: {
      field: 'year',
      type: 'quantitative',
      title: 'Year',
      axis: { format: 'd', tickCount: 8 },
    },
    y: {
      field: 'rate',
      type: 'quantitative',
      title: 'Adults literate (%)',
      scale: { domain: [0, 100] },
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
      { field: 'rate', type: 'quantitative', title: 'Literacy', format: '.1f' },
    ],
  },
};

const literacyMapSpec: TopLevelSpec = {
  $schema: 'https://vega.github.io/schema/vega-lite/v6.json',
  width: 'container',
  height: 390,
  data: { values: literacyMapGeoJson.features },
  projection: { type: 'equalEarth' },
  mark: { type: 'geoshape', stroke: '#f4f1e9', strokeWidth: 0.45 },
  encoding: {
    color: {
      condition: {
        test: 'datum.properties.hasData === true',
        field: 'properties.value',
        type: 'quantitative',
        scale: { domain: [0, 100], range: ['#d8ebdd', '#8abfa5', '#2d746a'] },
        legend: { title: 'Literacy (%)' },
      },
      value: '#d9ddd6',
    },
    tooltip: [
      { field: 'properties.country', type: 'nominal', title: 'Country' },
      { field: 'properties.value', type: 'quantitative', title: 'Literacy', format: '.1f' },
      { field: 'properties.year', type: 'quantitative', title: 'Reported year', format: 'd' },
    ],
  },
};

function latestFor(country: string) {
  return literacyMapSeries.find((point) => point.country === country);
}

export function LiteracyStory({ story }: LiteracyStoryProps) {
  if (!story.comparison) {
    throw new Error('Literacy story is missing its comparison definition');
  }

  const lowerReference = latestFor('Nigeria');
  const upperReference = latestFor('Spain');
  const storySources = getSources(['literacy-owid']);
  const mapSources = getSources(['literacy-owid', 'world-atlas-geometry', 'iso-country-codes']);
  const allSources = getSources([
    'literacy-owid',
    'world-atlas-geometry',
    'iso-country-codes',
  ]);

  return (
    <StoryFrame story={story}>
      <section className="story-lede">
        <p className="lede">
          Basic literacy has spread across generations, but the latest map is not a single
          synchronized snapshot. Each country is shown with the newest reported observation we
          could retain.
        </p>
        <div className="stat-grid">
          <div className="stat-card">
            <span className="stat-card__value">{lowerReference?.rate.toFixed(1)}%</span>
            <span className="stat-card__label">
              reported adult literacy in {lowerReference?.country}, {lowerReference?.year}
            </span>
          </div>
          <div className="stat-card">
            <span className="stat-card__value">{upperReference?.rate.toFixed(1)}%</span>
            <span className="stat-card__label">
              reported adult literacy in {upperReference?.country}, {upperReference?.year}
            </span>
          </div>
        </div>
      </section>

      <ComparisonCard title={story.comparison.title} fields={story.comparison.fields} />

      <ChartCard
        eyebrow="Selected countries · OWID + UNESCO"
        title="Literacy rose across a broad panel of countries"
        description="The panel is deliberately balanced across regions and includes countries with different starting points. It is an illustration of long-run change, not a ranking of every country."
        spec={literacySpec}
        data={literacySeries.map((point) => ({
          country: point.country,
          year: point.year,
          rate: point.rate,
        }))}
        columns={[
          { key: 'country', label: 'Country' },
          { key: 'year', label: 'Year' },
          { key: 'rate', label: 'Literacy (%)' },
        ]}
        sources={storySources}
        definition="Share of people aged 15 and older who can read and write a simple statement about everyday life."
      />

      <MapCard
        eyebrow="Latest reported observations · OWID + UNESCO"
        title="The latest map is uneven by both place and year"
        description="The map includes countries with a reported observation from 2018 onward. Grey means the source does not provide a qualifying recent observation; it does not mean zero literacy."
        spec={literacyMapSpec}
        data={literacyMapSeries.map((point) => ({
          country: point.country,
          code: point.code,
          year: point.year,
          rate: point.rate,
        }))}
        columns={[
          { key: 'country', label: 'Country' },
          { key: 'code', label: 'ISO code' },
          { key: 'year', label: 'Reported year' },
          { key: 'rate', label: 'Literacy (%)' },
        ]}
        sources={mapSources}
        definition="Latest available basic adult-literacy observation per country, restricted to observations from 2018 onward; reporting years are not identical."
        noDataLabel="Grey indicates no qualifying observation from 2018 onward."
      />

      <section className="method-note">
        <p className="eyebrow">Read the evidence carefully</p>
        <h2>More literacy is a real gain. The measurement is still imperfect.</h2>
        <p>
          Earlier observations often used different age thresholds, survey methods, or minimum
          definitions of literacy. Many countries stopped reporting once rates became close to
          universal. The map keeps those limits visible instead of filling the gaps with estimates.
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

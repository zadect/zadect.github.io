import type { TopLevelSpec } from 'vega-lite';
import { ChartCard } from '../../components/ChartCard';
import { ComparisonCard } from '../../components/ComparisonCard';
import { SourceList } from '../../components/SourceList';
import { StoryFrame } from '../../components/StoryFrame';
import type { StoryDefinition } from '../../content/stories';
import { getSources } from '../../content/sources';
import {
  womensRightsCountrySeries,
  womensRightsWorldSeries,
} from './data';

interface WomensRightsStoryProps {
  story: StoryDefinition;
}

const worldRightsSpec: TopLevelSpec = {
  $schema: 'https://vega.github.io/schema/vega-lite/v6.json',
  width: 'container',
  height: 340,
  data: { name: 'series' },
  mark: { type: 'line', point: { filled: true, size: 26 }, strokeWidth: 3 },
  encoding: {
    x: {
      field: 'year',
      type: 'quantitative',
      title: 'Year',
      axis: { format: 'd', tickCount: 8 },
    },
    y: {
      field: 'value',
      type: 'quantitative',
      title: 'Index (0–100)',
      scale: { domain: [0, 100] },
    },
    color: { value: '#2d746a' },
    tooltip: [
      { field: 'year', type: 'quantitative', title: 'Year', format: 'd' },
      { field: 'value', type: 'quantitative', title: 'WBL index', format: '.1f' },
    ],
  },
};

const countryRightsSpec: TopLevelSpec = {
  $schema: 'https://vega.github.io/schema/vega-lite/v6.json',
  width: 'container',
  height: 370,
  data: { name: 'series' },
  mark: { type: 'line', point: { filled: true, size: 38 }, strokeWidth: 2.5 },
  encoding: {
    x: {
      field: 'year',
      type: 'quantitative',
      title: 'Checkpoint year',
      axis: { format: 'd', values: [1970, 1990, 2010, 2023] },
    },
    y: {
      field: 'value',
      type: 'quantitative',
      title: 'Index (0–100)',
      scale: { domain: [0, 100] },
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
      { field: 'value', type: 'quantitative', title: 'WBL index', format: '.1f' },
    ],
  },
};

export function WomensRightsStory({ story }: WomensRightsStoryProps) {
  if (!story.comparison) {
    throw new Error("Women's rights story is missing its comparison definition");
  }

  const first = womensRightsWorldSeries[0];
  const last = womensRightsWorldSeries.at(-1);
  const latestCountryValues = womensRightsCountrySeries.filter((point) => point.year === 2023);
  const highestLatest = latestCountryValues.reduce((current, point) =>
    point.value > current.value ? point : current,
  );
  const sources = getSources(['wbl-index-owid', 'wbl-methodology']);
  const panelData = womensRightsCountrySeries.map((point) => ({
    country: point.entity,
    year: point.year,
    value: point.value,
  }));

  return (
    <StoryFrame story={story}>
      <section className="story-lede">
        <p className="lede">
          The World Bank’s legal-equality index records a large rise since 1970. It covers formal
          economic rights; enforcement and lived outcomes require different evidence.
        </p>
        <div className="stat-grid">
          <div className="stat-card">
            <span className="stat-card__value">{last?.value.toFixed(1)}</span>
            <span className="stat-card__label">
              world WBL index in {last?.year}, up from {first?.value.toFixed(1)} in {first?.year}
            </span>
          </div>
          <div className="stat-card">
            <span className="stat-card__value">{highestLatest.value.toFixed(1)}</span>
            <span className="stat-card__label">
              2023 index for {highestLatest.entity} in the selected country panel
            </span>
          </div>
        </div>
      </section>

      <ComparisonCard title={story.comparison.title} fields={story.comparison.fields} />

      <ChartCard
        eyebrow="Global legal index · World Bank + OWID"
        title="The legal baseline has risen worldwide"
        description="The World Bank’s index records formal legal provisions across eight areas that shape women’s economic opportunity. Lived equality requires different evidence."
        spec={worldRightsSpec}
        data={womensRightsWorldSeries.map((point) => ({
          year: point.year,
          value: Number(point.value.toFixed(2)),
        }))}
        columns={[
          { key: 'year', label: 'Year' },
          { key: 'value', label: 'WBL index' },
        ]}
        sources={getSources(['wbl-index-owid'])}
        definition="Average score across eight legal categories, from 0 (lowest measured legal equality) to 100 (equal legal rights in the covered categories)."
      />

      <ChartCard
        eyebrow="Selected countries · World Bank + OWID"
        title="Countries moved at different speeds"
        description="These checkpoints keep the comparison readable across regions. Each line shows the country’s legal score at four dates; the score does not rank economic power or safety."
        spec={countryRightsSpec}
        data={panelData.map((point) => ({
          country: point.country,
          year: point.year,
          value: Number(point.value.toFixed(2)),
        }))}
        columns={[
          { key: 'country', label: 'Country' },
          { key: 'year', label: 'Checkpoint year' },
          { key: 'value', label: 'WBL index' },
        ]}
        sources={getSources(['wbl-index-owid'])}
        definition="Country score at selected historical checkpoints; values are formal legal provisions, not implementation outcomes."
      />

      <section className="method-note">
        <p className="eyebrow">Scope and limits</p>
        <h2>The index records laws; enforcement needs separate evidence.</h2>
        <p>
          The index is built for comparison by applying standardized assumptions to laws and
          regulations. It does not tell us whether a right is enforced, whether women can use it
          in practice, or how rights differ across regions and groups within a country. It therefore
          measures legal change rather than women’s full experience.
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

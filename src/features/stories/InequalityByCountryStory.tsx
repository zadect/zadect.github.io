import type { TopLevelSpec } from 'vega-lite';
import { ChartCard } from '../../components/ChartCard';
import { ComparisonCard } from '../../components/ComparisonCard';
import { SourceList } from '../../components/SourceList';
import { StoryFrame } from '../../components/StoryFrame';
import type { StoryDefinition } from '../../content/stories';
import { getSources } from '../../content/sources';
import { inequalityEndpointSeries, inequalitySeries } from './data';

interface InequalityByCountryStoryProps {
  story: StoryDefinition;
}

const giniSpec: TopLevelSpec = {
  $schema: 'https://vega.github.io/schema/vega-lite/v6.json',
  width: 'container',
  height: 360,
  data: { name: 'series' },
  mark: { type: 'line', point: { filled: true, size: 28 }, strokeWidth: 2 },
  encoding: {
    x: {
      field: 'year',
      type: 'quantitative',
      title: 'Year',
      axis: { format: 'd', tickCount: 10 },
    },
    y: {
      field: 'gini',
      type: 'quantitative',
      title: 'Gini coefficient',
      scale: { domain: [0.2, 0.7] },
      axis: { format: '.2f' },
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
      { field: 'gini', type: 'quantitative', title: 'Gini coefficient', format: '.3f' },
    ],
  },
};

const endpointSpec: TopLevelSpec = {
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
          axis: { format: 'd', tickCount: 8 },
        },
        y: {
          field: 'gini',
          type: 'quantitative',
          title: 'Gini coefficient',
          scale: { domain: [0.2, 0.7] },
          axis: { format: '.2f' },
        },
        color: {
          field: 'country',
          type: 'nominal',
          title: 'Country',
          scale: { scheme: 'tableau20' },
        },
        detail: { field: 'country' },
      },
    },
    {
      mark: { type: 'point', filled: true, size: 60 },
      encoding: {
        x: { field: 'year', type: 'quantitative', title: 'Year' },
        y: {
          field: 'gini',
          type: 'quantitative',
          title: 'Gini coefficient',
          scale: { domain: [0.2, 0.7] },
        },
        color: {
          field: 'country',
          type: 'nominal',
          title: 'Country',
          scale: { scheme: 'tableau20' },
        },
        shape: {
          field: 'stage',
          type: 'nominal',
          title: 'Observation',
          scale: { domain: ['First reported', 'Latest reported'], range: ['circle', 'diamond'] },
        },
        tooltip: [
          { field: 'country', type: 'nominal', title: 'Country' },
          { field: 'stage', type: 'nominal', title: 'Observation' },
          { field: 'year', type: 'quantitative', title: 'Year', format: 'd' },
          { field: 'gini', type: 'quantitative', title: 'Gini coefficient', format: '.3f' },
        ],
      },
    },
  ],
};

const formatGini = (value: number) => value.toFixed(3);

export function InequalityByCountryStory({ story }: InequalityByCountryStoryProps) {
  if (!story.comparison) {
    throw new Error('Rich and poor story is missing its comparison definition');
  }

  const endpointData = inequalityEndpointSeries.map((point, index) => ({
    country: point.country,
    year: point.year,
    gini: point.gini,
    stage: index % 2 === 0 ? 'First reported' : 'Latest reported',
  }));
  const latestPoints = endpointData.filter((point) => point.stage === 'Latest reported');
  const highestLatest = latestPoints.reduce((current, point) =>
    point.gini > current.gini ? point : current,
  );
  const lowestLatest = latestPoints.reduce((current, point) =>
    point.gini < current.gini ? point : current,
  );
  const largestRise = latestPoints.reduce((current, point, index) => {
    const first = endpointData[index * 2];
    if (!first) return current;
    const change = point.gini - first.gini;
    return change > current.change ? { point, change } : current;
  }, { point: latestPoints[0], change: Number.NEGATIVE_INFINITY });

  const first = endpointData[0];
  const last = endpointData[1];
  if (!first || !last || !highestLatest || !lowestLatest || !largestRise.point) {
    throw new Error('Rich and poor story data is incomplete');
  }

  const sources = getSources(['world-bank-pip-gini']);

  return (
    <StoryFrame story={story}>
      <section className="story-lede">
        <p className="lede">
          “Rich and poor” is not a single global line. Inequality is measured inside each country,
          and the shape changes with the country, the survey, and the welfare concept being measured.
          These lines show the differences without pretending the data is more uniform than it is.
        </p>
        <div className="stat-grid">
          <div className="stat-card">
            <span className="stat-card__value">
              {formatGini(first.gini)} → {formatGini(last.gini)}
            </span>
            <span className="stat-card__label">
              first and latest observation in this extract: {first.country}, {first.year} to{' '}
              {last.year}
            </span>
          </div>
          <div className="stat-card">
            <span className="stat-card__value">
              {formatGini(highestLatest.gini)}
            </span>
            <span className="stat-card__label">
              highest latest reported coefficient: {highestLatest.country} ({highestLatest.year})
            </span>
          </div>
          <div className="stat-card">
            <span className="stat-card__value">
              +{largestRise.change.toFixed(3)}
            </span>
            <span className="stat-card__label">
              largest first-to-latest rise in the selected panel: {largestRise.point.country}
            </span>
          </div>
        </div>
      </section>

      <ComparisonCard title={story.comparison.title} fields={story.comparison.fields} />

      <ChartCard
        eyebrow="Selected countries · World Bank PIP via Our World in Data"
        title="Inequality does not move in one direction"
        description="Every point is a reported observation retained by the World Bank PIP series. Lines connect the observations for readability; missing years are not filled locally."
        spec={giniSpec}
        data={inequalitySeries.map((point) => ({
          country: point.country,
          year: point.year,
          gini: point.gini,
        }))}
        columns={[
          { key: 'country', label: 'Country' },
          { key: 'year', label: 'Year' },
          { key: 'gini', label: 'Gini coefficient' },
        ]}
        sources={sources}
        tone="bad"
        definition="Within-country inequality in the distribution of disposable income or consumption, scaled from 0 (perfect equality) to 1 (maximum inequality)."
      />

      <ChartCard
        eyebrow="First and latest reported observations · no interpolation"
        title="The endpoint comparison needs context"
        description="Each line joins a country’s first and latest observation in this extract. It shows the direction between two measured points, not an estimate of every year in between."
        spec={endpointSpec}
        data={endpointData}
        columns={[
          { key: 'country', label: 'Country' },
          { key: 'stage', label: 'Observation' },
          { key: 'year', label: 'Year' },
          { key: 'gini', label: 'Gini coefficient' },
        ]}
        sources={sources}
        tone="bad"
        definition="First-to-latest endpoint change for each selected country; endpoint years differ because survey coverage is not simultaneous."
      />

      <section className="method-note">
        <p className="eyebrow">Read the evidence carefully</p>
        <h2>A Gini coefficient describes a distribution, not a person’s life.</h2>
        <p>
          A higher Gini means a more unequal distribution within a country; it does not tell us
          whether everyone became richer or poorer. The World Bank combines national survey data,
          using disposable income after taxes and benefits for many high-income countries and
          consumption for many lower-income countries. Survey redesigns can create breaks, and the
          selected countries do not report every year. The lowest latest coefficient in this panel
          is {formatGini(lowestLatest.gini)} for {lowestLatest.country}, but that is not a global
          league table.
        </p>
      </section>

      <section className="sources-section">
        <p className="eyebrow">Sources and definitions</p>
        <h2>Where the inequality estimates come from</h2>
        <SourceList sources={sources} />
      </section>
    </StoryFrame>
  );
}

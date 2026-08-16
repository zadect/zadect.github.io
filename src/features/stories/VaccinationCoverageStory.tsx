import type { TopLevelSpec } from 'vega-lite';
import { ChartCard } from '../../components/ChartCard';
import { ComparisonCard } from '../../components/ComparisonCard';
import { SourceList } from '../../components/SourceList';
import { StoryFrame } from '../../components/StoryFrame';
import type { StoryDefinition } from '../../content/stories';
import { getSources } from '../../content/sources';
import { vaccinationPanelSeries, vaccinationWorldSeries } from './data';

interface VaccinationCoverageStoryProps {
  story: StoryDefinition;
}

const worldSpec: TopLevelSpec = {
  $schema: 'https://vega.github.io/schema/vega-lite/v6.json',
  width: 'container',
  height: 340,
  data: { name: 'series' },
  mark: { type: 'line', point: { filled: true, size: 24 }, strokeWidth: 3 },
  encoding: {
    x: {
      field: 'year',
      type: 'quantitative',
      title: 'Year',
      axis: { format: 'd', tickCount: 9 },
    },
    y: {
      field: 'coverage',
      type: 'quantitative',
      title: 'DTP3 coverage (%)',
      scale: { domain: [0, 100] },
    },
    color: { value: '#2d746a' },
    tooltip: [
      { field: 'year', type: 'quantitative', title: 'Year', format: 'd' },
      { field: 'coverage', type: 'quantitative', title: 'Coverage', format: '.0f' },
    ],
  },
};

const panelSpec: TopLevelSpec = {
  $schema: 'https://vega.github.io/schema/vega-lite/v6.json',
  width: 'container',
  height: 360,
  data: { name: 'series' },
  mark: { type: 'line', point: { filled: true, size: 42 }, strokeWidth: 2.5 },
  encoding: {
    x: {
      field: 'year',
      type: 'quantitative',
      title: 'Checkpoint year',
      axis: { format: 'd', values: [2000, 2019, 2024] },
    },
    y: {
      field: 'coverage',
      type: 'quantitative',
      title: 'DTP3 coverage (%)',
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
      { field: 'coverage', type: 'quantitative', title: 'Coverage', format: '.0f' },
    ],
  },
};

export function VaccinationCoverageStory({ story }: VaccinationCoverageStoryProps) {
  if (!story.comparison) {
    throw new Error('Vaccination coverage story is missing its comparison definition');
  }

  const first = vaccinationWorldSeries[0];
  const last = vaccinationWorldSeries.at(-1);
  const latestPanel = vaccinationPanelSeries.filter((point) => point.year === 2024);
  if (!first || !last || latestPanel.length === 0) {
    throw new Error('Vaccination coverage story data is incomplete');
  }

  const highestLatest = latestPanel.reduce((current, point) =>
    point.coverage > current.coverage ? point : current,
  );
  const lowestLatest = latestPanel.reduce((current, point) =>
    point.coverage < current.coverage ? point : current,
  );

  return (
    <StoryFrame story={story}>
      <section className="story-lede">
        <p className="lede">
          Vaccines turn prevention into a public system. DTP3 coverage moved from a low global
          baseline to a high one — and the recent interruption shows that maintenance is part of
          progress too.
        </p>
        <div className="stat-grid">
          <div className="stat-card">
            <span className="stat-card__value">{first.coverage}% → {last.coverage}%</span>
            <span className="stat-card__label">
              estimated global DTP3 coverage from {first.year} to {last.year}
            </span>
          </div>
          <div className="stat-card">
            <span className="stat-card__value">{highestLatest.coverage}%</span>
            <span className="stat-card__label">
              2024 coverage in {highestLatest.entity}, versus {lowestLatest.coverage}% in{' '}
              {lowestLatest.entity}
            </span>
          </div>
        </div>
      </section>

      <ComparisonCard title={story.comparison.title} fields={story.comparison.fields} />

      <ChartCard
        eyebrow="World · WHO + UNICEF"
        title="The world moved toward a high vaccination baseline"
        description="Global DTP3 coverage rose sharply over the period, then slipped during the pandemic years before recovering. The recent recovery is not the same as universal coverage."
        spec={worldSpec}
        data={vaccinationWorldSeries.map((point) => ({
          year: point.year,
          coverage: point.coverage,
        }))}
        columns={[
          { key: 'year', label: 'Year' },
          { key: 'coverage', label: 'DTP3 coverage (%)' },
        ]}
        sources={getSources(['who-unicef-dtp3'])}
        definition="Share of one-year-olds who received the third dose of the DTP vaccine."
      />

      <ChartCard
        eyebrow="Selected countries · WHO + UNICEF"
        title="Averages rose, but the starting points were not equal"
        description="The same three checkpoints make the country contrast readable. Some countries started near universal coverage; others made a much longer climb."
        spec={panelSpec}
        data={vaccinationPanelSeries.map((point) => ({
          country: point.entity,
          year: point.year,
          coverage: point.coverage,
        }))}
        columns={[
          { key: 'country', label: 'Country' },
          { key: 'year', label: 'Checkpoint year' },
          { key: 'coverage', label: 'DTP3 coverage (%)' },
        ]}
        sources={getSources(['who-unicef-dtp3'])}
        definition="WHO/UNICEF estimate of one-year-olds receiving DTP3 at each checkpoint."
      />

      <section className="method-note">
        <p className="eyebrow">Read the evidence carefully</p>
        <h2>Coverage is a system signal, not a guarantee.</h2>
        <p>
          The estimates combine administrative records, surveys, and country review. For some
          places and years, statistical methods fill reporting gaps. DTP3 says whether a child
          reached a third dose; it does not describe every vaccine, every community, or whether
          the health system can sustain that reach.
        </p>
      </section>

      <section className="sources-section">
        <p className="eyebrow">Sources and definitions</p>
        <h2>Where the vaccination estimates come from</h2>
        <SourceList sources={getSources(['who-unicef-dtp3'])} />
      </section>
    </StoryFrame>
  );
}

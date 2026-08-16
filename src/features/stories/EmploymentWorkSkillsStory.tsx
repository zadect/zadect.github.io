import type { TopLevelSpec } from 'vega-lite';
import { ChartCard } from '../../components/ChartCard';
import { ComparisonCard } from '../../components/ComparisonCard';
import { SourceList } from '../../components/SourceList';
import { StoryFrame } from '../../components/StoryFrame';
import type { StoryDefinition } from '../../content/stories';
import { getSources } from '../../content/sources';
import {
  employmentWorkSkillsPanelSeries,
  employmentWorkSkillsWorldSeries,
} from './data';

interface EmploymentWorkSkillsStoryProps {
  story: StoryDefinition;
}

const worldSpec: TopLevelSpec = {
  $schema: 'https://vega.github.io/schema/vega-lite/v6.json',
  width: 'container',
  height: 340,
  data: { name: 'series' },
  layer: [
    {
      mark: { type: 'area', color: '#8e7bb5', opacity: 0.18 },
      encoding: {
        x: {
          field: 'year',
          type: 'quantitative',
          title: 'Year',
          axis: { format: 'd', tickCount: 9 },
        },
        y: {
          field: 'rate',
          type: 'quantitative',
          title: 'Employed population (%)',
          scale: { domain: [50, 70] },
        },
        y2: { datum: 50 },
      },
    },
    {
      mark: { type: 'line', color: '#8e7bb5', strokeWidth: 3 },
      encoding: {
        x: { field: 'year', type: 'quantitative', title: 'Year' },
        y: {
          field: 'rate',
          type: 'quantitative',
          title: 'Employed population (%)',
          scale: { domain: [50, 70] },
        },
      },
    },
    {
      mark: { type: 'point', filled: true, color: '#d7c7ff', size: 28 },
      encoding: {
        x: { field: 'year', type: 'quantitative', title: 'Year' },
        y: {
          field: 'rate',
          type: 'quantitative',
          title: 'Employed population (%)',
          scale: { domain: [50, 70] },
        },
        tooltip: [
          { field: 'year', type: 'quantitative', title: 'Year', format: 'd' },
          { field: 'rate', type: 'quantitative', title: 'Employment rate', format: '.1f' },
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
  mark: { type: 'line', point: { filled: true, size: 34 }, strokeWidth: 2.5 },
  encoding: {
    x: {
      field: 'year',
      type: 'quantitative',
      title: 'Checkpoint year',
      scale: { domain: [1991, 2025] },
      axis: { format: 'd', values: [1991, 2000, 2010, 2020, 2025] },
    },
    y: {
      field: 'rate',
      type: 'quantitative',
      title: 'Employed population (%)',
      scale: { domain: [40, 90] },
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
      { field: 'rate', type: 'quantitative', title: 'Employment rate', format: '.1f' },
    ],
  },
};

export function EmploymentWorkSkillsStory({ story }: EmploymentWorkSkillsStoryProps) {
  if (!story.comparison) {
    throw new Error('Employment, Work & Skills story is missing its comparison definition');
  }

  const first = employmentWorkSkillsWorldSeries[0];
  const last = employmentWorkSkillsWorldSeries.at(-1);
  const latestPanel = employmentWorkSkillsPanelSeries.filter((point) => point.year === 2025);
  const highestLatest = latestPanel.reduce((current, point) =>
    point.rate > current.rate ? point : current,
  );
  const lowestLatest = latestPanel.reduce((current, point) =>
    point.rate < current.rate ? point : current,
  );

  if (!first || !last || !highestLatest || !lowestLatest) {
    throw new Error('Employment, Work & Skills story data is incomplete');
  }

  const sources = getSources(['ilo-employment-rate-owid']);
  const worldChange = last.rate - first.rate;

  return (
    <StoryFrame story={story}>
      <section className="story-lede">
        <p className="lede">
          Before asking whether work is secure, skilled, or fairly paid, start with a simpler
          question: how many adults are working at all? This broad rate fell during the pandemic
          and has not returned to its 1991 level globally.
        </p>
        <div className="stat-grid">
          <div className="stat-card">
            <span className="stat-card__value">
              {first.rate.toFixed(1)} → {last.rate.toFixed(1)}%
            </span>
            <span className="stat-card__label">
              world employment rate from {first.year} to {last.year} (
              {worldChange >= 0 ? '+' : ''}
              {worldChange.toFixed(1)} percentage points)
            </span>
          </div>
          <div className="stat-card">
            <span className="stat-card__value">{highestLatest.rate.toFixed(1)}%</span>
            <span className="stat-card__label">
              2025 rate in {highestLatest.entity}, highest in this selected panel
            </span>
          </div>
          <div className="stat-card">
            <span className="stat-card__value">{lowestLatest.rate.toFixed(1)}%</span>
            <span className="stat-card__label">
              2025 rate in {lowestLatest.entity}, lowest in this selected panel
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
        eyebrow="World · ILO Modelled Estimates via World Bank and OWID"
        title="The global work rate dipped, then recovered partway"
        description="The line is the share of people aged 15 and older who were employed. The 2020 drop is visible, but the latest point remains below the 1991 starting point."
        spec={worldSpec}
        data={employmentWorkSkillsWorldSeries.map((point) => ({
          year: point.year,
          rate: point.rate,
        }))}
        columns={[
          { key: 'year', label: 'Year' },
          { key: 'rate', label: 'Employment rate (%)' },
        ]}
        sources={sources}
        tone="future"
        definition="Share of the population aged 15 and older that is employed, using the ILO modeled estimate."
      />

      <ChartCard
        eyebrow="Six selected countries · shared checkpoints"
        title="Country lines start and end in different places"
        description="These lines connect five common checkpoints. They make differences in level and recovery visible, but they are not a ranking of job quality."
        spec={panelSpec}
        data={employmentWorkSkillsPanelSeries.map((point) => ({
          entity: point.entity,
          year: point.year,
          rate: point.rate,
        }))}
        columns={[
          { key: 'entity', label: 'Country' },
          { key: 'year', label: 'Year' },
          { key: 'rate', label: 'Employment rate (%)' },
        ]}
        sources={sources}
        tone="future"
        definition="The same employment-to-population ratio for Germany, India, Japan, Nigeria, Sweden, and the United States."
      />

      <section className="method-note method-note--future">
        <p className="eyebrow">Read the evidence carefully</p>
        <h2>A work rate is a starting point, not a verdict on work.</h2>
        <p>
          A person counts as employed after at least one hour of work in the reference period.
          That makes the measure useful for a broad comparison, but it cannot show whether work is
          formal, stable, safe, well paid, full-time, or a good match for someone’s skills. Those
          questions need separate evidence.
        </p>
      </section>

      <section className="sources-section">
        <p className="eyebrow">Sources and definitions</p>
        <h2>Where the employment signal comes from</h2>
        <SourceList sources={sources} />
      </section>
    </StoryFrame>
  );
}

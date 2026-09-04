import type { TopLevelSpec } from 'vega-lite';
import { ChartCard } from '../../components/ChartCard';
import { ComparisonCard } from '../../components/ComparisonCard';
import { SourceList } from '../../components/SourceList';
import { StoryFrame } from '../../components/StoryFrame';
import type { StoryDefinition } from '../../content/stories';
import { getSources } from '../../content/sources';
import { warsConflictSeries } from './data';

interface WarsConflictStoryProps {
  story: StoryDefinition;
}

const deathsSpec: TopLevelSpec = {
  $schema: 'https://vega.github.io/schema/vega-lite/v6.json',
  width: 'container',
  height: 340,
  data: { name: 'series' },
  layer: [
    {
      mark: { type: 'area', color: '#a66f63', opacity: 0.45 },
      encoding: {
        x: {
          field: 'year',
          type: 'quantitative',
          title: 'Year',
          axis: { format: 'd', tickCount: 10 },
        },
        y: {
          field: 'lowDeaths',
          type: 'quantitative',
          title: 'Battle-related deaths',
          scale: { domain: [0, 1000000] },
        },
        y2: { field: 'highDeaths' },
        tooltip: [
          { field: 'year', type: 'quantitative', title: 'Year', format: 'd' },
          { field: 'lowDeaths', type: 'quantitative', title: 'Low estimate', format: ',.0f' },
          { field: 'highDeaths', type: 'quantitative', title: 'High estimate', format: ',.0f' },
        ],
      },
    },
    {
      mark: { type: 'line', color: '#efad95', strokeWidth: 2.5 },
      encoding: {
        x: { field: 'year', type: 'quantitative', title: 'Year' },
        y: {
          field: 'bestDeaths',
          type: 'quantitative',
          title: 'Battle-related deaths',
          scale: { domain: [0, 1000000] },
        },
        tooltip: [
          { field: 'year', type: 'quantitative', title: 'Year', format: 'd' },
          { field: 'bestDeaths', type: 'quantitative', title: 'Best estimate', format: ',.0f' },
        ],
      },
    },
    {
      mark: { type: 'point', filled: true, color: '#ffd0bc', size: 22 },
      encoding: {
        x: { field: 'year', type: 'quantitative', title: 'Year' },
        y: {
          field: 'bestDeaths',
          type: 'quantitative',
          title: 'Battle-related deaths',
          scale: { domain: [0, 1000000] },
        },
      },
    },
  ],
};

const conflictsSpec: TopLevelSpec = {
  $schema: 'https://vega.github.io/schema/vega-lite/v6.json',
  width: 'container',
  height: 340,
  data: { name: 'series' },
  layer: [
    {
      mark: { type: 'area', color: '#8d5e57', opacity: 0.3 },
      encoding: {
        x: {
          field: 'year',
          type: 'quantitative',
          title: 'Year',
          axis: { format: 'd', tickCount: 10 },
        },
        y: {
          field: 'ongoingConflicts',
          type: 'quantitative',
          title: 'Ongoing conflicts (count)',
          scale: { domain: [0, 70] },
        },
        tooltip: [
          { field: 'year', type: 'quantitative', title: 'Year', format: 'd' },
          {
            field: 'ongoingConflicts',
            type: 'quantitative',
            title: 'Ongoing conflicts',
            format: ',.0f',
          },
        ],
      },
    },
    {
      mark: { type: 'line', color: '#efad95', strokeWidth: 3 },
      encoding: {
        x: { field: 'year', type: 'quantitative', title: 'Year' },
        y: {
          field: 'ongoingConflicts',
          type: 'quantitative',
          title: 'Ongoing conflicts (count)',
          scale: { domain: [0, 70] },
        },
      },
    },
    {
      mark: { type: 'point', filled: true, color: '#ffd0bc', size: 28 },
      encoding: {
        x: { field: 'year', type: 'quantitative', title: 'Year' },
        y: {
          field: 'ongoingConflicts',
          type: 'quantitative',
          title: 'Ongoing conflicts (count)',
          scale: { domain: [0, 70] },
        },
      },
    },
  ],
};

const formatNumber = (value: number) => new Intl.NumberFormat('en-US').format(value);

export function WarsConflictStory({ story }: WarsConflictStoryProps) {
  if (!story.comparison) {
    throw new Error('Wars and conflict story is missing its comparison definition');
  }

  const first = warsConflictSeries[0];
  const last = warsConflictSeries.at(-1);
  const highestDeaths = warsConflictSeries.reduce((current, point) =>
    point.bestDeaths > current.bestDeaths ? point : current,
  );
  const highestConflictCount = warsConflictSeries.reduce((current, point) =>
    point.ongoingConflicts > current.ongoingConflicts ? point : current,
  );

  if (!first || !last || !highestDeaths || !highestConflictCount) {
    throw new Error('Wars and conflict story data is incomplete');
  }

  const deathSources = getSources(['ucdp-conflict-deaths']);
  const conflictSources = getSources(['ucdp-conflict-counts']);
  const sources = getSources(['ucdp-conflict-deaths', 'ucdp-conflict-counts']);

  return (
    <StoryFrame story={story}>
      <section className="story-lede">
        <p className="lede">
          Battle-related deaths and the number of active state-based conflicts measure different
          parts of organized violence. A year can contain many conflicts without the same death
          toll as a smaller number of intense wars.
        </p>
        <div className="stat-grid">
          <div className="stat-card">
            <span className="stat-card__value">
              {formatNumber(last.bestDeaths)}
            </span>
            <span className="stat-card__label">
              best estimate of battle-related deaths worldwide in {last.year}; the reported range
              is {formatNumber(last.lowDeaths)}–{formatNumber(last.highDeaths)}
            </span>
          </div>
          <div className="stat-card">
            <span className="stat-card__value">
              {formatNumber(last.ongoingConflicts)}
            </span>
            <span className="stat-card__label">
              ongoing state-based conflicts worldwide in {last.year}, compared with{' '}
              {formatNumber(first.ongoingConflicts)} in {first.year}
            </span>
          </div>
          <div className="stat-card">
            <span className="stat-card__value">
              {formatNumber(highestDeaths.bestDeaths)}
            </span>
            <span className="stat-card__label">
              highest best-estimate death count in this extract, in {highestDeaths.year}
            </span>
          </div>
        </div>
      </section>

      <ComparisonCard title={story.comparison.title} fields={story.comparison.fields} />

      <ChartCard
        eyebrow="World · UCDP / PRIO via Our World in Data"
        title="Battle-related deaths in state-based conflicts"
        description="The central line is the best estimate of people killed by fighting. The shaded area shows the source’s low-to-high range."
        spec={deathsSpec}
        data={warsConflictSeries.map((point) => ({
          year: point.year,
          bestDeaths: point.bestDeaths,
          lowDeaths: point.lowDeaths,
          highDeaths: point.highDeaths,
        }))}
        columns={[
          { key: 'year', label: 'Year' },
          { key: 'bestDeaths', label: 'Best estimate' },
          { key: 'lowDeaths', label: 'Low estimate' },
          { key: 'highDeaths', label: 'High estimate' },
        ]}
        sources={deathSources}
        tone="bad"
        definition="Deaths of combatants and civilians due to fighting in interstate, intrastate, and extrasystemic conflicts that were ongoing that year."
      />

      <ChartCard
        eyebrow="World · UCDP / PRIO via Our World in Data"
        title="Ongoing state-based conflicts"
        description="This is the annual count of ongoing state-based conflicts. It rises when more conflicts meet the source’s threshold, not only when existing conflicts become deadlier."
        spec={conflictsSpec}
        data={warsConflictSeries.map((point) => ({
          year: point.year,
          ongoingConflicts: point.ongoingConflicts,
        }))}
        columns={[
          { key: 'year', label: 'Year' },
          { key: 'ongoingConflicts', label: 'Ongoing conflicts' },
        ]}
        sources={conflictSources}
        tone="bad"
        definition="Number of ongoing interstate, internationalized intrastate, non-internationalized intrastate, and extrasystemic conflicts causing at least 25 battle-related deaths in that year."
      />

      <section className="method-note">
        <p className="eyebrow">Scope and limits</p>
        <h2>Battle deaths cover only one part of war’s human cost.</h2>
        <p>
          The series counts deaths attributed to fighting, not the wider human cost of war. It
          leaves out deaths from disease, hunger, displacement, and other indirect effects. Before
          1989, the death series is sourced from PRIO; from 1989 onward it uses UCDP. Conflict-level
          data cannot be cleanly assigned to individual countries, so this page stays with a
          worldwide series rather than drawing a misleading country map. The highest conflict count
          in this extract is {formatNumber(highestConflictCount.ongoingConflicts)} in{' '}
          {highestConflictCount.year}.
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

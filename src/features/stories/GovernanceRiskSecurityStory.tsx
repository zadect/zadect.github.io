import type { TopLevelSpec } from 'vega-lite';
import { ChartCard } from '../../components/ChartCard';
import { ComparisonCard } from '../../components/ComparisonCard';
import { SourceList } from '../../components/SourceList';
import { StoryFrame } from '../../components/StoryFrame';
import type { StoryDefinition } from '../../content/stories';
import { getSources } from '../../content/sources';
import {
  governanceOverallMedianSeries,
  governanceOverallPanelSeries,
  governanceSecurityMedianSeries,
  governanceSecurityPanelSeries,
} from './data';

interface GovernanceRiskSecurityStoryProps {
  story: StoryDefinition;
}

const medianSpec: TopLevelSpec = {
  $schema: 'https://vega.github.io/schema/vega-lite/v6.json',
  width: 'container',
  height: 340,
  data: { name: 'series' },
  mark: { type: 'line', point: { filled: true, size: 34 }, strokeWidth: 3 },
  encoding: {
    x: {
      field: 'year',
      type: 'quantitative',
      title: 'Edition year',
      scale: { domain: [2012, 2025] },
      axis: { format: 'd', values: [2012, 2014, 2017, 2020, 2025] },
    },
    y: {
      field: 'value',
      type: 'quantitative',
      title: 'Index score',
      scale: { domain: [0, 1] },
      axis: { format: '.1f' },
    },
    color: {
      field: 'signal',
      type: 'nominal',
      title: 'Signal',
      scale: { range: ['#6f5a9e', '#4e8b78'] },
    },
    tooltip: [
      { field: 'signal', type: 'nominal', title: 'Signal' },
      { field: 'edition', type: 'nominal', title: 'WJP edition' },
      { field: 'value', type: 'quantitative', title: 'Country median', format: '.3f' },
    ],
  },
};

const overallPanelSpec: TopLevelSpec = {
  $schema: 'https://vega.github.io/schema/vega-lite/v6.json',
  width: 'container',
  height: 380,
  data: { name: 'series' },
  mark: { type: 'line', point: { filled: true, size: 28 }, strokeWidth: 2.2 },
  encoding: {
    x: {
      field: 'year',
      type: 'quantitative',
      title: 'Edition year',
      scale: { domain: [2012, 2025] },
      axis: { format: 'd', values: [2012, 2014, 2017, 2020, 2025] },
    },
    y: {
      field: 'value',
      type: 'quantitative',
      title: 'Overall Rule of Law Index',
      scale: { domain: [0.3, 0.9] },
      axis: { format: '.1f' },
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
      { field: 'edition', type: 'nominal', title: 'WJP edition' },
      { field: 'value', type: 'quantitative', title: 'Overall score', format: '.3f' },
    ],
  },
};

const securityPanelSpec: TopLevelSpec = {
  $schema: 'https://vega.github.io/schema/vega-lite/v6.json',
  width: 'container',
  height: 380,
  data: { name: 'series' },
  mark: { type: 'line', point: { filled: true, size: 28 }, strokeWidth: 2.2 },
  encoding: {
    x: {
      field: 'year',
      type: 'quantitative',
      title: 'Edition year',
      scale: { domain: [2012, 2025] },
      axis: { format: 'd', values: [2012, 2014, 2017, 2020, 2025] },
    },
    y: {
      field: 'value',
      type: 'quantitative',
      title: 'Order and Security factor',
      scale: { domain: [0.25, 1] },
      axis: { format: '.1f' },
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
      { field: 'edition', type: 'nominal', title: 'WJP edition' },
      { field: 'value', type: 'quantitative', title: 'Order and Security', format: '.3f' },
    ],
  },
};

export function GovernanceRiskSecurityStory({ story }: GovernanceRiskSecurityStoryProps) {
  if (!story.comparison) {
    throw new Error('Governance, Risk & Security story is missing its comparison definition');
  }

  const firstMedian = governanceOverallMedianSeries[0];
  const latestMedian = governanceOverallMedianSeries.at(-1);
  const latestOverallPanel = governanceOverallPanelSeries.filter((point) => point.year === 2025);
  const latestSecurityPanel = governanceSecurityPanelSeries.filter((point) => point.year === 2025);
  const highestOverall = latestOverallPanel.reduce((current, point) =>
    point.value > current.value ? point : current,
  );
  const lowestOverall = latestOverallPanel.reduce((current, point) =>
    point.value < current.value ? point : current,
  );
  const highestSecurity = latestSecurityPanel.reduce((current, point) =>
    point.value > current.value ? point : current,
  );

  if (
    !firstMedian ||
    !latestMedian ||
    !highestOverall ||
    !lowestOverall ||
    !highestSecurity ||
    latestOverallPanel.length === 0 ||
    latestSecurityPanel.length === 0
  ) {
    throw new Error('Governance, Risk & Security story data is incomplete');
  }

  const source = getSources(['wjp-rule-of-law']);

  return (
    <StoryFrame story={story}>
      <section className="story-lede">
        <p className="lede">
          Institutions are part of the future too. The Rule of Law Index gives that question a
          repeatable shape: one overall score, one security dimension, and a visible gap between
          countries.
        </p>
        <div className="stat-grid">
          <div className="stat-card">
            <span className="stat-card__value">
              {firstMedian.value.toFixed(2)} → {latestMedian.value.toFixed(2)}
            </span>
            <span className="stat-card__label">
              country median overall score from the first to the latest edition
            </span>
          </div>
          <div className="stat-card">
            <span className="stat-card__value">{highestOverall.value.toFixed(2)}</span>
            <span className="stat-card__label">
              2025 overall score in {highestOverall.entity}, highest in this panel
            </span>
          </div>
          <div className="stat-card">
            <span className="stat-card__value">{lowestOverall.value.toFixed(2)}</span>
            <span className="stat-card__label">
              2025 overall score in {lowestOverall.entity}, lowest in this panel
            </span>
          </div>
          <div className="stat-card">
            <span className="stat-card__value">{highestSecurity.value.toFixed(2)}</span>
            <span className="stat-card__label">
              2025 Order and Security score in {highestSecurity.entity}, highest in this panel
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
        eyebrow="WJP editions · median across reporting countries"
        title="The country median barely moves"
        description="The overall score and Order and Security factor follow different paths. The median is across countries, not people; the first and 2017 points represent multi-year editions."
        spec={medianSpec}
        data={[
          ...governanceOverallMedianSeries.map((point) => ({
            signal: 'Overall score',
            year: point.year,
            edition: point.edition,
            value: point.value,
          })),
          ...governanceSecurityMedianSeries.map((point) => ({
            signal: 'Order and Security',
            year: point.year,
            edition: point.edition,
            value: point.value,
          })),
        ]}
        columns={[
          { key: 'signal', label: 'Signal' },
          { key: 'year', label: 'Edition year' },
          { key: 'edition', label: 'WJP edition' },
          { key: 'value', label: 'Country median' },
        ]}
        sources={source}
        tone="future"
        definition="Median score across countries with a reported WJP score in the relevant edition."
      />

      <ChartCard
        eyebrow="Eight selected countries · WJP historical editions"
        title="Countries do not share one institutional path"
        description="The same editions reveal different levels and changes. These are index scores, not rankings of every part of public life."
        spec={overallPanelSpec}
        data={governanceOverallPanelSeries.map((point) => ({
          entity: point.entity,
          year: point.year,
          edition: point.edition,
          value: point.value,
        }))}
        columns={[
          { key: 'entity', label: 'Country' },
          { key: 'year', label: 'Edition year' },
          { key: 'edition', label: 'WJP edition' },
          { key: 'value', label: 'Overall score' },
        ]}
        sources={source}
        tone="future"
        definition="Overall WJP Rule of Law Index score for Brazil, France, Germany, India, Japan, Nigeria, the United Kingdom, and the United States."
      />

      <ChartCard
        eyebrow="Eight selected countries · WJP Factor 5"
        title="Security is one dimension, not the whole story"
        description="Order and Security is strongest in some of the same countries that score well overall, but the lines do not match perfectly. That difference is the point."
        spec={securityPanelSpec}
        data={governanceSecurityPanelSeries.map((point) => ({
          entity: point.entity,
          year: point.year,
          edition: point.edition,
          value: point.value,
        }))}
        columns={[
          { key: 'entity', label: 'Country' },
          { key: 'year', label: 'Edition year' },
          { key: 'edition', label: 'WJP edition' },
          { key: 'value', label: 'Order and Security' },
        ]}
        sources={source}
        tone="future"
        definition="WJP Factor 5: absence of crime, civil conflict, and violent redress, on the index’s 0–1 scale."
      />

      <section className="method-note method-note--future">
        <p className="eyebrow">Read the evidence carefully</p>
        <h2>A score is a signal, not a verdict.</h2>
        <p>
          The WJP combines household experience and expert assessment. Country coverage changes
          across editions, and a country median gives each reporting country one vote. The charts
          show institutional conditions captured by this index; they do not forecast shocks or
          explain why a score moved.
        </p>
      </section>

      <section className="sources-section">
        <p className="eyebrow">Sources and definitions</p>
        <h2>Where the governance signal comes from</h2>
        <SourceList sources={source} />
      </section>
    </StoryFrame>
  );
}

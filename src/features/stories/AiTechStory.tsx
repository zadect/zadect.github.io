import type { TopLevelSpec } from 'vega-lite';
import { ChartCard } from '../../components/ChartCard';
import { ComparisonCard } from '../../components/ComparisonCard';
import { SourceList } from '../../components/SourceList';
import { StudyContext } from '../../components/StudyContext';
import { StoryFrame } from '../../components/StoryFrame';
import type { StoryDefinition } from '../../content/stories';
import { getSources } from '../../content/sources';
import {
  aiCountryEndpointSeries,
  aiEnterpriseSizeSeries,
  aiEuAdoptionChartSeries,
  aiEuAdoptionSeries,
} from './data';

interface AiTechStoryProps {
  story: StoryDefinition;
}

const aiTimelineSpec: TopLevelSpec = {
  $schema: 'https://vega.github.io/schema/vega-lite/v6.json',
  width: 'container',
  height: 340,
  data: { name: 'series' },
  mark: { type: 'line', point: { filled: true, size: 42 }, strokeWidth: 3 },
  encoding: {
    x: {
      field: 'year',
      type: 'quantitative',
      title: 'Year',
      scale: { domain: [2021, 2025] },
      axis: { format: 'd', values: [2021, 2022, 2023, 2024, 2025] },
    },
    y: {
      field: 'value',
      type: 'quantitative',
      title: 'Enterprises using AI (%)',
      scale: { domain: [0, 25] },
    },
    color: { value: '#6b5a98' },
    tooltip: [
      { field: 'year', type: 'quantitative', title: 'Year', format: 'd' },
      { field: 'value', type: 'quantitative', title: 'Enterprises using AI (%)', format: '.2f' },
      { field: 'status', type: 'nominal', title: 'Data status' },
    ],
  },
};

const aiCountryEndpointSpec: TopLevelSpec = {
  $schema: 'https://vega.github.io/schema/vega-lite/v6.json',
  width: 'container',
  height: 360,
  data: { name: 'series' },
  mark: { type: 'line', point: { filled: true, size: 38 }, strokeWidth: 2.5 },
  encoding: {
    x: {
      field: 'year',
      type: 'quantitative',
      title: 'Reported year',
      scale: { domain: [2021, 2025] },
      axis: { format: 'd', values: [2021, 2025] },
    },
    y: {
      field: 'value',
      type: 'quantitative',
      title: 'Enterprises using AI (%)',
      scale: { domain: [0, 50] },
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
      { field: 'value', type: 'quantitative', title: 'Enterprises using AI (%)', format: '.2f' },
    ],
  },
};

const aiSizeSpec: TopLevelSpec = {
  $schema: 'https://vega.github.io/schema/vega-lite/v6.json',
  width: 'container',
  height: 340,
  data: { name: 'series' },
  mark: { type: 'bar', cornerRadiusTopLeft: 4, cornerRadiusTopRight: 4 },
  encoding: {
    x: {
      field: 'sizeLabel',
      type: 'nominal',
      title: 'Enterprise size',
      sort: ['10–49 employees', '50–249 employees', '250+ employees'],
    },
    y: {
      field: 'value',
      type: 'quantitative',
      title: 'Enterprises using AI (%)',
      scale: { domain: [0, 60] },
    },
    color: { value: '#6b5a98' },
    tooltip: [
      { field: 'sizeLabel', type: 'nominal', title: 'Enterprise size' },
      { field: 'value', type: 'quantitative', title: 'Enterprises using AI (%)', format: '.2f' },
    ],
  },
};

const sizeLabels: Record<string, string> = {
  '10-49': '10–49 employees',
  '50-249': '50–249 employees',
  GE250: '250+ employees',
};

export function AiTechStory({ story }: AiTechStoryProps) {
  if (!story.comparison) {
    throw new Error('AI & Tech story is missing its comparison definition');
  }

  const latestEu = aiEuAdoptionSeries.at(-1);
  const smallest = aiEnterpriseSizeSeries.find((point) => point.sizeEmp === '10-49');
  const largest = aiEnterpriseSizeSeries.find((point) => point.sizeEmp === 'GE250');
  const storySources = getSources(['eurostat-ai-adoption']);
  const contextSources = getSources(['ilo-ai-exposure-context', 'uk-ai-scenarios-context']);
  const allSources = [...storySources, ...contextSources];

  return (
    <StoryFrame story={story}>
      <section className="story-lede">
        <p className="lede">
          AI is moving from experiment to enterprise practice. The cleanest comparable signal we
          have here is adoption — not what adoption will do to work.
        </p>
        <div className="stat-grid">
          <div className="stat-card">
            <span className="stat-card__value">{latestEu?.value.toFixed(1)}%</span>
            <span className="stat-card__label">
              EU-27 enterprises with 10+ employees reporting at least one AI technology in{' '}
              {latestEu?.year}
            </span>
          </div>
          <div className="stat-card">
            <span className="stat-card__value">
              {smallest && largest ? `${(largest.value / smallest.value).toFixed(1)}×` : '—'}
            </span>
            <span className="stat-card__label">
              2025 adoption gap between enterprises with 250+ employees and those with 10–49
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
        eyebrow="EU-27 enterprise adoption · Eurostat"
        title="Adoption rose, but the series has a real gap"
        description="Eurostat reports comparable observations for 2021, 2023, 2024, and 2025. The empty 2022 position is deliberate: it is not interpolated."
        spec={aiTimelineSpec}
        data={aiEuAdoptionChartSeries.map((point) => ({
          year: point.year,
          value: point.value,
          status: point.status === 'reported' ? 'Reported' : 'Not reported',
        }))}
        columns={[
          { key: 'year', label: 'Year' },
          { key: 'value', label: 'Enterprises using AI (%)' },
          { key: 'status', label: 'Data status' },
        ]}
        sources={storySources}
        tone="future"
        definition="Percentage of enterprises with 10+ employees using at least one listed AI technology."
      />

      <ChartCard
        eyebrow="Selected countries · Eurostat"
        title="The starting points and pace are different"
        description="This endpoint view compares the same eight countries in the first and latest reported years. It shows adoption spread, not a league table or a causal explanation."
        spec={aiCountryEndpointSpec}
        data={aiCountryEndpointSeries.map((point) => ({
          country: point.country,
          year: point.year,
          value: point.value,
        }))}
        columns={[
          { key: 'country', label: 'Country' },
          { key: 'year', label: 'Year' },
          { key: 'value', label: 'Enterprises using AI (%)' },
        ]}
        sources={storySources}
        tone="future"
        definition="The same enterprise-adoption percentage, shown only at 2021 and 2025 endpoints for the selected country panel."
      />

      <ChartCard
        eyebrow="EU-27 by enterprise size · Eurostat"
        title="Scale still matters"
        description="In 2025, the largest enterprises reported AI use much more often than the smallest enterprises in the same covered activity scope."
        spec={aiSizeSpec}
        data={aiEnterpriseSizeSeries.map((point) => ({
          sizeLabel: sizeLabels[point.sizeEmp],
          value: point.value,
        }))}
        columns={[
          { key: 'sizeLabel', label: 'Enterprise size' },
          { key: 'value', label: 'Enterprises using AI (%)' },
        ]}
        sources={storySources}
        tone="future"
        definition="Percentage of enterprises using at least one listed AI technology, split by Eurostat enterprise-size class."
      />

      <section className="method-note method-note--future">
        <p className="eyebrow">Read the evidence carefully</p>
        <h2>Adoption is the beginning of the story, not its conclusion.</h2>
        <p>
          The survey asks whether an enterprise uses at least one listed AI technology. It does
          not tell us how deeply the tool is embedded, which workers use it, whether tasks are
          automated or supported, or whether outcomes improved. Those questions need different
          measures.
        </p>
      </section>

      <StudyContext
        items={[
          {
            title: 'Generative AI and Jobs: A Refined Global Index of Occupational Exposure',
            authorYear: 'ILO Working Paper 140 · 2025',
            purpose:
              'Estimate which occupational tasks are exposed to generative AI and where exposure is concentrated.',
            method:
              'Combines task-level occupational data with worker assessment and expert review across a global occupational framework.',
            limit:
              'Exposure describes potential task change; it is not a forecast of job losses and is not the enterprise-adoption measure above.',
            source: contextSources[0],
          },
          {
            title: 'AI Scenarios 2030',
            authorYear: 'UK Government Office for Science · 2026',
            purpose: 'Stress-test policy against several plausible ways AI could develop by 2030.',
            method:
              'Uses expert-informed scenario planning to explore uncertainty across society, the economy, security, and geopolitics.',
            limit:
              'Scenarios are not predictions and do not extend or replace the observed Eurostat series.',
            source: contextSources[1],
          },
        ]}
      />

      <section className="sources-section">
        <p className="eyebrow">Sources and definitions</p>
        <h2>Where the adoption evidence and wider research come from</h2>
        <SourceList sources={allSources} />
      </section>
    </StoryFrame>
  );
}

import type { TopLevelSpec } from 'vega-lite';
import { ChartCard } from '../../components/ChartCard';
import { ComparisonCard } from '../../components/ComparisonCard';
import { SourceList } from '../../components/SourceList';
import { StoryFrame } from '../../components/StoryFrame';
import type { StoryDefinition } from '../../content/stories';
import { getSources } from '../../content/sources';
import {
  electricitySanitationPanelSeries,
  electricitySanitationWorldSeries,
} from './data';

interface ElectricitySanitationStoryProps {
  story: StoryDefinition;
}

const measureLabels = {
  electricity: 'Electricity access',
  sanitation: 'Basic sanitation use',
} as const;

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
      axis: { format: 'd', tickCount: 8 },
    },
    y: {
      field: 'value',
      type: 'quantitative',
      title: 'Population covered (%)',
      scale: { domain: [0, 100] },
    },
    color: {
      field: 'measure',
      type: 'nominal',
      title: 'Measure',
      scale: { domain: [measureLabels.electricity, measureLabels.sanitation], range: ['#2d746a', '#b27a4b'] },
    },
    detail: { field: 'measure' },
    tooltip: [
      { field: 'measure', type: 'nominal', title: 'Measure' },
      { field: 'year', type: 'quantitative', title: 'Year', format: 'd' },
      { field: 'value', type: 'quantitative', title: 'Population covered (%)', format: '.1f' },
    ],
  },
};

const panelSpec: TopLevelSpec = {
  $schema: 'https://vega.github.io/schema/vega-lite/v6.json',
  width: 'container',
  height: 260,
  data: { name: 'series' },
  mark: { type: 'line', point: { filled: true, size: 38 }, strokeWidth: 2.5 },
  encoding: {
    x: {
      field: 'year',
      type: 'quantitative',
      title: 'Checkpoint year',
      axis: { format: 'd', values: [2000, 2010, 2024] },
    },
    y: {
      field: 'value',
      type: 'quantitative',
      title: 'Population covered (%)',
      scale: { domain: [0, 100] },
    },
    row: {
      field: 'measure',
      type: 'nominal',
      title: 'Service',
      sort: [measureLabels.electricity, measureLabels.sanitation],
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
      { field: 'measure', type: 'nominal', title: 'Measure' },
      { field: 'year', type: 'quantitative', title: 'Year', format: 'd' },
      { field: 'value', type: 'quantitative', title: 'Population covered (%)', format: '.1f' },
    ],
  },
  resolve: { scale: { y: 'shared' } },
};

export function ElectricitySanitationStory({ story }: ElectricitySanitationStoryProps) {
  if (!story.comparison) {
    throw new Error('Electricity and sanitation story is missing its comparison definition');
  }

  const electricityWorld = electricitySanitationWorldSeries.filter(
    (point) => point.measure === 'electricity',
  );
  const sanitationWorld = electricitySanitationWorldSeries.filter(
    (point) => point.measure === 'sanitation',
  );
  const electricityFirst = electricityWorld[0];
  const electricityLast = electricityWorld.at(-1);
  const sanitationFirst = sanitationWorld[0];
  const sanitationLast = sanitationWorld.at(-1);
  const nigeriaLatest = electricitySanitationPanelSeries.filter(
    (point) => point.entity === 'Nigeria' && point.year === 2024,
  );
  const nigeriaElectricity = nigeriaLatest.find((point) => point.measure === 'electricity');
  const nigeriaSanitation = nigeriaLatest.find((point) => point.measure === 'sanitation');

  if (
    !electricityFirst ||
    !electricityLast ||
    !sanitationFirst ||
    !sanitationLast ||
    !nigeriaElectricity ||
    !nigeriaSanitation
  ) {
    throw new Error('Electricity and sanitation story data is incomplete');
  }

  const worldChartData = electricitySanitationWorldSeries.map((point) => ({
    measure: measureLabels[point.measure],
    year: point.year,
    value: point.value,
  }));
  const panelChartData = electricitySanitationPanelSeries.map((point) => ({
    country: point.entity,
    measure: measureLabels[point.measure],
    year: point.year,
    value: point.value,
  }));
  const sources = getSources(['world-bank-electricity', 'who-unicef-sanitation']);

  return (
    <StoryFrame story={story}>
      <section className="story-lede">
        <p className="lede">
          Electricity and a private, improved toilet change the shape of an ordinary day. The
          world has moved forward on both — but the gap between basic services is still a lived
          divide.
        </p>
        <div className="stat-grid">
          <div className="stat-card">
            <span className="stat-card__value">
              {electricityFirst.value.toFixed(1)}% → {electricityLast.value.toFixed(1)}%
            </span>
            <span className="stat-card__label">
              global electricity access from {electricityFirst.year} to {electricityLast.year}
            </span>
          </div>
          <div className="stat-card">
            <span className="stat-card__value">
              {sanitationFirst.value.toFixed(1)}% → {sanitationLast.value.toFixed(1)}%
            </span>
            <span className="stat-card__label">
              global use of at least basic sanitation from {sanitationFirst.year} to{' '}
              {sanitationLast.year}
            </span>
          </div>
          <div className="stat-card">
            <span className="stat-card__value">
              {(nigeriaElectricity.value - nigeriaSanitation.value).toFixed(1)} points
            </span>
            <span className="stat-card__label">
              2024 Nigeria gap between electricity access and basic sanitation use
            </span>
          </div>
        </div>
      </section>

      <ComparisonCard title={story.comparison.title} fields={story.comparison.fields} />

      <ChartCard
        eyebrow="World · World Bank + WHO/UNICEF JMP"
        title="Basic services spread across the world"
        description="The two lines use their longest comparable world series. Electricity access is measured from 1998 here; sanitation use begins in 2000, so the lines are not forced onto a shared starting year."
        spec={worldSpec}
        data={worldChartData}
        columns={[
          { key: 'measure', label: 'Measure' },
          { key: 'year', label: 'Year' },
          { key: 'value', label: 'Population covered (%)' },
        ]}
        sources={sources}
        definition="Electricity access and use of at least basic sanitation are separate population shares; neither is a measure of service quality or reliability."
      />

      <ChartCard
        eyebrow="Selected countries · 2000, 2010, and 2024"
        title="The global average hides the distance still to travel"
        description="Each facet keeps the same percentage scale, while country colours show how different starting points and end points can be."
        spec={panelSpec}
        data={panelChartData}
        columns={[
          { key: 'country', label: 'Country' },
          { key: 'measure', label: 'Measure' },
          { key: 'year', label: 'Checkpoint year' },
          { key: 'value', label: 'Population covered (%)' },
        ]}
        sources={sources}
        definition="Country checkpoints from the same source series; they are not a ranking of service quality, affordability, or reliability."
      />

      <section className="method-note">
        <p className="eyebrow">Read the evidence carefully</p>
        <h2>Access is a beginning, not the whole service.</h2>
        <p>
          The electricity measure means that a basic source can provide light and charge a phone
          or radio for a limited period; it does not say that supply is affordable, reliable, or
          clean. Basic sanitation means an improved facility that is not shared with another
          household; it is not the same as safely managed sanitation. Both sources use surveys,
          censuses, administrative data, and modelling where reporting is incomplete.
        </p>
      </section>

      <section className="sources-section">
        <p className="eyebrow">Sources and definitions</p>
        <h2>Where the service estimates come from</h2>
        <SourceList sources={sources} />
      </section>
    </StoryFrame>
  );
}

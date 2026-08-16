import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { ChartCard } from './ChartCard';
import type { TopLevelSpec } from 'vega-lite';
import { getSources } from '../content/sources';

vi.mock('react-vega', () => ({
  VegaEmbed: () => <div data-testid="vega-chart" />,
}));

const spec: TopLevelSpec = {
  $schema: 'https://vega.github.io/schema/vega-lite/v6.json',
  data: { values: [] },
  mark: 'line',
};

describe('ChartCard', () => {
  it('exposes the chart tone and definition to the accessible presentation', () => {
    render(
      <ChartCard
        eyebrow="Bad signal"
        title="A dark chart"
        description="Description"
        definition="A clearly defined measure."
        spec={spec}
        data={[{ year: 2024, value: 10 }]}
        columns={[
          { key: 'year', label: 'Year' },
          { key: 'value', label: 'Value' },
        ]}
        sources={getSources(['epi-ceo-pay'])}
        tone="bad"
      />,
    );

    expect(screen.getByRole('article')).toHaveAttribute('data-chart-tone', 'bad');
    expect(screen.getByText('A clearly defined measure.')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /CEO-to-worker compensation ratio/i })).toBeInTheDocument();
  });

  it('supports the Future chart treatment', () => {
    render(
      <ChartCard
        eyebrow="Future signal"
        title="A lilac chart"
        description="Description"
        spec={spec}
        data={[{ year: 2024, value: 10 }]}
        columns={[
          { key: 'year', label: 'Year' },
          { key: 'value', label: 'Value' },
        ]}
        sources={getSources(['eurostat-ai-adoption'])}
        tone="future"
      />,
    );

    expect(screen.getByRole('article')).toHaveAttribute('data-chart-tone', 'future');
  });
});

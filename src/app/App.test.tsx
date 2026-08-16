import { render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { App } from './App';

vi.mock('react-vega', () => ({
  VegaEmbed: () => <div data-testid="vega-chart" />,
}));

afterEach(() => {
  window.location.hash = '';
});

describe('app routes', () => {
  it('renders the overview with both categories', () => {
    render(<App />);
    expect(screen.getByRole('heading', { name: /where is humanity heading/i })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /signals of human progress/i })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /signals we cannot look away from/i })).toBeInTheDocument();
  });

  it('renders a published story and a coming-soon story from hash routes', () => {
    window.location.hash = '#/good/world-hunger';
    render(<App />);
    expect(screen.getByRole('heading', { name: /fewer people are undernourished/i })).toBeInTheDocument();

    window.location.hash = '#/good/literacy';
    render(<App />);
    expect(screen.getByText('Coming next')).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Literacy' })).toBeInTheDocument();
  });

  it('renders the CEO definitions, absolute views, and deferred country context', () => {
    window.location.hash = '#/bad/ceo-pay-gap';
    render(<App />);

    expect(screen.getByRole('heading', { name: /a defined contrast/i })).toBeInTheDocument();
    expect(screen.getAllByText(/average annual compensation for CEOs/i)).not.toHaveLength(0);
    expect(screen.getByRole('heading', { name: /CEO compensation, measured in dollars/i })).toBeInTheDocument();
    expect(
      screen.getByRole('heading', { name: /country figures need matching definitions/i }),
    ).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Germany' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'France' })).toBeInTheDocument();
  });
});

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
  it('renders the overview with all three categories', () => {
    render(<App />);
    expect(screen.getByRole('heading', { name: /where is humanity heading/i })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /signals of human progress/i })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /signals we cannot look away from/i })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /questions for the years ahead/i })).toBeInTheDocument();
  });

  it('renders published literacy and democracy stories from hash routes', () => {
    window.location.hash = '#/good/world-hunger';
    render(<App />);
    expect(screen.getByRole('heading', { name: /fewer people are undernourished/i })).toBeInTheDocument();

    window.location.hash = '#/good/literacy';
    render(<App />);
    expect(screen.getByRole('heading', { name: 'Literacy' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /literacy rose across a broad panel/i })).toBeInTheDocument();
    expect(screen.getByText(/World Bank\/UNESCO cross-check found the same reporting gap/i)).toBeInTheDocument();

    window.location.hash = '#/bad/democratic-backsliding';
    render(<App />);
    expect(screen.getByRole('heading', { name: 'Democratic backsliding' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /where the index fell/i })).toBeInTheDocument();
  });

  it('links Good, Bad, and Future navigation to homepage sections', () => {
    render(<App />);
    expect(screen.getByRole('link', { name: 'Good' })).toHaveAttribute('href', '#/?section=good');
    expect(screen.getByRole('link', { name: 'Bad' })).toHaveAttribute('href', '#/?section=bad');
    expect(screen.getByRole('link', { name: 'Future' })).toHaveAttribute(
      'href',
      '#/?section=future',
    );
    expect(screen.getByRole('region', { name: /signals of human progress/i })).toHaveAttribute(
      'id',
      'good-section',
    );
    expect(screen.getByRole('region', { name: /signals we cannot look away from/i })).toHaveAttribute(
      'id',
      'bad-section',
    );
    expect(screen.getByRole('region', { name: /questions for the years ahead/i })).toHaveAttribute(
      'id',
      'future-section',
    );
  });

  it('renders Future stories as source-directed placeholders', () => {
    window.location.hash = '#/future/tech-and-ai';
    render(<App />);

    expect(screen.getByRole('heading', { name: 'Tech & AI' })).toBeInTheDocument();
    expect(screen.getByText('Future signal')).toBeInTheDocument();
    expect(screen.getByText(/Firm AI adoption, AI tools by role or task/i)).toBeInTheDocument();
    expect(screen.getByText(/OECD AI Policy Observatory/i)).toBeInTheDocument();
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

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

  it('renders the published Women’s rights story', () => {
    window.location.hash = '#/good/womens-rights';
    render(<App />);

    expect(screen.getByRole('heading', { name: "Women's rights" })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /legal baseline has risen/i })).toBeInTheDocument();
    expect(screen.getByText(/formal legal provisions, not enforcement/i)).toBeInTheDocument();
  });

  it('renders the published child mortality story', () => {
    window.location.hash = '#/good/child-mortality';
    render(<App />);

    expect(screen.getByRole('heading', { name: 'Child mortality' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /global risk fell across two centuries/i })).toBeInTheDocument();
    expect(screen.getByText(/estimated probability that a newborn dies/i)).toBeInTheDocument();
  });

  it('renders the published life expectancy story', () => {
    window.location.hash = '#/good/life-expectancy';
    render(<App />);

    expect(screen.getByRole('heading', { name: 'Life expectancy' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /average human life became much longer/i })).toBeInTheDocument();
    expect(screen.getAllByText(/period life expectancy at birth/i)).not.toHaveLength(0);
  });

  it('renders the published vaccination coverage story', () => {
    window.location.hash = '#/good/vaccination-coverage';
    render(<App />);

    expect(screen.getByRole('heading', { name: 'Vaccination coverage' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /high vaccination baseline/i })).toBeInTheDocument();
    expect(
      screen.getAllByText(/share of one-year-olds who received the third dose/i),
    ).not.toHaveLength(0);
  });

  it('renders the published electricity and sanitation story', () => {
    window.location.hash = '#/good/electricity-and-sanitation';
    render(<App />);

    expect(screen.getByRole('heading', { name: 'Electricity and sanitation' })).toBeInTheDocument();
    expect(
      screen.getByRole('heading', { name: /basic services spread across the world/i }),
    ).toBeInTheDocument();
    expect(screen.getByText(/reliability, service quality/i)).toBeInTheDocument();
  });

  it('renders the published extreme poverty story', () => {
    window.location.hash = '#/good/extreme-poverty';
    render(<App />);

    expect(screen.getByRole('heading', { name: 'Extreme poverty' })).toBeInTheDocument();
    expect(
      screen.getByRole('heading', { name: /global poverty line moved downward/i }),
    ).toBeInTheDocument();
    expect(screen.getByText(/income data in some countries with consumption data/i)).toBeInTheDocument();
  });

  it('renders the published climate change story', () => {
    window.location.hash = '#/bad/climate-change';
    render(<App />);

    expect(screen.getByRole('heading', { name: 'Climate change' })).toBeInTheDocument();
    expect(
      screen.getByRole('heading', { name: /annual signal keeps moving upward/i }),
    ).toBeInTheDocument();
    expect(screen.getByText(/global average hides regional and seasonal differences/i)).toBeInTheDocument();
  });

  it('renders the published wars and conflict story', () => {
    window.location.hash = '#/bad/wars-and-conflict';
    render(<App />);

    expect(screen.getByRole('heading', { name: 'Wars and conflict' })).toBeInTheDocument();
    expect(
      screen.getByRole('heading', { name: /deaths can spike when conflicts intensify/i }),
    ).toBeInTheDocument();
    expect(screen.getAllByText(/deaths from disease, hunger, displacement/i)).not.toHaveLength(0);
  });

  it('renders the published rich and poor story', () => {
    window.location.hash = '#/bad/inequality-by-country';
    render(<App />);

    expect(screen.getByRole('heading', { name: 'Rich and poor' })).toBeInTheDocument();
    expect(
      screen.getByRole('heading', { name: /inequality does not move in one direction/i }),
    ).toBeInTheDocument();
    expect(screen.getByText(/survey redesigns can create breaks/i)).toBeInTheDocument();
  });

  it('renders the published biodiversity loss story', () => {
    window.location.hash = '#/bad/biodiversity-loss';
    render(<App />);

    expect(screen.getByRole('heading', { name: 'Biodiversity loss' })).toBeInTheDocument();
    expect(
      screen.getByRole('heading', { name: /monitored-population signal fell sharply/i }),
    ).toBeInTheDocument();
    expect(screen.getByText(/not a headcount of every wild animal/i)).toBeInTheDocument();
  });

  it('renders the published forced displacement story', () => {
    window.location.hash = '#/bad/forced-displacement';
    render(<App />);

    expect(screen.getByRole('heading', { name: 'Forced displacement' })).toBeInTheDocument();
    expect(
      screen.getByRole('heading', { name: /internal displacement now dominates/i }),
    ).toBeInTheDocument();
    expect(screen.getByText(/headline number depends on the accounting boundary/i)).toBeInTheDocument();
  });

  it('renders the published air pollution story', () => {
    window.location.hash = '#/bad/air-pollution';
    render(<App />);

    expect(screen.getByRole('heading', { name: 'Air pollution' })).toBeInTheDocument();
    expect(
      screen.getByRole('heading', { name: /global average remains far above/i }),
    ).toBeInTheDocument();
    expect(screen.getByText(/modeled exposure estimates, not direct monitor readings/i)).toBeInTheDocument();
  });

  it('renders the published employment and skills Future story', () => {
    window.location.hash = '#/future/employment-work-and-skills';
    render(<App />);

    expect(screen.getByRole('heading', { name: 'Employment, Work & Skills' })).toBeInTheDocument();
    expect(
      screen.getByRole('heading', { name: /global work rate dipped/i }),
    ).toBeInTheDocument();
    expect(screen.getByText(/not a measure of job quality/i)).toBeInTheDocument();
  });

  it('renders the published wealth distribution Future story', () => {
    window.location.hash = '#/future/wealth-distribution-and-inequality';
    render(<App />);

    expect(
      screen.getByRole('heading', { name: 'Wealth Distribution & Inequality' }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('heading', { name: /global line is not a one-way climb/i }),
    ).toBeInTheDocument();
    expect(screen.getByText(/not the whole distribution/i)).toBeInTheDocument();
  });

  it('renders the published economic growth and debt Future story', () => {
    window.location.hash = '#/future/economic-growth-debt-and-public-finance';
    render(<App />);

    expect(
      screen.getByRole('heading', { name: 'Economic Growth, Debt & Public Finance' }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('heading', { name: /growth has a rhythm of shocks/i }),
    ).toBeInTheDocument();
    expect(screen.getByText(/not a complete balance sheet/i)).toBeInTheDocument();
  });

  it('renders the published inflation, prices, and energy Future story', () => {
    window.location.hash = '#/future/inflation-prices-and-energy';
    render(<App />);

    expect(
      screen.getByRole('heading', { name: 'Inflation, Prices & Energy' }),
    ).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /inflation arrives in waves/i })).toBeInTheDocument();
    expect(screen.getByText(/not a single forecast/i)).toBeInTheDocument();
  });

  it('renders the published demographics and migration Future story', () => {
    window.location.hash = '#/future/demographics-and-migration';
    render(<App />);

    expect(screen.getByRole('heading', { name: 'Demographics & Migration' })).toBeInTheDocument();
    expect(
      screen.getByRole('heading', { name: /the world gets older on a long arc/i }),
    ).toBeInTheDocument();
    expect(screen.getByText(/population structure is not destiny/i)).toBeInTheDocument();
  });

  it('renders the published health, longevity, and human capital Future story', () => {
    window.location.hash = '#/future/health-longevity-and-human-capital';
    render(<App />);

    expect(
      screen.getByRole('heading', { name: 'Health, Longevity & Human Capital' }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('heading', { name: /healthy years rose/i }),
    ).toBeInTheDocument();
    expect(screen.getByText(/more spending is not a guarantee/i)).toBeInTheDocument();
  });

  it('renders the published governance, risk, and security Future story', () => {
    window.location.hash = '#/future/governance-risk-and-security';
    render(<App />);

    expect(
      screen.getByRole('heading', { name: 'Governance, Risk & Security' }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('heading', { name: /country median barely moves/i }),
    ).toBeInTheDocument();
    expect(screen.getByText(/score is a signal, not a verdict/i)).toBeInTheDocument();
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

  it('renders the published AI and housing Future stories', () => {
    window.location.hash = '#/future/tech-and-ai';
    render(<App />);

    expect(screen.getByRole('heading', { name: 'AI & Tech' })).toBeInTheDocument();
    expect(screen.getByText('Future signal')).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /adoption rose/i })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /useful studies, kept out/i })).toBeInTheDocument();

    window.location.hash = '#/future/housing-cities-and-infrastructure';
    render(<App />);
    expect(screen.getByRole('heading', { name: 'Housing, Cities & Infrastructure' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /prices and incomes did not move together/i })).toBeInTheDocument();
    expect(screen.getByText(/does not measure rents/i)).toBeInTheDocument();
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

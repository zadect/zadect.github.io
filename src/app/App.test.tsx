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
    expect(
      screen.getByRole('heading', { name: /conditions shaping the next decades/i }),
    ).toBeInTheDocument();
    expect(
      screen.queryByRole('heading', {
        name: /humanity is changing in more than one direction at once/i,
      }),
    ).not.toBeInTheDocument();
    expect(screen.getByText('By: zadect; update: 2026-08-16')).toBeInTheDocument();
    expect(screen.getByRole('navigation', { name: 'Story category navigation' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /the good 8/i })).toHaveAttribute(
      'aria-current',
      'location',
    );
    expect(screen.getByText(/Prevalence of undernourishment and food availability/i)).toBeInTheDocument();
  });

  it('uses the same attribution on story pages', () => {
    window.location.hash = '#/good/world-hunger';
    render(<App />);

    expect(screen.getByText('By: zadect; update: 2026-08-16')).toBeInTheDocument();
  });

  it('renders published literacy and democracy stories from hash routes', () => {
    window.location.hash = '#/good/world-hunger';
    render(<App />);
    expect(screen.getByRole('heading', { name: /fewer people are undernourished/i })).toBeInTheDocument();

    window.location.hash = '#/good/literacy';
    render(<App />);
    expect(screen.getByRole('heading', { name: 'Adult literacy' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /literacy rose across a broad panel/i })).toBeInTheDocument();
    expect(screen.getByText(/World Bank\/UNESCO cross-check found the same reporting gap/i)).toBeInTheDocument();

    window.location.hash = '#/bad/democratic-backsliding';
    render(<App />);
    expect(screen.getByRole('heading', { name: 'Democratic backsliding' })).toBeInTheDocument();
    expect(
      screen.getByRole('heading', { name: /five-year change in the liberal democracy index/i }),
    ).toBeInTheDocument();
  });

  it('renders the published Women’s rights story', () => {
    window.location.hash = '#/good/womens-rights';
    render(<App />);

    expect(screen.getByRole('heading', { name: 'Legal equality for women' })).toBeInTheDocument();
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

    expect(screen.getByRole('heading', { name: 'DTP3 vaccination coverage' })).toBeInTheDocument();
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
      screen.getByRole('heading', { name: /global share below \$3\/day fell/i }),
    ).toBeInTheDocument();
    expect(screen.getByText(/income data in some countries with consumption data/i)).toBeInTheDocument();
  });

  it('renders the published climate change story', () => {
    window.location.hash = '#/bad/climate-change';
    render(<App />);

    expect(screen.getByRole('heading', { name: 'Climate change' })).toBeInTheDocument();
    expect(
      screen.getByRole('heading', { name: /annual anomalies vary around a warmer baseline/i }),
    ).toBeInTheDocument();
    expect(screen.getByText(/global average hides regional and seasonal differences/i)).toBeInTheDocument();
  });

  it('renders the published wars and conflict story', () => {
    window.location.hash = '#/bad/wars-and-conflict';
    render(<App />);

    expect(screen.getByRole('heading', { name: 'Wars and conflict' })).toBeInTheDocument();
    expect(
      screen.getByRole('heading', { name: /battle-related deaths in state-based conflicts/i }),
    ).toBeInTheDocument();
    expect(screen.getAllByText(/deaths from disease, hunger, displacement/i)).not.toHaveLength(0);
  });

  it('renders the published rich and poor story', () => {
    window.location.hash = '#/bad/inequality-by-country';
    render(<App />);

    expect(screen.getByRole('heading', { name: 'Rich and poor' })).toBeInTheDocument();
    expect(
      screen.getByRole('heading', { name: /reported gini observations by country/i }),
    ).toBeInTheDocument();
    expect(screen.getByText(/survey redesigns can create breaks/i)).toBeInTheDocument();
  });

  it('renders the published biodiversity loss story', () => {
    window.location.hash = '#/bad/biodiversity-loss';
    render(<App />);

    expect(
      screen.getByRole('heading', { name: 'Monitored vertebrate populations' }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('heading', { name: /monitored vertebrate-population index fell sharply/i }),
    ).toBeInTheDocument();
    expect(screen.getAllByText(/monitored vertebrate populations/i)).not.toHaveLength(0);
  });

  it('renders the published forced displacement story', () => {
    window.location.hash = '#/bad/forced-displacement';
    render(<App />);

    expect(
      screen.getByRole('heading', { name: 'Refugees and forced displacement' }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('heading', { name: /four unhcr categories, shown separately/i }),
    ).toBeInTheDocument();
    expect(screen.getByText(/headline number depends on the accounting boundary/i)).toBeInTheDocument();
  });

  it('renders the published air pollution story', () => {
    window.location.hash = '#/bad/air-pollution';
    render(<App />);

    expect(screen.getByRole('heading', { name: 'Ambient PM2.5 exposure' })).toBeInTheDocument();
    expect(
      screen.getByRole('heading', { name: /global ambient pm2\.5 exposure remains above/i }),
    ).toBeInTheDocument();
    expect(screen.getByText(/modeled exposure estimates, not direct monitor readings/i)).toBeInTheDocument();
  });

  it('renders the published employment and skills Future story', () => {
    window.location.hash = '#/future/employment-work-and-skills';
    render(<App />);

    expect(screen.getByRole('heading', { name: 'Employment rates' })).toBeInTheDocument();
    expect(
      screen.getByRole('heading', { name: /global employment-to-population ratio/i }),
    ).toBeInTheDocument();
    expect(screen.getByText(/does not describe job quality/i)).toBeInTheDocument();
  });

  it('renders the published wealth distribution Future story', () => {
    window.location.hash = '#/future/wealth-distribution-and-inequality';
    render(<App />);

    expect(
      screen.getByRole('heading', { name: 'Top 1% wealth share' }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('heading', { name: /global top 1% wealth-share observations/i }),
    ).toBeInTheDocument();
    expect(screen.getByText(/leaves most of the distribution unmeasured/i)).toBeInTheDocument();
  });

  it('renders the published economic growth and debt Future story', () => {
    window.location.hash = '#/future/economic-growth-debt-and-public-finance';
    render(<App />);

    expect(
      screen.getByRole('heading', { name: 'World growth and central-government debt' }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('heading', { name: /annual world gdp growth/i }),
    ).toBeInTheDocument();
    expect(screen.getByText(/do not establish fiscal sustainability/i)).toBeInTheDocument();
  });

  it('renders the published inflation, prices, and energy Future story', () => {
    window.location.hash = '#/future/inflation-prices-and-energy';
    render(<App />);

    expect(
      screen.getByRole('heading', { name: 'Inflation and renewable electricity' }),
    ).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /annual consumer inflation/i })).toBeInTheDocument();
    expect(
      screen.getByRole('heading', { name: /inflation and renewable electricity answer different questions/i }),
    ).toBeInTheDocument();
  });

  it('renders the published demographics and migration Future story', () => {
    window.location.hash = '#/future/demographics-and-migration';
    render(<App />);

    expect(screen.getByRole('heading', { name: 'Population age and migrant stock' })).toBeInTheDocument();
    expect(
      screen.getByRole('heading', { name: /observed median age and the un medium scenario/i }),
    ).toBeInTheDocument();
    expect(screen.getByText(/one un scenario does not settle future population change/i)).toBeInTheDocument();
  });

  it('renders the published health, longevity, and human capital Future story', () => {
    window.location.hash = '#/future/health-longevity-and-human-capital';
    render(<App />);

    expect(
      screen.getByRole('heading', { name: 'Healthy life expectancy and health spending' }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('heading', { name: /healthy life expectancy$/i }),
    ).toBeInTheDocument();
    expect(screen.getByText(/do not establish a spending effect/i)).toBeInTheDocument();
  });

  it('renders the published governance, risk, and security Future story', () => {
    window.location.hash = '#/future/governance-risk-and-security';
    render(<App />);

    expect(
      screen.getByRole('heading', { name: 'Rule of law and security' }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('heading', { name: /country median rule-of-law and security scores/i }),
    ).toBeInTheDocument();
    expect(screen.getByText(/selected institutional conditions/i)).toBeInTheDocument();
  });

  it('renders the published climate and environmental futures story', () => {
    window.location.hash = '#/future/climate-and-environmental-futures';
    render(<App />);

    expect(
      screen.getByRole('heading', { name: 'Historical fossil CO₂ emissions' }),
    ).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /annual territorial fossil co₂ emissions/i })).toBeInTheDocument();
    expect(
      screen.getByRole('heading', { name: /territorial emissions are one accounting boundary/i }),
    ).toBeInTheDocument();
  });

  it('renders the published capital markets and money flows story', () => {
    window.location.hash = '#/future/capital-markets-and-money-flows';
    render(<App />);

    expect(
      screen.getAllByRole('heading', { name: 'Private-sector credit relative to GDP' }),
    ).not.toHaveLength(0);
    expect(
      screen.getByRole('heading', { name: /credit-to-gdp ratio is a stock measure/i }),
    ).toBeInTheDocument();
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
    expect(
      screen.getByRole('region', { name: /conditions shaping the next decades/i }),
    ).toHaveAttribute(
      'id',
      'future-section',
    );
  });

  it('renders the published AI and housing Future stories', () => {
    window.location.hash = '#/future/tech-and-ai';
    render(<App />);

    expect(screen.getByRole('heading', { name: 'Firm AI adoption' })).toBeInTheDocument();
    expect(screen.getByText('Future baseline')).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /reported firm ai adoption/i })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /useful studies, kept out/i })).toBeInTheDocument();

    window.location.hash = '#/future/housing-cities-and-infrastructure';
    render(<App />);
    expect(screen.getByRole('heading', { name: 'Housing price-to-income' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /national house-price-to-income index/i })).toBeInTheDocument();
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

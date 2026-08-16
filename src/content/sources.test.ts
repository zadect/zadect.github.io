import { describe, expect, it } from 'vitest';
import { getSources, sources } from './sources';

describe('source catalogue', () => {
  it('gives every chart source a citation, version, coverage, and direct links', () => {
    for (const source of getSources([
      'fao-undernourishment',
      'fao-food-availability',
      'epi-ceo-pay',
      'epi-ceo-compensation',
      'wbl-index-owid',
      'child-mortality-long-run',
      'child-mortality-igme',
      'life-expectancy-owid',
      'who-unicef-dtp3',
      'world-bank-electricity',
      'who-unicef-sanitation',
      'world-bank-pip-extreme-poverty',
      'nasa-gistemp',
      'ucdp-conflict-deaths',
      'ucdp-conflict-counts',
      'unhcr-population-api',
      'world-bank-pip-gini',
      'wwf-zsl-living-planet-index',
      'gbd-pm25-owid',
      'ilo-employment-rate-owid',
      'wid-wealth-top-1-owid',
      'world-bank-annual-gdp-growth',
      'world-bank-public-debt',
      'imf-consumer-inflation-owid',
      'ember-renewable-electricity-owid',
      'un-wpp-median-age-owid',
      'un-desa-migrant-stock-owid',
      'eurostat-ai-adoption',
      'oecd-house-price-income',
    ])) {
      expect(source.citation).toBeTruthy();
      expect(source.version).toBeTruthy();
      expect(source.coverage).toBeTruthy();
      expect(source.methodologyHref).toMatch(/^https:\/\//);
      expect(source.dataHref).toMatch(/^https:\/\//);
      expect(source.localPath).toMatch(/^src\/data\//);
    }
  });

  it('keeps OWID processing and underlying publisher attribution distinct', () => {
    const hunger = sources.find((source) => source.id === 'fao-undernourishment');
    const calories = sources.find((source) => source.id === 'fao-food-availability');

    expect(hunger?.processor).toBe('Our World in Data');
    expect(hunger?.originalPublisher).toContain('Food and Agriculture');
    expect(calories?.note).toContain('other historical sources');
  });

  it('does not turn international research notes into plotted datasets', () => {
    for (const source of getSources([
      'uk-ceo-pay-context',
      'germany-ceo-pay-research',
      'france-ceo-pay-research',
    ])) {
      expect(source.coverage).toContain('not plotted');
      expect(source.localPath).toBeUndefined();
    }
  });

  it('marks Future research context separately from plotted data', () => {
    for (const source of getSources([
      'wbl-methodology',
      'ilo-ai-exposure-context',
      'uk-ai-scenarios-context',
      'imf-housing-affordability-context',
      'un-habitat-housing-context',
    ])) {
      expect(source.role).toBe('research-context');
      expect(source.coverage).toContain('context only');
      expect(source.localPath).toBeUndefined();
      expect(source.dataHref).toMatch(/^https:\/\//);
      expect(source.transformation).toContain('No ');
    }
  });

  it('keeps forced-displacement context separate from the plotted API extract', () => {
    const api = sources.find((source) => source.id === 'unhcr-population-api');
    const report = sources.find((source) => source.id === 'unhcr-global-trends-2024');

    expect(api?.originalPublisher).toContain('United Nations High Commissioner');
    expect(api?.localPath).toBe('src/data/forced-displacement.csv');
    expect(api?.transformation).toContain('no missing category is treated as an observed zero');
    expect(report?.role).toBe('research-context');
    expect(report?.coverage).toContain('context only');
    expect(report?.localPath).toBeUndefined();
  });

  it('keeps the PM2.5 guideline separate from modeled exposure data', () => {
    const exposure = sources.find((source) => source.id === 'gbd-pm25-owid');
    const guideline = sources.find((source) => source.id === 'who-air-quality-guidelines');

    expect(exposure?.processor).toBe('Our World in Data');
    expect(exposure?.originalPublisher).toContain('Global Burden of Disease Study 2023');
    expect(guideline?.role).toBe('research-context');
    expect(guideline?.coverage).toContain('context only');
    expect(guideline?.localPath).toBeUndefined();
  });

  it('keeps literacy, democracy, and map geometry provenance complete', () => {
    for (const source of getSources([
      'literacy-owid',
      'world-bank-literacy-coverage',
      'vdem-liberal-democracy',
      'world-atlas-geometry',
      'iso-country-codes',
    ])) {
      expect(source.citation).toBeTruthy();
      expect(source.version).toBeTruthy();
      expect(source.coverage).toBeTruthy();
      expect(source.unit).toBeTruthy();
      expect(source.transformation).toBeTruthy();
      expect(source.methodologyHref).toMatch(/^https:\/\//);
      expect(source.dataHref).toMatch(/^https:\/\//);
    }

    expect(sources.find((source) => source.id === 'literacy-owid')?.processor).toBe(
      'Our World in Data',
    );
    expect(sources.find((source) => source.id === 'literacy-owid')?.originalPublisher).toContain(
      'UNESCO',
    );
    expect(sources.find((source) => source.id === 'vdem-liberal-democracy')?.originalPublisher).toContain(
      'V-Dem',
    );
    expect(sources.find((source) => source.id === 'world-bank-literacy-coverage')?.coverage).toContain(
      'Coverage audit only',
    );
  });

  it('keeps inflation and energy attribution distinct', () => {
    const inflation = sources.find((source) => source.id === 'imf-consumer-inflation-owid');
    const energy = sources.find((source) => source.id === 'ember-renewable-electricity-owid');

    expect(inflation?.processor).toBe('Our World in Data');
    expect(inflation?.originalPublisher).toContain('International Monetary Fund');
    expect(energy?.processor).toBe('Our World in Data');
    expect(energy?.originalPublisher).toContain('Ember');
    expect(energy?.note).toContain('not a share of total energy use');
  });

  it('keeps demographic and migration attribution distinct', () => {
    const age = sources.find((source) => source.id === 'un-wpp-median-age-owid');
    const migration = sources.find((source) => source.id === 'un-desa-migrant-stock-owid');

    expect(age?.processor).toBe('Our World in Data');
    expect(age?.citation).toContain('World Population Prospects 2024');
    expect(age?.note).toContain('medium scenario');
    expect(migration?.processor).toBe('Our World in Data');
    expect(migration?.citation).toContain('International Migrant Stock 2024');
    expect(migration?.note).toContain('not an annual migration flow');
  });
});

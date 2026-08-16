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
      'world-bank-pip-gini',
      'wwf-zsl-living-planet-index',
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
});

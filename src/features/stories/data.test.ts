import { describe, expect, it } from 'vitest';
import {
  aiAdoptionSeries,
  aiCountryEndpointSeries,
  aiEnterpriseSizeSeries,
  aiEuAdoptionChartSeries,
  aiEuAdoptionSeries,
  ceoCompensationSeries,
  ceoPaySeries,
  childMortalityLongRunSeries,
  childMortalityPanelSeries,
  childMortalitySeries,
  democracyMapGeoJson,
  democracyMapSeries,
  democracySeries,
  electricitySanitationPanelSeries,
  electricitySanitationSeries,
  electricitySanitationWorldSeries,
  foodAvailabilitySeries,
  hungerSeries,
  housingBenchmarkSeries,
  housingPriceIncomeSeries,
  isoCountryCodes,
  literacyMapGeoJson,
  literacyMapSeries,
  literacySeries,
  lifeExpectancyLongRunSeries,
  lifeExpectancyPanelSeries,
  lifeExpectancySeries,
  womensRightsCountrySeries,
  womensRightsSeries,
  womensRightsWorldSeries,
  toCompensationChartSeries,
  toChartSeries,
  toWorkerCompensationChartSeries,
  vaccinationPanelSeries,
  vaccinationCoverageSeries,
  vaccinationWorldSeries,
} from './data';

describe('published story data', () => {
  it('keeps the direct hunger series and longer context series distinct', () => {
    expect(hungerSeries[0].year).toBe(2000);
    expect(foodAvailabilitySeries[0].year).toBe(1961);
    expect(foodAvailabilitySeries.length).toBeGreaterThan(hungerSeries.length);
  });

  it('keeps child mortality source series separate and within probability bounds', () => {
    expect(childMortalityLongRunSeries).toHaveLength(46);
    expect(childMortalityPanelSeries).toHaveLength(20);
    expect(childMortalitySeries[0]).toMatchObject({
      series: 'long-run',
      entity: 'World',
      year: 1800,
      rate: 42.8,
    });
    expect(childMortalityLongRunSeries.at(-1)).toMatchObject({ year: 2024, rate: 3.74 });
    expect(
      childMortalityPanelSeries.every((point) => [1965, 1985, 2005, 2024].includes(point.year)),
    ).toBe(true);
    expect(childMortalitySeries.every((point) => point.rate >= 0 && point.rate <= 100)).toBe(
      true,
    );
  });

  it('keeps life expectancy source series separate and within plausible bounds', () => {
    expect(lifeExpectancyLongRunSeries).toHaveLength(81);
    expect(lifeExpectancyPanelSeries).toHaveLength(20);
    expect(lifeExpectancyLongRunSeries[0]).toMatchObject({
      year: 1770,
      years: 28.5,
    });
    expect(lifeExpectancyLongRunSeries.at(-1)).toMatchObject({
      year: 2023,
      years: 73.1694,
    });
    expect(
      lifeExpectancyPanelSeries.every((point) => [1950, 1980, 2000, 2023].includes(point.year)),
    ).toBe(true);
    expect(lifeExpectancySeries.every((point) => point.years > 0 && point.years <= 100)).toBe(
      true,
    );
  });

  it('keeps vaccination coverage source series separate and within percentage bounds', () => {
    expect(vaccinationWorldSeries).toHaveLength(45);
    expect(vaccinationPanelSeries).toHaveLength(15);
    expect(vaccinationWorldSeries[0]).toMatchObject({ year: 1980, coverage: 20 });
    expect(vaccinationWorldSeries.at(-1)).toMatchObject({ year: 2024, coverage: 85 });
    expect(
      vaccinationPanelSeries.every((point) => [2000, 2019, 2024].includes(point.year)),
    ).toBe(true);
    expect(vaccinationCoverageSeries.every((point) => point.coverage >= 0 && point.coverage <= 100)).toBe(
      true,
    );
  });

  it('keeps electricity and sanitation definitions separate and within percentage bounds', () => {
    expect(electricitySanitationWorldSeries).toHaveLength(52);
    expect(electricitySanitationPanelSeries).toHaveLength(30);
    expect(electricitySanitationWorldSeries[0]).toMatchObject({
      measure: 'electricity',
      year: 1998,
      value: 73.200584,
    });
    expect(electricitySanitationWorldSeries.at(-1)).toMatchObject({
      measure: 'sanitation',
      year: 2024,
      value: 82.0083,
    });
    expect(
      electricitySanitationPanelSeries.every((point) => [2000, 2010, 2024].includes(point.year)),
    ).toBe(true);
    expect(
      new Set(electricitySanitationPanelSeries.map((point) => point.entity)).size,
    ).toBe(5);
    expect(electricitySanitationSeries.every((point) => point.value >= 0 && point.value <= 100)).toBe(
      true,
    );
  });

  it('contains the full CEO pay ratio range and both measures', () => {
    expect(ceoPaySeries[0].year).toBe(1965);
    expect(ceoPaySeries.at(-1)?.year).toBeGreaterThanOrEqual(2024);
    expect(ceoPaySeries.every((point) => point.realized > 0 && point.granted > 0)).toBe(true);
    expect(toChartSeries(ceoPaySeries)).toHaveLength(ceoPaySeries.length * 2);
  });

  it('keeps EPI absolute compensation gaps and the projected year explicit', () => {
    expect(ceoCompensationSeries[0]).toMatchObject({
      year: 1965,
      status: 'selected',
      workersIndustries: undefined,
    });
    expect(ceoCompensationSeries.at(-1)).toMatchObject({
      year: 2024,
      status: 'projected',
      workersIndustries: 84,
    });

    const aligned = ceoCompensationSeries.filter(
      (point) => point.workersIndustries !== undefined,
    );
    expect(aligned[0].year).toBe(1992);
    expect(toCompensationChartSeries(aligned)).toHaveLength(aligned.length * 2);
    expect(toWorkerCompensationChartSeries(aligned)).toHaveLength(aligned.length);
  });

  it('keeps the Eurostat AI reporting gap and declared enterprise scopes explicit', () => {
    expect(aiAdoptionSeries).toHaveLength(36);
    expect(aiEuAdoptionSeries.map((point) => point.year)).toEqual([2021, 2023, 2024, 2025]);
    expect(aiEuAdoptionChartSeries).toHaveLength(5);
    expect(aiEuAdoptionChartSeries[1]).toMatchObject({ year: 2022, status: 'not-reported' });
    expect(aiCountryEndpointSeries).toHaveLength(16);
    expect(aiEnterpriseSizeSeries).toHaveLength(3);
    expect(aiEnterpriseSizeSeries.find((point) => point.sizeEmp === 'GE250')?.value).toBe(55.03);
    expect(aiAdoptionSeries.every((point) => point.value >= 0 && point.value <= 100)).toBe(true);
  });

  it('keeps the OECD housing panel complete and its benchmark separate', () => {
    expect(housingPriceIncomeSeries).toHaveLength(200);
    expect(new Set(housingPriceIncomeSeries.map((point) => point.geo)).size).toBe(8);
    expect(
      housingPriceIncomeSeries.every((point) => point.year >= 2000 && point.year <= 2024),
    ).toBe(true);
    expect(
      new Set(
        housingPriceIncomeSeries
          .filter((point) => point.geo === 'CAN')
          .map((point) => point.year),
      ).size,
    ).toBe(25);
    expect(housingBenchmarkSeries).toHaveLength(8);
    expect(housingBenchmarkSeries.every((point) => point.year === 2024)).toBe(true);
    expect(housingBenchmarkSeries.find((point) => point.geo === 'CAN')?.value).toBeCloseTo(
      156.6927,
      3,
    );
  });

  it('keeps the women rights index within bounds and preserves its source checkpoints', () => {
    expect(womensRightsWorldSeries).toHaveLength(54);
    expect(womensRightsSeries).toHaveLength(86);
    expect(womensRightsCountrySeries).toHaveLength(32);
    expect(womensRightsWorldSeries[0]).toMatchObject({ year: 1970, value: 45.70395 });
    expect(womensRightsWorldSeries.at(-1)).toMatchObject({ year: 2023, value: 77.85526 });
    expect(
      womensRightsCountrySeries.every((point) => [1970, 1990, 2010, 2023].includes(point.year)),
    ).toBe(true);
    expect(womensRightsSeries.every((point) => point.value >= 0 && point.value <= 100)).toBe(
      true,
    );
  });

  it('keeps the literacy panel and latest-observation map within the stated bounds', () => {
    expect(literacySeries).toHaveLength(167);
    expect(new Set(literacySeries.map((point) => point.country)).size).toBe(12);
    expect(literacySeries.every((point) => point.rate >= 0 && point.rate <= 100)).toBe(true);
    expect(literacyMapSeries.every((point) => point.year >= 2018)).toBe(true);
    expect(literacyMapGeoJson.features.some((mapFeature) => mapFeature.properties.hasData)).toBe(true);
    expect(
      literacyMapGeoJson.features.find(
        (mapFeature) => mapFeature.properties.id === '840',
      ),
    ).toMatchObject({
      properties: { hasData: false, value: 0, valueLabel: 'No qualifying data' },
    });
    expect(
      literacyMapGeoJson.features.find(
        (mapFeature) => mapFeature.properties.id === '840',
      )?.geometry,
    ).toBeTruthy();
  });

  it('keeps democracy map changes tied to both endpoints and normalized joins', () => {
    expect(democracySeries).toHaveLength(467);
    expect(democracyMapSeries).toHaveLength(174);
    expect(
      democracyMapSeries.every(
        (point) =>
          point.startYear === 2020 &&
          point.endYear === 2025 &&
          point.change === Number((point.endIndex - point.startIndex).toFixed(3)),
      ),
    ).toBe(true);
    expect(democracyMapSeries.every((point) => isoCountryCodes.has(point.code))).toBe(true);
    expect(democracyMapGeoJson.features.some((mapFeature) => !mapFeature.properties.hasData)).toBe(true);
  });
});

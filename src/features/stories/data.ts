import ceoPayCsv from '../../data/ceo-pay-ratio.csv?raw';
import ceoCompensationCsv from '../../data/ceo-pay-compensation.csv?raw';
import democracyMapCsv from '../../data/democracy-map.csv?raw';
import democracySeriesCsv from '../../data/democracy-series.csv?raw';
import climateChangeCsv from '../../data/climate-change.csv?raw';
import warsConflictCsv from '../../data/wars-conflict.csv?raw';
import inequalityByCountryCsv from '../../data/inequality-by-country.csv?raw';
import biodiversityLossCsv from '../../data/biodiversity-loss.csv?raw';
import forcedDisplacementCsv from '../../data/forced-displacement.csv?raw';
import airPollutionCsv from '../../data/air-pollution.csv?raw';
import electricitySanitationCsv from '../../data/electricity-sanitation.csv?raw';
import employmentWorkSkillsCsv from '../../data/employment-work-skills.csv?raw';
import economicGrowthDebtPublicFinanceCsv from '../../data/economic-growth-debt-public-finance.csv?raw';
import extremePovertyCsv from '../../data/extreme-poverty.csv?raw';
import inflationPricesEnergyCsv from '../../data/inflation-prices-energy.csv?raw';
import demographicsMigrationCsv from '../../data/demographics-migration.csv?raw';
import foodAvailabilityCsv from '../../data/food-availability.csv?raw';
import hungerCsv from '../../data/hunger-undernourishment.csv?raw';
import aiAdoptionSizeCsv from '../../data/ai-adoption-size.csv?raw';
import aiAdoptionCsv from '../../data/ai-adoption.csv?raw';
import childMortalityCsv from '../../data/child-mortality.csv?raw';
import housingBenchmarkCsv from '../../data/housing-price-income-benchmark.csv?raw';
import housingPriceIncomeCsv from '../../data/housing-price-income.csv?raw';
import isoCountryCodesCsv from '../../data/iso-country-codes.csv?raw';
import lifeExpectancyCsv from '../../data/life-expectancy.csv?raw';
import literacyMapCsv from '../../data/literacy-map.csv?raw';
import literacySeriesCsv from '../../data/literacy-series.csv?raw';
import womensRightsCsv from '../../data/womens-rights-index.csv?raw';
import vaccinationCoverageCsv from '../../data/vaccination-coverage.csv?raw';
import wealthDistributionInequalityCsv from '../../data/wealth-distribution-inequality.csv?raw';
import worldTopology from '../../data/world-countries-110m.json';
import { feature } from 'topojson-client';
import type { FeatureCollection, Geometry } from 'geojson';

interface CsvRow {
  [key: string]: string;
}

function parseCsv(raw: string): CsvRow[] {
  const [headerLine, ...lines] = raw.trim().split(/\r?\n/);
  if (!headerLine) return [];

  const headers = headerLine.split(',');
  return lines
    .filter(Boolean)
    .map((line) => {
      const values = line.split(',');
      return Object.fromEntries(headers.map((header, index) => [header, values[index] ?? '']));
    });
}

function numberValue(value: string, field: string) {
  const parsed = Number(value);
  if (!Number.isFinite(parsed)) {
    throw new Error(`Invalid ${field} value: ${value}`);
  }
  return parsed;
}

function optionalNumberValue(value: string, field: string) {
  if (value.trim() === '') return undefined;
  return numberValue(value, field);
}

function boundedNumberValue(value: string, field: string, minimum: number, maximum: number) {
  const parsed = numberValue(value, field);
  if (parsed < minimum || parsed > maximum) {
    throw new Error(`Invalid ${field} range: ${value}`);
  }
  return parsed;
}

function textValue(value: string, field: string) {
  if (!value.trim()) {
    throw new Error(`Invalid ${field} value: empty`);
  }
  return value;
}

function assertUnique<T>(rows: T[], keyOf: (row: T) => string, label: string) {
  const keys = rows.map(keyOf);
  if (new Set(keys).size !== keys.length) {
    throw new Error(`Duplicate ${label} row`);
  }
  return rows;
}

function assertCompleteAnnualPanel(
  rows: Array<{ geo: string; year: number }>,
  countries: string[],
  startYear: number,
  endYear: number,
  label: string,
) {
  const expectedYears = endYear - startYear + 1;
  for (const country of countries) {
    const countryRows = rows.filter((row) => row.geo === country);
    if (
      countryRows.length !== expectedYears ||
      countryRows.some((row) => row.year < startYear || row.year > endYear)
    ) {
      throw new Error(`Incomplete ${label} panel for ${country}`);
    }
  }
}

export interface HungerPoint {
  year: number;
  prevalence: number;
}

export interface FoodAvailabilityPoint {
  year: number;
  calories: number;
}

export interface ChildMortalityPoint {
  series: 'long-run' | 'panel';
  entity: string;
  code: string;
  year: number;
  rate: number;
}

export interface LifeExpectancyPoint {
  series: 'long-run' | 'panel';
  entity: string;
  code: string;
  year: number;
  years: number;
}

export interface VaccinationCoveragePoint {
  series: 'world' | 'panel';
  entity: string;
  code: string;
  year: number;
  coverage: number;
}

export interface ElectricitySanitationPoint {
  series: 'world' | 'panel';
  measure: 'electricity' | 'sanitation';
  entity: string;
  code: string;
  year: number;
  value: number;
}

export type ExtremePovertyStatus = 'reported-or-survey-based' | 'source-extrapolation';

export interface ExtremePovertyPoint {
  series: 'world' | 'panel';
  entity: string;
  code: string;
  year: number;
  value: number;
  status: ExtremePovertyStatus;
}

export interface ClimateAnnualPoint {
  year: number;
  anomaly: number;
}

export type ClimateDecadeStatus = 'complete' | 'partial';

export interface ClimateDecadePoint {
  year: number;
  anomaly: number;
  yearsInPeriod: number;
  status: ClimateDecadeStatus;
}

export interface WarsConflictPoint {
  year: number;
  bestDeaths: number;
  lowDeaths: number;
  highDeaths: number;
  ongoingConflicts: number;
}

export interface InequalityPoint {
  country: string;
  code: string;
  year: number;
  gini: number;
}

export interface BiodiversityPoint {
  series: 'world' | 'region';
  entity: string;
  year: number;
  central: number;
  lower?: number;
  upper?: number;
}

export interface ForcedDisplacementPoint {
  year: number;
  refugees: number;
  asylumSeekers?: number;
  idps?: number;
  otherProtection?: number;
}

export interface AirPollutionPoint {
  entity: string;
  code: string;
  year: number;
  pm25: number;
}

export interface EmploymentWorkSkillsPoint {
  series: 'world' | 'panel';
  entity: string;
  code: string;
  year: number;
  rate: number;
}

export interface WealthDistributionInequalityPoint {
  series: 'world' | 'panel';
  entity: string;
  code: string;
  year: number;
  share: number;
}

export interface EconomicGrowthDebtPublicFinancePoint {
  measure: 'growth-world' | 'debt-panel';
  entity: string;
  code: string;
  year: number;
  value: number;
}

export interface InflationPricesEnergyPoint {
  measure: 'inflation-world' | 'inflation-panel' | 'renewables-world';
  entity: string;
  code: string;
  year: number;
  value: number;
}

export interface DemographicsMigrationPoint {
  measure:
    | 'median-observed-world'
    | 'median-projection-world'
    | 'median-panel'
    | 'migration-world'
    | 'migration-panel';
  entity: string;
  code: string;
  year: number;
  value: number;
}

export interface CeoPayPoint {
  year: number;
  realized: number;
  granted: number;
}

export type CeoValueStatus = 'selected' | 'annual' | 'projected';

export interface CeoCompensationPoint {
  year: number;
  realized: number;
  granted: number;
  workersAll: number;
  workersIndustries?: number;
  status: CeoValueStatus;
}

export interface AiAdoptionPoint {
  geo: string;
  country: string;
  year: number;
  value: number;
}

export interface AiEnterpriseSizePoint {
  geo: string;
  country: string;
  sizeEmp: string;
  year: number;
  value: number;
}

export interface AiAdoptionChartPoint {
  year: number;
  value?: number;
  status: 'reported' | 'not-reported';
}

export interface HousingPriceIncomePoint {
  geo: string;
  country: string;
  year: number;
  value: number;
}

export interface HousingBenchmarkPoint {
  geo: string;
  country: string;
  year: number;
  value: number;
}

export interface WomensRightsPoint {
  entity: string;
  code: string;
  year: number;
  value: number;
}

export interface LiteracyPoint {
  country: string;
  code: string;
  isoNumeric: string;
  year: number;
  rate: number;
}

export interface DemocracyPoint {
  country: string;
  code: string;
  isoNumeric: string;
  year: number;
  index: number;
}

export type LiteracyMapPoint = LiteracyPoint;

export interface DemocracyMapPoint {
  country: string;
  code: string;
  isoNumeric: string;
  startYear: number;
  startIndex: number;
  endYear: number;
  endIndex: number;
  change: number;
}

export interface MapFeatureProperties {
  id: string;
  country: string;
  name?: string;
  value?: number;
  startValue?: number;
  endValue?: number;
  change?: number;
  year?: number;
  startYear?: number;
  endYear?: number;
  valueLabel?: string;
  yearLabel?: string;
  startValueLabel?: string;
  endValueLabel?: string;
  changeLabel?: string;
  hasData: boolean;
}

export const hungerSeries: HungerPoint[] = parseCsv(hungerCsv).map((row) => ({
  year: numberValue(row.year, 'hunger year'),
  prevalence: numberValue(row.prevalence_percent, 'undernourishment prevalence'),
}));

export const foodAvailabilitySeries: FoodAvailabilityPoint[] = parseCsv(foodAvailabilityCsv).map(
  (row) => ({
    year: numberValue(row.year, 'food availability year'),
    calories: numberValue(row.kcal_per_person_day, 'food availability'),
  }),
);

export const childMortalitySeries = assertUnique(
  parseCsv(childMortalityCsv).map((row) => {
    const series = row.series;
    if (series !== 'long-run' && series !== 'panel') {
      throw new Error(`Invalid child mortality series: ${series}`);
    }

    return {
      series,
      entity: textValue(row.entity, 'child mortality entity'),
      code: textValue(row.code, 'child mortality code'),
      year: numberValue(row.year, 'child mortality year'),
      rate: boundedNumberValue(row.value, 'child mortality rate', 0, 100),
    };
  }),
  (row) => `${row.series}:${row.code}:${row.year}`,
  'child mortality',
) satisfies ChildMortalityPoint[];

export const childMortalityLongRunSeries = childMortalitySeries.filter(
  (point) => point.series === 'long-run',
);

export const childMortalityPanelSeries = childMortalitySeries.filter(
  (point) => point.series === 'panel',
);

export const lifeExpectancySeries = assertUnique(
  parseCsv(lifeExpectancyCsv).map((row) => {
    const series = row.series;
    if (series !== 'long-run' && series !== 'panel') {
      throw new Error(`Invalid life expectancy series: ${series}`);
    }

    return {
      series,
      entity: textValue(row.entity, 'life expectancy entity'),
      code: textValue(row.code, 'life expectancy code'),
      year: numberValue(row.year, 'life expectancy year'),
      years: boundedNumberValue(row.value, 'life expectancy', 0, 100),
    };
  }),
  (row) => `${row.series}:${row.code}:${row.year}`,
  'life expectancy',
) satisfies LifeExpectancyPoint[];

export const lifeExpectancyLongRunSeries = lifeExpectancySeries.filter(
  (point) => point.series === 'long-run',
);

export const lifeExpectancyPanelSeries = lifeExpectancySeries.filter(
  (point) => point.series === 'panel',
);

export const vaccinationCoverageSeries = assertUnique(
  parseCsv(vaccinationCoverageCsv).map((row) => {
    const series = row.series;
    if (series !== 'world' && series !== 'panel') {
      throw new Error(`Invalid vaccination coverage series: ${series}`);
    }

    return {
      series,
      entity: textValue(row.entity, 'vaccination entity'),
      code: textValue(row.code, 'vaccination code'),
      year: numberValue(row.year, 'vaccination year'),
      coverage: boundedNumberValue(row.value, 'vaccination coverage', 0, 100),
    };
  }),
  (row) => `${row.series}:${row.code}:${row.year}`,
  'vaccination coverage',
) satisfies VaccinationCoveragePoint[];

export const vaccinationWorldSeries = vaccinationCoverageSeries.filter(
  (point) => point.series === 'world',
);

export const vaccinationPanelSeries = vaccinationCoverageSeries.filter(
  (point) => point.series === 'panel',
);

export const electricitySanitationSeries = assertUnique(
  parseCsv(electricitySanitationCsv).map((row) => {
    const series = row.series;
    if (series !== 'world' && series !== 'panel') {
      throw new Error(`Invalid electricity and sanitation series: ${series}`);
    }

    const measure = row.measure;
    if (measure !== 'electricity' && measure !== 'sanitation') {
      throw new Error(`Invalid electricity and sanitation measure: ${measure}`);
    }

    return {
      series,
      measure,
      entity: textValue(row.entity, 'electricity and sanitation entity'),
      code: textValue(row.code, 'electricity and sanitation code'),
      year: numberValue(row.year, 'electricity and sanitation year'),
      value: boundedNumberValue(row.value, 'electricity and sanitation percentage', 0, 100),
    };
  }),
  (row) => `${row.series}:${row.measure}:${row.code}:${row.year}`,
  'electricity and sanitation',
) satisfies ElectricitySanitationPoint[];

export const electricitySanitationWorldSeries = electricitySanitationSeries.filter(
  (point) => point.series === 'world',
);

export const electricitySanitationPanelSeries = electricitySanitationSeries.filter(
  (point) => point.series === 'panel',
);

export const extremePovertySeries = assertUnique(
  parseCsv(extremePovertyCsv).map((row) => {
    const series = row.series;
    if (series !== 'world' && series !== 'panel') {
      throw new Error(`Invalid extreme poverty series: ${series}`);
    }

    const status = row.status;
    if (status !== 'reported-or-survey-based' && status !== 'source-extrapolation') {
      throw new Error(`Invalid extreme poverty status: ${status}`);
    }

    return {
      series,
      entity: textValue(row.entity, 'extreme poverty entity'),
      code: textValue(row.code, 'extreme poverty code'),
      year: numberValue(row.year, 'extreme poverty year'),
      value: boundedNumberValue(row.value, 'extreme poverty percentage', 0, 100),
      status,
    };
  }),
  (row) => `${row.series}:${row.code}:${row.year}`,
  'extreme poverty',
) satisfies ExtremePovertyPoint[];

export const extremePovertyWorldSeries = extremePovertySeries.filter(
  (point) => point.series === 'world',
);

export const extremePovertyPanelSeries = extremePovertySeries.filter(
  (point) => point.series === 'panel',
);

export const climateAnnualSeries = assertUnique(
  parseCsv(climateChangeCsv).map((row) => {
    if (row.series !== 'annual') {
      throw new Error(`Invalid climate change series: ${row.series}`);
    }

    return {
      year: numberValue(row.year, 'climate change year'),
      anomaly: numberValue(row.value, 'climate change anomaly'),
    };
  }),
  (row) => String(row.year),
  'climate change',
) satisfies ClimateAnnualPoint[];

const climateLastYear = climateAnnualSeries.at(-1)?.year ?? 1880;

export const climateDecadeSeries = Array.from(
  { length: Math.floor((climateLastYear - 1880) / 10) + 1 },
  (_, index) => 1880 + index * 10,
)
  .map((year) => {
    const points = climateAnnualSeries.filter(
      (point) => point.year >= year && point.year < year + 10,
    );
    if (points.length === 0) return undefined;

    return {
      year,
      anomaly: Number(
        (points.reduce((total, point) => total + point.anomaly, 0) / points.length).toFixed(3),
      ),
      yearsInPeriod: points.length,
      status: points.length === 10 ? ('complete' as const) : ('partial' as const),
    };
  })
  .filter((point): point is ClimateDecadePoint => point !== undefined);

export const warsConflictSeries = assertUnique(
  parseCsv(warsConflictCsv).map((row) => {
    const year = numberValue(row.year, 'wars and conflict year');
    const bestDeaths = numberValue(row.best_deaths, 'best conflict deaths');
    const lowDeaths = numberValue(row.low_deaths, 'low conflict deaths');
    const highDeaths = numberValue(row.high_deaths, 'high conflict deaths');
    const ongoingConflicts = numberValue(row.ongoing_conflicts, 'ongoing conflicts');

    if (
      year < 1946 ||
      year > 2025 ||
      bestDeaths < 0 ||
      lowDeaths < 0 ||
      highDeaths < 0 ||
      ongoingConflicts < 0 ||
      !Number.isInteger(ongoingConflicts) ||
      lowDeaths > bestDeaths ||
      bestDeaths > highDeaths
    ) {
      throw new Error(`Invalid wars and conflict row for ${year}`);
    }

    return {
      year,
      bestDeaths,
      lowDeaths,
      highDeaths,
      ongoingConflicts,
    };
  }),
  (row) => String(row.year),
  'wars and conflict',
) satisfies WarsConflictPoint[];

if (
  warsConflictSeries.length !== 80 ||
  warsConflictSeries[0]?.year !== 1946 ||
  warsConflictSeries.at(-1)?.year !== 2025 ||
  warsConflictSeries.some((point, index) => point.year !== 1946 + index)
) {
  throw new Error('Wars and conflict series must cover every year from 1946 through 2025');
}

export const inequalitySeries = assertUnique(
  parseCsv(inequalityByCountryCsv).map((row) => ({
    country: textValue(row.country, 'inequality country'),
    code: textValue(row.code, 'inequality code'),
    year: numberValue(row.year, 'inequality year'),
    gini: boundedNumberValue(row.gini, 'Gini coefficient', 0, 1),
  })),
  (row) => `${row.code}:${row.year}`,
  'inequality',
) satisfies InequalityPoint[];

const inequalityCountries = [
  'United States',
  'Brazil',
  'China',
  'India',
  'Nigeria',
  'South Africa',
  'Germany',
];

if (
  new Set(inequalitySeries.map((point) => point.country)).size !== inequalityCountries.length ||
  inequalityCountries.some(
    (country) => !inequalitySeries.some((point) => point.country === country),
  )
) {
  throw new Error('Inequality series does not cover the declared country panel');
}

export const inequalityEndpointSeries = inequalityCountries.flatMap((country) => {
  const countrySeries = inequalitySeries.filter((point) => point.country === country);
  const first = countrySeries[0];
  const latest = countrySeries.at(-1);
  if (!first || !latest) {
    throw new Error(`Inequality series is incomplete for ${country}`);
  }
  return first === latest ? [first] : [first, latest];
});

export const biodiversitySeries = assertUnique(
  parseCsv(biodiversityLossCsv).map((row) => {
    const series = row.series;
    if (series !== 'world' && series !== 'region') {
      throw new Error(`Invalid biodiversity series: ${series}`);
    }

    const lower = optionalNumberValue(row.lower, 'biodiversity lower estimate');
    const upper = optionalNumberValue(row.upper, 'biodiversity upper estimate');
    if (series === 'world' && (lower === undefined || upper === undefined)) {
      throw new Error(`World biodiversity row is missing uncertainty bounds for ${row.year}`);
    }
    if (series === 'region' && (lower !== undefined || upper !== undefined)) {
      throw new Error(`Regional biodiversity row unexpectedly has uncertainty bounds for ${row.year}`);
    }

    return {
      series,
      entity: textValue(row.entity, 'biodiversity entity'),
      year: numberValue(row.year, 'biodiversity year'),
      central: boundedNumberValue(row.central, 'biodiversity index', 0, 200),
      lower,
      upper,
    };
  }),
  (row) => `${row.series}:${row.entity}:${row.year}`,
  'biodiversity',
) satisfies BiodiversityPoint[];

export const biodiversityWorldSeries = biodiversitySeries.filter(
  (point) => point.series === 'world',
);

export const biodiversityRegionSeries = biodiversitySeries.filter(
  (point) => point.series === 'region',
);

const biodiversityRegions = [
  'Africa',
  'Asia and Pacific',
  'Europe and Central Asia',
  'Latin America and the Caribbean',
  'North America',
];

if (
  biodiversityWorldSeries.length !== 51 ||
  biodiversityWorldSeries.some((point, index) => point.year !== 1970 + index) ||
  biodiversityRegionSeries.length !== biodiversityRegions.length * 6 ||
  biodiversityRegions.some(
    (region) =>
      biodiversityRegionSeries.filter((point) => point.entity === region).length !== 6,
  )
) {
  throw new Error('Biodiversity series does not cover the declared world and regional panels');
}

export const forcedDisplacementSeries = assertUnique(
  parseCsv(forcedDisplacementCsv).map((row) => {
    const year = numberValue(row.year, 'forced displacement year');
    const refugees = boundedNumberValue(row.refugees, 'refugee population', 0, 200_000_000);
    const asylumSeekers = optionalNumberValue(row.asylum_seekers, 'asylum-seeker population');
    const idps = optionalNumberValue(row.idps, 'internally displaced population');
    const otherProtection = optionalNumberValue(
      row.oip,
      'other people in need of international protection',
    );

    for (const [label, value] of [
      ['asylum-seeker population', asylumSeekers],
      ['internally displaced population', idps],
      ['other people in need of international protection', otherProtection],
    ] as const) {
      if (
        value !== undefined &&
        (!Number.isInteger(value) || value < 0 || value > 200_000_000)
      ) {
        throw new Error(`Invalid ${label} value for ${year}`);
      }
    }

    if (year < 1951 || year > 2024) {
      throw new Error(`Invalid forced displacement year: ${year}`);
    }

    return {
      year,
      refugees,
      asylumSeekers,
      idps,
      otherProtection,
    };
  }),
  (row) => String(row.year),
  'forced displacement',
) satisfies ForcedDisplacementPoint[];

if (
  forcedDisplacementSeries.length !== 74 ||
  forcedDisplacementSeries.some((point, index) => point.year !== 1951 + index) ||
  forcedDisplacementSeries.some(
    (point) =>
      point.year >= 1993 &&
      (point.asylumSeekers === undefined || point.idps === undefined),
  ) ||
  forcedDisplacementSeries.some(
    (point) => point.year >= 2018 && point.otherProtection === undefined,
  ) ||
  forcedDisplacementSeries.some(
    (point) => point.year < 1993 && (point.asylumSeekers !== undefined || point.idps !== undefined),
  ) ||
  forcedDisplacementSeries.some(
    (point) => point.year < 2018 && point.otherProtection !== undefined,
  )
) {
  throw new Error('Forced displacement series has an unexpected coverage gap');
}

export const airPollutionSeries = assertUnique(
  parseCsv(airPollutionCsv).map((row) => ({
    entity: textValue(row.entity, 'air pollution entity'),
    code: textValue(row.code, 'air pollution code'),
    year: numberValue(row.year, 'air pollution year'),
    pm25: boundedNumberValue(row.pm25, 'PM2.5 exposure', 0, 200),
  })),
  (row) => `${row.code}:${row.year}`,
  'air pollution',
) satisfies AirPollutionPoint[];

export const employmentWorkSkillsSeries = assertUnique(
  parseCsv(employmentWorkSkillsCsv).map((row) => {
    const series = row.series;
    if (series !== 'world' && series !== 'panel') {
      throw new Error(`Invalid employment and skills series: ${series}`);
    }

    return {
      series,
      entity: textValue(row.entity, 'employment and skills entity'),
      code: textValue(row.code, 'employment and skills code'),
      year: numberValue(row.year, 'employment and skills year'),
      rate: boundedNumberValue(row.value, 'employment rate', 0, 100),
    };
  }),
  (row) => `${row.series}:${row.code}:${row.year}`,
  'employment and skills',
) satisfies EmploymentWorkSkillsPoint[];

export const employmentWorkSkillsWorldSeries = employmentWorkSkillsSeries.filter(
  (point) => point.series === 'world',
);

export const employmentWorkSkillsPanelSeries = employmentWorkSkillsSeries.filter(
  (point) => point.series === 'panel',
);

const employmentWorkSkillsPanel = [
  'Germany',
  'India',
  'Japan',
  'Nigeria',
  'Sweden',
  'United States',
];

if (
  employmentWorkSkillsWorldSeries.length !== 35 ||
  employmentWorkSkillsWorldSeries.some((point, index) => point.year !== 1991 + index) ||
  employmentWorkSkillsPanelSeries.length !== employmentWorkSkillsPanel.length * 5 ||
  employmentWorkSkillsPanel.some(
    (entity) =>
      employmentWorkSkillsPanelSeries.filter((point) => point.entity === entity).length !== 5,
  ) ||
  employmentWorkSkillsPanelSeries.some(
    (point) => ![1991, 2000, 2010, 2020, 2025].includes(point.year),
  )
) {
  throw new Error('Employment and skills series does not cover the declared panel');
}

export const wealthDistributionInequalitySeries = assertUnique(
  parseCsv(wealthDistributionInequalityCsv).map((row) => {
    const series = row.series;
    if (series !== 'world' && series !== 'panel') {
      throw new Error(`Invalid wealth distribution and inequality series: ${series}`);
    }

    return {
      series,
      entity: textValue(row.entity, 'wealth distribution entity'),
      code: textValue(row.code, 'wealth distribution code'),
      year: numberValue(row.year, 'wealth distribution year'),
      share: boundedNumberValue(row.value, 'top 1% wealth share', 0, 100),
    };
  }),
  (row) => `${row.series}:${row.code}:${row.year}`,
  'wealth distribution and inequality',
) satisfies WealthDistributionInequalityPoint[];

export const wealthDistributionInequalityWorldSeries =
  wealthDistributionInequalitySeries.filter((point) => point.series === 'world');

export const wealthDistributionInequalityPanelSeries =
  wealthDistributionInequalitySeries.filter((point) => point.series === 'panel');

const wealthDistributionInequalityPanel = [
  'China',
  'France',
  'Germany',
  'India',
  'South Africa',
  'United States',
];
const wealthDistributionInequalityCheckpoints = [1820, 1900, 1950, 1980, 2000, 2010, 2020, 2024];

if (
  wealthDistributionInequalityWorldSeries.length !== 56 ||
  wealthDistributionInequalityWorldSeries[0]?.year !== 1820 ||
  wealthDistributionInequalityWorldSeries.at(-1)?.year !== 2024 ||
  wealthDistributionInequalityPanelSeries.length !==
    wealthDistributionInequalityPanel.length * wealthDistributionInequalityCheckpoints.length ||
  wealthDistributionInequalityPanel.some(
    (entity) =>
      wealthDistributionInequalityPanelSeries.filter((point) => point.entity === entity).length !==
      wealthDistributionInequalityCheckpoints.length,
  ) ||
  wealthDistributionInequalityPanelSeries.some(
    (point) => !wealthDistributionInequalityCheckpoints.includes(point.year),
  )
) {
  throw new Error('Wealth distribution and inequality series does not cover the declared panel');
}

export const economicGrowthDebtPublicFinanceSeries = assertUnique(
  parseCsv(economicGrowthDebtPublicFinanceCsv).map((row) => {
    const measure = row.measure;
    if (measure !== 'growth-world' && measure !== 'debt-panel') {
      throw new Error(`Invalid economic growth and debt measure: ${measure}`);
    }

    return {
      measure,
      entity: textValue(row.entity, 'economic growth and debt entity'),
      code: textValue(row.code, 'economic growth and debt code'),
      year: numberValue(row.year, 'economic growth and debt year'),
      value: numberValue(row.value, 'economic growth and debt value'),
    };
  }),
  (row) => `${row.measure}:${row.code}:${row.year}`,
  'economic growth and debt',
) satisfies EconomicGrowthDebtPublicFinancePoint[];

export const economicGrowthWorldSeries = economicGrowthDebtPublicFinanceSeries.filter(
  (point) => point.measure === 'growth-world',
);

export const publicDebtPanelSeries = economicGrowthDebtPublicFinanceSeries.filter(
  (point) => point.measure === 'debt-panel',
);

const publicDebtPanel = ['Canada', 'France', 'Germany', 'Italy', 'United Kingdom', 'United States'];

if (
  economicGrowthWorldSeries.length !== 24 ||
  economicGrowthWorldSeries.some((point, index) => point.year !== 2000 + index) ||
  publicDebtPanelSeries.length !== publicDebtPanel.length * 24 ||
  publicDebtPanel.some(
    (entity) =>
      publicDebtPanelSeries.filter((point) => point.entity === entity).length !== 24,
  ) ||
  publicDebtPanelSeries.some((point) => point.year < 2000 || point.year > 2023) ||
  economicGrowthWorldSeries.some((point) => point.value < -100)
) {
  throw new Error('Economic growth and public debt series does not cover the declared panel');
}

export const inflationPricesEnergySeries = assertUnique(
  parseCsv(inflationPricesEnergyCsv).map((row) => {
    const measure = row.measure;
    if (
      measure !== 'inflation-world' &&
      measure !== 'inflation-panel' &&
      measure !== 'renewables-world'
    ) {
      throw new Error(`Invalid inflation and energy measure: ${measure}`);
    }

    const value =
      measure === 'renewables-world'
        ? boundedNumberValue(row.value, 'renewable electricity share', 0, 100)
        : boundedNumberValue(row.value, 'consumer inflation', -100, 1_000);

    return {
      measure,
      entity: textValue(row.entity, 'inflation and energy entity'),
      code: textValue(row.code, 'inflation and energy code'),
      year: numberValue(row.year, 'inflation and energy year'),
      value,
    };
  }),
  (row) => `${row.measure}:${row.code}:${row.year}`,
  'inflation and energy',
) satisfies InflationPricesEnergyPoint[];

export const inflationWorldSeries = inflationPricesEnergySeries.filter(
  (point) => point.measure === 'inflation-world',
);

export const inflationPanelSeries = inflationPricesEnergySeries.filter(
  (point) => point.measure === 'inflation-panel',
);

export const renewableElectricityWorldSeries = inflationPricesEnergySeries.filter(
  (point) => point.measure === 'renewables-world',
);

const inflationPanel = ['Brazil', 'Germany', 'India', 'Sweden', 'United Kingdom', 'United States'];
const inflationPanelCheckpoints = [2000, 2010, 2020, 2024];

if (
  inflationWorldSeries.length !== 45 ||
  inflationWorldSeries.some((point, index) => point.year !== 1981 + index) ||
  inflationPanelSeries.length !== inflationPanel.length * inflationPanelCheckpoints.length ||
  inflationPanel.some(
    (entity) =>
      inflationPanelSeries.filter((point) => point.entity === entity).length !==
      inflationPanelCheckpoints.length,
  ) ||
  inflationPanelSeries.some((point) => !inflationPanelCheckpoints.includes(point.year)) ||
  renewableElectricityWorldSeries.length !== 126 ||
  renewableElectricityWorldSeries.some((point, index) => point.year !== 1900 + index)
) {
  throw new Error('Inflation and renewable electricity series does not cover the declared panels');
}

export const demographicsMigrationSeries = assertUnique(
  parseCsv(demographicsMigrationCsv).map((row) => {
    const measure = row.measure;
    if (
      measure !== 'median-observed-world' &&
      measure !== 'median-projection-world' &&
      measure !== 'median-panel' &&
      measure !== 'migration-world' &&
      measure !== 'migration-panel'
    ) {
      throw new Error(`Invalid demographics and migration measure: ${measure}`);
    }

    return {
      measure,
      entity: textValue(row.entity, 'demographics and migration entity'),
      code: textValue(row.code, 'demographics and migration code'),
      year: numberValue(row.year, 'demographics and migration year'),
      value: boundedNumberValue(
        row.value,
        measure.startsWith('median') ? 'median age' : 'foreign-born population share',
        0,
        100,
      ),
    };
  }),
  (row) => `${row.measure}:${row.code}:${row.year}`,
  'demographics and migration',
) satisfies DemographicsMigrationPoint[];

export const medianAgeObservedWorldSeries = demographicsMigrationSeries.filter(
  (point) => point.measure === 'median-observed-world',
);

export const medianAgeProjectionWorldSeries = demographicsMigrationSeries.filter(
  (point) => point.measure === 'median-projection-world',
);

export const medianAgePanelSeries = demographicsMigrationSeries.filter(
  (point) => point.measure === 'median-panel',
);

export const migrationWorldSeries = demographicsMigrationSeries.filter(
  (point) => point.measure === 'migration-world',
);

export const migrationPanelSeries = demographicsMigrationSeries.filter(
  (point) => point.measure === 'migration-panel',
);

const demographicsPanelEntities = [
  'Brazil',
  'Germany',
  'India',
  'Japan',
  'Nigeria',
  'United States',
];
const medianAgePanelCheckpoints = [1950, 1980, 2000, 2023];
const migrationPanelCheckpoints = [1990, 2000, 2010, 2020, 2024];

if (
  medianAgeObservedWorldSeries.length !== 74 ||
  medianAgeObservedWorldSeries.some((point, index) => point.year !== 1950 + index) ||
  medianAgeProjectionWorldSeries.length !== 77 ||
  medianAgeProjectionWorldSeries.some((point, index) => point.year !== 2024 + index) ||
  medianAgePanelSeries.length !== demographicsPanelEntities.length * medianAgePanelCheckpoints.length ||
  demographicsPanelEntities.some(
    (entity) =>
      medianAgePanelSeries.filter((point) => point.entity === entity).length !==
      medianAgePanelCheckpoints.length,
  ) ||
  medianAgePanelSeries.some((point) => !medianAgePanelCheckpoints.includes(point.year)) ||
  migrationWorldSeries.length !== 8 ||
  migrationWorldSeries.some(
    (point, index) => point.year !== [1990, 1995, 2000, 2005, 2010, 2015, 2020, 2024][index],
  ) ||
  migrationPanelSeries.length !== demographicsPanelEntities.length * migrationPanelCheckpoints.length ||
  demographicsPanelEntities.some(
    (entity) =>
      migrationPanelSeries.filter((point) => point.entity === entity).length !==
      migrationPanelCheckpoints.length,
  ) ||
  migrationPanelSeries.some((point) => !migrationPanelCheckpoints.includes(point.year))
) {
  throw new Error('Demographics and migration series does not cover the declared panels');
}

const airPollutionEntities = [
  'World',
  'Brazil',
  'China',
  'Germany',
  'India',
  'Nigeria',
  'United States',
];

if (
  airPollutionSeries.length !== airPollutionEntities.length * 34 ||
  airPollutionEntities.some(
    (entity) =>
      airPollutionSeries.filter((point) => point.entity === entity).length !== 34 ||
      airPollutionSeries.some(
        (point) => point.entity === entity && (point.year < 1990 || point.year > 2023),
      ),
  )
) {
  throw new Error('Air pollution series does not cover the declared annual panel');
}

export const ceoPaySeries: CeoPayPoint[] = parseCsv(ceoPayCsv).map((row) => ({
  year: numberValue(row.year, 'CEO pay year'),
  realized: numberValue(row.realized_ratio, 'realized CEO pay ratio'),
  granted: numberValue(row.granted_ratio, 'granted CEO pay ratio'),
}));

export const ceoCompensationSeries: CeoCompensationPoint[] = parseCsv(ceoCompensationCsv).map(
  (row) => {
    const status = row.ceo_value_status;
    if (status !== 'selected' && status !== 'annual' && status !== 'projected') {
      throw new Error(`Invalid CEO compensation status: ${status}`);
    }

    return {
      year: numberValue(row.year, 'CEO compensation year'),
      realized: numberValue(row.ceo_realized_thousands, 'realized CEO compensation'),
      granted: numberValue(row.ceo_granted_thousands, 'granted CEO compensation'),
      workersAll: numberValue(row.workers_all_thousands, 'all private-sector worker compensation'),
      workersIndustries: optionalNumberValue(
        row.workers_industry_thousands,
        'worker compensation in firms’ industries',
      ),
      status,
    };
  },
);

const aiReportedYears = new Set([2021, 2023, 2024, 2025]);

export const aiAdoptionSeries = assertUnique(
  parseCsv(aiAdoptionCsv).map((row) => {
    const year = numberValue(row.year, 'AI adoption year');
    if (!aiReportedYears.has(year)) {
      throw new Error(`Unexpected AI adoption year: ${year}`);
    }

    return {
      geo: textValue(row.geo, 'AI adoption geography'),
      country: textValue(row.country, 'AI adoption country'),
      year,
      value: boundedNumberValue(row.value, 'AI adoption percentage', 0, 100),
    };
  }),
  (row) => `${row.geo}:${row.year}`,
  'AI adoption',
);

export const aiEuAdoptionSeries = aiAdoptionSeries.filter((row) => row.geo === 'EU27_2020');

export const aiCountryAdoptionSeries = aiAdoptionSeries.filter(
  (row) => row.geo !== 'EU27_2020',
);

export const aiEuAdoptionChartSeries: AiAdoptionChartPoint[] = [2021, 2022, 2023, 2024, 2025].map(
  (year) => {
    const point = aiEuAdoptionSeries.find((row) => row.year === year);
    return point
      ? { year, value: point.value, status: 'reported' }
      : { year, status: 'not-reported' };
  },
);

export const aiCountryEndpointSeries = aiCountryAdoptionSeries.filter(
  (row) => row.year === 2021 || row.year === 2025,
);

export const aiEnterpriseSizeSeries = assertUnique(
  parseCsv(aiAdoptionSizeCsv).map((row) => {
    const year = numberValue(row.year, 'AI enterprise-size year');
    if (year !== 2025) {
      throw new Error(`Unexpected AI enterprise-size year: ${year}`);
    }

    if (!['10-49', '50-249', 'GE250'].includes(row.size_emp)) {
      throw new Error(`Unexpected AI enterprise-size class: ${row.size_emp}`);
    }

    return {
      geo: textValue(row.geo, 'AI enterprise-size geography'),
      country: textValue(row.country, 'AI enterprise-size country'),
      sizeEmp: row.size_emp,
      year,
      value: boundedNumberValue(row.value, 'AI enterprise-size percentage', 0, 100),
    };
  }),
  (row) => `${row.geo}:${row.sizeEmp}:${row.year}`,
  'AI enterprise-size',
);

const housingCountries = ['CAN', 'FRA', 'DEU', 'JPN', 'NLD', 'SWE', 'GBR', 'USA'];

export const housingPriceIncomeSeries = assertUnique(
  parseCsv(housingPriceIncomeCsv).map((row) => ({
    geo: textValue(row.geo, 'housing geography'),
    country: textValue(row.country, 'housing country'),
    year: numberValue(row.year, 'housing year'),
    value: numberValue(row.value, 'house-price-to-income index'),
  })),
  (row) => `${row.geo}:${row.year}`,
  'housing price-to-income',
);

assertCompleteAnnualPanel(
  housingPriceIncomeSeries,
  housingCountries,
  2000,
  2024,
  'housing price-to-income',
);

export const housingBenchmarkSeries = assertUnique(
  parseCsv(housingBenchmarkCsv).map((row) => {
    const year = numberValue(row.year, 'housing benchmark year');
    if (year !== 2024) {
      throw new Error(`Unexpected housing benchmark year: ${year}`);
    }

    return {
      geo: textValue(row.geo, 'housing benchmark geography'),
      country: textValue(row.country, 'housing benchmark country'),
      year,
      value: numberValue(row.value, 'housing long-term benchmark'),
    };
  }),
  (row) => `${row.geo}:${row.year}`,
  'housing long-term benchmark',
);

if (
  new Set(housingBenchmarkSeries.map((row) => row.geo)).size !== housingCountries.length ||
  housingBenchmarkSeries.some((row) => !housingCountries.includes(row.geo))
) {
  throw new Error('Housing long-term benchmark does not cover the declared country panel');
}

export const womensRightsSeries = parseCsv(womensRightsCsv).map((row) => ({
  entity: textValue(row.entity, 'women rights entity'),
  code: textValue(row.code, 'women rights code'),
  year: numberValue(row.year, 'women rights year'),
  value: boundedNumberValue(row.value, 'women rights index', 0, 100),
})) satisfies WomensRightsPoint[];

export const womensRightsWorldSeries = womensRightsSeries.filter(
  (point) => point.code === 'OWID_WRL',
);

export const womensRightsCountrySeries = womensRightsSeries.filter(
  (point) => point.code !== 'OWID_WRL',
);

export const literacySeries: LiteracyPoint[] = parseCsv(literacySeriesCsv).map((row) => ({
  country: row.country,
  code: row.code,
  isoNumeric: row.iso_numeric,
  year: numberValue(row.year, 'literacy year'),
  rate: boundedNumberValue(row.rate, 'literacy rate', 0, 100),
}));

export const literacyMapSeries: LiteracyMapPoint[] = parseCsv(literacyMapCsv).map((row) => ({
  country: row.country,
  code: row.code,
  isoNumeric: row.iso_numeric,
  year: numberValue(row.year, 'literacy map year'),
  rate: boundedNumberValue(row.rate, 'literacy map rate', 0, 100),
}));

export const democracySeries: DemocracyPoint[] = parseCsv(democracySeriesCsv).map((row) => ({
  country: row.country,
  code: row.code,
  isoNumeric: row.iso_numeric,
  year: numberValue(row.year, 'democracy year'),
  index: boundedNumberValue(row.index, 'Liberal Democracy Index', 0, 1),
}));

export const democracyMapSeries: DemocracyMapPoint[] = parseCsv(democracyMapCsv).map((row) => {
  const startIndex = boundedNumberValue(row.start_index, 'democracy map start index', 0, 1);
  const endIndex = boundedNumberValue(row.end_index, 'democracy map end index', 0, 1);
  const change = numberValue(row.change, 'democracy map change');
  const expectedChange = Number((endIndex - startIndex).toFixed(3));
  if (change !== expectedChange) {
    throw new Error(`Democracy map change does not match endpoints for ${row.country}`);
  }

  return {
    country: row.country,
    code: row.code,
    isoNumeric: row.iso_numeric,
    startYear: numberValue(row.start_year, 'democracy map start year'),
    startIndex,
    endYear: numberValue(row.end_year, 'democracy map end year'),
    endIndex,
    change,
  };
});

export const isoCountryCodes = new Map(
  parseCsv(isoCountryCodesCsv).map((row) => [row.code, row.iso_numeric]),
);

function normalizedMapId(code: string, isoNumeric: string) {
  const crosswalkValue = isoCountryCodes.get(code);
  if (!crosswalkValue) {
    throw new Error(`Missing ISO numeric code for ${code}`);
  }
  if (crosswalkValue !== isoNumeric) {
    throw new Error(`Mismatched ISO numeric code for ${code}`);
  }
  return crosswalkValue;
}

const worldFeatures = feature(
  worldTopology as unknown,
  (worldTopology as { objects: { countries: unknown } }).objects.countries,
) as FeatureCollection<Geometry, MapFeatureProperties>;

function withMapProperties(
  valueById: Map<string, Omit<MapFeatureProperties, 'id' | 'country' | 'hasData'>>,
) {
  return {
    ...worldFeatures,
    features: worldFeatures.features.map((worldFeature) => {
      const id = String(worldFeature.id ?? '').padStart(3, '0');
      const properties = valueById.get(id);
      const hasData = Boolean(properties);
      const value = properties?.value;
      const year = properties?.year;
      const startValue = properties?.startValue;
      const endValue = properties?.endValue;
      const change = properties?.change;

      return {
        ...worldFeature,
        properties: {
          id,
          country: worldFeature.properties?.country ?? worldFeature.properties?.name ?? 'Unknown',
          ...properties,
          value: value ?? 0,
          change: change ?? 0,
          valueLabel: hasData && value !== undefined ? value.toFixed(1) : 'No qualifying data',
          yearLabel: hasData && year !== undefined ? String(year) : 'Not reported',
          startValueLabel:
            hasData && startValue !== undefined ? startValue.toFixed(3) : 'Not reported',
          endValueLabel: hasData && endValue !== undefined ? endValue.toFixed(3) : 'Not reported',
          changeLabel: hasData && change !== undefined ? change.toFixed(3) : 'Not reported',
          hasData,
        },
      };
    }),
  } satisfies FeatureCollection<Geometry, MapFeatureProperties>;
}

export const literacyMapGeoJson = withMapProperties(
  new Map(
    literacyMapSeries.map((point) => [
      normalizedMapId(point.code, point.isoNumeric),
      { value: point.rate, year: point.year },
    ]),
  ),
);

export const democracyMapGeoJson = withMapProperties(
  new Map(
    democracyMapSeries.map((point) => [
      normalizedMapId(point.code, point.isoNumeric),
      {
        startValue: point.startIndex,
        endValue: point.endIndex,
        change: point.change,
        startYear: point.startYear,
        endYear: point.endYear,
      },
    ]),
  ),
);

export function latest<T extends { year: number }>(series: T[]) {
  return series.reduce((current, point) => (point.year > current.year ? point : current));
}

export function earliest<T extends { year: number }>(series: T[]) {
  return series.reduce((current, point) => (point.year < current.year ? point : current));
}

export function toChartSeries(
  series: CeoPayPoint[],
): Array<{ year: number; measure: string; ratio: number }> {
  return series.flatMap((point) => [
    { year: point.year, measure: 'Realized compensation', ratio: point.realized },
    { year: point.year, measure: 'Granted compensation', ratio: point.granted },
  ]);
}

export function toCompensationChartSeries(series: CeoCompensationPoint[]) {
  return series.flatMap((point) => [
    {
      year: point.year,
      measure: 'Realized CEO compensation',
      amount: point.realized,
      status: point.status,
    },
    {
      year: point.year,
      measure: 'Granted CEO compensation',
      amount: point.granted,
      status: point.status,
    },
  ]);
}

export function toWorkerCompensationChartSeries(series: CeoCompensationPoint[]) {
  return series.flatMap((point) =>
    point.workersIndustries === undefined
      ? []
      : [
          {
            year: point.year,
            amount: point.workersIndustries,
            status: point.status,
          },
        ],
  );
}

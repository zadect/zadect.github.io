import ceoPayCsv from '../../data/ceo-pay-ratio.csv?raw';
import ceoCompensationCsv from '../../data/ceo-pay-compensation.csv?raw';
import democracyMapCsv from '../../data/democracy-map.csv?raw';
import democracySeriesCsv from '../../data/democracy-series.csv?raw';
import foodAvailabilityCsv from '../../data/food-availability.csv?raw';
import hungerCsv from '../../data/hunger-undernourishment.csv?raw';
import aiAdoptionSizeCsv from '../../data/ai-adoption-size.csv?raw';
import aiAdoptionCsv from '../../data/ai-adoption.csv?raw';
import housingBenchmarkCsv from '../../data/housing-price-income-benchmark.csv?raw';
import housingPriceIncomeCsv from '../../data/housing-price-income.csv?raw';
import isoCountryCodesCsv from '../../data/iso-country-codes.csv?raw';
import literacyMapCsv from '../../data/literacy-map.csv?raw';
import literacySeriesCsv from '../../data/literacy-series.csv?raw';
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

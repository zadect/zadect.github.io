import ceoPayCsv from '../../data/ceo-pay-ratio.csv?raw';
import ceoCompensationCsv from '../../data/ceo-pay-compensation.csv?raw';
import democracyMapCsv from '../../data/democracy-map.csv?raw';
import democracySeriesCsv from '../../data/democracy-series.csv?raw';
import foodAvailabilityCsv from '../../data/food-availability.csv?raw';
import hungerCsv from '../../data/hunger-undernourishment.csv?raw';
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

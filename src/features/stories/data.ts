import ceoPayCsv from '../../data/ceo-pay-ratio.csv?raw';
import ceoCompensationCsv from '../../data/ceo-pay-compensation.csv?raw';
import foodAvailabilityCsv from '../../data/food-availability.csv?raw';
import hungerCsv from '../../data/hunger-undernourishment.csv?raw';

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

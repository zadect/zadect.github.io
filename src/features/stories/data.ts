import ceoPayCsv from '../../data/ceo-pay-ratio.csv?raw';
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

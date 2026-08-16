import { describe, expect, it } from 'vitest';
import {
  ceoPaySeries,
  foodAvailabilitySeries,
  hungerSeries,
  toChartSeries,
} from './data';

describe('published story data', () => {
  it('keeps the direct hunger series and longer context series distinct', () => {
    expect(hungerSeries[0].year).toBe(2000);
    expect(foodAvailabilitySeries[0].year).toBe(1961);
    expect(foodAvailabilitySeries.length).toBeGreaterThan(hungerSeries.length);
  });

  it('contains the full CEO pay ratio range and both measures', () => {
    expect(ceoPaySeries[0].year).toBe(1965);
    expect(ceoPaySeries.at(-1)?.year).toBeGreaterThanOrEqual(2024);
    expect(ceoPaySeries.every((point) => point.realized > 0 && point.granted > 0)).toBe(true);
    expect(toChartSeries(ceoPaySeries)).toHaveLength(ceoPaySeries.length * 2);
  });
});

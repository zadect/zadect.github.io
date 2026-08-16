export interface SourceReference {
  id: string;
  title: string;
  publisher: string;
  href: string;
  dataHref: string;
  coverage: string;
  retrieved: string;
  note: string;
}

export const sources: SourceReference[] = [
  {
    id: 'fao-undernourishment',
    title: 'Prevalence of undernourishment',
    publisher: 'Food and Agriculture Organization of the United Nations',
    href: 'https://www.fao.org/faostat/en/#data/FS',
    dataHref: 'https://ourworldindata.org/grapher/prevalence-of-undernourishment',
    coverage: 'Global annual series, 2000–2024 in this release',
    retrieved: '2026-08-16',
    note: 'The share of the population whose habitual food intake is insufficient for an active, healthy life. Values below 2.5% are reported by FAO as <2.5% because of uncertainty.',
  },
  {
    id: 'fao-food-availability',
    title: 'Daily supply of calories per person',
    publisher: 'Food and Agriculture Organization of the United Nations',
    href: 'https://www.fao.org/faostat/en/#data/FS',
    dataHref: 'https://ourworldindata.org/grapher/food-supply-kcal',
    coverage: 'Global annual series, 1961–2023 in this release',
    retrieved: '2026-08-16',
    note: 'Average calories available in the national food supply, not the amount each person actually consumes. It is a context measure, not a direct hunger measure.',
  },
  {
    id: 'epi-ceo-pay',
    title: 'CEO-to-worker pay ratio',
    publisher: 'Economic Policy Institute',
    href: 'https://www.epi.org/publication/ceo-pay/',
    dataHref: 'https://github.com/Economic/data/releases/latest',
    coverage: 'United States, annual series, 1965–2025 in this release',
    retrieved: '2026-08-16',
    note: 'EPI compares compensation for CEOs of the largest US public companies with compensation for a typical private-sector production or nonsupervisory worker. Realized and granted compensation are separate measures.',
  },
];

export function getSources(ids: string[]) {
  return ids.flatMap((id) => {
    const source = sources.find((candidate) => candidate.id === id);
    return source ? [source] : [];
  });
}

export interface SourceReference {
  id: string;
  title: string;
  publisher: string;
  originalPublisher: string;
  processor?: string;
  citation: string;
  methodologyHref: string;
  dataHref: string;
  originalDataHref?: string;
  metadataHref?: string;
  licenseHref?: string;
  version: string;
  coverage: string;
  retrieved: string;
  unit: string;
  localPath?: string;
  transformation: string;
  note: string;
}

const accessDate = '2026-08-16';

export const sources: SourceReference[] = [
  {
    id: 'fao-undernourishment',
    title: 'Share of people who are undernourished – UN FAO',
    publisher: 'Food and Agriculture Organization of the United Nations',
    originalPublisher: 'Food and Agriculture Organization of the United Nations',
    processor: 'Our World in Data',
    citation:
      'FAO (2025), “Share of people who are undernourished – UN FAO,” with major processing by Our World in Data.',
    methodologyHref: 'https://ourworldindata.org/grapher/prevalence-of-undernourishment.metadata.json',
    dataHref: 'https://ourworldindata.org/grapher/prevalence-of-undernourishment',
    originalDataHref: 'https://www.fao.org/faostat/en/#data/FS',
    metadataHref: 'https://ourworldindata.org/grapher/prevalence-of-undernourishment.metadata.json',
    licenseHref: 'https://ourworldindata.org/licence',
    version: 'OWID Grapher variable 1196353',
    coverage: 'Global annual series, 2000–2024 in this release',
    retrieved: accessDate,
    unit: 'Percent of the population',
    localPath: 'src/data/hunger-undernourishment.csv',
    transformation:
      'The local extract keeps the OWID global series and rounds only for display; no values below FAO’s reporting threshold are imputed.',
    note:
      'The prevalence of undernourishment estimates the share of people whose habitual food intake is insufficient for an active, healthy life. FAO reports values below 2.5% as <2.5% because of uncertainty.',
  },
  {
    id: 'fao-food-availability',
    title: 'Daily supply of calories per person',
    publisher: 'Food and Agriculture Organization of the United Nations and other historical sources',
    originalPublisher: 'Food and Agriculture Organization of the United Nations and listed historical sources',
    processor: 'Our World in Data',
    citation:
      'FAO (2025) and other listed historical sources, “Daily supply of calories per person,” with major processing by Our World in Data.',
    methodologyHref: 'https://www.fao.org/faostat/en/#data/FS',
    dataHref: 'https://ourworldindata.org/grapher/food-supply-kcal',
    originalDataHref: 'https://www.fao.org/faostat/en/#data/FS',
    metadataHref: 'https://ourworldindata.org/grapher/food-supply-kcal.metadata.json',
    licenseHref: 'https://ourworldindata.org/licence',
    version: 'OWID Grapher variable 1205780',
    coverage: 'Global annual series, 1961–2023 in this release',
    retrieved: accessDate,
    unit: 'Kilocalories available per person per day',
    localPath: 'src/data/food-availability.csv',
    transformation:
      'The local extract keeps the OWID world series and rounds to whole kilocalories in the chart table.',
    note:
      'This is average food available in the national food supply, not what each person consumes. OWID’s metadata lists FAO and other historical sources, so this is not an FAO-only series.',
  },
  {
    id: 'epi-ceo-pay',
    title: 'CEO-to-worker compensation ratio',
    publisher: 'Economic Policy Institute',
    originalPublisher: 'Economic Policy Institute',
    processor: 'Economic Policy Institute State of Working America Data Library',
    citation:
      'Economic Policy Institute (2026), State of Working America Data Library, “CEO-to-worker pay ratio, realized” and “CEO-to-worker pay ratio, granted,” release 2026.8.14.',
    methodologyHref: 'https://www.epi.org/publication/methodology-measuring-ceo-compensation-ratio/',
    dataHref: 'https://github.com/Economic/data/releases/download/2026.8.14/epi_swa_data_library.zip',
    originalDataHref: 'https://data.epi.org/wage_gaps/ceo_pay_ratio/line/year/national/ceo_worker_realized/overall',
    metadataHref: 'https://data.epi.org/',
    version: 'EPI release 2026.8.14; ceo_pay_ratio.csv',
    coverage: 'United States, annual ratio series, 1965–2025 in this release',
    retrieved: accessDate,
    unit: 'Times CEO compensation / worker compensation',
    localPath: 'src/data/ceo-pay-ratio.csv',
    transformation:
      'The local extract contains the release’s realized and granted measures in separate columns; the site does not recompute or interpolate the ratios.',
    note:
      'EPI’s numerator is average annual compensation for CEOs of the largest US public companies. The denominator is average wages and benefits for private-sector production and nonsupervisory workers on a full-time, full-year basis.',
  },
  {
    id: 'epi-ceo-compensation',
    title: 'CEO and worker compensation in 2024 dollars',
    publisher: 'Economic Policy Institute',
    originalPublisher:
      'Economic Policy Institute authors using Compustat ExecuComp, FRED, BLS Current Employment Statistics, and BEA NIPA tables',
    processor: 'Economic Policy Institute',
    citation:
      'Economic Policy Institute (2026), “CEO compensation, CEO-to-worker compensation ratio, and stock prices (2024$), selected years, 1965–2024,” chart post 306615.',
    methodologyHref: 'https://www.epi.org/publication/methodology-measuring-ceo-compensation-ratio/',
    dataHref: 'https://www.epi.org/chart/ceo-pay-ceo-compensation-over-time-1b/',
    originalDataHref: 'https://www.epi.org/chart/ceo-pay-ceo-compensation-over-time-1b/',
    metadataHref: 'https://www.epi.org/publication/ceo-pay/',
    version: 'EPI chart post 306615; 2026-08-09 embed',
    coverage: 'United States; selected years 1965–1989 and annual values 1992–2024',
    retrieved: accessDate,
    unit: 'Thousands of 2024 dollars',
    localPath: 'src/data/ceo-pay-compensation.csv',
    transformation:
      'The local extract preserves EPI’s rounded thousands, selected early CEO observations, annual observations from 1992, and the explicit projected status for 2024. Missing early industry-worker values remain blank.',
    note:
      'Realized CEO compensation includes stock options exercised and vested stock awards. Granted compensation values stock awards and options when granted. The worker series is annual compensation for production and nonsupervisory workers in the firms’ industries.',
  },
  {
    id: 'uk-ceo-pay-context',
    title: 'UK CEO-to-worker pay-ratio disclosures',
    publisher: 'High Pay Centre and UK statutory reporting framework',
    originalPublisher: 'UK quoted companies subject to the statutory pay-ratio disclosure rules',
    processor: 'High Pay Centre',
    citation:
      'High Pay Centre (2025), “CEO to worker pay gaps in the FTSE 350: Five years of pay ratio disclosures.”',
    methodologyHref: 'https://www.legislation.gov.uk/uksi/2018/860/contents/made',
    dataHref:
      'https://highpaycentre.org/ceo-to-worker-pay-gaps-in-the-ftse-350-five-years-of-pay-ratio-disclosures-2/',
    originalDataHref: 'https://highpaycentre.org/uk-pay-database/',
    metadataHref: 'https://highpaycentre.org/contact/',
    version: 'Research status; no local numeric extract',
    coverage: 'UK FTSE 350 disclosure context; not plotted in this release',
    retrieved: accessDate,
    unit: 'Not plotted',
    transformation:
      'No numeric series was retained because the public database did not provide a reproducible self-service export for this release.',
    note:
      'UK rules cover qualifying quoted companies with more than 250 UK employees and compare the CEO single-figure remuneration with UK employee remuneration at the 25th, 50th, and 75th percentiles. Those populations and definitions are not interchangeable with EPI’s US series.',
  },
  {
    id: 'germany-ceo-pay-research',
    title: 'German executive-pay research',
    publisher: 'Deutsche Schutzgemeinschaft für Wertpapierbesitz (DSW)',
    originalPublisher: 'DSW and German research partners',
    citation: 'DSW, executive-pay research resources, accessed 2026-08-16.',
    methodologyHref: 'https://www.dsw-info.de/',
    dataHref: 'https://www.dsw-info.de/',
    version: 'Research status; no local numeric extract',
    coverage: 'Germany; not plotted in this release',
    retrieved: accessDate,
    unit: 'Not plotted',
    transformation: 'No figures are reported because no open, compatible, versionable series was identified.',
    note:
      'German executive-pay studies are useful context, but their company populations and compensation definitions are not yet aligned with the US EPI series used here.',
  },
  {
    id: 'france-ceo-pay-research',
    title: 'French executive-pay research',
    publisher: 'Proxinvest',
    originalPublisher: 'Proxinvest and French listed-company disclosures',
    citation: 'Proxinvest, executive-pay research resources, accessed 2026-08-16.',
    methodologyHref: 'https://www.proxinvest.fr/',
    dataHref: 'https://www.proxinvest.fr/',
    version: 'Research status; no local numeric extract',
    coverage: 'France; not plotted in this release',
    retrieved: accessDate,
    unit: 'Not plotted',
    transformation: 'No figures are reported because no open, compatible, versionable series was identified.',
    note:
      'French executive-pay research is useful context, but no open series with definitions and coverage compatible with EPI’s US measure was retained.',
  },
];

export function getSources(ids: string[]) {
  return ids.flatMap((id) => {
    const source = sources.find((candidate) => candidate.id === id);
    return source ? [source] : [];
  });
}

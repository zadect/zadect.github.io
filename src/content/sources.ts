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
  {
    id: 'literacy-owid',
    title: 'Literacy rate',
    publisher: 'Our World in Data',
    originalPublisher: 'UNESCO Institute for Statistics and listed historical sources',
    processor: 'Our World in Data',
    citation:
      'UNESCO Institute for Statistics (2026) and listed historical sources, “Literacy rate,” with major processing by Our World in Data.',
    methodologyHref: 'https://ourworldindata.org/grapher/cross-country-literacy-rates.metadata.json',
    dataHref: 'https://ourworldindata.org/grapher/cross-country-literacy-rates',
    originalDataHref: 'https://databrowser.uis.unesco.org/resources/bulk',
    metadataHref: 'https://ourworldindata.org/grapher/cross-country-literacy-rates.metadata.json',
    licenseHref: 'https://ourworldindata.org/licence',
    version: 'OWID Grapher variable 1271900; updated 2026-05-12',
    coverage: 'Country observations from 1475–2024; map keeps latest observations from 2018 onward',
    retrieved: accessDate,
    unit: 'Percent of people aged 15 and older',
    localPath: 'src/data/literacy-series.csv and src/data/literacy-map.csv',
    transformation:
      'The local line extract keeps the documented 12-country illustrative panel from 1950 onward. The map keeps each country’s latest observation from 2018 onward and preserves that observation year; no values are interpolated.',
    note:
      'This is basic literacy: the share of adults able to read and write a simple statement about everyday life. Historical definitions and population coverage vary, and the measure does not capture functional literacy.',
  },
  {
    id: 'world-bank-literacy-coverage',
    title: 'Literacy rate, adult total',
    publisher: 'World Bank World Development Indicators',
    originalPublisher: 'UNESCO Institute for Statistics',
    processor: 'World Bank',
    citation:
      'World Bank (2026), World Development Indicators, “Literacy rate, adult total (% of people ages 15 and above),” indicator SE.ADT.LITR.ZS; coverage cross-check accessed 2026-08-16.',
    methodologyHref: 'https://data.worldbank.org/indicator/SE.ADT.LITR.ZS',
    dataHref:
      'https://api.worldbank.org/v2/country/all/indicator/SE.ADT.LITR.ZS?format=json&per_page=20000',
    originalDataHref: 'https://databrowser.uis.unesco.org/resources/bulk',
    metadataHref: 'https://api.worldbank.org/v2/sources/2/series/SE.ADT.LITR.ZS?format=json',
    version: 'World Development Indicators source 2; last updated 2026-07-13',
    coverage: 'Coverage audit only; no World Bank values are merged into the plotted map',
    retrieved: accessDate,
    unit: 'Percent of people aged 15 and older',
    transformation:
      'The latest non-null country observations were checked against the OWID extract. No values are merged because the indicator does not provide a newer comparable observation for many developed countries.',
    note:
      'This independent UNESCO-based indicator confirms the reporting gap for many high-income countries. It is cited to explain missing recent observations, not presented as a second series on the map.',
  },
  {
    id: 'vdem-liberal-democracy',
    title: 'Liberal Democracy Index',
    publisher: 'Our World in Data',
    originalPublisher: 'Varieties of Democracy (V-Dem) Project',
    processor: 'Our World in Data',
    citation:
      'V-Dem (2026), “Liberal democracy index,” Country-Year Dataset v16, with processing and historical imputation by Our World in Data.',
    methodologyHref: 'https://v-dem.net/data/the-v-dem-dataset/',
    dataHref: 'https://ourworldindata.org/grapher/liberal-democracy-index',
    originalDataHref: 'https://doi.org/10.23696/vdemds26',
    metadataHref: 'https://ourworldindata.org/grapher/liberal-democracy-index.metadata.json',
    licenseHref: 'https://creativecommons.org/licenses/by-sa/4.0/',
    version: 'V-Dem Country-Year Dataset v16; OWID variable 1209797; updated 2026-03-17',
    coverage: 'Country-year estimates from 1789–2025; story change map compares 2020 with 2025',
    retrieved: accessDate,
    unit: 'Liberal Democracy Index, 0–1; five-year change in index points',
    localPath: 'src/data/democracy-series.csv and src/data/democracy-map.csv',
    transformation:
      'The local line extract keeps the documented 13-country illustrative panel from 1990–2025. The map keeps countries with both 2020 and 2025 values and calculates 2025 minus 2020; no missing endpoint is imputed locally.',
    note:
      'The index combines electoral freedoms, civil liberties, equality before the law, and executive constraints. A negative five-year change is a signal of democratic deterioration in this measure, not proof of a cause or a complete description of a country’s political system.',
  },
  {
    id: 'world-atlas-geometry',
    title: 'World country boundaries',
    publisher: 'World Atlas',
    originalPublisher: 'Natural Earth',
    processor: 'World Atlas / TopoJSON',
    citation:
      'World Atlas 2.0.2, “countries-110m.json,” redistributed from Natural Earth 4.1.0 Admin 0 country boundaries.',
    methodologyHref: 'https://github.com/topojson/world-atlas',
    dataHref: 'https://cdn.jsdelivr.net/npm/world-atlas@2.0.2/countries-110m.json',
    metadataHref: 'https://github.com/topojson/world-atlas#countries-110mjson',
    licenseHref: 'https://github.com/topojson/world-atlas/blob/master/LICENSE',
    version: 'World Atlas 2.0.2; Natural Earth 4.1.0; 110m scale',
    coverage: 'Country boundary geometry used for both story maps',
    retrieved: accessDate,
    unit: 'ISO 3166-1 numeric country geometry',
    localPath: 'src/data/world-countries-110m.json',
    transformation:
      'The pinned TopoJSON is converted to local GeoJSON features in the browser and joined by ISO 3166-1 numeric code. Statistical values remain in the story-specific local extracts.',
    note:
      'Boundaries are map context, not political claims. Small territories, disputed areas, and statistical aggregates may not have a corresponding polygon or value.',
  },
  {
    id: 'iso-country-codes',
    title: 'ISO country-code crosswalk',
    publisher: 'Datasets / Open Knowledge Foundation',
    originalPublisher: 'ISO 3166-1 country-code standard',
    processor: 'Datasets country-codes repository',
    citation:
      'Datasets / Open Knowledge Foundation, “Country Codes,” ISO 3166-1 alpha-3 to numeric crosswalk, accessed 2026-08-16.',
    methodologyHref: 'https://github.com/datasets/country-codes',
    dataHref: 'https://raw.githubusercontent.com/datasets/country-codes/master/data/country-codes.csv',
    metadataHref: 'https://www.iso.org/iso-3166-country-codes.html',
    version: 'Country-codes repository snapshot retrieved 2026-08-16',
    coverage: 'ISO alpha-3 and numeric codes used to join source rows to map geometry',
    retrieved: accessDate,
    unit: 'ISO 3166-1 alpha-3 and numeric codes',
    localPath: 'src/data/iso-country-codes.csv',
    transformation:
      'The local crosswalk retains only alpha-3, numeric, and English country-name fields needed to validate the story extracts and the TopoJSON join.',
    note:
      'Country names are display labels only; the map join uses the numeric code.',
  },
];

export function getSources(ids: string[]) {
  return ids.flatMap((id) => {
    const source = sources.find((candidate) => candidate.id === id);
    return source ? [source] : [];
  });
}

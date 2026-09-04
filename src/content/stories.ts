export type StoryCategory = 'good' | 'bad' | 'future';
export type StoryStatus = 'published' | 'coming-soon';
export type EvidenceStatus =
  | 'historical-observation'
  | 'historical-estimate'
  | 'modelled-estimate'
  | 'source-extrapolation'
  | 'source-projection';

export interface StoryEvidence {
  status: EvidenceStatus;
  dataThrough: string;
  note: string;
  cardLabel: string;
}

export interface StoryCategoryPresentation {
  label: string;
  signalLabel: string;
  heading: string;
  description: string;
}

export const storyCategoryPresentation: Record<StoryCategory, StoryCategoryPresentation> = {
  good: {
    label: 'The good',
    signalLabel: 'Good signal',
    heading: 'Signals of human progress',
    description: 'Each card opens a sourced time series, its definition, and the date its data ends.',
  },
  bad: {
    label: 'The bad',
    signalLabel: 'Bad signal',
    heading: 'Signals we cannot look away from',
    description: 'Each card opens a sourced time series, its definition, and the date its data ends.',
  },
  future: {
    label: 'The future',
    signalLabel: 'Future baseline',
    heading: 'Conditions shaping the next decades',
    description: 'Historical baselines for decisions that will shape the years ahead.',
  },
};

export interface StoryComparison {
  title: string;
  fields: Array<{ label: string; value: string }>;
}

export interface StoryDefinition {
  slug: string;
  title: string;
  category: StoryCategory;
  status: StoryStatus;
  summary: string;
  plannedMetric: string;
  geography: string;
  sourceHint: string;
  comparison?: StoryComparison;
  evidence: StoryEvidence;
}

type StorySeed = Omit<StoryDefinition, 'evidence'>;

const storyCatalogue: StorySeed[] = [
  {
    slug: 'world-hunger',
    title: 'World hunger',
    category: 'good',
    status: 'published',
    summary:
      'Undernourishment is measured from 2000; food supply reaches back to 1961. The two series point in the same direction but measure different things.',
    plannedMetric: 'Prevalence of undernourishment and food availability',
    geography: 'World',
    sourceHint: 'FAO and Our World in Data',
    comparison: {
      title: 'Two measures, kept separate',
      fields: [
        {
          label: 'Direct measure',
          value: 'Share of people whose habitual food intake is insufficient for an active, healthy life.',
        },
        {
          label: 'Longer context',
          value: 'Average calories available in the food supply per person per day, not actual consumption.',
        },
      ],
    },
  },
  {
    slug: 'literacy',
    title: 'Adult literacy',
    category: 'good',
    status: 'published',
    summary:
      'Basic literacy has spread widely. The latest country observations still arrive in different years and leave visible reporting gaps.',
    plannedMetric: 'Adult literacy rate',
    geography: 'Selected countries and latest reported country observations',
    sourceHint: 'UNESCO Institute for Statistics and Our World in Data',
    comparison: {
      title: 'What literacy means here',
      fields: [
        {
          label: 'Measure',
          value: 'Share of people aged 15 and older who can read and write a simple statement about everyday life.',
        },
        {
          label: 'Map',
          value: 'Each country uses its latest reported observation from 2018 onward; the year is shown because reporting is not simultaneous.',
        },
        {
          label: 'Limit',
          value: 'Definitions and population coverage changed over time, and basic literacy is not the same as functional literacy.',
        },
      ],
    },
  },
  {
    slug: 'womens-rights',
    title: 'Legal equality for women',
    category: 'good',
    status: 'published',
    summary:
      'The World Bank’s legal-equality index has risen substantially. It measures formal economic rights, not whether those rights are enforced or experienced equally.',
    plannedMetric: 'Women, Business and the Law Index',
    geography: 'World and selected countries',
    sourceHint: 'World Bank Women, Business and the Law, via Our World in Data',
    comparison: {
      title: 'What the index measures',
      fields: [
        {
          label: 'Measure',
          value: 'A 0–100 index of legal gender equality across mobility, workplace, pay, marriage, parenthood, entrepreneurship, assets, and pension.',
        },
        {
          label: 'Scope',
          value: 'The chart records laws and regulations that affect women’s economic opportunity in the World Bank’s standardized country comparison.',
        },
        {
          label: 'Time',
          value: 'The historical series runs from 1970 to 2023 in this release. Selected country checkpoints are shown at 1970, 1990, 2010, and 2023.',
        },
        {
          label: 'Limit',
          value: 'It describes formal legal provisions, not enforcement, social norms, political representation, safety, or women’s actual economic outcomes.',
        },
      ],
    },
  },
  {
    slug: 'child-mortality',
    title: 'Child mortality',
    category: 'good',
    status: 'published',
    summary:
      'The chance of dying before age five has fallen sharply, but the distance between countries remains visible.',
    plannedMetric: 'Under-five mortality rate',
    geography: 'World and regions',
    sourceHint: 'UN Inter-agency Group for Child Mortality Estimation',
    comparison: {
      title: 'What child mortality means here',
      fields: [
        {
          label: 'Measure',
          value: 'Estimated deaths before age five per 100 live births, often called the under-five mortality rate.',
        },
        {
          label: 'Long run',
          value: 'The world chart uses the longest documented OWID series, with five-year checkpoints from 1800 to 2020 and a 2024 endpoint.',
        },
        {
          label: 'Panel',
          value: 'The country chart uses exact UN IGME observations for Sweden, Brazil, India, Nigeria, and the United States at shared checkpoints.',
        },
        {
          label: 'Limit',
          value: 'These are modelled estimates of probability, not a simple count of deaths; country coverage and uncertainty vary over time.',
        },
      ],
    },
  },
  {
    slug: 'life-expectancy',
    title: 'Life expectancy',
    category: 'good',
    status: 'published',
    summary:
      'People are living longer than previous generations did, while the pandemic and country gaps keep the line honest.',
    plannedMetric: 'Life expectancy at birth',
    geography: 'World and countries',
    sourceHint: 'UN World Population Prospects',
    comparison: {
      title: 'What life expectancy means here',
      fields: [
        {
          label: 'Measure',
          value: 'Period life expectancy at birth: the average years a newborn would live if that year’s age-specific death rates stayed constant.',
        },
        {
          label: 'Long run',
          value: 'The world series uses the longest documented OWID compilation, from 1770 through 2023.',
        },
        {
          label: 'Panel',
          value: 'Selected country checkpoints show Sweden, Brazil, India, Nigeria, and the United States at 1950, 1980, 2000, and 2023.',
        },
        {
          label: 'Limit',
          value: 'It is a period measure, not a prediction for a baby born today, and historical estimates have different source coverage and uncertainty.',
        },
      ],
    },
  },
  {
    slug: 'vaccination-coverage',
    title: 'DTP3 vaccination coverage',
    category: 'good',
    status: 'published',
    summary:
      'The share of one-year-olds receiving a third DTP dose rose sharply, dipped during the pandemic, and recovered without reaching every child.',
    plannedMetric: 'Third dose of the diphtheria, tetanus, and pertussis vaccine (DTP3)',
    geography: 'World and countries',
    sourceHint: 'WHO and UNICEF estimates',
    comparison: {
      title: 'What vaccination coverage means here',
      fields: [
        {
          label: 'Measure',
          value: 'Share of one-year-olds who received the third dose of the diphtheria, tetanus, and pertussis vaccine (DTP3).',
        },
        {
          label: 'Long run',
          value: 'The world series runs from 1980 to 2024 and keeps the annual source estimates, including the pandemic-era decline.',
        },
        {
          label: 'Panel',
          value: 'Selected countries are shown at common checkpoints in 2000, 2019, and 2024.',
        },
        {
          label: 'Limit',
          value: 'DTP3 is one routine-vaccine indicator; it does not measure every vaccine, protection quality, or whether every child completed the schedule on time.',
        },
      ],
    },
  },
  {
    slug: 'electricity-and-sanitation',
    title: 'Electricity and sanitation',
    category: 'good',
    status: 'published',
    summary:
      'Electricity access and at least basic sanitation have spread, but they remain separate services with different gaps and definitions.',
    plannedMetric: 'Share of the population with electricity access and basic sanitation use',
    geography: 'World and countries',
    sourceHint: 'World Bank and WHO/UNICEF Joint Monitoring Programme, via Our World in Data',
    comparison: {
      title: 'Two basic services, two definitions',
      fields: [
        {
          label: 'Electricity',
          value: 'Share of the population with an electricity source capable of basic lighting and charging a phone or radio for four hours per day.',
        },
        {
          label: 'Sanitation',
          value: 'Share of the population using an improved sanitation facility that is not shared with another household.',
        },
        {
          label: 'Scope',
          value: 'The world electricity series runs from 1998 to 2024 in this extract; the sanitation series runs from 2000 to 2024. Selected countries use common checkpoints in 2000, 2010, and 2024.',
        },
        {
          label: 'Limit',
          value: 'Neither measure captures affordability, reliability, service quality, or the full safely managed sanitation standard.',
        },
      ],
    },
  },
  {
    slug: 'extreme-poverty',
    title: 'Extreme poverty',
    category: 'good',
    status: 'published',
    summary:
      'The share of people below the international poverty line has fallen sharply, while the remaining burden is concentrated and uneven.',
    plannedMetric: 'Share of people below the $3-a-day international poverty line',
    geography: 'World and countries',
    sourceHint: 'World Bank Poverty and Inequality Platform, via Our World in Data',
    comparison: {
      title: 'What the poverty line compares',
      fields: [
        {
          label: 'Measure',
          value: 'Share of people living in a household with income or consumption below $3 per person per day, expressed in 2021 international dollars.',
        },
        {
          label: 'World',
          value: 'The world series runs from 1990 to 2026. The source-extrapolated 2023–2026 tail is marked separately from the earlier series.',
        },
        {
          label: 'Countries',
          value: 'Selected-country points preserve the years available in the consolidated source; survey years are not synchronized and no missing years are interpolated.',
        },
        {
          label: 'Limit',
          value: 'The line is a monetary floor, not a complete measure of deprivation. Countries may use income or consumption data, and survey definitions can change over time.',
        },
      ],
    },
  },
  {
    slug: 'ceo-pay-gap',
    title: 'The CEO pay gap',
    category: 'bad',
    status: 'published',
    summary: 'How compensation at the top has pulled away from the typical worker in the United States.',
    plannedMetric: 'CEO-to-worker compensation ratio',
    geography: 'United States',
    sourceHint: 'Economic Policy Institute',
    comparison: {
      title: 'What the ratio compares',
      fields: [
        {
          label: 'Numerator',
          value: 'Average annual compensation for CEOs of the largest US public companies in EPI’s sample.',
        },
        {
          label: 'Denominator',
          value: 'Average wages plus benefits for private-sector production and nonsupervisory workers on a full-time, full-year basis.',
        },
        {
          label: 'Limit',
          value: 'An economy-wide average-to-average contrast, not an individual company’s CEO-to-median-employee ratio.',
        },
      ],
    },
  },
  {
    slug: 'climate-change',
    title: 'Climate change',
    category: 'bad',
    status: 'published',
    summary:
      'Annual temperature anomalies vary, while recent decades sit well above the earlier NASA baseline.',
    plannedMetric: 'Global land-ocean surface temperature anomaly',
    geography: 'World',
    sourceHint: 'NASA Goddard Institute for Space Studies GISTEMP v4',
    comparison: {
      title: 'What the temperature line compares',
      fields: [
        {
          label: 'Measure',
          value: 'NASA GISTEMP v4 global land-ocean surface temperature anomaly, in degrees Celsius.',
        },
        {
          label: 'Baseline',
          value: 'Each annual value is measured relative to NASA’s 1951–1980 mean.',
        },
        {
          label: 'Scope',
          value: 'The full-year annual series runs from 1880 to 2025. Decade averages are calculated from those annual rows; the 2020s average covers 2020–2025 only.',
        },
        {
          label: 'Limit',
          value: 'A global average hides regional and seasonal differences. This page shows the observed temperature signal, not a forecast or an impact estimate.',
        },
      ],
    },
  },
  {
    slug: 'wars-and-conflict',
    title: 'Wars and conflict',
    category: 'bad',
    status: 'published',
    summary:
      'State-based conflict can be counted by deaths and by active conflicts. Those measures describe different parts of organized violence.',
    plannedMetric: 'Battle deaths and conflict incidence',
    geography: 'World and regions',
    sourceHint: 'UCDP and Our World in Data',
    comparison: {
      title: 'Two measures of conflict, kept separate',
      fields: [
        {
          label: 'Deaths',
          value: 'Annual battle-related deaths of combatants and civilians in ongoing interstate, intrastate, and extrasystemic conflicts.',
        },
        {
          label: 'Conflicts',
          value: 'The number of ongoing state-based conflicts that caused at least 25 deaths in a year, summed across four conflict types.',
        },
        {
          label: 'Coverage',
          value: 'Worldwide annual observations from 1946 to 2025. The death series uses PRIO before 1989 and UCDP from 1989 onward.',
        },
        {
          label: 'Limit',
          value: 'Deaths from disease, hunger, displacement, and other indirect effects are excluded. Conflict counts do not measure intensity, duration, or civilian harm on their own.',
        },
      ],
    },
  },
  {
    slug: 'inequality-by-country',
    title: 'Rich and poor',
    category: 'bad',
    status: 'published',
    summary:
      'Inequality moves differently across countries: some lines rose, some fell, and the surveys do not all measure the same welfare concept.',
    plannedMetric: 'Gini coefficient',
    geography: 'Selected countries',
    sourceHint: 'World Bank Poverty and Inequality Platform',
    comparison: {
      title: 'What the Gini lines compare',
      fields: [
        {
          label: 'Measure',
          value: 'The Gini coefficient, from 0 for perfect equality to 1 for maximum inequality; higher values mean a more unequal distribution.',
        },
        {
          label: 'Panel',
          value: 'United States, Brazil, China, India, Nigeria, South Africa, and Germany, using every available observation retained by the World Bank PIP series.',
        },
        {
          label: 'Welfare data',
          value: 'Depending on country and year, the underlying survey measures disposable income after taxes and benefits or household consumption per person.',
        },
        {
          label: 'Limit',
          value: 'Survey years and methods differ, so country levels are not a clean global ranking and missing years are not interpolated.',
        },
      ],
    },
  },
  {
    slug: 'biodiversity-loss',
    title: 'Monitored vertebrate populations',
    category: 'bad',
    status: 'published',
    summary:
      'The Living Planet Index shows a sharp decline in monitored vertebrate populations since 1970, with regional trends moving at different speeds.',
    plannedMetric: 'Living Planet Index of monitored vertebrate populations',
    geography: 'World and broad regions',
    sourceHint: 'Living Planet Index and IUCN Red List',
    comparison: {
      title: 'What the Living Planet Index measures',
      fields: [
        {
          label: 'Measure',
          value: 'The average change in the size of monitored vertebrate populations, indexed to 100 in 1970.',
        },
        {
          label: 'Scope',
          value: 'The world series covers 34,836 monitored populations across 5,495 native vertebrate species in the 2024 report; the regional chart shows five broad regions.',
        },
        {
          label: 'Uncertainty',
          value: 'The world chart includes the report’s lower and upper estimates around the central index; regional checkpoints show central estimates only.',
        },
        {
          label: 'Limit',
          value: 'This is not a census of all wildlife, a count of species, or a direct measure of extinction. Monitoring coverage is uneven and the index is sensitive to which populations are observed.',
        },
      ],
    },
  },
  {
    slug: 'forced-displacement',
    title: 'Refugees and forced displacement',
    category: 'bad',
    status: 'published',
    summary:
      'The long series counts refugees. A separate four-category UNHCR panel shows how internally displaced people now dominate that accounting boundary.',
    plannedMetric:
      'Refugees, internally displaced people, asylum-seekers, and other people in need of international protection',
    geography: 'World and regions',
    sourceHint: 'UNHCR Refugee Data Finder and Global Trends',
    comparison: {
      title: 'What the displacement series compares',
      fields: [
        {
          label: 'Measure',
          value: 'Year-end stocks of people in four UNHCR categories: refugees, asylum-seekers, internally displaced people, and other people in need of international protection.',
        },
        {
          label: 'Long run',
          value: 'The refugee series runs from 1951 to 2024. The other three categories have comparable observations from 1993; the other-protection series begins in 2018.',
        },
        {
          label: 'Scope',
          value: 'The charts use the UNHCR global aggregate. They do not count how many people fled during a year, and they do not add stateless people, others of concern, or host communities.',
        },
        {
          label: 'Limit',
          value: 'UNHCR’s 2024 headline total is broader than this consistent API extract because it also incorporates UNRWA and IDMC accounting. Those systems are not silently combined here.',
        },
      ],
    },
  },
  {
    slug: 'air-pollution',
    title: 'Ambient PM2.5 exposure',
    category: 'bad',
    status: 'published',
    summary:
      'Population-weighted ambient PM2.5 exposure has fallen in some countries, but the world estimate remains above the WHO health guideline.',
    plannedMetric: 'Population-weighted annual mean PM2.5 exposure',
    geography: 'World and selected countries',
    sourceHint: 'Global Burden of Disease Study, World Bank, Our World in Data, and WHO',
    comparison: {
      title: 'What the air-pollution series compares',
      fields: [
        {
          label: 'Measure',
          value: 'Population-weighted annual mean exposure to outdoor fine particulate matter (PM2.5), measured in micrograms per cubic metre.',
        },
        {
          label: 'Panel',
          value: 'The world and six selected countries use the same annual 1990–2023 GBD 2023 series, without filling missing years.',
        },
        {
          label: 'Reference',
          value: 'The 5 µg/m³ line is WHO’s 2021 annual mean guideline recommendation; it is a health reference, not a legal limit or a claim that risk vanishes below it.',
        },
        {
          label: 'Limit',
          value: 'These are population-weighted modeled exposure estimates, not direct monitor readings, source attribution, or a count of pollution-related deaths.',
        },
      ],
    },
  },
  {
    slug: 'democratic-backsliding',
    title: 'Democratic backsliding',
    category: 'bad',
    status: 'published',
    summary:
      'The V-Dem liberal-democracy index fell in some countries between 2020 and 2025 and rose in others; small changes need cautious reading.',
    plannedMetric: 'V-Dem Liberal Democracy Index',
    geography: 'Selected countries and countries with comparable 2020–2025 values',
    sourceHint: 'V-Dem and Our World in Data',
    comparison: {
      title: 'What backsliding means here',
      fields: [
        {
          label: 'Index',
          value: 'V-Dem’s Liberal Democracy Index, a 0–1 estimate combining elections, civil liberties, rights, and executive constraints.',
        },
        {
          label: 'Change',
          value: 'The map shows the index in 2025 minus the index in 2020; negative values indicate deterioration in this measure.',
        },
        {
          label: 'Limit',
          value: 'This is a model-based signal of change, not a causal explanation or a complete ranking of political systems.',
        },
      ],
    },
  },
  {
    slug: 'tech-and-ai',
    title: 'Firm AI adoption',
    category: 'future',
    status: 'published',
    summary:
      'Eurostat records a rising share of firms using at least one AI technology across the EU and selected European countries. The missing 2022 observation remains a reporting gap.',
    plannedMetric: 'Share of enterprises using at least one AI technology',
    geography: 'EU-27 and selected European countries',
    sourceHint: 'Eurostat enterprise ICT survey',
    comparison: {
      title: 'What AI adoption means here',
      fields: [
        {
          label: 'Measure',
          value: 'Share of enterprises with 10 or more persons employed that report using at least one listed AI technology.',
        },
        {
          label: 'Scope',
          value: 'Covered non-financial activities in the EU-27 and a selected eight-country panel; the enterprise is the unit, not the worker.',
        },
        {
          label: 'Reporting',
          value: 'The comparable extract reports 2021, 2023, 2024, and 2025. Eurostat has no observation in this extract for 2022.',
        },
        {
          label: 'Limit',
          value: 'The measure records adoption, not productivity, job creation, job loss, task displacement, worker access, or social benefit.',
        },
      ],
    },
  },
  {
    slug: 'employment-work-and-skills',
    title: 'Employment rates',
    category: 'future',
    status: 'published',
    summary:
      'The employment-to-population ratio provides a historical baseline for labour-market participation. It says nothing by itself about job quality, skills, or security.',
    plannedMetric: 'Employment-to-population ratio',
    geography: 'World and selected countries',
    sourceHint: 'International Labour Organization Modelled Estimates, via World Bank and Our World in Data',
    comparison: {
      title: 'What the employment rate compares',
      fields: [
        {
          label: 'Measure',
          value: 'Share of people aged 15 and older who worked for at least one hour in the reference period, in paid work, self-employment, or production for own use.',
        },
        {
          label: 'World',
          value: 'The annual global series runs from 1991 to 2025 and uses the ILO’s modeled estimates for comparable coverage.',
        },
        {
          label: 'Panel',
          value: 'Germany, India, Japan, Nigeria, Sweden, and the United States are shown at shared checkpoints: 1991, 2000, 2010, 2020, and 2025.',
        },
        {
          label: 'Limit',
          value: 'The rate does not tell us whether work is secure, well paid, full-time, formal, skilled, or compatible with a healthy life.',
        },
      ],
    },
  },
  {
    slug: 'wealth-distribution-and-inequality',
    title: 'Top 1% wealth share',
    category: 'future',
    status: 'published',
    summary:
      'World Inequality Database estimates show the share of household wealth held by the richest 1%. The historical checkpoints are sparse and differ across countries.',
    plannedMetric: 'Share of household net wealth held by the richest 1%',
    geography: 'World and selected countries',
    sourceHint: 'World Inequality Database, via Our World in Data',
    comparison: {
      title: 'What the wealth-share measure compares',
      fields: [
        {
          label: 'Measure',
          value: 'Share of total household net wealth held by the richest 1%, where wealth includes financial and non-financial assets minus debts.',
        },
        {
          label: 'Long run',
          value: 'The world series keeps every available WID observation from 1820 to 2024; historical points are unevenly spaced rather than interpolated.',
        },
        {
          label: 'Panel',
          value: 'China, France, Germany, India, South Africa, and the United States are shown at shared checkpoints from 1820 to 2024.',
        },
        {
          label: 'Limit',
          value: 'These are modeled distributional estimates, not a direct census of household balance sheets; they do not show the bottom 50%, mobility, income, or living costs.',
        },
      ],
    },
  },
  {
    slug: 'economic-growth-debt-and-public-finance',
    title: 'World growth and central-government debt',
    category: 'future',
    status: 'published',
    summary:
      'World GDP growth and selected countries’ central-government debt describe two separate historical series. Together they do not establish fiscal capacity or sustainability.',
    plannedMetric: 'Annual GDP growth and gross central-government debt as a share of GDP',
    geography: 'World growth and six selected countries',
    sourceHint: 'World Bank national accounts and public-sector debt data, via Our World in Data',
    comparison: {
      title: 'Two signals, kept separate',
      fields: [
        {
          label: 'Growth',
          value: 'Annual percentage change in inflation-adjusted GDP for the world, from 2000 through 2023.',
        },
        {
          label: 'Debt',
          value: 'Gross central-government debt as a share of GDP for Canada, France, Germany, Italy, the United Kingdom, and the United States.',
        },
        {
          label: 'Scope',
          value: 'Both series are observed annual data through 2023; the debt panel begins in 2000 and does not represent every public-sector liability.',
        },
        {
          label: 'Limit',
          value: 'These lines do not explain why growth or debt moved, measure productivity composition, or show interest burdens, household debt, or fiscal sustainability by themselves.',
        },
      ],
    },
  },
  {
    slug: 'inflation-prices-and-energy',
    title: 'Inflation and renewable electricity',
    category: 'future',
    status: 'published',
    summary:
      'Consumer inflation and renewable electricity share move on different clocks. The page keeps them separate rather than implying a common mechanism.',
    plannedMetric:
      'Consumer inflation and renewable electricity share',
    geography: 'World and six selected countries',
    sourceHint:
      'IMF International Financial Statistics via World Bank and Ember, via Our World in Data',
    comparison: {
      title: 'Two signals, kept separate',
      fields: [
        {
          label: 'Prices',
          value: 'Annual percentage change in consumer prices: the change in the cost of a representative household consumption basket.',
        },
        {
          label: 'Energy',
          value: 'Share of electricity generation from renewable sources, including hydropower, wind, solar, bioenergy, geothermal, wave, and tidal generation.',
        },
        {
          label: 'Coverage',
          value: 'The world inflation series runs from 1981 to 2025; renewable-electricity history runs from 1900 to 2025. The country inflation panel uses Brazil, Germany, India, Sweden, the United Kingdom, and the United States at 2000, 2010, 2020, and 2024.',
        },
        {
          label: 'Limit',
          value: 'Inflation is not the same as every household’s cost of living, and renewable electricity is not renewable energy’s share of all energy use. The two lines are context, not a causal claim.',
        },
      ],
    },
  },
  {
    slug: 'demographics-and-migration',
    title: 'Population age and migrant stock',
    category: 'future',
    status: 'published',
    summary:
      'Median age and the foreign-born share describe two historical population changes. Only the UN median-age series continues into a source-backed scenario.',
    plannedMetric: 'Median age and share of the population born in another country',
    geography: 'World and six selected countries',
    sourceHint:
      'UN World Population Prospects and UN DESA International Migrant Stock, via Our World in Data',
    comparison: {
      title: 'Two population signals, kept separate',
      fields: [
        {
          label: 'Age',
          value: 'Median age: the age dividing a population into two equal halves. The world chart separates observed estimates from the UN medium-scenario projection.',
        },
        {
          label: 'Migration',
          value: 'Share of residents born in another country, measured as migrant stock rather than annual migration flow.',
        },
        {
          label: 'Coverage',
          value: 'Median-age estimates run from 1950 to 2023, with a medium-scenario projection from 2024 to 2100. Migrant-stock observations cover 1990 to 2024 at five-year intervals.',
        },
        {
          label: 'Limit',
          value: 'Neither line measures dependency, pension readiness, integration, or the causes of population change. The projection is a scenario, and the migration series is not a flow count.',
        },
      ],
    },
  },
  {
    slug: 'housing-cities-and-infrastructure',
    title: 'Housing price-to-income',
    category: 'future',
    status: 'published',
    summary:
      'The OECD house-price-to-income index compares national house prices with disposable income. It is a housing baseline, not a city or infrastructure measure.',
    plannedMetric: 'OECD house-price-to-income index',
    geography: 'Canada, France, Germany, Japan, Netherlands, Sweden, UK, and US',
    sourceHint: 'OECD Analytical house prices indicators',
    comparison: {
      title: 'What the housing index compares',
      fields: [
        {
          label: 'Numerator',
          value: 'OECD’s nominal residential house-price index for each country.',
        },
        {
          label: 'Denominator',
          value: 'Nominal disposable household income per head in the same country.',
        },
        {
          label: 'Base',
          value: 'The plotted HPI_YDH index is set to 100 in 2015. The secondary benchmark expresses 2024 as a percentage of each country’s own long-term average.',
        },
        {
          label: 'Limit',
          value: 'It does not measure rents, mortgage payments, housing quality, construction supply, city-level affordability, urban productivity, or infrastructure capacity.',
        },
      ],
    },
  },
  {
    slug: 'health-longevity-and-human-capital',
    title: 'Healthy life expectancy and health spending',
    category: 'future',
    status: 'published',
    summary:
      'Healthy life expectancy and health spending show two historical health measures with different end years. Neither series measures human capital as a whole.',
    plannedMetric: 'Healthy life expectancy and total health spending per person',
    geography: 'World and six selected countries',
    sourceHint:
      'WHO Global Health Observatory and Global Health Expenditure Database via World Bank and Our World in Data',
    comparison: {
      title: 'Two health signals, kept separate',
      fields: [
        {
          label: 'Healthy years',
          value: 'Healthy life expectancy at birth: estimated years lived in full health after adjusting period life expectancy for disease and injury burden.',
        },
        {
          label: 'Spending',
          value: 'Total current health expenditure per person: public and private spending combined, expressed in current international dollars at purchasing power parity.',
        },
        {
          label: 'Coverage',
          value: 'Healthy life expectancy runs from 2000 to 2021; health-spending data runs from 2000 to 2023 in this extract. Both use Brazil, Germany, India, Japan, Nigeria, and the United States at shared checkpoints.',
        },
        {
          label: 'Limit',
          value: 'Spending is not care quality or access, and healthy life expectancy is not a diagnosis count. The two measures are context, not evidence that spending caused an outcome.',
        },
      ],
    },
  },
  {
    slug: 'governance-risk-and-security',
    title: 'Rule of law and security',
    category: 'future',
    status: 'published',
    summary:
      'World Justice Project scores describe rule of law and its order-and-security factor across changing country panels. They are historical index estimates, not a complete risk register.',
    plannedMetric: 'WJP Rule of Law Index and its Order and Security factor',
    geography: 'Country median and eight selected countries',
    sourceHint: 'World Justice Project Rule of Law Index',
    comparison: {
      title: 'Two dimensions of institutional capacity',
      fields: [
        {
          label: 'Overall score',
          value: 'The WJP Rule of Law Index score combines eight factors covering constraints on government powers, corruption, open government, rights, order and security, regulatory enforcement, civil justice, and criminal justice.',
        },
        {
          label: 'Order and security',
          value: 'Factor 5 measures the absence of crime, civil conflict, and violent redress, as defined by the WJP index. It is one factor, not a crime count.',
        },
        {
          label: 'Median',
          value: 'The median is calculated across countries with a reported score in each WJP edition. It is an unweighted country median, not a population-weighted world estimate.',
        },
        {
          label: 'Limit',
          value: 'The index is based on household and expert surveys, coverage changes across editions, and does not measure every dimension of trust, resilience, or future risk.',
        },
      ],
    },
  },
  {
    slug: 'climate-and-environmental-futures',
    title: 'Historical fossil CO₂ emissions',
    category: 'future',
    status: 'published',
    summary:
      'Territorial fossil CO₂ emissions have risen sharply. Total and per-person accounting answer different questions and do not provide a future pathway.',
    plannedMetric: 'Territorial fossil CO₂ emissions and fossil CO₂ emissions per person',
    geography: 'World and eight selected countries',
    sourceHint: 'Global Carbon Project via Our World in Data',
    comparison: {
      title: 'What the emissions lines compare',
      fields: [
        {
          label: 'Total',
          value: 'Annual territorial fossil CO₂ emissions from coal, oil, gas, flaring, and cement, measured in million tonnes.',
        },
        {
          label: 'Per person',
          value: 'The same territorial fossil CO₂ total divided by the population in that year, measured in tonnes per person.',
        },
        {
          label: 'Coverage',
          value: 'The world series runs from 1850 to 2024. The country panel uses Brazil, China, Germany, India, Japan, Nigeria, the United Kingdom, and the United States at shared checkpoints from 1950 to 2024.',
        },
        {
          label: 'Limit',
          value: 'These are production-based emissions, not the emissions embodied in imported goods. They exclude land-use change and do not forecast future emissions or climate impacts.',
        },
      ],
    },
  },
  {
    slug: 'capital-markets-and-money-flows',
    title: 'Private-sector credit relative to GDP',
    category: 'future',
    status: 'published',
    summary:
      'Private-sector credit relative to GDP is a historical credit-stock measure. It does not measure capital-market activity, annual lending, or money flows directly.',
    plannedMetric: 'Credit to the private non-financial sector as a share of GDP',
    geography: 'BIS all-reporting-economies aggregate and eight selected countries',
    sourceHint: 'Bank for International Settlements, total credit dataset',
    comparison: {
      title: 'What the credit ratio compares',
      fields: [
        {
          label: 'Numerator',
          value: 'The stock of credit from all lender sectors to the private non-financial sector, valued at market value and adjusted for breaks.',
        },
        {
          label: 'Denominator',
          value: 'Gross domestic product in the same economy and period. The ratio is expressed as a percentage of GDP.',
        },
        {
          label: 'Timing',
          value: 'Each point is the fourth-quarter observation for that year. The aggregate starts in 1999; the eight-country panel uses a common 2000–2025 window.',
        },
        {
          label: 'Limit',
          value: 'A high ratio is not automatically a crisis, and a low ratio is not automatically healthy. This is a credit-stock signal, not a measure of wealth, annual lending, interest burden, or market capitalization.',
        },
      ],
    },
  },
];

const evidenceBySlug: Record<string, StoryEvidence> = {
  'world-hunger': {
    status: 'historical-estimate',
    dataThrough: '2024 (food supply: 2023)',
    note: 'FAO estimates undernourishment; the longer food-supply series is a separate historical measure.',
    cardLabel: 'Historical estimate',
  },
  literacy: {
    status: 'historical-observation',
    dataThrough: '2024',
    note: 'Country observations are reported in different years; the map is not a simultaneous snapshot.',
    cardLabel: 'Historical observations',
  },
  'womens-rights': {
    status: 'historical-observation',
    dataThrough: '2023',
    note: 'The index codes formal economic laws and regulations rather than lived outcomes.',
    cardLabel: 'Historical observations',
  },
  'child-mortality': {
    status: 'historical-estimate',
    dataThrough: '2024',
    note: 'The long reconstruction and modern UN estimates use different source coverage and uncertainty.',
    cardLabel: 'Historical estimate',
  },
  'life-expectancy': {
    status: 'historical-estimate',
    dataThrough: '2023',
    note: 'The series combines historical reconstructions with modern population estimates.',
    cardLabel: 'Historical estimate',
  },
  'vaccination-coverage': {
    status: 'historical-estimate',
    dataThrough: '2024',
    note: 'DTP3 is a routine-immunisation tracer, not a measure of every vaccine or service outcome.',
    cardLabel: 'Historical estimate',
  },
  'electricity-and-sanitation': {
    status: 'historical-estimate',
    dataThrough: '2024',
    note: 'Electricity access and sanitation use are separate service measures with different source histories.',
    cardLabel: 'Historical estimate',
  },
  'extreme-poverty': {
    status: 'source-extrapolation',
    dataThrough: '2026 (observed through 2022)',
    note: 'The final global points are source extrapolations, not new household surveys.',
    cardLabel: 'Source extrapolation',
  },
  'ceo-pay-gap': {
    status: 'historical-observation',
    dataThrough: '2025 (absolute compensation: 2024)',
    note: 'The comparable ratio is a United States series; the international material is separate context.',
    cardLabel: 'Historical observations',
  },
  'climate-change': {
    status: 'historical-observation',
    dataThrough: '2025',
    note: 'Annual land-ocean anomalies vary from year to year around a long-run warming trend.',
    cardLabel: 'Historical observations',
  },
  'wars-and-conflict': {
    status: 'historical-estimate',
    dataThrough: '2025',
    note: 'The series covers state-based conflict and battle-related deaths, not every consequence of war.',
    cardLabel: 'Historical estimate',
  },
  'inequality-by-country': {
    status: 'historical-estimate',
    dataThrough: '2024',
    note: 'Country points are survey observations with different welfare concepts and gaps between years.',
    cardLabel: 'Historical estimate',
  },
  'biodiversity-loss': {
    status: 'modelled-estimate',
    dataThrough: '2020',
    note: 'The Living Planet Index tracks monitored vertebrate populations, not all species or ecosystems.',
    cardLabel: 'Modelled estimate',
  },
  'forced-displacement': {
    status: 'historical-observation',
    dataThrough: '2024',
    note: 'The long series is refugees; the broader panel uses four UNHCR population categories.',
    cardLabel: 'Historical observations',
  },
  'air-pollution': {
    status: 'modelled-estimate',
    dataThrough: '2023',
    note: 'These are population-weighted ambient PM2.5 exposure estimates, not monitor readings or emissions.',
    cardLabel: 'Modelled estimate',
  },
  'democratic-backsliding': {
    status: 'modelled-estimate',
    dataThrough: '2025',
    note: 'V-Dem scores are modelled estimates; small changes should not be read without their uncertainty.',
    cardLabel: 'Modelled estimate',
  },
  'tech-and-ai': {
    status: 'historical-observation',
    dataThrough: '2025',
    note: 'Eurostat reports firm adoption in selected European economies; missing years are reporting gaps.',
    cardLabel: 'Historical baseline',
  },
  'employment-work-and-skills': {
    status: 'modelled-estimate',
    dataThrough: '2025',
    note: 'The core series is the modelled employment-to-population ratio for people aged 15 and older.',
    cardLabel: 'Historical baseline',
  },
  'wealth-distribution-and-inequality': {
    status: 'modelled-estimate',
    dataThrough: '2024',
    note: 'Selected World Inequality Database estimates are sparse checkpoints for the top 1% wealth share.',
    cardLabel: 'Historical baseline',
  },
  'economic-growth-debt-and-public-finance': {
    status: 'historical-observation',
    dataThrough: '2023',
    note: "World growth and selected countries' central-government debt are separate historical measures.",
    cardLabel: 'Historical baseline',
  },
  'inflation-prices-and-energy': {
    status: 'historical-observation',
    dataThrough: '2025',
    note: 'Consumer inflation and renewable electricity share answer different questions and are shown separately.',
    cardLabel: 'Historical baseline',
  },
  'demographics-and-migration': {
    status: 'source-projection',
    dataThrough: '2024 observed; 2100 scenario',
    note: 'The UN medium scenario begins after the observed 2023 median-age series and depends on stated demographic assumptions.',
    cardLabel: 'Source scenario',
  },
  'housing-cities-and-infrastructure': {
    status: 'historical-observation',
    dataThrough: '2024',
    note: 'The plotted measure is a national house-price-to-income index, not a city or infrastructure measure.',
    cardLabel: 'Historical baseline',
  },
  'health-longevity-and-human-capital': {
    status: 'historical-estimate',
    dataThrough: '2023 (healthy life expectancy: 2021)',
    note: 'Healthy life expectancy and current-dollar health spending are separate measures with different end years.',
    cardLabel: 'Historical baseline',
  },
  'governance-risk-and-security': {
    status: 'modelled-estimate',
    dataThrough: '2025',
    note: 'The World Justice Project scores rule of law and order and security for changing country panels.',
    cardLabel: 'Historical baseline',
  },
  'climate-and-environmental-futures': {
    status: 'historical-observation',
    dataThrough: '2024',
    note: 'The charts show territorial fossil CO2 accounting, not impacts, adaptation, or a future pathway.',
    cardLabel: 'Historical baseline',
  },
  'capital-markets-and-money-flows': {
    status: 'historical-observation',
    dataThrough: '2025',
    note: 'Private-sector credit relative to GDP is a credit-stock ratio, not a direct measure of capital-market activity.',
    cardLabel: 'Historical baseline',
  },
};

export const stories: StoryDefinition[] = storyCatalogue.map((story) => {
  const evidence = evidenceBySlug[story.slug];
  if (!evidence) {
    throw new Error(`Story ${story.slug} is missing evidence metadata`);
  }
  return { ...story, evidence };
});

export function getStory(category: string | undefined, slug: string | undefined) {
  return stories.find((story) => story.category === category && story.slug === slug);
}

export function getStoriesByCategory(category: StoryCategory) {
  return stories
    .map((story, index) => ({ story, index }))
    .filter(({ story }) => story.category === category)
    .sort((left, right) => {
      const statusOrder = { published: 0, 'coming-soon': 1 };
      return (
        statusOrder[left.story.status] - statusOrder[right.story.status] ||
        left.index - right.index
      );
    })
    .map(({ story }) => story);
}

export function getStoryCategoryPresentation(category: StoryCategory) {
  return storyCategoryPresentation[category];
}

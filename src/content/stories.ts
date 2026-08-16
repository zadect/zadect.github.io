export type StoryCategory = 'good' | 'bad' | 'future';
export type StoryStatus = 'published' | 'coming-soon';

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
    description: 'Not a victory lap. A record of what has improved, and where the work remains.',
  },
  bad: {
    label: 'The bad',
    signalLabel: 'Bad signal',
    heading: 'Signals we cannot look away from',
    description: 'Not a prophecy. A record of pressure, concentration, and consequences.',
  },
  future: {
    label: 'The future',
    signalLabel: 'Future signal',
    heading: 'Questions for the years ahead',
    description: 'A working catalogue of changes worth measuring before conclusions are drawn.',
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
}

export const stories: StoryDefinition[] = [
  {
    slug: 'world-hunger',
    title: 'World hunger',
    category: 'good',
    status: 'published',
    summary: 'A long decline in the share of people without enough food, with important limits to the evidence.',
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
    title: 'Literacy',
    category: 'good',
    status: 'published',
    summary: 'Basic literacy has spread widely, though the map still shows uneven coverage and unfinished progress.',
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
    title: "Women's rights",
    category: 'good',
    status: 'published',
    summary:
      'The laws shaping women’s economic lives have changed substantially, but legal equality is not the same as lived equality.',
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
    title: 'Vaccination coverage',
    category: 'good',
    status: 'published',
    summary:
      'Routine immunisation reached far more children, but the recent dip shows how quickly coverage can slip.',
    plannedMetric: 'Share of children receiving routine vaccines',
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
      'Basic services have spread widely, but the distance between electricity access and sanitation use still shapes daily life.',
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
      'The global temperature anomaly has moved upward for more than a century, turning a noisy annual line into a clear shift in the baseline.',
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
      'Conflict has two different signals: how many people die in fighting, and how many state-based conflicts remain active.',
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
    plannedMetric: 'Gini coefficient and income shares',
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
    title: 'Biodiversity loss',
    category: 'bad',
    status: 'published',
    summary:
      'Monitored vertebrate populations have declined sharply since 1970, with regional lines moving at very different speeds.',
    plannedMetric: 'Species population and extinction-risk indicators',
    geography: 'World and biomes',
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
    title: 'Forced displacement',
    category: 'bad',
    status: 'published',
    summary:
      'The number of people counted in UNHCR displacement categories has risen, while internal displacement now dominates the comparable panel.',
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
    title: 'Air pollution',
    category: 'bad',
    status: 'coming-soon',
    summary: 'The health cost of polluted air and the uneven pace of clean-up.',
    plannedMetric: 'Fine particulate matter exposure',
    geography: 'World and cities',
    sourceHint: 'WHO Global Health Observatory',
  },
  {
    slug: 'democratic-backsliding',
    title: 'Democratic backsliding',
    category: 'bad',
    status: 'published',
    summary: 'The latest five-year changes show democratic deterioration in some countries and recovery in others.',
    plannedMetric: 'Democracy and civil-liberties indices',
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
    title: 'AI & Tech',
    category: 'future',
    status: 'published',
    summary:
      'Businesses are adopting AI faster, but adoption alone does not tell us whether work is better, fewer jobs exist, or productivity has risen.',
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
    title: 'Employment, Work & Skills',
    category: 'future',
    status: 'coming-soon',
    summary: 'Whether labour-market transitions lead to more secure work and broader access to useful skills.',
    plannedMetric:
      'Vacancy and unemployment rates, unstable schedules, involuntary part-time work, re-employment, occupation switches, and training participation',
    geography: 'Countries with comparable labour-force and skills surveys',
    sourceHint:
      'ILOSTAT, OECD Employment Outlook and Job Quality Framework, Eurostat Labour Force Survey, and OECD PIAAC',
  },
  {
    slug: 'wealth-distribution-and-inequality',
    title: 'Wealth Distribution & Inequality',
    category: 'future',
    status: 'coming-soon',
    summary: 'Who receives economic growth, who can move between income groups, and who faces rising living costs.',
    plannedMetric:
      'Income and wealth Gini coefficients, top and bottom income shares, intergenerational mobility, and housing costs relative to income',
    geography: 'Countries with comparable household-distribution data',
    sourceHint:
      'World Inequality Database, World Bank Poverty and Inequality Platform, World Bank mobility data, and OECD Affordable Housing Database',
  },
  {
    slug: 'economic-growth-debt-and-public-finance',
    title: 'Economic Growth, Debt & Public Finance',
    category: 'future',
    status: 'coming-soon',
    summary: 'The mix of productivity, debt, and public finance behind economic room to act.',
    plannedMetric:
      'Growth-accounting components, household debt and delinquencies, public debt-to-GDP, and interest payments relative to public revenue',
    geography: 'Advanced and emerging economies',
    sourceHint:
      'OECD, Penn World Table or Conference Board, Bank for International Settlements, and IMF World Economic Outlook and Fiscal Monitor',
  },
  {
    slug: 'inflation-prices-and-energy',
    title: 'Inflation, Prices & Energy',
    category: 'future',
    status: 'coming-soon',
    summary: 'How prices, energy systems, and efficiency shape the affordability of the next decade.',
    plannedMetric:
      'Core, headline, goods, and services inflation; renewable electricity share; energy intensity; and energy-price volatility',
    geography: 'World and major economies',
    sourceHint: 'OECD, IMF International Financial Statistics, Ember, and International Energy Agency',
  },
  {
    slug: 'demographics-and-migration',
    title: 'Demographics & Migration',
    category: 'future',
    status: 'coming-soon',
    summary: 'Aging, workforce supply, and migration patterns that will shape economies and public services.',
    plannedMetric:
      'Median age, dependency ratios, pension replacement, labour-force participation, net migration, and labour-market integration',
    geography: 'World, regions, and OECD countries',
    sourceHint:
      'UN World Population Prospects, OECD Pensions at a Glance, ILOSTAT, UN DESA, and OECD Indicators of Immigrant Integration',
  },
  {
    slug: 'housing-cities-and-infrastructure',
    title: 'Housing, Cities & Infrastructure',
    category: 'future',
    status: 'published',
    summary:
      'House prices have moved faster than incomes in some countries, but a national price-to-income index is only one part of housing pressure.',
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
    title: 'Health, Longevity & Human Capital',
    category: 'future',
    status: 'coming-soon',
    summary: 'Longer lives, disease burden, care needs, and the capacity to participate in work and society.',
    plannedMetric:
      'Life and healthy-life expectancy, chronic-disease burden, health spending, disability, and older-worker participation',
    geography: 'World and countries with comparable health data',
    sourceHint:
      'WHO Global Health Observatory and Global Health Expenditure Database, IHME Global Burden of Disease, and ILOSTAT',
  },
  {
    slug: 'governance-risk-and-security',
    title: 'Governance, Risk & Security',
    category: 'future',
    status: 'coming-soon',
    summary: 'How trust, institutional capacity, and exposure to shocks affect a society’s ability to respond.',
    plannedMetric:
      'Institutional trust, rule of law, regulatory quality, policy responsiveness, and exposure to economic and climate shocks',
    geography: 'Countries and regions',
    sourceHint: 'OECD Trust Survey, World Justice Project, V-Dem, INFORM Risk, and ND-GAIN',
  },
  {
    slug: 'climate-and-environmental-futures',
    title: 'Climate & Environmental Futures',
    category: 'future',
    status: 'coming-soon',
    summary: 'Emissions, physical climate risks, and adaptation capacity that will shape the conditions ahead.',
    plannedMetric:
      'Sector greenhouse-gas emissions, carbon intensity, disaster costs, heat exposure, and adaptation readiness',
    geography: 'World, regions, and countries',
    sourceHint:
      'Global Carbon Project or EDGAR, WMO and EM-DAT, ND-GAIN, and compatible Our World in Data series',
  },
  {
    slug: 'capital-markets-and-money-flows',
    title: 'Capital Markets & Money Flows',
    category: 'future',
    status: 'coming-soon',
    summary: 'Where capital accumulates, how new firms are funded, and how financial conditions reach the real economy.',
    plannedMetric:
      'Capital-gain concentration, venture funding and startup survival, credit growth, policy rates, and corporate defaults',
    geography: 'Countries and capital markets with comparable coverage',
    sourceHint:
      'World Inequality Database, OECD financing and entrepreneurship data, Bank for International Settlements, and IMF',
  },
];

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

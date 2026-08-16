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
    status: 'coming-soon',
    summary: 'A future view of legal rights, political representation, and everyday autonomy.',
    plannedMetric: 'Composite legal and political rights indicators',
    geography: 'Countries and regions',
    sourceHint: 'World Bank Women, Business and the Law',
  },
  {
    slug: 'child-mortality',
    title: 'Child mortality',
    category: 'good',
    status: 'coming-soon',
    summary: 'The fall in deaths before age five and the places where progress is unfinished.',
    plannedMetric: 'Under-five mortality rate',
    geography: 'World and regions',
    sourceHint: 'UN Inter-agency Group for Child Mortality Estimation',
  },
  {
    slug: 'life-expectancy',
    title: 'Life expectancy',
    category: 'good',
    status: 'coming-soon',
    summary: 'Longer lives are one of the clearest signs of human progress, but not a uniform one.',
    plannedMetric: 'Life expectancy at birth',
    geography: 'World and countries',
    sourceHint: 'UN World Population Prospects',
  },
  {
    slug: 'vaccination-coverage',
    title: 'Vaccination coverage',
    category: 'good',
    status: 'coming-soon',
    summary: 'The spread of routine immunisation and the setbacks that can reverse it.',
    plannedMetric: 'Share of children receiving routine vaccines',
    geography: 'World and countries',
    sourceHint: 'WHO and UNICEF estimates',
  },
  {
    slug: 'electricity-and-sanitation',
    title: 'Electricity and sanitation',
    category: 'good',
    status: 'coming-soon',
    summary: 'Basic services that quietly change what daily life makes possible.',
    plannedMetric: 'Access to electricity and safely managed sanitation',
    geography: 'World and countries',
    sourceHint: 'World Bank and WHO/UNICEF JMP',
  },
  {
    slug: 'extreme-poverty',
    title: 'Extreme poverty',
    category: 'good',
    status: 'coming-soon',
    summary: 'The global poverty line has reached fewer people, while the remaining burden is concentrated.',
    plannedMetric: 'Share of people below the international poverty line',
    geography: 'World and countries',
    sourceHint: 'World Bank Poverty and Inequality Platform',
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
    status: 'coming-soon',
    summary: 'A future look at the temperature signal behind a changing climate.',
    plannedMetric: 'Global surface temperature anomaly',
    geography: 'World',
    sourceHint: 'NASA, NOAA, and Berkeley Earth',
  },
  {
    slug: 'wars-and-conflict',
    title: 'Wars and conflict',
    category: 'bad',
    status: 'coming-soon',
    summary: 'A careful comparison of conflict frequency, duration, and human cost.',
    plannedMetric: 'Battle deaths and conflict incidence',
    geography: 'World and regions',
    sourceHint: 'UCDP and Our World in Data',
  },
  {
    slug: 'inequality-by-country',
    title: 'Rich and poor',
    category: 'bad',
    status: 'coming-soon',
    summary: 'How income distributions have shifted within selected countries.',
    plannedMetric: 'Gini coefficient and income shares',
    geography: 'Selected countries',
    sourceHint: 'World Bank Poverty and Inequality Platform',
  },
  {
    slug: 'biodiversity-loss',
    title: 'Biodiversity loss',
    category: 'bad',
    status: 'coming-soon',
    summary: 'The pressure on species and ecosystems that prosperity can hide.',
    plannedMetric: 'Species population and extinction-risk indicators',
    geography: 'World and biomes',
    sourceHint: 'Living Planet Index and IUCN Red List',
  },
  {
    slug: 'forced-displacement',
    title: 'Forced displacement',
    category: 'bad',
    status: 'coming-soon',
    summary: 'The number of people pushed from home by conflict, persecution, and crisis.',
    plannedMetric: 'Refugees and internally displaced people',
    geography: 'World and regions',
    sourceHint: 'UNHCR Global Trends',
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
    title: 'Tech & AI',
    category: 'future',
    status: 'coming-soon',
    summary: 'How artificial intelligence spreads through work, changes tasks, and may affect productivity.',
    plannedMetric:
      'Firm AI adoption, AI tools by role or task, automation versus augmentation, and productivity growth by sector',
    geography: 'OECD countries and global context',
    sourceHint: 'OECD AI Policy Observatory, Stanford AI Index, ILO, and OECD Productivity Database',
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
    status: 'coming-soon',
    summary: 'Whether homes, construction, and productive cities keep pace with the people who depend on them.',
    plannedMetric:
      'Home-price and rent-to-income ratios, housing supply versus household formation, and metropolitan output per worker',
    geography: 'Countries and metropolitan areas with comparable data',
    sourceHint:
      'OECD Affordable Housing Database, Eurostat, national statistical agencies, and OECD metropolitan statistics',
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
  return stories.filter((story) => story.category === category);
}

export function getStoryCategoryPresentation(category: StoryCategory) {
  return storyCategoryPresentation[category];
}

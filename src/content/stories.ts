export type StoryCategory = 'good' | 'bad';
export type StoryStatus = 'published' | 'coming-soon';

export interface StoryDefinition {
  slug: string;
  title: string;
  category: StoryCategory;
  status: StoryStatus;
  summary: string;
  plannedMetric: string;
  geography: string;
  sourceHint: string;
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
  },
  {
    slug: 'literacy',
    title: 'Literacy',
    category: 'good',
    status: 'coming-soon',
    summary: 'How access to reading and writing has expanded across generations.',
    plannedMetric: 'Adult literacy rate',
    geography: 'World and regions',
    sourceHint: 'UNESCO Institute for Statistics',
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
    status: 'coming-soon',
    summary: 'A measured view of civic freedoms, institutions, and the quality of public choice.',
    plannedMetric: 'Democracy and civil-liberties indices',
    geography: 'Countries and regions',
    sourceHint: 'V-Dem and Freedom House',
  },
];

export function getStory(category: string | undefined, slug: string | undefined) {
  return stories.find((story) => story.category === category && story.slug === slug);
}

export function getStoriesByCategory(category: StoryCategory) {
  return stories.filter((story) => story.category === category);
}

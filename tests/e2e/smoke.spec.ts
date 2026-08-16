import { expect, test } from '@playwright/test';

test('serves cache-busted SVG and ICO favicon assets', async ({ page, request }) => {
  await page.goto('/');
  await expect(page.locator('link[rel="icon"][type="image/svg+xml"]')).toHaveAttribute(
    'href',
    './favicon.svg?v=2',
  );
  await expect(page.locator('link[rel="icon"][type="image/x-icon"]')).toHaveAttribute(
    'href',
    './favicon.ico?v=2',
  );
  expect((await request.get('/favicon.svg?v=2')).ok()).toBe(true);
  expect((await request.get('/favicon.ico?v=2')).ok()).toBe(true);
});

test('the overview links to both published stories', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('heading', { name: /where is humanity heading/i })).toBeVisible();
  await expect(
    page.getByRole('heading', {
      name: /humanity is changing in more than one direction at once/i,
    }),
  ).toHaveCount(0);
  await expect(page.getByText('By: zadect; update: 2026-08-16', { exact: true })).toHaveCount(1);
  await page.getByRole('link', { name: /world hunger/i }).first().click();
  await expect(page).toHaveURL(/#\/good\/world-hunger/);
  await expect(page.getByRole('heading', { name: /fewer people are undernourished/i })).toBeVisible();
  await expect(page.locator('.chart-card__visual svg')).toHaveCount(2);

  await page.getByRole('link', { name: /back to the overview/i }).click();
  await page.getByRole('link', { name: /ceo pay gap/i }).first().click();
  await expect(page).toHaveURL(/#\/bad\/ceo-pay-gap/);
  await expect(page.getByRole('heading', { name: /the ratio is far above its 1960s level/i })).toBeVisible();
  await expect(page.getByRole('heading', { name: /a defined contrast/i })).toBeVisible();
  await expect(page.locator('.chart-card__visual svg')).toHaveCount(3);
});

test('desktop landing cards contain every story title', async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== 'chromium', 'This geometry check targets desktop cards.');

  await page.goto('/');
  const overflowingCards = await page.locator('.story-card').evaluateAll((cards) =>
    cards
      .map((card) => ({
        title: card.querySelector('.story-card__title')?.textContent ?? '',
        clientWidth: card.clientWidth,
        scrollWidth: card.scrollWidth,
      }))
      .filter(({ clientWidth, scrollWidth }) => scrollWidth > clientWidth + 1),
  );

  expect(overflowingCards).toEqual([]);
});

test('mobile chart cards contain wide drawings in local scrollers', async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== 'mobile', 'This geometry check targets the mobile layout.');

  await page.goto('/#/good/world-hunger');
  const hungerMetrics = await page.locator('.chart-card').evaluateAll((cards) =>
    cards.map((card) => {
      const visual = card.querySelector('.chart-card__visual');
      return {
        cardClientWidth: card.clientWidth,
        cardScrollWidth: card.scrollWidth,
        visualClientWidth: visual?.clientWidth ?? 0,
        visualScrollWidth: visual?.scrollWidth ?? 0,
        visualTabIndex: visual?.getAttribute('tabindex'),
      };
    }),
  );

  expect(hungerMetrics).not.toHaveLength(0);
  expect(hungerMetrics.every(({ cardClientWidth, cardScrollWidth }) => cardScrollWidth <= cardClientWidth + 1)).toBe(
    true,
  );
  expect(hungerMetrics.some(({ visualClientWidth, visualScrollWidth }) => visualScrollWidth > visualClientWidth + 1)).toBe(
    true,
  );
  expect(hungerMetrics.every(({ visualTabIndex }) => visualTabIndex === '0')).toBe(true);

  await page.goto('/#/good/literacy');
  const mapMetrics = await page.locator('.map-card').evaluateAll((cards) =>
    cards.map((card) => {
      const visual = card.querySelector('.map-card__visual');
      return {
        cardClientWidth: card.clientWidth,
        cardScrollWidth: card.scrollWidth,
        visualClientWidth: visual?.clientWidth ?? 0,
        visualScrollWidth: visual?.scrollWidth ?? 0,
        visualTabIndex: visual?.getAttribute('tabindex'),
      };
    }),
  );

  expect(mapMetrics).not.toHaveLength(0);
  expect(mapMetrics.every(({ cardClientWidth, cardScrollWidth }) => cardScrollWidth <= cardClientWidth + 1)).toBe(
    true,
  );
  expect(mapMetrics.some(({ visualClientWidth, visualScrollWidth }) => visualScrollWidth > visualClientWidth + 1)).toBe(
    true,
  );
  expect(mapMetrics.every(({ visualTabIndex }) => visualTabIndex === '0')).toBe(true);
});

test('the new literacy and democracy stories render their charts and maps', async ({ page }) => {
  await page.goto('/#/good/literacy');
  await expect(page.getByRole('heading', { name: 'Literacy', exact: true })).toBeVisible();
  await expect(page.getByRole('heading', { name: /literacy rose across a broad panel/i })).toBeVisible();
  await expect(page.locator('.chart-card__visual svg')).toHaveCount(2);
  expect(await page.locator('.map-card__visual .mark-shape path').count()).toBeGreaterThan(50);
  await expect(page.getByText(/qualifying observation from 2018 onward/i)).toBeVisible();
  await expect(page.getByText(/World Bank\/UNESCO cross-check found the same reporting gap/i)).toBeVisible();

  await page.goto('/#/bad/democratic-backsliding');
  await expect(
    page.getByRole('heading', { name: 'Democratic backsliding', exact: true }),
  ).toBeVisible();
  await expect(page.getByRole('heading', { name: /where the index fell/i })).toBeVisible();
  await expect(page.locator('.chart-card__visual svg')).toHaveCount(2);
  expect(await page.locator('.map-card__visual .mark-shape path').count()).toBeGreaterThan(100);
  await expect(page.getByText(/one of the 2020 or 2025 endpoint values is missing/i)).toBeVisible();
  await expect(page.getByText(/missing coverage is not mistaken for a zero change/i)).toBeVisible();
});

test('the Women’s rights story renders its legal-equality charts', async ({ page }) => {
  await page.goto('/#/good/womens-rights');
  await expect(page.getByRole('heading', { name: "Women's rights", exact: true })).toBeVisible();
  await expect(page.getByRole('heading', { name: /legal baseline has risen worldwide/i })).toBeVisible();
  await expect(page.locator('.chart-card__visual svg')).toHaveCount(2);
  await expect(page.getByText(/formal legal provisions, not enforcement/i)).toBeVisible();
  await expect(
    page.getByRole('link', { name: /Women, Business and the Law Index/i }).first(),
  ).toBeVisible();
});

test('the child mortality story renders its long-run and country charts', async ({ page }) => {
  await page.goto('/#/good/child-mortality');
  await expect(page.getByRole('heading', { name: 'Child mortality', exact: true })).toBeVisible();
  await expect(page.getByRole('heading', { name: /global risk fell across two centuries/i })).toBeVisible();
  await expect(page.locator('.chart-card__visual svg')).toHaveCount(2);
  await expect(page.getByText(/the remaining risk is still very uneven/i)).toBeVisible();
  await expect(page.getByRole('link', { name: /Child mortality rate/i }).first()).toBeVisible();
});

test('the life expectancy story renders its long-run and country charts', async ({ page }) => {
  await page.goto('/#/good/life-expectancy');
  await expect(page.getByRole('heading', { name: 'Life expectancy', exact: true })).toBeVisible();
  await expect(page.getByRole('heading', { name: /average human life became much longer/i })).toBeVisible();
  await expect(page.locator('.chart-card__visual svg')).toHaveCount(2);
  await expect(page.getByText(/one average hides many different lives/i)).toBeVisible();
  await expect(page.getByRole('link', { name: /Life expectancy/i }).first()).toBeVisible();
});

test('the vaccination coverage story renders its world and country charts', async ({ page }) => {
  await page.goto('/#/good/vaccination-coverage');
  await expect(page.getByRole('heading', { name: 'Vaccination coverage', exact: true })).toBeVisible();
  await expect(page.getByRole('heading', { name: /high vaccination baseline/i })).toBeVisible();
  await expect(page.locator('.chart-card__visual svg')).toHaveCount(2);
  await expect(page.getByText(/coverage is a system signal/i)).toBeVisible();
  await expect(page.getByRole('link', { name: /DTP3 vaccination coverage/i }).first()).toBeVisible();
});

test('the electricity and sanitation story renders its service charts', async ({ page }) => {
  await page.goto('/#/good/electricity-and-sanitation');
  await expect(
    page.getByRole('heading', { name: 'Electricity and sanitation', exact: true }),
  ).toBeVisible();
  await expect(page.getByRole('heading', { name: /basic services spread across the world/i })).toBeVisible();
  await expect(page.locator('.chart-card__visual svg')).toHaveCount(2);
  await expect(page.getByText(/reliability, service quality/i)).toBeVisible();
  await expect(
    page.getByRole('link', { name: /Share of the population with access to electricity/i }).first(),
  ).toBeVisible();
});

test('the extreme poverty story renders its world and country charts', async ({ page }) => {
  await page.goto('/#/good/extreme-poverty');
  await expect(page.getByRole('heading', { name: 'Extreme poverty', exact: true })).toBeVisible();
  await expect(page.getByRole('heading', { name: /global poverty line moved downward/i })).toBeVisible();
  await expect(page.locator('.chart-card__visual svg')).toHaveCount(2);
  await expect(page.getByText(/source-extrapolated 2023–2026 tail/i).first()).toBeVisible();
  await expect(page.getByText(/income data in some countries with consumption data/i)).toBeVisible();
  await expect(
    page.getByRole('link', { name: /Share of population in poverty/i }).first(),
  ).toBeVisible();
});

test('the climate change story renders its annual and decade charts', async ({ page }) => {
  await page.goto('/#/bad/climate-change');
  await expect(page.getByRole('heading', { name: 'Climate change', exact: true })).toBeVisible();
  await expect(page.getByRole('heading', { name: /annual signal keeps moving upward/i })).toBeVisible();
  await expect(page.locator('.chart-card__visual svg')).toHaveCount(2);
  await expect(page.getByText(/2020s point uses six complete years/i)).toBeVisible();
  await expect(page.getByText(/global average hides regional and seasonal differences/i)).toBeVisible();
  await expect(
    page.getByRole('link', { name: /GISTEMP global land-ocean temperature index/i }).first(),
  ).toBeVisible();
});

test('the wars and conflict story renders its two measures', async ({ page }) => {
  await page.goto('/#/bad/wars-and-conflict');
  await expect(page.getByRole('heading', { name: 'Wars and conflict', exact: true })).toBeVisible();
  await expect(
    page.getByRole('heading', { name: /deaths can spike when conflicts intensify/i }),
  ).toBeVisible();
  await expect(page.locator('.chart-card__visual svg')).toHaveCount(2);
  await expect(page.getByText(/deaths from disease, hunger, displacement/i).first()).toBeVisible();
  await expect(
    page.getByRole('link', { name: /Deaths in state-based conflicts/i }).first(),
  ).toBeVisible();
});

test('the rich and poor story renders its Gini charts', async ({ page }) => {
  await page.goto('/#/bad/inequality-by-country');
  await expect(page.getByRole('heading', { name: 'Rich and poor', exact: true })).toBeVisible();
  await expect(
    page.getByRole('heading', { name: /inequality does not move in one direction/i }),
  ).toBeVisible();
  await expect(page.locator('.chart-card__visual svg')).toHaveCount(2);
  await expect(page.getByText(/survey redesigns can create breaks/i)).toBeVisible();
  await expect(
    page.getByRole('link', { name: /Gini coefficient — World Bank PIP/i }).first(),
  ).toBeVisible();
});

test('the biodiversity loss story renders its global and regional charts', async ({ page }) => {
  await page.goto('/#/bad/biodiversity-loss');
  await expect(page.getByRole('heading', { name: 'Biodiversity loss', exact: true })).toBeVisible();
  await expect(
    page.getByRole('heading', { name: /monitored-population signal fell sharply/i }),
  ).toBeVisible();
  await expect(page.locator('.chart-card__visual svg')).toHaveCount(2);
  await expect(page.getByText(/not a headcount of every wild animal/i)).toBeVisible();
  await expect(
    page.getByRole('link', { name: /Living Planet Index/i }).first(),
  ).toBeVisible();
});

test('the forced displacement story renders its long-run and category charts', async ({ page }) => {
  await page.goto('/#/bad/forced-displacement');
  await expect(page.getByRole('heading', { name: 'Forced displacement', exact: true })).toBeVisible();
  await expect(
    page.getByRole('heading', { name: /internal displacement now dominates/i }),
  ).toBeVisible();
  await expect(page.locator('.chart-card__visual svg')).toHaveCount(2);
  await expect(page.getByText(/blank values mean that the category was not reported/i)).toBeVisible();
  await expect(page.getByRole('link', { name: /Refugee Data Finder/i }).first()).toBeVisible();
});

test('the air pollution story renders its global and country charts', async ({ page }) => {
  await page.goto('/#/bad/air-pollution');
  await expect(page.getByRole('heading', { name: 'Air pollution', exact: true })).toBeVisible();
  await expect(
    page.getByRole('heading', { name: /global average remains far above/i }),
  ).toBeVisible();
  await expect(page.locator('.chart-card__visual svg')).toHaveCount(2);
  await expect(page.getByText(/the line is the population-weighted annual mean/i)).toBeVisible();
  await expect(page.getByText('WHO global air quality guidelines', { exact: true })).toBeVisible();
});

test('the published Future stories render their charts and context cards', async ({ page }) => {
  await page.goto('/#/future/tech-and-ai');
  await expect(page.getByRole('heading', { name: 'AI & Tech', exact: true })).toBeVisible();
  await expect(page.getByRole('heading', { name: /adoption rose, but the series has a real gap/i })).toBeVisible();
  await expect(page.locator('.chart-card__visual svg')).toHaveCount(3);
  await expect(page.getByText(/2022 position is deliberate/i)).toBeVisible();
  await expect(page.getByRole('heading', { name: /useful studies, kept out/i })).toBeVisible();
  await expect(page.locator('.study-card')).toHaveCount(2);

  await page.goto('/#/future/housing-cities-and-infrastructure');
  await expect(
    page.getByRole('heading', { name: 'Housing, Cities & Infrastructure', exact: true }),
  ).toBeVisible();
  await expect(page.getByRole('heading', { name: /prices and incomes did not move together/i })).toBeVisible();
  await expect(page.locator('.chart-card__visual svg')).toHaveCount(2);
  await expect(page.getByText(/not an absolute affordability ranking/i)).toBeVisible();
  await expect(page.locator('.study-card')).toHaveCount(2);

  await page.goto('/#/future/employment-work-and-skills');
  await expect(
    page.getByRole('heading', { name: 'Employment, Work & Skills', exact: true }),
  ).toBeVisible();
  await expect(
    page.getByRole('heading', { name: /global work rate dipped/i }),
  ).toBeVisible();
  await expect(page.locator('.chart-card__visual svg')).toHaveCount(2);
  await expect(page.getByText(/not a measure of job quality/i)).toBeVisible();
  await expect(
    page.getByRole('link', { name: /Employment rate/i }).first(),
  ).toBeVisible();

  await page.goto('/#/future/wealth-distribution-and-inequality');
  await expect(
    page.getByRole('heading', { name: 'Wealth Distribution & Inequality', exact: true }),
  ).toBeVisible();
  await expect(
    page.getByRole('heading', { name: /global line is not a one-way climb/i }),
  ).toBeVisible();
  await expect(page.locator('.chart-card__visual svg')).toHaveCount(2);
  await expect(page.getByText(/not the whole distribution/i)).toBeVisible();
  await expect(
    page.getByRole('link', { name: /Wealth share of the richest 1%/i }).first(),
  ).toBeVisible();

  await page.goto('/#/future/economic-growth-debt-and-public-finance');
  await expect(
    page.getByRole('heading', { name: 'Economic Growth, Debt & Public Finance', exact: true }),
  ).toBeVisible();
  await expect(
    page.getByRole('heading', { name: /growth has a rhythm of shocks/i }),
  ).toBeVisible();
  await expect(page.locator('.chart-card__visual svg')).toHaveCount(2);
  await expect(page.getByText(/not a complete balance sheet/i)).toBeVisible();
  await expect(
    page.getByRole('link', { name: /Annual GDP growth/i }).first(),
  ).toBeVisible();

  await page.goto('/#/future/inflation-prices-and-energy');
  await expect(
    page.getByRole('heading', { name: 'Inflation, Prices & Energy', exact: true }),
  ).toBeVisible();
  await expect(page.getByRole('heading', { name: /inflation arrives in waves/i })).toBeVisible();
  await expect(page.locator('.chart-card__visual svg')).toHaveCount(3);
  await expect(page.getByText(/different clocks, not a single forecast/i)).toBeVisible();
  await expect(
    page.getByRole('link', { name: /Inflation of consumer prices/i }).first(),
  ).toBeVisible();

  await page.goto('/#/future/demographics-and-migration');
  await expect(
    page.getByRole('heading', { name: 'Demographics & Migration', exact: true }),
  ).toBeVisible();
  await expect(page.getByRole('heading', { name: /the world gets older on a long arc/i })).toBeVisible();
  await expect(page.locator('.chart-card__visual svg')).toHaveCount(4);
  await expect(page.getByText(/population structure is not destiny/i)).toBeVisible();
  await expect(
    page.getByRole('link', { name: /Median age of the population/i }).first(),
  ).toBeVisible();

  await page.goto('/#/future/health-longevity-and-human-capital');
  await expect(
    page.getByRole('heading', { name: 'Health, Longevity & Human Capital', exact: true }),
  ).toBeVisible();
  await expect(page.getByRole('heading', { name: /healthy years rose/i })).toBeVisible();
  await expect(page.locator('.chart-card__visual svg')).toHaveCount(4);
  await expect(page.getByText(/more spending is not a guarantee/i)).toBeVisible();
  await expect(
    page.getByRole('link', { name: /Healthy life expectancy at birth/i }).first(),
  ).toBeVisible();

  await page.goto('/#/future/governance-risk-and-security');
  await expect(
    page.getByRole('heading', { name: 'Governance, Risk & Security', exact: true }),
  ).toBeVisible();
  await expect(page.getByRole('heading', { name: /country median barely moves/i })).toBeVisible();
  await expect(page.locator('.chart-card__visual svg')).toHaveCount(3);
  await expect(page.getByText(/a score is a signal, not a verdict/i)).toBeVisible();
  await expect(
    page.getByRole('link', { name: /WJP Rule of Law Index 2025/i }).first(),
  ).toBeVisible();

  await page.goto('/#/future/climate-and-environmental-futures');
  await expect(
    page.getByRole('heading', { name: 'Climate & Environmental Futures', exact: true }),
  ).toBeVisible();
  await expect(page.getByRole('heading', { name: /the total keeps climbing/i })).toBeVisible();
  await expect(page.locator('.chart-card__visual svg')).toHaveCount(4);
  await expect(page.getByText(/one emissions ledger cannot answer every climate question/i)).toBeVisible();
  await expect(
    page.getByRole('link', { name: /Fossil CO₂ emissions — Global Carbon Budget/i }).first(),
  ).toBeVisible();

  await page.goto('/#/future/capital-markets-and-money-flows');
  await expect(
    page.getByRole('heading', { name: 'Capital Markets & Money Flows', exact: true }),
  ).toBeVisible();
  await expect(page.getByRole('heading', { name: /credit rose, then pulled back/i })).toBeVisible();
  await expect(page.locator('.chart-card__visual svg')).toHaveCount(2);
  await expect(page.getByText(/a large credit bridge is not a verdict/i)).toBeVisible();
  await expect(
    page.getByRole('link', { name: /Credit to the private non-financial sector/i }).first(),
  ).toBeVisible();
});

test('header category links target their homepage sections', async ({ page }) => {
  await page.goto('/#/bad/ceo-pay-gap');
  await page.locator('header.site-header').getByRole('link', { name: 'Good', exact: true }).click();
  await expect(page).toHaveURL(/#\/\?section=good/);
  await expect(page.locator('#good-section')).toBeVisible();

  await page.locator('header.site-header').getByRole('link', { name: 'Bad', exact: true }).click();
  await expect(page).toHaveURL(/#\/\?section=bad/);
  await expect(page.locator('#bad-section')).toBeVisible();
  await expect(page.locator('#featured-section')).toHaveCount(0);

  await page.locator('header.site-header').getByRole('link', { name: 'Future', exact: true }).click();
  await expect(page).toHaveURL(/#\/\?section=future/);
  await expect(page.locator('#future-section')).toBeVisible();
  await page.locator('#future-section').getByRole('link', { name: /ai & tech/i }).click();
  await expect(page).toHaveURL(/#\/future\/tech-and-ai/);
  await expect(page.getByRole('heading', { name: 'AI & Tech', exact: true })).toBeVisible();
  await expect(page.locator('.chart-card__visual svg')).toHaveCount(3);
});

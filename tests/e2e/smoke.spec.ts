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
  await expect(page.getByText('By: zadect; update: 2026-09-04', { exact: true })).toHaveCount(1);
  await expect(page.getByRole('navigation', { name: 'Story category navigation' })).toBeVisible();
  await expect(
    page
      .getByRole('navigation', { name: 'Story category navigation' })
      .getByRole('link', { name: /the good/i }),
  ).toHaveAttribute('aria-current', 'location');
  await page.getByRole('link', { name: /world hunger/i }).first().click();
  await expect(page).toHaveURL(/#\/good\/world-hunger/);
  await expect(page.getByRole('heading', { name: /fewer people are undernourished/i })).toBeVisible();
  await expect(page.locator('.chart-card__visual svg')).toHaveCount(2);

  await page.getByRole('link', { name: /back to the overview/i }).click();
  await page.getByRole('link', { name: /ceo pay gap/i }).first().click();
  await expect(page).toHaveURL(/#\/bad\/ceo-pay-gap/);
  await expect(page.getByRole('heading', { name: /the ratio is far above its 1960s level/i })).toBeVisible();
  await expect(
    page.getByRole('heading', { name: /how the two compensation averages are defined/i }),
  ).toBeVisible();
  await expect(page.locator('.chart-card__visual svg')).toHaveCount(4);
  await page.getByText('Open citations and methodology').click();
  await expect(page.locator('.source-disclosure')).toHaveAttribute('open', '');
  await expect(
    page.getByRole('link', { name: 'CEO-to-worker compensation ratio', exact: true }).last(),
  ).toBeVisible();
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

  const cardHeaderOverlaps = await page.locator('.story-card').evaluateAll((cards) =>
    cards
      .map((card) => {
        const meta = card.querySelector('.story-card__meta')?.getBoundingClientRect();
        const arrow = card.querySelector('.story-card__arrow')?.getBoundingClientRect();
        return meta && arrow ? meta.right > arrow.left : false;
      })
      .filter(Boolean),
  );

  expect(cardHeaderOverlaps).toEqual([]);

  const misalignedRows = await page.locator('.story-list').evaluateAll((lists) =>
    lists.flatMap((list) => {
      const rows = new Map<number, number[]>();

      list.querySelectorAll('.story-card').forEach((card) => {
        const cardTop = Math.round(card.getBoundingClientRect().top);
        const title = card.querySelector('.story-card__title');
        if (!title) {
          return;
        }

        const titleTop = Math.round(title.getBoundingClientRect().top);
        rows.set(cardTop, [...(rows.get(cardTop) ?? []), titleTop]);
      });

      return [...rows.values()].filter((titleTops) => Math.max(...titleTops) - Math.min(...titleTops) > 2);
    }),
  );

  expect(misalignedRows).toEqual([]);
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
  await expect(page.locator('.chart-card__scroll-cue')).toHaveCount(hungerMetrics.length);
  await expect(page.locator('.chart-card__scroll-cue').first()).toBeVisible();

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
  await expect(page.locator('.map-card .chart-card__scroll-cue')).toBeVisible();
});

test('the new literacy and democracy stories render their charts and maps', async ({ page }) => {
  await page.goto('/#/good/literacy');
  await expect(page.getByRole('heading', { name: 'Adult literacy', exact: true })).toBeVisible();
  await expect(page.getByRole('heading', { name: /literacy rose across a broad panel/i })).toBeVisible();
  await expect(page.locator('.chart-card__visual svg')).toHaveCount(2);
  expect(await page.locator('.map-card__visual .mark-shape path').count()).toBeGreaterThan(50);
  await expect(page.getByText(/qualifying observation from 2018 onward/i)).toBeVisible();
  await expect(page.getByText(/World Bank\/UNESCO cross-check found the same reporting gap/i)).toBeVisible();

  await page.goto('/#/bad/democratic-backsliding');
  await expect(
    page.getByRole('heading', { name: 'Democratic backsliding', exact: true }),
  ).toBeVisible();
  await expect(
    page.getByRole('heading', { name: /five-year change in the liberal democracy index/i }),
  ).toBeVisible();
  await expect(page.locator('.chart-card__visual svg')).toHaveCount(2);
  expect(await page.locator('.map-card__visual .mark-shape path').count()).toBeGreaterThan(100);
  await expect(page.getByText(/one of the 2020 or 2025 endpoint values is missing/i)).toBeVisible();
  await expect(page.getByText(/missing coverage is not mistaken for a zero change/i)).toBeVisible();
});

test('the Women’s rights story renders its legal-equality charts', async ({ page }) => {
  await page.goto('/#/good/womens-rights');
  await expect(page.getByRole('heading', { name: 'Legal equality for women', exact: true })).toBeVisible();
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
  await expect(
    page.getByRole('heading', { name: /estimated under-five mortality fell over the long run/i }),
  ).toBeVisible();
  await expect(page.locator('.chart-card__visual svg')).toHaveCount(2);
  await expect(page.getByText(/country estimates still differ widely/i)).toBeVisible();
  await expect(page.getByRole('link', { name: /Child mortality rate/i }).first()).toBeVisible();
});

test('the life expectancy story renders its long-run and country charts', async ({ page }) => {
  await page.goto('/#/good/life-expectancy');
  await expect(page.getByRole('heading', { name: 'Life expectancy', exact: true })).toBeVisible();
  await expect(
    page.getByRole('heading', { name: /estimated life expectancy rose over the long run/i }),
  ).toBeVisible();
  await expect(page.locator('.chart-card__visual svg')).toHaveCount(2);
  await expect(page.getByText(/life expectancy summarizes a population/i)).toBeVisible();
  await expect(page.getByRole('link', { name: /Life expectancy/i }).first()).toBeVisible();
});

test('the vaccination coverage story renders its world and country charts', async ({ page }) => {
  await page.goto('/#/good/vaccination-coverage');
  await expect(page.getByRole('heading', { name: 'DTP3 vaccination coverage', exact: true })).toBeVisible();
  await expect(
    page.getByRole('heading', { name: /global dtp3 coverage rose, then dipped/i }),
  ).toBeVisible();
  await expect(page.locator('.chart-card__visual svg')).toHaveCount(2);
  await expect(page.getByText(/DTP3 is one routine-vaccine milestone/i)).toBeVisible();
  await expect(page.getByRole('link', { name: /DTP3 vaccination coverage/i }).first()).toBeVisible();
});

test('the electricity and sanitation story renders its service charts', async ({ page }) => {
  await page.goto('/#/good/electricity-and-sanitation');
  await expect(
    page.getByRole('heading', { name: 'Electricity and sanitation', exact: true }),
  ).toBeVisible();
  await expect(
    page.getByRole('heading', { name: /electricity access and sanitation use increased/i }),
  ).toBeVisible();
  await expect(page.locator('.chart-card__visual svg')).toHaveCount(2);
  await expect(page.getByText(/reliability, service quality/i)).toBeVisible();
  await expect(
    page.getByRole('link', { name: /Share of the population with access to electricity/i }).first(),
  ).toBeVisible();
});

test('the extreme poverty story renders its world and country charts', async ({ page }) => {
  await page.goto('/#/good/extreme-poverty');
  await expect(page.getByRole('heading', { name: 'Extreme poverty', exact: true })).toBeVisible();
  await expect(page.getByRole('heading', { name: /global share below \$3\/day fell/i })).toBeVisible();
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
  await expect(page.getByRole('heading', { name: /annual anomalies vary around a warmer baseline/i })).toBeVisible();
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
    page.getByRole('heading', { name: /battle-related deaths in state-based conflicts/i }),
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
    page.getByRole('heading', { name: /reported gini observations by country/i }),
  ).toBeVisible();
  await expect(page.locator('.chart-card__visual svg')).toHaveCount(2);
  await expect(page.getByText(/survey redesigns can create breaks/i)).toBeVisible();
  await expect(
    page.getByRole('link', { name: /Gini coefficient — World Bank PIP/i }).first(),
  ).toBeVisible();
});

test('the biodiversity loss story renders its global and regional charts', async ({ page }) => {
  await page.goto('/#/bad/biodiversity-loss');
  await expect(
    page.getByRole('heading', { name: 'Monitored vertebrate populations', exact: true }),
  ).toBeVisible();
  await expect(
    page.getByRole('heading', { name: /monitored vertebrate-population index fell sharply/i }),
  ).toBeVisible();
  await expect(page.locator('.chart-card__visual svg')).toHaveCount(2);
  await expect(page.getByText(/the index describes monitored populations, not all biodiversity/i)).toBeVisible();
  await expect(
    page.getByRole('link', { name: /Living Planet Index/i }).first(),
  ).toBeVisible();
});

test('the forced displacement story renders its long-run and category charts', async ({ page }) => {
  await page.goto('/#/bad/forced-displacement');
  await expect(
    page.getByRole('heading', { name: 'Refugees and forced displacement', exact: true }),
  ).toBeVisible();
  await expect(
    page.getByRole('heading', { name: /four unhcr categories, shown separately/i }),
  ).toBeVisible();
  await expect(page.locator('.chart-card__visual svg')).toHaveCount(2);
  await expect(page.getByText(/a blank value means the source had not reported/i)).toBeVisible();
  await expect(page.getByRole('link', { name: /Refugee Data Finder/i }).first()).toBeVisible();
});

test('the air pollution story renders its global and country charts', async ({ page }) => {
  await page.goto('/#/bad/air-pollution');
  await expect(page.getByRole('heading', { name: 'Ambient PM2.5 exposure', exact: true })).toBeVisible();
  await expect(
    page.getByRole('heading', { name: /global ambient pm2\.5 exposure remains above/i }),
  ).toBeVisible();
  await expect(page.locator('.chart-card__visual svg')).toHaveCount(2);
  await expect(page.getByText(/the series shows population-weighted annual mean/i)).toBeVisible();
  await page.getByText('Open citations and methodology').click();
  await expect(page.getByText('WHO global air quality guidelines', { exact: true })).toBeVisible();
});

test('the published Future stories render their charts and context cards', async ({ page }) => {
  await page.goto('/#/future/tech-and-ai');
  await expect(page.getByRole('heading', { name: 'Firm AI adoption', exact: true })).toBeVisible();
  await expect(page.getByRole('heading', { name: /reported firm ai adoption/i })).toBeVisible();
  await expect(page.locator('.chart-card__visual svg')).toHaveCount(3);
  await expect(page.getByText(/2022 position marks a reporting gap/i)).toBeVisible();
  await expect(
    page.getByRole('heading', { name: /studies that address the wider question/i }),
  ).toBeVisible();
  await expect(page.locator('.study-card')).toHaveCount(2);

  await page.goto('/#/future/housing-cities-and-infrastructure');
  await expect(
    page.getByRole('heading', { name: 'Housing price-to-income', exact: true }),
  ).toBeVisible();
  await expect(page.getByRole('heading', { name: /national house-price-to-income index/i })).toBeVisible();
  await expect(page.locator('.chart-card__visual svg')).toHaveCount(2);
  await expect(page.getByText(/ranking of absolute affordability across countries/i)).toBeVisible();
  await expect(page.locator('.study-card')).toHaveCount(2);

  await page.goto('/#/future/employment-work-and-skills');
  await expect(
    page.getByRole('heading', { name: 'Employment rates', exact: true }),
  ).toBeVisible();
  await expect(
    page.getByRole('heading', { name: /global employment-to-population ratio/i }),
  ).toBeVisible();
  await expect(page.locator('.chart-card__visual svg')).toHaveCount(2);
  await expect(page.getByText(/does not describe job quality/i)).toBeVisible();
  await expect(
    page.getByRole('link', { name: /Employment rate/i }).first(),
  ).toBeVisible();

  await page.goto('/#/future/wealth-distribution-and-inequality');
  await expect(
    page.getByRole('heading', { name: 'Top 1% wealth share', exact: true }),
  ).toBeVisible();
  await expect(
    page.getByRole('heading', { name: /global top 1% wealth-share observations/i }),
  ).toBeVisible();
  await expect(page.locator('.chart-card__visual svg')).toHaveCount(2);
  await expect(page.getByText(/leaves most of the distribution unmeasured/i)).toBeVisible();
  await expect(
    page.getByRole('link', { name: /Wealth share of the richest 1%/i }).first(),
  ).toBeVisible();

  await page.goto('/#/future/economic-growth-debt-and-public-finance');
  await expect(
    page.getByRole('heading', { name: 'World growth and central-government debt', exact: true }),
  ).toBeVisible();
  await expect(
    page.getByRole('heading', { name: /annual world gdp growth/i }),
  ).toBeVisible();
  await expect(page.locator('.chart-card__visual svg')).toHaveCount(2);
  await expect(page.getByText(/do not establish fiscal sustainability/i)).toBeVisible();
  await expect(
    page.getByRole('link', { name: /Annual GDP growth/i }).first(),
  ).toBeVisible();

  await page.goto('/#/future/inflation-prices-and-energy');
  await expect(
    page.getByRole('heading', { name: 'Inflation and renewable electricity', exact: true }),
  ).toBeVisible();
  await expect(page.getByRole('heading', { name: /annual consumer inflation/i })).toBeVisible();
  await expect(page.locator('.chart-card__visual svg')).toHaveCount(3);
  await expect(
    page.getByRole('heading', { name: /inflation and renewable electricity answer different questions/i }),
  ).toBeVisible();
  await expect(
    page.getByRole('link', { name: /Inflation of consumer prices/i }).first(),
  ).toBeVisible();

  await page.goto('/#/future/demographics-and-migration');
  await expect(
    page.getByRole('heading', { name: 'Population age and migrant stock', exact: true }),
  ).toBeVisible();
  await expect(page.getByRole('heading', { name: /observed median age and the un medium scenario/i })).toBeVisible();
  await expect(page.locator('.chart-card__visual svg')).toHaveCount(4);
  await expect(page.getByText(/one un scenario does not settle future population change/i)).toBeVisible();
  await expect(
    page.getByRole('link', { name: /Median age of the population/i }).first(),
  ).toBeVisible();

  await page.goto('/#/future/health-longevity-and-human-capital');
  await expect(
    page.getByRole('heading', { name: 'Healthy life expectancy and health spending', exact: true }),
  ).toBeVisible();
  await expect(page.getByRole('heading', { name: /healthy life expectancy$/i })).toBeVisible();
  await expect(page.locator('.chart-card__visual svg')).toHaveCount(4);
  await expect(page.getByText(/two measures answer different health questions/i)).toBeVisible();
  await expect(
    page.getByRole('link', { name: /Healthy life expectancy at birth/i }).first(),
  ).toBeVisible();

  await page.goto('/#/future/governance-risk-and-security');
  await expect(
    page.getByRole('heading', { name: 'Rule of law and security', exact: true }),
  ).toBeVisible();
  await expect(page.getByRole('heading', { name: /country median rule-of-law and security scores/i })).toBeVisible();
  await expect(page.locator('.chart-card__visual svg')).toHaveCount(3);
  await expect(page.getByText(/selected institutional conditions/i)).toBeVisible();
  await expect(
    page.getByRole('link', { name: /WJP Rule of Law Index 2025/i }).first(),
  ).toBeVisible();

  await page.goto('/#/future/climate-and-environmental-futures');
  await expect(
    page.getByRole('heading', { name: 'Historical fossil CO₂ emissions', exact: true }),
  ).toBeVisible();
  await expect(page.getByRole('heading', { name: /annual territorial fossil co₂ emissions/i })).toBeVisible();
  await expect(page.locator('.chart-card__visual svg')).toHaveCount(4);
  await expect(page.getByText(/territorial emissions are one accounting boundary/i)).toBeVisible();
  await expect(
    page.getByRole('link', { name: /Fossil CO₂ emissions — Global Carbon Budget/i }).first(),
  ).toBeVisible();

  await page.goto('/#/future/capital-markets-and-money-flows');
  await expect(
    page.getByRole('heading', { name: 'Private-sector credit relative to GDP', exact: true }).first(),
  ).toBeVisible();
  await expect(page.locator('.chart-card__visual svg')).toHaveCount(2);
  await expect(page.getByText(/credit-to-gdp ratio is a stock measure/i)).toBeVisible();
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
  await page.locator('#future-section').getByRole('link', { name: /firm ai adoption/i }).click();
  await expect(page).toHaveURL(/#\/future\/tech-and-ai/);
  await expect(page.getByRole('heading', { name: 'Firm AI adoption', exact: true })).toBeVisible();
  await expect(page.locator('.chart-card__visual svg')).toHaveCount(3);
});

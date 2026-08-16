import { expect, test } from '@playwright/test';

test('the overview links to both published stories', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('heading', { name: /where is humanity heading/i })).toBeVisible();
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

test('header Good and Bad links target the homepage sections', async ({ page }) => {
  await page.goto('/#/bad/ceo-pay-gap');
  await page.locator('header.site-header').getByRole('link', { name: 'Good', exact: true }).click();
  await expect(page).toHaveURL(/#\/\?section=good/);
  await expect(page.locator('#good-section')).toBeVisible();

  await page.locator('header.site-header').getByRole('link', { name: 'Bad', exact: true }).click();
  await expect(page).toHaveURL(/#\/\?section=bad/);
  await expect(page.locator('#bad-section')).toBeVisible();
  await expect(page.locator('#featured-section')).toHaveCount(0);
});

test('a deferred story explains its planned evidence', async ({ page }) => {
  await page.goto('/#/bad/climate-change');
  await expect(page.getByText('Coming next')).toBeVisible();
  await expect(page.getByText(/global surface temperature anomaly/i)).toBeVisible();
});

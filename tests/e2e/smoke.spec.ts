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
  await expect(page.getByRole('heading', { name: /the pay gap became a chasm/i })).toBeVisible();
  await expect(page.locator('.chart-card__visual svg')).toHaveCount(1);
});

test('a deferred story explains its planned evidence', async ({ page }) => {
  await page.goto('/#/bad/climate-change');
  await expect(page.getByText('Coming next')).toBeVisible();
  await expect(page.getByText(/global surface temperature anomaly/i)).toBeVisible();
});

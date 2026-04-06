import { test, expect } from '@playwright/test';
import { Routes } from '../../../shared/infrastructure/ui/routes';
import { Endpoints } from '../../../shared/infrastructure/http/endpoints';

test.describe('The Health Status Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(Routes.Health);
  });

  test('presents the system health title', async ({ page }) => {
    await expect(page.getByRole('heading', { name: 'System Health' })).toBeVisible();
  });

  test('shows healthy status when system is operational', async ({ page }) => {
    await expect(page.getByText('● healthy')).toBeVisible();
  });

  test('shows uptime information', async ({ page }) => {
    await expect(page.getByText('Uptime')).toBeVisible();
  });

  test('shows when the system started', async ({ page }) => {
    await expect(page.getByText('Started')).toBeVisible();
  });

  test('shows when the last check occurred', async ({ page }) => {
    await expect(page.getByText('Last Check')).toBeVisible();
  });

  test('offers a refresh option', async ({ page }) => {
    await expect(page.getByRole('button', { name: 'Refresh Status' })).toBeVisible();
  });

  test('refreshes the status when user clicks refresh', async ({ page }) => {
    const refreshButton = page.getByRole('button', { name: 'Refresh Status' });
    await expect(refreshButton).toBeVisible();
    await refreshButton.click();
    await expect(page.getByText('● healthy')).toBeVisible();
  });

  test('navigates to health page from root', async ({ page }) => {
    await page.goto(Routes.Home);
    await expect(page).toHaveURL(Routes.Health);
    await expect(page.getByRole('heading', { name: 'System Health' })).toBeVisible();
  });
});

test.describe('The Health Status Page loading behavior', () => {
  test('shows loading indicator while fetching data', async ({ page }) => {
    const networkDelayMs = 500;
    await page.route(`**/api${Endpoints.Health}`, async (route) => {
      await delay(networkDelayMs);
      await route.continue();
    });
    await page.goto(Routes.Health);
    await expect(page.getByText('Checking health status...')).toBeVisible();
    await expect(page.getByRole('heading', { name: 'System Health' })).toBeVisible();
  });
});

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

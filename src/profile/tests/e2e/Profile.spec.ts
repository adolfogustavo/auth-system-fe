import { test, expect } from '@playwright/test';
import { execSync } from 'child_process';
import { Routes } from '../../../shared/infrastructure/ui/routes';

function readOtpFromDatabase(email: string): string {
  const command = `docker exec mongo mongosh --quiet backend-template --eval "db.otp_sessions.findOne({_id: '${email}'}).otp"`;
  return execSync(command, { encoding: 'utf-8' }).trim();
}

test.describe('Profile Editing Flow', () => {
  test('edits contact details and ends the session', async ({ page }) => {
    const uniqueEmail = `profile-e2e-${Date.now()}@example.com`;

    await page.goto(Routes.Register);
    await page.getByLabel('Email').fill(uniqueEmail);
    await page.getByRole('button', { name: 'Create Account' }).click();
    await expect(page).toHaveURL(new RegExp(Routes.Login));

    await page.getByLabel('Email').fill(uniqueEmail);
    await page.getByRole('button', { name: 'Send Code' }).click();
    await expect(page).toHaveURL(new RegExp(Routes.Verify));

    const otp = readOtpFromDatabase(uniqueEmail);
    await page.getByLabel('Verification Code').fill(otp);
    await page.getByRole('button', { name: 'Verify' }).click();
    await expect(page).toHaveURL(Routes.Profile);

    await expect(page.getByRole('heading', { name: 'Profile' })).toBeVisible();
    await expect(page.locator('#email')).toHaveValue(uniqueEmail);

    await page.getByLabel('Name', { exact: true }).fill('Jane');
    await page.getByLabel('Last Name').fill('Doe');
    await page.getByLabel('Phone').fill('612345678');
    await page.getByRole('button', { name: 'Save Changes' }).click();

    await expect(page.getByText('Profile updated successfully')).toBeVisible();
    await expect(page.getByLabel('Name', { exact: true })).toHaveValue('Jane');
    await expect(page.getByLabel('Last Name')).toHaveValue('Doe');
    await expect(page.getByLabel('Phone')).toHaveValue('612345678');

    await page.getByRole('button', { name: 'Sign Out' }).click();
    await expect(page).toHaveURL(Routes.Login);
  });

  test('sends unauthenticated visitors to sign in', async ({ page }) => {
    await page.goto(Routes.Profile);

    await expect(page).toHaveURL(Routes.Login);
  });

  test('sends visitors with an expired session token to sign in', async ({ page }) => {
    const pastExpiration = Math.floor(Date.now() / 1000) - 60;
    const payload = Buffer.from(JSON.stringify({ email: 'expired@example.com', exp: pastExpiration }))
      .toString('base64')
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=+$/, '');
    const header = Buffer.from(JSON.stringify({ alg: 'HS256', typ: 'JWT' }))
      .toString('base64')
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=+$/, '');
    const expiredToken = `${header}.${payload}.fakesignature`;

    await page.goto(Routes.Login);
    await page.evaluate((token) => localStorage.setItem('auth_token', token), expiredToken);
    await page.goto(Routes.Profile);

    await expect(page).toHaveURL(Routes.Login);
  });
});

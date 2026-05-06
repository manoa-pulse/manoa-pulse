import { test, expect } from './auth-utils';

test.slow();

test('can authenticate a specific user', async ({ getUserPage }) => {
  const customUserPage = await getUserPage('john@foo.com', 'changeme');

  await customUserPage.goto('http://localhost:3000/');

  await expect(
    customUserPage.getByRole('button', { name: 'john@foo.com' }),
  ).toBeVisible({ timeout: 10000 });

  const nav = customUserPage.getByRole('navigation');

  await expect(
    nav.getByRole('link', { name: 'Pulse Feed', exact: true }),
  ).toBeVisible({ timeout: 5000 });

  await expect(
    nav.getByRole('link', { name: 'Locations', exact: true }),
  ).toBeVisible({ timeout: 5000 });

  await expect(
    nav.getByRole('link', { name: 'Map View', exact: true }),
  ).toBeVisible({ timeout: 5000 });

  await expect(
    nav.getByRole('link', { name: 'Submit Update', exact: true }),
  ).toBeVisible({ timeout: 5000 });

  await expect(
    nav.getByRole('link', { name: 'Profile', exact: true }),
  ).toBeVisible({ timeout: 5000 });

  await nav.getByRole('link', { name: 'Submit Update', exact: true }).click();

  await expect(customUserPage).toHaveURL(/\/submit/);

  await expect(
    customUserPage.getByRole('heading', { name: 'Submit Update', exact: true }),
  ).toBeVisible({ timeout: 15000 });

  await customUserPage.goto('http://localhost:3000/pulse-feed');

  await expect(customUserPage).toHaveURL(/\/pulse-feed/);

  await expect(
    customUserPage.getByText('campus study, dining, and fitness locations', { exact: false }),
  ).toBeVisible({ timeout: 10000 });
});
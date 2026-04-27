import { test, expect } from './auth-utils';

test.slow();

test('test access to admin page', async ({ getUserPage }) => {
  const adminPage = await getUserPage('admin@foo.com', 'changeme');

  await adminPage.goto('http://localhost:3000/');

  await expect(
    adminPage.getByRole('button', { name: 'admin@foo.com' }),
  ).toBeVisible({ timeout: 10000 });

  const nav = adminPage.getByRole('navigation');

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

  await expect(
    nav.getByRole('link', { name: 'Admin', exact: true }),
  ).toBeVisible({ timeout: 5000 });

  await nav.getByRole('link', { name: 'Submit Update', exact: true }).click();

  await expect(
    adminPage.getByRole('heading', { name: 'Submit Update', exact: true }),
  ).toBeVisible({ timeout: 5000 });

  await nav.getByRole('link', { name: 'Pulse Feed', exact: true }).click();

  await expect(
    adminPage.getByRole('heading', { name: 'The Pulse Feed', exact: true }),
  ).toBeVisible({ timeout: 5000 });

  await nav.getByRole('link', { name: 'Admin', exact: true }).click();

  await expect(
    adminPage.getByRole('heading', { name: 'List Stuff Admin', exact: true }),
  ).toBeVisible({ timeout: 5000 });

  await expect(
    adminPage.getByRole('heading', { name: 'List Users Admin', exact: true }),
  ).toBeVisible({ timeout: 5000 });
});
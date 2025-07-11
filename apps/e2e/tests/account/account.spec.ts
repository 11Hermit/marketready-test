import { Page, expect, test } from '@playwright/test';

import { AccountPageObject } from './account.po';
import {AuthPageObject} from "../authentication/auth.po";

test.describe('Account Settings', () => {
  let page: Page;
  let account: AccountPageObject;

  test.beforeAll(async ({ browser }) => {
    page = await browser.newPage();
    account = new AccountPageObject(page);

    await account.setup();
  });

  test('user can update their profile name', async () => {
    const name = 'John Doe';

    const request = account.updateName(name);

    const response = page.waitForResponse((resp) => {
      return resp.url().includes('accounts');
    });

    await Promise.all([request, response]);

    await expect(account.getProfileName()).toHaveText(name);
  });

  test('user can update their email', async () => {
    const email = account.auth.createRandomEmail();

    await account.updateEmail(email);
  });

  test('user can update their password', async () => {
    const password = (Math.random() * 100000).toString();

    const request = account.updatePassword(password);

    const response = page.waitForResponse((resp) => {
      return resp.url().includes('auth/v1/user');
    });

    await Promise.all([request, response]);

    await page.context().clearCookies();

    await page.reload();
  });
});

test.describe('Account Deletion', () => {
  test('user can delete their own account', async ({ page }) => {
    const account = new AccountPageObject(page);
    const auth = new AuthPageObject(page);

    const { email } = await account.setup();

    await account.deleteAccount(email);

    await page.waitForURL('/');

    await page.goto('/auth/sign-in');

    // sign in will now fail
    await auth.signIn({
      email,
      password: 'testingpassword',
    });

    await expect(page.locator('[data-test="auth-error-message"]')).toBeVisible();
  });
});

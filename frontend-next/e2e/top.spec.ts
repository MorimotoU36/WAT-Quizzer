import { test, expect } from '@playwright/test';

test.describe('navigation', () => {
  test.beforeEach(async ({ page }) => {
    // Go to the starting url before each test.
    await page.goto(process.env.QUIZZER_FRONT_SERVER || '');
  });

  test('Quizzer Init', async ({ page }) => {
    // Expect a title "to contain" a substring.
    await expect(page).toHaveTitle(/Quizzer/);
    // 格言で取得中。。から変わるか確認
    await expect(page.locator('#saying')).not.toHaveText(/取得中.../);
    // DBヘルスチェックで取得中。。から変わるか確認
    await expect(page.locator('#db-health')).not.toHaveText(/取得中.../);
  });

  test('ヘッダーのロゴ表示', async ({ page }) => {
    // ヘッダーに"WAT Quizzer"が表示されているか
    await expect(page.locator('header .title')).toHaveText(/WAT Quizzer/);
  });

  test('主要ボタンの存在', async ({ page }) => {
    // Quizzer, English Quiz Bot, 設定ボタンが存在するか
    await expect(page.locator('button:has-text("Quizzer")')).toBeVisible();
    await expect(page.locator('button:has-text("English Quiz Bot")')).toBeVisible();
    await expect(page.locator('button:has-text("設定")')).toBeVisible();
  });

  test('主要ボタンの遷移', async ({ page }) => {
    // Quizzerボタンをクリックして遷移するか
    await page.click('button:has-text("Quizzer")');
    await expect(page).toHaveURL(/\/quizzer/);
    await page.goBack();
    // English Quiz Botボタンをクリックして遷移するか
    await page.click('button:has-text("English Quiz Bot")');
    await expect(page).toHaveURL(/\/englishBot/);
    await page.goBack();
    // 設定ボタンをクリックして遷移するか
    await page.click('button:has-text("設定")');
    await expect(page).toHaveURL(/\/settings/);
    await page.goBack();
  });

  test('フッターの表示', async ({ page }) => {
    // フッターのトップ・ログアウトボタン、コピーライトが表示されているか
    await expect(page.locator('footer .left button:has-text("トップ")')).toBeVisible();
    await expect(page.locator('footer .left button:has-text("ログアウト")')).toBeVisible();
    await expect(page.locator('footer .right')).toHaveText(/©️ Tatsuroh Wakasugi/);
  });
});

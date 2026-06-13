import { test, expect } from '@playwright/test';

test.describe('IDE shell', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('titlebar renders with traffic lights', async ({ page }) => {
    await expect(page.locator('.dot-red')).toBeVisible();
    await expect(page.locator('.dot-yellow')).toBeVisible();
    await expect(page.locator('.dot-green')).toBeVisible();
  });

  test('vim statusbar shows NORMAL mode', async ({ page }) => {
    await expect(page.locator('#vim-mode')).toHaveText('-- NORMAL --');
  });

  test('all four files appear in sidebar', async ({ page }) => {
    await expect(page.getByText('README.md').first()).toBeVisible();
    await expect(page.getByText('experience.java').first()).toBeVisible();
    await expect(page.getByText('skills.json').first()).toBeVisible();
    await expect(page.getByText('contact.md').first()).toBeVisible();
  });

  test('all four tabs render', async ({ page }) => {
    await expect(page.locator('[data-tab-id="readme"]')).toBeVisible();
    await expect(page.locator('[data-tab-id="experience"]')).toBeVisible();
    await expect(page.locator('[data-tab-id="skills"]')).toBeVisible();
    await expect(page.locator('[data-tab-id="contact"]')).toBeVisible();
  });
});

test.describe('sections', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('README section exists with name', async ({ page }) => {
    await expect(page.locator('#readme')).toBeAttached();
    await expect(page.locator('#readme')).toContainText('Anmol');
  });

  test('experience section exists with CRED', async ({ page }) => {
    await expect(page.locator('#experience')).toBeAttached();
    await expect(page.locator('#experience')).toContainText('CRED');
  });

  test('skills section exists with Java', async ({ page }) => {
    await expect(page.locator('#skills')).toBeAttached();
    await expect(page.locator('#skills')).toContainText('Java');
  });

  test('contact section has email link', async ({ page }) => {
    await expect(page.locator('#contact')).toBeAttached();
    await expect(page.locator('#contact a[href="mailto:anmolbadi@gmail.com"]')).toBeVisible();
  });
});

test.describe('visual enhancements', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('README hero avatar is visible', async ({ page }) => {
    await expect(page.locator('.hero-avatar')).toBeVisible();
    await expect(page.locator('.hero-avatar')).toContainText('A');
  });

  test('README hero name shows Anmol', async ({ page }) => {
    await expect(page.locator('.hero-name')).toBeVisible();
    await expect(page.locator('.hero-name')).toContainText('Anmol');
  });

  test('experience section has metric chips', async ({ page }) => {
    await expect(page.locator('#experience .metric-chips').first()).toBeVisible();
  });

  test('metric chips contain impact values', async ({ page }) => {
    await expect(page.locator('#experience')).toContainText('7h→1h');
    await expect(page.locator('#experience')).toContainText('50M+');
    await expect(page.locator('#experience')).toContainText('16M');
  });

  test('page title is Anmol', async ({ page }) => {
    await expect(page).toHaveTitle('Anmol');
  });
});

test.describe('navigation', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('clicking experience in sidebar activates its tab', async ({ page }) => {
    await page.locator('[data-file-id="experience"]').click();
    await expect(page.locator('[data-tab-id="experience"]')).toHaveClass(/active/);
  });

  test('clicking skills tab activates it', async ({ page }) => {
    await page.locator('[data-tab-id="skills"]').click();
    await expect(page.locator('[data-tab-id="skills"]')).toHaveClass(/active/);
  });

  test('vim mode flashes INSERT then returns to NORMAL on navigation', async ({ page }) => {
    await page.locator('[data-file-id="experience"]').click();
    await expect(page.locator('#vim-mode')).toHaveText('-- INSERT --', { timeout: 500 });
    await expect(page.locator('#vim-mode')).toHaveText('-- NORMAL --', { timeout: 2000 });
  });
});

test.describe('resume', () => {
  test('resume PDF is accessible', async ({ page }) => {
    const resp = await page.request.get('/resume.pdf');
    expect(resp.status()).toBe(200);
  });
});

test.describe('mobile', () => {
  test.use({ viewport: { width: 375, height: 812 } });

  test('hamburger visible and sidebar hidden by default', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('#sidebar-toggle')).toBeVisible();
    const sidebar = page.locator('#sidebar');
    // sidebar should not have class 'open' initially
    await expect(sidebar).not.toHaveClass(/open/);
  });

  test('hamburger click opens sidebar', async ({ page }) => {
    await page.goto('/');
    await page.locator('#sidebar-toggle').click();
    await expect(page.locator('#sidebar')).toHaveClass(/open/);
  });

  test('clicking a file in sidebar closes it', async ({ page }) => {
    await page.goto('/');
    await page.locator('#sidebar-toggle').click();
    await expect(page.locator('#sidebar')).toHaveClass(/open/);
    await page.locator('[data-file-id="skills"]').click();
    await expect(page.locator('#sidebar')).not.toHaveClass(/open/);
  });
});

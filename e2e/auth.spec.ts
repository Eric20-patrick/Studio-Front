import { test, expect } from '@playwright/test';

test.describe('Autenticação', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/admin/login');
  });

  test('deve fazer login com credenciais válidas', async ({ page }) => {
    await page.fill('input[type="email"]', 'admsalaoneo@neo.com');
    await page.fill('input[type="password"]', '123456789');

    await page.click('button[type="submit"]');

    await page.waitForURL('**/admin');
    expect(page.url()).toContain('/admin');
  });

  test('deve exibir erro com credenciais inválidas', async ({ page }) => {
    await page.fill('input[type="email"]', 'teste@example.com');
    await page.fill('input[type="password"]', 'senhaerrada');

    await page.click('button[type="submit"]');

    const errorElement = await page.locator('text=Credenciais inválidas');
    await expect(errorElement).toBeVisible({ timeout: 5000 });
  });

  test('deve validar email obrigatório', async ({ page }) => {
    await page.fill('input[type="password"]', '123456789');
    await page.click('button[type="submit"]');

    const errorText = await page.locator('text=Email').first();
    await expect(errorText).toBeVisible();
  });

  test('deve validar password obrigatória', async ({ page }) => {
    await page.fill('input[type="email"]', 'admsalaoneo@neo.com');
    await page.click('button[type="submit"]');

    const errorText = await page.locator('text=Senha');
    await expect(errorText).toBeVisible();
  });

  test('deve fazer logout com sucesso', async ({ page }) => {
    await page.fill('input[type="email"]', 'admsalaoneo@neo.com');
    await page.fill('input[type="password"]', '123456789');
    await page.click('button[type="submit"]');

    await page.waitForURL('**/admin');

    const userMenu = await page.locator('button').filter({ has: page.locator('text=Admin') }).first();
    await userMenu.click();

    const logoutButton = await page.locator('text=Sair');
    await logoutButton.click();

    await page.waitForURL('**/admin/login');
    expect(page.url()).toContain('/admin/login');
  });

  test('deve redirecionar para login se tentar acessar rota protegida sem autenticação', async ({ page }) => {
    await page.goto('/admin');

    await page.waitForURL('**/admin/login');
    expect(page.url()).toContain('/admin/login');
  });
});

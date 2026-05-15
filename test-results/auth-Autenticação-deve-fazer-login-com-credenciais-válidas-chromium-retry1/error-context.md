# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: auth.spec.ts >> Autenticação >> deve fazer login com credenciais válidas
- Location: e2e\auth.spec.ts:8:7

# Error details

```
Error: page.goto: net::ERR_CONNECTION_REFUSED at http://localhost:5173/admin/login
Call log:
  - navigating to "http://localhost:5173/admin/login", waiting until "load"

```

# Test source

```ts
  1  | import { test, expect } from '@playwright/test';
  2  | 
  3  | test.describe('Autenticação', () => {
  4  |   test.beforeEach(async ({ page }) => {
> 5  |     await page.goto('http://localhost:5173/admin/login');
     |                ^ Error: page.goto: net::ERR_CONNECTION_REFUSED at http://localhost:5173/admin/login
  6  |   });
  7  | 
  8  |   test('deve fazer login com credenciais válidas', async ({ page }) => {
  9  |     await page.fill('input[type="email"]', 'admsalaoneo@neo.com');
  10 |     await page.fill('input[type="password"]', '123456789');
  11 | 
  12 |     await page.click('button[type="submit"]');
  13 | 
  14 |     await page.waitForURL('http://localhost:5173/admin');
  15 |     expect(page.url()).toContain('/admin');
  16 |   });
  17 | 
  18 |   test('deve exibir erro com credenciais inválidas', async ({ page }) => {
  19 |     await page.fill('input[type="email"]', 'teste@example.com');
  20 |     await page.fill('input[type="password"]', 'senhaerrada');
  21 | 
  22 |     await page.click('button[type="submit"]');
  23 | 
  24 |     const errorElement = await page.locator('text=Credenciais inválidas');
  25 |     await expect(errorElement).toBeVisible({ timeout: 5000 });
  26 |   });
  27 | 
  28 |   test('deve validar email obrigatório', async ({ page }) => {
  29 |     await page.fill('input[type="password"]', '123456789');
  30 |     await page.click('button[type="submit"]');
  31 | 
  32 |     const errorText = await page.locator('text=Email').first();
  33 |     await expect(errorText).toBeVisible();
  34 |   });
  35 | 
  36 |   test('deve validar password obrigatória', async ({ page }) => {
  37 |     await page.fill('input[type="email"]', 'admsalaoneo@neo.com');
  38 |     await page.click('button[type="submit"]');
  39 | 
  40 |     const errorText = await page.locator('text=Senha');
  41 |     await expect(errorText).toBeVisible();
  42 |   });
  43 | 
  44 |   test('deve fazer logout com sucesso', async ({ page }) => {
  45 |     await page.fill('input[type="email"]', 'admsalaoneo@neo.com');
  46 |     await page.fill('input[type="password"]', '123456789');
  47 |     await page.click('button[type="submit"]');
  48 | 
  49 |     await page.waitForURL('http://localhost:5173/admin');
  50 | 
  51 |     const userMenu = await page.locator('button').filter({ has: page.locator('text=Admin') }).first();
  52 |     await userMenu.click();
  53 | 
  54 |     const logoutButton = await page.locator('text=Sair');
  55 |     await logoutButton.click();
  56 | 
  57 |     await page.waitForURL('http://localhost:5173/admin/login');
  58 |     expect(page.url()).toContain('/admin/login');
  59 |   });
  60 | 
  61 |   test('deve redirecionar para login se tentar acessar rota protegida sem autenticação', async ({ page }) => {
  62 |     await page.goto('http://localhost:5173/admin');
  63 | 
  64 |     await page.waitForURL('http://localhost:5173/admin/login');
  65 |     expect(page.url()).toContain('/admin/login');
  66 |   });
  67 | });
  68 | 
```
# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: booking.spec.ts >> Agendamento >> deve exigir nome do cliente
- Location: e2e\booking.spec.ts:18:7

# Error details

```
Error: page.goto: net::ERR_CONNECTION_REFUSED at http://localhost:5173/
Call log:
  - navigating to "http://localhost:5173/", waiting until "load"

```

# Test source

```ts
  1   | import { test, expect } from '@playwright/test';
  2   | import { addDays, format } from 'date-fns';
  3   | 
  4   | test.describe('Agendamento', () => {
  5   |   test.beforeEach(async ({ page }) => {
> 6   |     await page.goto('http://localhost:5173');
      |                ^ Error: page.goto: net::ERR_CONNECTION_REFUSED at http://localhost:5173/
  7   |   });
  8   | 
  9   |   test('deve navegar pela página de agendamento', async ({ page }) => {
  10  |     const agendarButton = await page.locator('text=Agendar');
  11  |     await expect(agendarButton).toBeVisible();
  12  |     await agendarButton.click();
  13  | 
  14  |     await page.waitForURL('**/agendar');
  15  |     expect(page.url()).toContain('/agendar');
  16  |   });
  17  | 
  18  |   test('deve exigir nome do cliente', async ({ page }) => {
  19  |     const agendarButton = await page.locator('text=Agendar');
  20  |     await agendarButton.click();
  21  | 
  22  |     await page.waitForURL('**/agendar');
  23  | 
  24  |     const submitButton = await page.locator('button').filter({ has: page.locator('text=Confirmar') }).first();
  25  |     await submitButton.click();
  26  | 
  27  |     const errorText = await page.locator('text=Nome');
  28  |     await expect(errorText).toBeVisible({ timeout: 5000 });
  29  |   });
  30  | 
  31  |   test('deve exigir telefone do cliente', async ({ page }) => {
  32  |     const agendarButton = await page.locator('text=Agendar');
  33  |     await agendarButton.click();
  34  | 
  35  |     await page.waitForURL('**/agendar');
  36  | 
  37  |     const nameInput = await page.locator('input[type="text"]').first();
  38  |     await nameInput.fill('João Silva');
  39  | 
  40  |     const submitButton = await page.locator('button').filter({ has: page.locator('text=Confirmar') }).first();
  41  |     await submitButton.click();
  42  | 
  43  |     const errorText = await page.locator('text=Telefone');
  44  |     await expect(errorText).toBeVisible({ timeout: 5000 });
  45  |   });
  46  | 
  47  |   test('deve exigir procedimento selecionado', async ({ page }) => {
  48  |     const agendarButton = await page.locator('text=Agendar');
  49  |     await agendarButton.click();
  50  | 
  51  |     await page.waitForURL('**/agendar');
  52  | 
  53  |     const nameInput = await page.locator('input[type="text"]').first();
  54  |     await nameInput.fill('João Silva');
  55  | 
  56  |     const phoneInput = await page.locator('input[type="tel"]');
  57  |     await phoneInput.fill('11999999999');
  58  | 
  59  |     const submitButton = await page.locator('button').filter({ has: page.locator('text=Confirmar') }).first();
  60  |     await submitButton.click();
  61  | 
  62  |     const errorText = await page.locator('text=Procedimento');
  63  |     await expect(errorText).toBeVisible({ timeout: 5000 });
  64  |   });
  65  | 
  66  |   test('deve permitir seleção de data e hora', async ({ page }) => {
  67  |     const agendarButton = await page.locator('text=Agendar');
  68  |     await agendarButton.click();
  69  | 
  70  |     await page.waitForURL('**/agendar');
  71  | 
  72  |     const nextDate = addDays(new Date(), 1);
  73  |     const dateString = format(nextDate, 'dd');
  74  | 
  75  |     const dateButton = await page.locator(`button:has-text("${dateString}")`).first();
  76  |     await expect(dateButton).toBeVisible();
  77  |   });
  78  | 
  79  |   test('deve validar email do cliente', async ({ page }) => {
  80  |     const agendarButton = await page.locator('text=Agendar');
  81  |     await agendarButton.click();
  82  | 
  83  |     await page.waitForURL('**/agendar');
  84  | 
  85  |     const emailInput = await page.locator('input[type="email"]');
  86  |     await emailInput.fill('email-inválido');
  87  | 
  88  |     const emailField = emailInput.locator('..'); // parent
  89  |     await emailField.click();
  90  | 
  91  |     const errorText = await page.locator('text=Email válido');
  92  |     await expect(errorText).toBeVisible({ timeout: 2000 }).catch(() => {
  93  |       // Email validation might be on blur, try submit
  94  |     });
  95  |   });
  96  | 
  97  |   test('deve exibir resumo do agendamento antes de confirmar', async ({ page }) => {
  98  |     const agendarButton = await page.locator('text=Agendar');
  99  |     await agendarButton.click();
  100 | 
  101 |     await page.waitForURL('**/agendar');
  102 | 
  103 |     const nameInput = await page.locator('input[type="text"]').first();
  104 |     await nameInput.fill('João Silva');
  105 | 
  106 |     const phoneInput = await page.locator('input[type="tel"]');
```
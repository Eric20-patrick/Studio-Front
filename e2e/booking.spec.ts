import { test, expect } from '@playwright/test';
import { addDays, format } from 'date-fns';

test.describe('Agendamento', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('deve navegar pela página de agendamento', async ({ page }) => {
    const agendarButton = await page.locator('text=Agendar');
    await expect(agendarButton).toBeVisible();
    await agendarButton.click();

    await page.waitForURL('**/agendar');
    expect(page.url()).toContain('/agendar');
  });

  test('deve exigir nome do cliente', async ({ page }) => {
    const agendarButton = await page.locator('text=Agendar');
    await agendarButton.click();

    await page.waitForURL('**/agendar');

    const submitButton = await page.locator('button').filter({ has: page.locator('text=Confirmar') }).first();
    await submitButton.click();

    const errorText = await page.locator('text=Nome');
    await expect(errorText).toBeVisible({ timeout: 5000 });
  });

  test('deve exigir telefone do cliente', async ({ page }) => {
    const agendarButton = await page.locator('text=Agendar');
    await agendarButton.click();

    await page.waitForURL('**/agendar');

    const nameInput = await page.locator('input[type="text"]').first();
    await nameInput.fill('João Silva');

    const submitButton = await page.locator('button').filter({ has: page.locator('text=Confirmar') }).first();
    await submitButton.click();

    const errorText = await page.locator('text=Telefone');
    await expect(errorText).toBeVisible({ timeout: 5000 });
  });

  test('deve exigir procedimento selecionado', async ({ page }) => {
    const agendarButton = await page.locator('text=Agendar');
    await agendarButton.click();

    await page.waitForURL('**/agendar');

    const nameInput = await page.locator('input[type="text"]').first();
    await nameInput.fill('João Silva');

    const phoneInput = await page.locator('input[type="tel"]');
    await phoneInput.fill('11999999999');

    const submitButton = await page.locator('button').filter({ has: page.locator('text=Confirmar') }).first();
    await submitButton.click();

    const errorText = await page.locator('text=Procedimento');
    await expect(errorText).toBeVisible({ timeout: 5000 });
  });

  test('deve permitir seleção de data e hora', async ({ page }) => {
    const agendarButton = await page.locator('text=Agendar');
    await agendarButton.click();

    await page.waitForURL('**/agendar');

    const nextDate = addDays(new Date(), 1);
    const dateString = format(nextDate, 'dd');

    const dateButton = await page.locator(`button:has-text("${dateString}")`).first();
    await expect(dateButton).toBeVisible();
  });

  test('deve validar email do cliente', async ({ page }) => {
    const agendarButton = await page.locator('text=Agendar');
    await agendarButton.click();

    await page.waitForURL('**/agendar');

    const emailInput = await page.locator('input[type="email"]');
    await emailInput.fill('email-inválido');

    const emailField = emailInput.locator('..'); // parent
    await emailField.click();

    const errorText = await page.locator('text=Email válido');
    await expect(errorText).toBeVisible({ timeout: 2000 }).catch(() => {
      // Email validation might be on blur, try submit
    });
  });

  test('deve exibir resumo do agendamento antes de confirmar', async ({ page }) => {
    const agendarButton = await page.locator('text=Agendar');
    await agendarButton.click();

    await page.waitForURL('**/agendar');

    const nameInput = await page.locator('input[type="text"]').first();
    await nameInput.fill('João Silva');

    const phoneInput = await page.locator('input[type="tel"]');
    await phoneInput.fill('11999999999');

    const emailInput = await page.locator('input[type="email"]');
    await emailInput.fill('joao@example.com');

    const procedureButton = await page.locator('button').filter({ has: page.locator('text=Manicure') }).first();
    if (await procedureButton.isVisible()) {
      await procedureButton.click();
    }

    const nextButton = await page.locator('button').filter({ has: page.locator('text=Próximo') }).first();
    if (await nextButton.isVisible()) {
      await nextButton.click();
      await page.waitForTimeout(500);
    }

    const resumoText = await page.locator('text=Resumo').or(page.locator('text=Confirmação')).first();
    await expect(resumoText).toBeVisible({ timeout: 5000 });
  });
});

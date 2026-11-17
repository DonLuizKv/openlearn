import { test, expect } from '@playwright/test';

test('search, photos, library persistence, personal cards and review session', async ({ page }) => {
  const errors: string[] = [];
  page.on('pageerror', error => errors.push(error.message));
  await page.goto('/');
  await expect(page.getByText('Aprende algo nuevo.', { exact: false })).toBeVisible();
  await page.screenshot({ path: 'test-results/explore-mobile.png' });
  await page.getByRole('textbox', { name: 'Buscar instrumentos' }).fill('KOCHER');
  await expect(page.getByRole('button', { name: 'Ver Pinza Kocher', exact: true })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Ver Tijeras Mayo', exact: true })).toHaveCount(0);
  await page.getByRole('button', { name: 'Limpiar búsqueda' }).click();
  await page.getByRole('button', { name: 'Ver Tijeras Mayo', exact: true }).click();
  await page.screenshot({ path: 'test-results/instrument-mobile.png' });
  await page.getByRole('button', { name: 'Ampliar fotografía de Tijeras Mayo' }).click();
  await page.getByRole('button', { name: 'Ampliar imagen', exact: true }).click();
  await expect(page.getByText('1.5×', { exact: true })).toBeVisible();
  await page.getByRole('button', { name: 'Restablecer imagen' }).click();
  await expect(page.getByText('1.0×', { exact: true })).toBeVisible();
  await page.getByRole('button', { name: 'Cerrar visor' }).click();
  await page.getByRole('button', { name: 'Guardar en mi biblioteca', exact: true }).click();
  await page.getByRole('button', { name: 'Crear un nuevo tema' }).click();
  await page.getByRole('textbox', { name: 'Nombre del tema', exact: true }).fill('Mi primer examen');
  await page.getByRole('button', { name: 'Crear tema', exact: true }).click();
  await expect(page.getByRole('checkbox', { name: 'Mi primer examen' })).toBeChecked();
  await page.getByRole('button', { name: 'Listo', exact: true }).click();
  await page.goto('/library');
  await page.getByRole('button', { name: 'Abrir tema Mi primer examen' }).click();
  await page.getByRole('textbox', { name: 'Notas del tema' }).fill('Comparar las hojas en la próxima clase.');
  await page.getByRole('button', { name: 'Guardar notas', exact: true }).click();
  await expect(page.getByText('Notas guardadas', { exact: true })).toBeVisible();
  await page.getByRole('button', { name: 'Crear mi primera tarjeta' }).click();
  await page.getByRole('textbox', { name: 'Pregunta', exact: true }).fill('¿Qué debo comparar?');
  await page.getByRole('textbox', { name: 'Respuesta', exact: true }).fill('Las hojas y las ramas.');
  await page.getByRole('button', { name: 'Guardar tarjeta' }).click();
  await expect(page.getByText('¿Qué debo comparar?', { exact: true })).toBeVisible();
  await expect.poll(() => page.evaluate(() => localStorage.getItem('@openlearn/library/v1'))).toContain('Las hojas y las ramas.');
  await page.reload();
  await expect(page.getByRole('textbox', { name: 'Notas del tema' })).toHaveValue('Comparar las hojas en la próxima clase.');
  await expect(page.getByText('¿Qué debo comparar?', { exact: true })).toBeVisible();
  await page.getByRole('button', { name: 'Estudiar este tema' }).click();
  for (let i = 0; i < 2; i++) {
    await page.getByRole('button', { name: 'Revelar respuesta' }).click();
    await page.getByRole('button', { name: i === 0 ? 'Necesito repasar' : 'Lo recordé', exact: true }).click();
    await page.getByRole('button', { name: i === 0 ? 'Siguiente tarjeta' : 'Ver mis resultados', exact: true }).click();
  }
  await expect(page.getByText('¡Sesión completada!', { exact: true })).toBeVisible();
  await expect(page.getByText('1 / 2', { exact: true })).toBeVisible();
  await page.getByRole('button', { name: 'Repasar 1 pendientes' }).click();
  await page.getByRole('button', { name: 'Revelar respuesta' }).click();
  await page.getByRole('button', { name: 'Lo recordé', exact: true }).click();
  await page.getByRole('button', { name: 'Ver mis resultados' }).click();
  await expect(page.getByText('1 / 1', { exact: true })).toBeVisible();
  expect(errors).toEqual([]);
});

test('quiz hides the answer in the viewer, grades once and completes', async ({ page }) => {
  await page.goto('/study?mode=quiz&topic=all');
  await page.getByRole('button', { name: 'Ampliar imagen de la pregunta' }).click();
  await expect(page.getByText('Reconocimiento visual', { exact: true })).toBeVisible();
  await page.getByRole('button', { name: 'Cerrar visor' }).click();
  for (let i = 0; i < 4; i++) {
    const option = page.getByRole('button').filter({ hasText: /Tijeras Mayo/ });
    await option.click();
    await expect(option).toBeDisabled();
    await page.getByRole('button', { name: i === 3 ? 'Ver mis resultados' : 'Siguiente tarjeta', exact: true }).click();
  }
  await expect(page.getByText('¡Sesión completada!', { exact: true })).toBeVisible();
  await expect(page.getByText('1 / 4', { exact: true })).toBeVisible();
  await expect.poll(() => page.evaluate(() => JSON.parse(localStorage.getItem('@openlearn/library/v1') ?? '{}').sessions)).toBe(1);
});

test('empty search, empty topic and invalid routes have recovery actions', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('textbox', { name: 'Buscar instrumentos' }).fill('inexistente');
  await expect(page.getByText('Probemos con otro término')).toBeVisible();
  await page.getByRole('button', { name: 'Ver todo el catálogo' }).click();
  await expect(page.getByRole('button', { name: 'Ver Pinza Kocher', exact: true })).toBeVisible();
  await page.goto('/study?topic=missing');
  await expect(page.getByText('Todavía no hay tarjetas para esta sesión')).toBeVisible();
  await page.goto('/instrument/missing');
  await expect(page.getByText('No encontramos esta ficha')).toBeVisible();
});

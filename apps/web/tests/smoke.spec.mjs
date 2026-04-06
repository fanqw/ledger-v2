import { expect, test } from '@playwright/test';

const suffix = Date.now().toString();

const names = {
  category: `分类-${suffix}`,
  unit: `单位-${suffix}`,
  commodity: `商品-${suffix}`,
  order: `订单-${suffix}`,
};

async function fillDialogForm(page, values) {
  const dialog = page.locator('div.fixed.inset-0');
  await expect(dialog).toBeVisible();

  if (values.name !== undefined) {
    await dialog.locator('input').first().fill(values.name);
  }

  if (values.description !== undefined) {
    await dialog.locator('textarea').fill(values.description);
  }

  if (values.categoryId !== undefined) {
    await dialog.locator('select').nth(0).selectOption({ label: values.categoryId });
  }

  if (values.unitId !== undefined) {
    await dialog.locator('select').nth(1).selectOption({ label: values.unitId });
  }

  if (values.commodityId !== undefined) {
    await dialog.locator('select').first().selectOption({ label: values.commodityId });
  }

  if (values.quantity !== undefined) {
    await dialog.locator('input[type="number"]').nth(0).fill(String(values.quantity));
  }

  if (values.unitPrice !== undefined) {
    await dialog.locator('input[type="number"]').nth(1).fill(String(values.unitPrice));
  }
}

test('browser smoke for login and core CRUD flows', async ({ page }) => {
  await page.goto('/login');
  await expect(page.getByText('登录后台')).toBeVisible();

  await page.getByPlaceholder('请输入用户名').fill('admin');
  await page.getByPlaceholder('请输入密码').fill('admin123456');
  await page.getByRole('button', { name: '登录' }).click();

  await expect(page.getByText('全栈后台')).toBeVisible();

  await page.getByRole('link', { name: '分类' }).click();
  await expect(page.getByRole('heading', { name: '分类管理' })).toBeVisible();
  await page.getByRole('button', { name: '新增' }).click();
  await fillDialogForm(page, { name: names.category, description: 'smoke' });
  await page.getByRole('button', { name: '创建' }).click();
  await expect(page.getByText(names.category)).toBeVisible();

  await page.getByRole('link', { name: '单位' }).click();
  await expect(page.getByRole('heading', { name: '单位管理' })).toBeVisible();
  await page.getByRole('button', { name: '新增' }).click();
  await fillDialogForm(page, { name: names.unit, description: 'smoke' });
  await page.getByRole('button', { name: '创建' }).click();
  await expect(page.getByText(names.unit)).toBeVisible();

  await page.getByRole('link', { name: '商品' }).click();
  await expect(page.getByRole('heading', { name: '商品管理' })).toBeVisible();
  await page.getByRole('button', { name: '新增商品' }).click();
  await fillDialogForm(page, {
    name: names.commodity,
    description: 'smoke',
    categoryId: names.category,
    unitId: names.unit,
  });
  await page.getByRole('button', { name: '保存' }).click();
  await expect(page.getByText(names.commodity)).toBeVisible();

  await page.getByRole('link', { name: '订单' }).click();
  await expect(page.getByRole('heading', { name: '订单管理' })).toBeVisible();
  await page.getByRole('button', { name: '新增订单' }).click();
  await fillDialogForm(page, { name: names.order, description: 'smoke' });
  await page.getByRole('button', { name: '保存' }).click();
  await expect(page.getByRole('link', { name: names.order })).toBeVisible();

  await page.getByRole('link', { name: names.order }).click();
  await expect(page.getByRole('heading', { name: '订单明细' })).toBeVisible();
  await page.getByRole('button', { name: '新增明细' }).click();
  await fillDialogForm(page, {
    commodityId: names.commodity,
    quantity: 2,
    unitPrice: 12.5,
    description: 'smoke item',
  });
  await page.getByRole('button', { name: '保存' }).click();

  await expect(page.getByText('总金额')).toBeVisible();
  await expect(page.getByText('25.00')).toBeVisible();
  await expect(page.getByText(names.commodity)).toBeVisible();
  await expect(page.getByText(names.category)).toBeVisible();
});

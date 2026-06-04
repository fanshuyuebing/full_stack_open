# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: blog_app.spec.js >> Blog app >> When logged in >> a blog can be liked
- Location: tests\blog_app.spec.js:54:5

# Error details

```
Error: page.goto: Target page, context or browser has been closed
```

```
Error: locator.click: Target page, context or browser has been closed
```

# Test source

```ts
  1  | const { test, expect, beforeEach, describe } = require('@playwright/test')
  2  | 
  3  | describe('Blog app', () => {
  4  |   beforeEach(async ({ page, request }) => {
  5  |     await request.post('http://localhost:3003/api/testing/reset')
  6  |     await request.post('http://localhost:3003/api/users', {
  7  |       data: {
  8  |         name: 'Matti Luukkainen',
  9  |         username: 'mluukkai',
  10 |         password: 'salainen'
  11 |       }
  12 |     })
  13 |     await page.goto('http://localhost:5173')
  14 |   })
  15 | 
  16 |   describe('Login', () => {
  17 |     test('succeeds with correct credentials', async ({ page }) => {
  18 |       await page.getByRole('link', { name: 'login' }).click()
  19 |       await page.getByLabel('username').fill('mluukkai')
  20 |       await page.getByLabel('password').fill('salainen')
  21 |       await page.getByRole('button', { name: 'login' }).click()
  22 | 
  23 |       await expect(page.getByText('Matti Luukkainen logged in')).toBeVisible()
  24 |     })
  25 | 
  26 |     test('fails with wrong credentials', async ({ page }) => {
  27 |       await page.getByRole('link', { name: 'login' }).click()
  28 |       await page.getByLabel('username').fill('mluukkai')
  29 |       await page.getByLabel('password').fill('wrong')
  30 |       await page.getByRole('button', { name: 'login' }).click()
  31 | 
  32 |       await expect(page.getByText('wrong credentials')).toBeVisible()
  33 |     })
  34 |   })
  35 | 
  36 |   describe('When logged in', () => {
  37 |     beforeEach(async ({ page }) => {
> 38 |       await page.getByRole('link', { name: 'login' }).click()
     |                                                       ^ Error: locator.click: Target page, context or browser has been closed
  39 |       await page.getByLabel('username').fill('mluukkai')
  40 |       await page.getByLabel('password').fill('salainen')
  41 |       await page.getByRole('button', { name: 'login' }).click()
  42 |     })
  43 | 
  44 |     test('a new blog can be created', async ({ page }) => {
  45 |       await page.getByRole('link', { name: 'create new' }).click()
  46 |       await page.getByPlaceholder('title').fill('Test Blog')
  47 |       await page.getByPlaceholder('author').fill('Test Author')
  48 |       await page.getByPlaceholder('url').fill('http://testblog.com')
  49 |       await page.getByRole('button', { name: 'create' }).click()
  50 | 
  51 |       await expect(page.getByText('Test Blog Test Author')).toBeVisible()
  52 |     })
  53 | 
  54 |     test('a blog can be liked', async ({ page }) => {
  55 |       await page.getByRole('link', { name: 'create new' }).click()
  56 |       await page.getByPlaceholder('title').fill('Blog to Like')
  57 |       await page.getByPlaceholder('author').fill('Test Author')
  58 |       await page.getByPlaceholder('url').fill('http://testblog.com')
  59 |       await page.getByRole('button', { name: 'create' }).click()
  60 | 
  61 |       await page.getByRole('button', { name: 'view' }).click()
  62 |       await page.getByRole('button', { name: 'like' }).click()
  63 | 
  64 |       await expect(page.getByText('likes 1')).toBeVisible()
  65 |     })
  66 | 
  67 |     test('a blog can be deleted', async ({ page }) => {
  68 |       await page.getByRole('link', { name: 'create new' }).click()
  69 |       await page.getByPlaceholder('title').fill('Blog to Delete')
  70 |       await page.getByPlaceholder('author').fill('Test Author')
  71 |       await page.getByPlaceholder('url').fill('http://testblog.com')
  72 |       await page.getByRole('button', { name: 'create' }).click()
  73 | 
  74 |       await page.getByRole('button', { name: 'view' }).click()
  75 | 
  76 |       page.on('dialog', dialog => dialog.accept())
  77 |       await page.getByRole('button', { name: 'remove' }).click()
  78 | 
  79 |       await expect(page.getByText('Blog to Delete Test Author')).not.toBeVisible()
  80 |     })
  81 |   })
  82 | })
```
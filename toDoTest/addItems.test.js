// tests/add-todo.test.js
import { test, expect } from '@playwright/test';

test.describe('Add Todo Items', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to the todos application URL
    await page.goto('https://todomvc.com/examples/react/dist/');
  });

//Add task

  test('should add multiple todo items', async ({ page }) => {
    const todoItems = ['rest', 'test', 'shop', 'gym', 'read', 'walk'];

    // Function to add a new todo item
    async function addTodoItem(itemText) {
      await page.fill('input[placeholder="What needs to be done?"]', itemText);
      await page.press('input[placeholder="What needs to be done?"]', 'Enter');
      await page.waitForTimeout(500);
    }

    // Add todo items
    for (const itemText of todoItems) {
      await addTodoItem(itemText);
    }

    // Verify the todo items were added correctly
    for (const itemText of todoItems) {
        await expect(page.locator(`text=${itemText}`).first()).toBeVisible({ timeout: 10000 })
    }

   // Verify the items left count
   let itemsLeft = await page.textContent('.todo-count');
  console.log(`Items left: ${itemsLeft}`); 

//Complete the task

    // Define the todo item locator
    const todoItemText = 'walk';
    const todoLocator = page.locator(`.todo-list li:has-text("${todoItemText}")`);
           

    // Define the checkbox locator
    const checkbox = todoLocator.getByTestId('todo-item-toggle');
    const checkboxIsVisible = await checkbox.isVisible({ timeout: 10000 });
    console.log(`Checkbox visibility for "${todoItemText}": ${checkboxIsVisible}`);

   
    // Click the checkbox to mark the todo item as completed
     await checkbox.check();

    // Verify the todo item is crossed out and grayed out
    await expect(todoLocator).toHaveClass(/completed/);

    // Verify the checkbox is checked
    await expect(checkbox).toBeChecked();

// Edit task 
  const initialItemText = 'rest';
  const editedTodoText = 'swim';

  // Double-click the todo item to edit it
  const todoLocator1= page.locator(`.todo-list li:has-text("${initialItemText}")`);
  await todoLocator1.dblclick();

  // Fill the todo item with new text and press Entern
  const textInput = page.getByTestId('todo-list').getByTestId('text-input');
  await textInput.fill(editedTodoText);
  await textInput.press('Enter');

// Verify the changes are reflected in the todo list
  await expect(page.locator(`.todo-list li:has-text("${editedTodoText}")`).first()).toBeVisible({ timeout: 10000 });
  await expect(page.locator(`.todo-list li:has-text("${initialItemText}")`)).toHaveCount(0, { timeout: 10000 });

//Delete task
// Hover over the todo item to reveal the delete button
const todoText = 'test';
const todoLocator2 = page.locator(`.todo-list li:has-text("${todoText}")`);
await todoLocator2.hover();

// Click the delete button
//const deleteButton = todoLocator2.locator('.destroy');
const deleteButton = todoLocator2.getByRole('button', { name: '×' });
await deleteButton.click();

// Verify the todo item is removed from the list
await expect(page.locator(`.todo-list li:has-text("${todoText}")`)).toHaveCount(0, { timeout: 10000 });

// Verify the items left count
itemsLeft = await page.textContent('.todo-count');
console.log(`Items left: ${itemsLeft}`);

// Click the "Completed" filter button
await page.click('text=Completed');
await expect(page.locator('.todo-list li')).toHaveCount(1);
itemsLeft = await page.textContent('.todo-count');
console.log(`Items left: ${itemsLeft}`);

// Click the "Active" filter button
await page.click('text=Active');
await expect(page.locator('.todo-list li')).toHaveCount(4);
itemsLeft = await page.textContent('.todo-count');
console.log(`Items left: ${itemsLeft}`);

// Click the "All" filter button
await page.click('footer >> text=All');
await expect(page.locator('.todo-list li')).toHaveCount(5);
itemsLeft = await page.textContent('.todo-count');
console.log(`Items left: ${itemsLeft}`);
  });
});
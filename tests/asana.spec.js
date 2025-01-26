import { test, expect } from "@playwright/test";
import { testCases } from "../test-data/asana.json";

/*
 * Test suite for verifying project tasks, columns, and tags.
 * @description This test suite logs in to the application and runs a series of tests
 * to verify the presence and correct placement of tasks within projects.
 */
test.describe("Test Suite", () => {

  // Performs login before each test.

  test.beforeEach(async ({ page }) => {
    await page.goto(process.env.ASANA_URL);
    await page.fill("input#username", process.env.ASANA_USERNAME);
    await page.fill("input#password", process.env.ASANA_PASSWORD);
    await page.click("//button[@type='submit']");
  });

  for (const data of testCases) {
  
    // Verifies that a specific project has the expected task in the correct column with the correct tags.
    test(`Verify ${data.project} project has ${data.task} task in ${data.column} column with ${data.tags} tag/tags @asana`, async ({page}) => {
      
      // Navigates to 'Web Application' OR 'Mobile Application' section
      await page.click(`text=${data.project}`);
      
      // verifies task elem and column elem are visisble and task elem is in the correct column
      const taskElement = page.locator(`//h3[contains(text(),"${data.task}")]/..`);
      await expect(taskElement).toBeVisible();
      const columnElement = page.locator(`//h2[contains(text(),"${data.column}")]/..`);
      await expect(columnElement).toBeVisible();
      expect(columnElement).toContainText(`${data.task}`);

      // verifies expected tag/tags is present in the given task
      for (let tag of data.tags) {
        await expect(taskElement).toContainText(tag);
      }
    });
  }
});

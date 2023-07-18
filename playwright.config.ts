import type { PlaywrightTestConfig } from "@playwright/test";
import { devices } from "@playwright/test";

require("dotenv").config();

const config: PlaywrightTestConfig = {
  testDir: "./tests",
  timeout: 300 * 1000,
  expect: {
    timeout: 5000,
  },
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: process.env.CI
    ? [
        ["html", { open: "never", outputFolder: "playwright-report" }],
        ["list", { printSteps: true }],
        ["junit", { outputFile: "playwright-report/results.xml" }],
        ["allure-playwright"],
      ]
    : [
        ["html", { open: "never", outputFolder: "playwright-report" }],
        ["list", { printSteps: true }],
        ["junit", { outputFile: "playwright-report/results.xml" }],
        ["allure-playwright"],
      ],
  use: {
    actionTimeout: 0,
    headless: !true,
    trace: "on-first-retry",
    video: "on",

    baseURL:
      process.env.STAGING === "1"
        ? "https://staging.getwemail.io"
        : "https://api.getwemail.io",
    httpCredentials:
      process.env.STAGING === "1"
        ? {
            username: process.env.STAGING_USER_NAME!,
            password: process.env.STAGING_PASSWORD!,
          }
        : {
            username: process.env.USER_NAME!,
            password: process.env.PASSWORD!,
          },

    extraHTTPHeaders: {
      authorization: "",
      site:
        process.env.STAGING === "1"
          ? process.env.STAGING_WP_SITE_ID!
          : process.env.WP_SITE_ID!,
    },
  },
  projects: [
    {
      name: "firefox",
      use: {
        ...devices["Desktop Firefox"],
      },
    },
  ],
};

export default config;

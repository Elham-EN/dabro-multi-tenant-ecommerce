import type { Config } from "jest";
import nextJest from "next/jest.js";

const createJestConfig = nextJest({
  // Provide the path to your Next.js app to load next.config.js and .env files in your test environment
  dir: "./",
});

const config: Config = {
  // Automatically clear mock calls, instances, contexts and results before every test
  clearMocks: true,

  // Indicates whether the coverage information should be collected while executing the test
  collectCoverage: true,

  // The directory where Jest should output its coverage files
  coverageDirectory: "coverage-server",

  // Indicates which provider should be used to instrument code for coverage
  coverageProvider: "v8",

  // A list of paths to modules that run some code to configure or set up the testing framework before each test
  setupFilesAfterEnv: ["<rootDir>/jest.server.setup.ts"],

  // The test environment that will be used for testing (NODE for server components)
  testEnvironment: "node",

  // The glob patterns Jest uses to detect test files (only server component tests)
  testMatch: [
    "**/app/**/page.server.test.?([mc])[jt]s?(x)",
    "**/app/api/**/*.test.?([mc])[jt]s?(x)",
    "**/*.server.test.?([mc])[jt]s?(x)",
  ],

  // Display name for this project when running multiple configs
  displayName: "server",
};

export default createJestConfig(config);

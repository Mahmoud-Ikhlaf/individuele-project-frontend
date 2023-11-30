import { defineConfig } from "cypress";
import codeCoverageTask from  "@cypress/code-coverage/task";

export default defineConfig({
  e2e: {
    baseUrl: 'http://localhost:5000',
    setupNodeEvents(on, config) {
      // implement node event listeners here
      codeCoverageTask(on, config);

      return config;
    },
  },
});

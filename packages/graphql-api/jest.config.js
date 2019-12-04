const { join } = require("path");
const { pathsToModuleNameMapper } = require("ts-jest/utils");
const { compilerOptions } = require("./tsconfig");

module.exports = {
  preset: "ts-jest",
  collectCoverageFrom: ["src/**/*.{ts,js}"],
  moduleFileExtensions: ["ts", "js", "json", "node"],
  moduleNameMapper: pathsToModuleNameMapper(compilerOptions.paths, {
    prefix: "<rootDir>/",
  }),
  setupFiles: [join(__dirname, "/test/jest_setup.ts")],
  ...(process.env.COVERAGE
    ? {
        collectCoverage: true,
        coverageReporters: ["lcov"],
      }
    : {}),
};

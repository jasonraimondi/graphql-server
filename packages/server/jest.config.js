const { pathsToModuleNameMapper } = require('ts-jest/utils');
const { compilerOptions } = require('./tsconfig');

module.exports = {
    collectCoverage: true,
    collectCoverageFrom: ["src/**/*.{ts,js}"],
    coverageReporters: ["lcov"],
    moduleFileExtensions: ["ts", "js", "json", "node"],
    moduleNameMapper: pathsToModuleNameMapper(compilerOptions.paths, { prefix: '<rootDir>/' }),
    setupFiles: [
      __dirname + "/test/jest_setup.ts",
    ],
    transform: {
        "^.+\\.tsx?$": "ts-jest",
    },
    testRegex: "(/__tests__/.*|(\\.|/)(spec))\\.(jsx?|tsx?)$"
};

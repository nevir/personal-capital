/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */
module.exports = {
  projects: ['<rootDir>/test/functional', '<rootDir>/test/unit'],

  collectCoverage: true,
  collectCoverageFrom: ['<rootDir>/src/**/*.ts'],
}

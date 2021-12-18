/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */
module.exports = {
  projects: ['<rootDir>/test/functional'],

  collectCoverage: true,
  collectCoverageFrom: ['<rootDir>/src/**/*.ts'],
}

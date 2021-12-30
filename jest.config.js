/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */
module.exports = {
  projects: ['<rootDir>/test/functional', '<rootDir>/test/unit'],

  collectCoverageFrom: ['<rootDir>/src/**/*.ts'],
}

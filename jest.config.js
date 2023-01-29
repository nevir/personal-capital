/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */
module.exports = {
  preset: 'ts-jest',

  projects: [
    {
      preset: 'ts-jest',
      displayName: 'unit',
      testMatch: ['<rootDir>/test/unit/**/*.ts'],
      setupFiles: [
        '<rootDir>/test/support/unit/setup.ts',
      ],
    },

    {
      preset: 'ts-jest',
      displayName: 'functional',
      testMatch: ['<rootDir>/test/functional/**/*.ts'],
    }
  ],

  collectCoverageFrom: ['<rootDir>/src/**/*.ts'],
}

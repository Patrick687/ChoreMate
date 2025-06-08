export default {
  preset: 'ts-jest/presets/default-esm',
  testEnvironment: 'node',
  extensionsToTreatAsEsm: ['.ts'],
  testMatch: ['**/__tests__/**/*.test.ts'],
  transform: {
    '^.+\\.tsx?$': [
      'ts-jest',
      {
        useESM: true,
        tsconfig: '<rootDir>/tsconfig.json',
      },
    ],
  },
  // Remove globalSetup/globalTeardown for now
  setupFilesAfterEnv: [
    '<rootDir>/src/__tests__/jest-console-silence.ts',
    '<rootDir>/src/__tests__/jest-setup.ts',
  ],
  moduleNameWrapper: {},
  transformIgnorePatterns: [],
};

module.exports = {
  testEnvironment: 'jsdom',
  setupFiles: ['<rootDir>/jest.polyfills.js'],
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1'
  },
  testMatch: ['<rootDir>/src/**/*.test.{js,jsx}'],
  collectCoverageFrom: [
    'src/**/*.{js,jsx}',
    '!src/main.jsx',
    '!src/**/styles.js',
    '!src/**/*.test.{js,jsx}',
    '!src/test/**',
    '!src/config/**',
    '!src/utils/navigation.js'
  ],
  clearMocks: true
}

module.exports = {
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/src/setupTests.js'],
  moduleNameMapper: {
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
  },
  transform: {
    '^.+\\.(js|jsx)$': 'babel-jest',
  },
  moduleFileExtensions: ['js', 'jsx', 'json'],
  testMatch: [
    '<rootDir>/src/**/*.test.js',
    '<rootDir>/src/__tests__/**/*.test.js'
  ],
  testPathIgnorePatterns: [
    '<rootDir>/test/',
    '<rootDir>/node_modules/'
  ],
  collectCoverageFrom: [
    'src/**/*.{js,jsx}',
    '!src/index.js',
    '!src/reportWebVitals.js'
  ],
  // Add these for modern React and Node.js compatibility
  globals: {
    TextEncoder: TextEncoder,
    TextDecoder: TextDecoder,
  },
  testEnvironmentOptions: {
    url: 'http://localhost:3000'
  }
};
import '@testing-library/jest-dom';

// Mock environment variables
process.env.REACT_APP_CHAIN_ID = '80001';
process.env.REACT_APP_GEO_NFT_CONTRACT_ADDRESS = '0x0000000000000000000000000000000000000000';
process.env.REACT_APP_CLAIM_CONTRACT_ADDRESS = '0x0000000000000000000000000000000000000000';

// Mock matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});
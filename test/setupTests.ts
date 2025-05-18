jest.mock('../src/plugins/currencyJob', () => ({
  __esModule: true,
  default: jest.fn(() => 'mocked-currencyJob'),
}));

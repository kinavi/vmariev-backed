"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
jest.mock('../src/plugins/currencyJob', () => ({
    __esModule: true,
    default: jest.fn(() => 'mocked-currencyJob'),
}));
//# sourceMappingURL=setupTests.js.map
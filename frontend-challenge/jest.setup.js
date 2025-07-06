import '@testing-library/jest-dom'

// MSW server setup
const { server } = require('./src/mocks/server')

beforeAll(() => server.listen())
afterEach(() => server.resetHandlers())
afterAll(() => server.close()) 
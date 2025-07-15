import '@testing-library/jest-dom'

// Polyfills para MSW en Node.js
import { TextEncoder, TextDecoder } from 'util'
import { ReadableStream } from 'stream/web'

// Polyfill para Response y Request
global.TextEncoder = TextEncoder
global.TextDecoder = TextDecoder
global.ReadableStream = ReadableStream

// Polyfill para fetch si no está disponible
if (!global.fetch) {
  global.fetch = jest.fn()
}

// Polyfill para Response
if (!global.Response) {
  global.Response = class Response {
    constructor(body, init = {}) {
      this.body = body
      this.status = init.status || 200
      this.statusText = init.statusText || 'OK'
      this.headers = new Map(Object.entries(init.headers || {}))
      this.ok = this.status >= 200 && this.status < 300
    }
    
    async json() {
      return JSON.parse(this.body)
    }
    
    async text() {
      return this.body
    }
  }
}

// Polyfill para Request
if (!global.Request) {
  global.Request = class Request {
    constructor(url, init = {}) {
      this.url = url
      this.method = init.method || 'GET'
      this.headers = new Map(Object.entries(init.headers || {}))
      this.body = init.body
    }
  }
}

// Solo importar y configurar MSW si no estamos en un test específico que no lo necesite
let server
try {
  const { server: mswServer } = require('./src/mocks/server')
  server = mswServer
} catch (error) {
  // Si MSW no está disponible, no configurarlo
  console.warn('MSW server not available in test environment')
}

// Configurar MSW solo si está disponible
if (server) {
  beforeAll(() => {
    server.listen({
      onUnhandledRequest: 'warn',
    })
  })
  
  afterEach(() => {
    server.resetHandlers()
  })
  
  afterAll(() => {
    server.close()
  })
}

// Mock para window.matchMedia (necesario para algunos tests)
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
})

// Mock para IntersectionObserver
global.IntersectionObserver = class IntersectionObserver {
  constructor() {}
  observe() {}
  unobserve() {}
  disconnect() {}
}
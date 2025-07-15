import { setupWorker } from 'msw/browser';
import { handlers } from './handlers.js';

export const worker = setupWorker(...handlers);

export const initMSW = async () => {
  try {
    await worker.start({
      onUnhandledRequest: 'bypass',
      serviceWorker: {
        url: '/mockServiceWorker.js'
      },
      waitUntilReady: true
    });
    
  } catch (error) {
    console.error('Failed to initialize MSW:', error);
  }
};
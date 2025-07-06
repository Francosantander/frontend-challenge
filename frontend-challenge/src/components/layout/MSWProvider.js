'use client';
import { useEffect } from 'react';

export default function MSWProvider() {
  useEffect(() => {
    if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
      import('../../mocks/browser').then(({ initMSW }) => {
        initMSW();
      });
    }
  }, []);
  return null;
}

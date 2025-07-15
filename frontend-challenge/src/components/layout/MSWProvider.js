'use client';
import { useEffect } from 'react';

export default function MSWProvider() {
  useEffect(() => {
    if (typeof window !== 'undefined') {
      import('../../mocks/browser').then(({ initMSW }) => {
        initMSW();
      });
    }
  }, []);
  return null;
}

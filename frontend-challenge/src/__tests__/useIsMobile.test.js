import { renderHook, act } from '@testing-library/react';
import useIsMobile from '@/hooks/useIsMobile';

Object.defineProperty(window, 'innerWidth', {
  writable: true,
  configurable: true,
  value: 1024,
});

const mockAddEventListener = jest.fn();
const mockRemoveEventListener = jest.fn();
Object.defineProperty(window, 'addEventListener', {
  writable: true,
  configurable: true,
  value: mockAddEventListener,
});
Object.defineProperty(window, 'removeEventListener', {
  writable: true,
  configurable: true,
  value: mockRemoveEventListener,
});

describe('useIsMobile', () => {
  beforeEach(() => {
    window.innerWidth = 1024;
    mockAddEventListener.mockClear();
    mockRemoveEventListener.mockClear();
  });

  describe('Initial State', () => {
    test('should detect desktop correctly', () => {
      window.innerWidth = 1024;
      const { result } = renderHook(() => useIsMobile());
      
      expect(result.current).toBe(false);
      expect(mockAddEventListener).toHaveBeenCalledWith('resize', expect.any(Function));
    });

    test('should detect mobile correctly', () => {
      window.innerWidth = 500;
      const { result } = renderHook(() => useIsMobile());
      
      expect(result.current).toBe(true);
    });

    test('should use custom breakpoint', () => {
      window.innerWidth = 900;
      const { result } = renderHook(() => useIsMobile(1000));
      
      expect(result.current).toBe(true);
    });
  });

  describe('Resize Handling', () => {
    test('should update state on window resize', () => {
      window.innerWidth = 1024;
      const { result } = renderHook(() => useIsMobile());
      
      expect(result.current).toBe(false);
      
      act(() => {
        window.innerWidth = 500;
        const resizeHandler = mockAddEventListener.mock.calls.find(
          call => call[0] === 'resize'
        )[1];
        resizeHandler();
      });
      
      expect(result.current).toBe(true);

      act(() => {
        window.innerWidth = 1024;
        const resizeHandler = mockAddEventListener.mock.calls.find(
          call => call[0] === 'resize'
        )[1];
        resizeHandler();
      });
      
      expect(result.current).toBe(false);
    });

    test('should handle breakpoint edge case', () => {
      window.innerWidth = 768;
      const { result } = renderHook(() => useIsMobile(768));
      
      expect(result.current).toBe(false);
      
      act(() => {
        window.innerWidth = 767;
        const resizeHandler = mockAddEventListener.mock.calls.find(
          call => call[0] === 'resize'
        )[1];
        resizeHandler();
      });
      
      expect(result.current).toBe(true);
    });
  });

  describe('Lifecycle', () => {
    test('should cleanup event listener on unmount', () => {
      const { unmount } = renderHook(() => useIsMobile());
      
      expect(mockAddEventListener).toHaveBeenCalledWith('resize', expect.any(Function));
      
      unmount();
      
      expect(mockRemoveEventListener).toHaveBeenCalledWith('resize', expect.any(Function));
    });

    test('should handle breakpoint changes', () => {
      window.innerWidth = 800;
      const { result, rerender } = renderHook(
        ({ breakpoint }) => useIsMobile(breakpoint),
        { initialProps: { breakpoint: 768 } }
      );
      
      expect(result.current).toBe(false);
      
      rerender({ breakpoint: 1024 });
      
      expect(result.current).toBe(true);
    });
  });
}); 
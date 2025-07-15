import { renderHook, act, waitFor } from '@testing-library/react';
import useProductSearch from '@/hooks/useProductSearch';

global.fetch = jest.fn();

describe('useProductSearch', () => {
  beforeEach(() => {
    fetch.mockClear();
    jest.clearAllTimers();
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
  });

  test('should initialize with empty state', () => {
    const { result } = renderHook(() => useProductSearch());
    
    expect(result.current.query).toBe('');
    expect(result.current.results).toEqual([]);
    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBe(null);
    expect(result.current.hasSearched).toBe(false);
  });

  test('should handle successful search', async () => {
    const mockResponse = {
      query: 'iphone',
      results: [
        {
          id: 'MLA123456789',
          title: 'Apple iPhone 13',
          price: 1367999,
          currency_id: 'ARS'
        }
      ]
    };

    fetch.mockResolvedValueOnce({
      ok: true,
      status: 200,
      headers: {
        get: jest.fn().mockReturnValue('application/json')
      },
      json: async () => mockResponse,
    });

    const { result } = renderHook(() => useProductSearch());

    await act(async () => {
      await result.current.searchProducts('iphone');
    });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.query).toBe('iphone');
    expect(result.current.results).toEqual(mockResponse.results);
    expect(result.current.error).toBe(null);
    expect(result.current.hasSearched).toBe(true);
    expect(fetch).toHaveBeenCalledWith('/api/search?q=iphone&limit=10&offset=0');
  });

  test('should handle search error', async () => {
    const mockResponse = {
      ok: false,
      status: 500,
      headers: {
        get: jest.fn().mockReturnValue('application/json')
      },
      json: jest.fn().mockResolvedValue({ message: 'Server error' })
    };

    fetch.mockResolvedValue(mockResponse);

    const { result } = renderHook(() => useProductSearch());

    await act(async () => {
      await result.current.searchProducts('iphone');
    });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    }, { timeout: 3000 });

    expect(result.current.results).toEqual([]);
    expect(result.current.error).toBe('Error de configuración del servidor mock. Por favor recarga la página.');
    expect(result.current.hasSearched).toBe(true);
  });

  test('should ignore empty queries', async () => {
    const { result } = renderHook(() => useProductSearch());

    await act(async () => {
      await result.current.searchProducts('   ');
    });

    expect(result.current.hasSearched).toBe(false);
    expect(fetch).not.toHaveBeenCalled();
  });

  test('should clear search results', () => {
    const { result } = renderHook(() => useProductSearch());

    act(() => {
      result.current.searchProducts('iphone');
    });

    act(() => {
      result.current.clearSearch();
    });

    expect(result.current.query).toBe('');
    expect(result.current.results).toEqual([]);
    expect(result.current.error).toBe(null);
    expect(result.current.hasSearched).toBe(false);
  });

  test('should handle network errors', async () => {
    fetch.mockRejectedValueOnce(new Error('Failed to fetch'));

    const { result } = renderHook(() => useProductSearch());

    await act(async () => {
      await result.current.searchProducts('iphone');
    });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.results).toEqual([]);
    expect(result.current.error).toBe('Error de conexión. Verifica tu conexión a internet.');
    expect(result.current.hasSearched).toBe(true);
  });

  test('should handle MSW retry logic', async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      status: 200,
      headers: {
        get: jest.fn().mockReturnValue('text/html')
      }
    });

    const mockResponse = {
      query: 'iphone',
      results: [
        {
          id: 'MLA123456789',
          title: 'Apple iPhone 13',
          price: 1367999,
          currency_id: 'ARS'
        }
      ]
    };

    fetch.mockResolvedValueOnce({
      ok: true,
      status: 200,
      headers: {
        get: jest.fn().mockReturnValue('application/json')
      },
      json: async () => mockResponse,
    });

    const { result } = renderHook(() => useProductSearch());

    act(() => {
      result.current.searchProducts('iphone');
    });

    act(() => {
      jest.advanceTimersByTime(200);
    });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.query).toBe('iphone');
    expect(result.current.results).toEqual(mockResponse.results);
    expect(result.current.error).toBe(null);
    expect(result.current.hasSearched).toBe(true);
    expect(fetch).toHaveBeenCalledTimes(2);
  });

  test('should handle MSW retry exhaustion', async () => {
    fetch.mockResolvedValue({
      ok: true,
      status: 200,
      headers: {
        get: jest.fn().mockReturnValue('text/html')
      }
    });

    const { result } = renderHook(() => useProductSearch());

    act(() => {
      result.current.searchProducts('iphone');
    });

    await act(async () => {
      jest.advanceTimersByTime(200);
      await Promise.resolve();
    });

    await act(async () => {
      jest.advanceTimersByTime(400);
      await Promise.resolve();
    });

    await act(async () => {
      jest.advanceTimersByTime(600);
      await Promise.resolve();
    });

    await waitFor(() => {
      expect(result.current.hasSearched).toBe(true);
    });

    expect(result.current.results).toEqual([]);
    console.log('Actual error:', result.current.error);
    expect(result.current.error).toBe('Error de configuración del servidor mock. Por favor recarga la página.'); // El mensaje viene del retry logic
    expect(result.current.hasSearched).toBe(true);
  });

  test('should handle JSON parsing errors', async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      status: 200,
      headers: {
        get: jest.fn().mockReturnValue('application/json')
      },
      json: async () => {
        throw new Error('Unexpected token in JSON');
      },
    });

    const { result } = renderHook(() => useProductSearch());

    await act(async () => {
      await result.current.searchProducts('iphone');
    });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.results).toEqual([]);
    expect(result.current.error).toBe('Error de formato en la respuesta del servidor.');
    expect(result.current.hasSearched).toBe(true);
  });

  test('should trim whitespace from query', async () => {
    const mockResponse = {
      query: 'iphone',
      results: [
        {
          id: 'MLA123456789',
          title: 'Apple iPhone 13',
          price: 1367999,
          currency_id: 'ARS'
        }
      ]
    };

    fetch.mockResolvedValueOnce({
      ok: true,
      status: 200,
      headers: {
        get: jest.fn().mockReturnValue('application/json')
      },
      json: async () => mockResponse,
    });

    const { result } = renderHook(() => useProductSearch());

    await act(async () => {
      await result.current.searchProducts('  iphone  ');
    });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(fetch).toHaveBeenCalledWith('/api/search?q=iphone&limit=10&offset=0');
    expect(result.current.query).toBe('iphone');
    expect(result.current.results).toEqual(mockResponse.results);
  });

  test('should ignore empty queries', async () => {
    const { result } = renderHook(() => useProductSearch());

    await act(async () => {
      await result.current.searchProducts('   ');
    });

    expect(result.current.hasSearched).toBe(false);
    expect(fetch).not.toHaveBeenCalled();
  });

  test('should clear search results', () => {
    const { result } = renderHook(() => useProductSearch());

    act(() => {
      result.current.searchProducts('iphone');
    });

    act(() => {
      result.current.clearSearch();
    });

    expect(result.current.query).toBe('');
    expect(result.current.results).toEqual([]);
    expect(result.current.error).toBe(null);
    expect(result.current.hasSearched).toBe(false);
  });

  test('should handle loading state correctly', async () => {
    let resolvePromise;
    const fetchPromise = new Promise((resolve) => {
      resolvePromise = resolve;
    });

    fetch.mockImplementationOnce(() => fetchPromise);

    const { result } = renderHook(() => useProductSearch());

    act(() => {
      result.current.searchProducts('iphone');
    });

    expect(result.current.isLoading).toBe(true);
    expect(result.current.error).toBe(null);
    expect(result.current.results).toEqual([]);

    await act(async () => {
      resolvePromise({
        ok: true,
        status: 200,
        headers: {
          get: jest.fn().mockReturnValue('application/json')
        },
        json: async () => ({ query: 'iphone', results: [] }),
      });
    });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.hasSearched).toBe(true);
  });

  test('should handle 404 error correctly', async () => {
    fetch.mockResolvedValueOnce({
      ok: false,
      status: 404,
      headers: {
        get: jest.fn().mockReturnValue('application/json')
      },
      json: async () => ({ error: 'Not found', message: 'No results for this query' }),
    });

    const { result } = renderHook(() => useProductSearch());

    await act(async () => {
      await result.current.searchProducts('iphone');
    });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.results).toEqual([]);
    expect(result.current.error).toBe(null);
    expect(result.current.hasSearched).toBe(true);
  });

  test('should handle server errors correctly', async () => {
    fetch.mockResolvedValue({
      ok: false,
      status: 500,
      headers: {
        get: jest.fn().mockReturnValue('application/json')
      },
      json: async () => ({ message: 'Internal server error' }),
    });

    const { result } = renderHook(() => useProductSearch());

    await act(async () => {
      await result.current.searchProducts('iphone');
    });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    }, { timeout: 3000 });

    expect(result.current.results).toEqual([]);
    expect(result.current.error).toBe('Error de configuración del servidor mock. Por favor recarga la página.');
    expect(result.current.hasSearched).toBe(true);
  });

  test('should handle response without message in error', async () => {
    fetch.mockResolvedValue({
      ok: false,
      status: 500,
      headers: {
        get: jest.fn().mockReturnValue('application/json')
      },
      json: async () => ({}),
    });

    const { result } = renderHook(() => useProductSearch());

    await act(async () => {
      await result.current.searchProducts('iphone');
    });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    }, { timeout: 3000 });

    expect(result.current.results).toEqual([]);
    expect(result.current.error).toBe('Error de configuración del servidor mock. Por favor recarga la página.');
    expect(result.current.hasSearched).toBe(true);
  });
}); 
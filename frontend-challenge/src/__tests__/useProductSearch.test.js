import { renderHook, act, waitFor } from '@testing-library/react';
import useProductSearch from '@/hooks/useProductSearch';

// Mock fetch globally
global.fetch = jest.fn();

describe('useProductSearch', () => {
  beforeEach(() => {
    fetch.mockClear();
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
    fetch.mockResolvedValueOnce({
      ok: false,
      json: async () => ({ message: 'Network error' }),
    });

    const { result } = renderHook(() => useProductSearch());

    await act(async () => {
      await result.current.searchProducts('iphone');
    });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.results).toEqual([]);
    expect(result.current.error).toBe('Network error');
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

    // First set some state
    act(() => {
      result.current.searchProducts('iphone');
    });

    // Then clear it
    act(() => {
      result.current.clearSearch();
    });

    expect(result.current.query).toBe('');
    expect(result.current.results).toEqual([]);
    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBe(null);
    expect(result.current.hasSearched).toBe(false);
  });
}); 
import useProductSearch from '@/hooks/useProductSearch';

// Mock fetch globally
global.fetch = jest.fn();

describe('useProductSearch', () => {
  beforeEach(() => {
    fetch.mockClear();
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
    fetch.mockResolvedValueOnce({
      ok: false,
      json: async () => ({ message: 'Network error' }),
    });

    const { result } = renderHook(() => useProductSearch());

    await act(async () => {
      await result.current.searchProducts('iphone');
    });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.results).toEqual([]);
    expect(result.current.error).toBe('Network error');
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

    // First set some state
    act(() => {
      result.current.searchProducts('iphone');
    });

    // Then clear it
    act(() => {
      result.current.clearSearch();
    });

    expect(result.current.query).toBe('');
    expect(result.current.results).toEqual([]);
    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBe(null);
    expect(result.current.hasSearched).toBe(false);
  });
}); 
import { renderHook, act, waitFor } from '@testing-library/react';
import useProductDetail from '@/hooks/useProductDetail';

global.fetch = jest.fn();

describe('useProductDetail', () => {
  beforeEach(() => {
    fetch.mockClear();
    jest.clearAllTimers();
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
  });

  test('should initialize with correct default state', () => {
    const { result } = renderHook(() => useProductDetail());
    
    expect(result.current.product).toBe(null);
    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBe(null);
    expect(result.current.hasLoaded).toBe(false);
    expect(typeof result.current.fetchProductDetail).toBe('function');
    expect(typeof result.current.clearProductDetail).toBe('function');
  });

  test('should handle successful product fetch', async () => {
    const mockProduct = {
      id: 'MLA123456789',
      title: 'iPhone 13 Pro',
      price: 1500000,
      currency_id: 'ARS',
      thumbnail: 'https://example.com/thumb.jpg',
      pictures: [
        { secure_url: 'https://example.com/pic1.jpg' },
        { secure_url: 'https://example.com/pic2.jpg' }
      ],
      condition: 'new',
      sold_quantity: 150,
      available_quantity: 5
    };

    fetch.mockResolvedValueOnce({
      ok: true,
      status: 200,
      headers: {
        get: jest.fn().mockReturnValue('application/json')
      },
      json: async () => mockProduct,
    });

    const { result } = renderHook(() => useProductDetail());

    await act(async () => {
      await result.current.fetchProductDetail('MLA123456789');
    });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.product).toEqual(mockProduct);
    expect(result.current.error).toBe(null);
    expect(result.current.hasLoaded).toBe(true);
    expect(fetch).toHaveBeenCalledWith('/api/items/MLA123456789');
  });

  test('should handle 404 error correctly', async () => {
    fetch.mockResolvedValueOnce({
      ok: false,
      status: 404,
      headers: {
        get: jest.fn().mockReturnValue('application/json')
      }
    });

    const { result } = renderHook(() => useProductDetail());

    await act(async () => {
      await result.current.fetchProductDetail('INVALID_ID');
    });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.product).toBe(null);
    expect(result.current.error).toBe('Producto no encontrado');
    expect(result.current.hasLoaded).toBe(true);
  });

  test('should handle server errors correctly', async () => {
    const errorResponse = {
      message: 'Internal server error'
    };

    fetch.mockResolvedValueOnce({
      ok: false,
      status: 500,
      headers: {
        get: jest.fn().mockReturnValue('application/json')
      },
      json: async () => errorResponse,
    });

    const { result } = renderHook(() => useProductDetail());

    await act(async () => {
      await result.current.fetchProductDetail('MLA123456789');
    });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.product).toBe(null);
    expect(result.current.error).toBe('Internal server error');
    expect(result.current.hasLoaded).toBe(true);
  });

  test('should handle network errors correctly', async () => {
    fetch.mockRejectedValueOnce(new Error('Failed to fetch'));

    const { result } = renderHook(() => useProductDetail());

    await act(async () => {
      await result.current.fetchProductDetail('MLA123456789');
    });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.product).toBe(null);
    expect(result.current.error).toBe('Error de conexión. Verifica tu conexión a internet.');
    expect(result.current.hasLoaded).toBe(true);
  });

  test('should handle empty or invalid product ID', async () => {
    const { result } = renderHook(() => useProductDetail());

    await act(async () => {
      await result.current.fetchProductDetail('');
    });

    expect(result.current.product).toBe(null);
    expect(result.current.error).toBe('ID de producto requerido');
    expect(result.current.hasLoaded).toBe(true);
    expect(result.current.isLoading).toBe(false);
    expect(fetch).not.toHaveBeenCalled();
  });

  test('should handle whitespace-only product ID', async () => {
    const { result } = renderHook(() => useProductDetail());

    await act(async () => {
      await result.current.fetchProductDetail('   ');
    });

    expect(result.current.product).toBe(null);
    expect(result.current.error).toBe('ID de producto requerido');
    expect(result.current.hasLoaded).toBe(true);
    expect(result.current.isLoading).toBe(false);
    expect(fetch).not.toHaveBeenCalled();
  });

  test('should handle MSW retry logic correctly', async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      status: 200,
      headers: {
        get: jest.fn().mockReturnValue('text/html')
      }
    });

    const mockProduct = {
      id: 'MLA123456789',
      title: 'iPhone 13 Pro',
      price: 1500000
    };

    fetch.mockResolvedValueOnce({
      ok: true,
      status: 200,
      headers: {
        get: jest.fn().mockReturnValue('application/json')
      },
      json: async () => mockProduct,
    });

    const { result } = renderHook(() => useProductDetail());

    act(() => {
      result.current.fetchProductDetail('MLA123456789');
    });

    act(() => {
      jest.advanceTimersByTime(200);
    });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.product).toEqual(mockProduct);
    expect(result.current.error).toBe(null);
    expect(result.current.hasLoaded).toBe(true);
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

    const { result } = renderHook(() => useProductDetail());

    act(() => {
      result.current.fetchProductDetail('MLA123456789');
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
      expect(result.current.hasLoaded).toBe(true);
    });

    expect(result.current.product).toBe(null);
    expect(result.current.error).toBe('Error de configuración del servidor mock. Por favor recarga la página.');
    expect(result.current.isLoading).toBe(false);
    expect(fetch).toHaveBeenCalledTimes(4);
  });

  test('should clear product detail correctly', () => {
    const { result } = renderHook(() => useProductDetail());

    act(() => {
      result.current.clearProductDetail();
    });

    expect(result.current.product).toBe(null);
    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBe(null);
    expect(result.current.hasLoaded).toBe(false);
  });

  test('should set loading state correctly during fetch', async () => {
    let resolvePromise;
    const fetchPromise = new Promise((resolve) => {
      resolvePromise = resolve;
    });

    fetch.mockImplementationOnce(() => fetchPromise);

    const { result } = renderHook(() => useProductDetail());

    act(() => {
      result.current.fetchProductDetail('MLA123456789');
    });

    expect(result.current.isLoading).toBe(true);
    expect(result.current.error).toBe(null);
    expect(result.current.product).toBe(null);

    act(() => {
      resolvePromise({
        ok: true,
        status: 200,
        headers: {
          get: jest.fn().mockReturnValue('application/json')
        },
        json: async () => ({ id: 'test', title: 'Test Product' }),
      });
    });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.product).toBeDefined();
    expect(result.current.hasLoaded).toBe(true);
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

    const { result } = renderHook(() => useProductDetail());

    await act(async () => {
      await result.current.fetchProductDetail('MLA123456789');
    });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.product).toBe(null);
    expect(result.current.error).toBe('Error de formato en la respuesta del servidor.');
    expect(result.current.hasLoaded).toBe(true);
  });

  test('should trim whitespace from product ID', async () => {
    const mockProduct = {
      id: 'MLA123456789',
      title: 'iPhone 13 Pro'
    };

    fetch.mockResolvedValueOnce({
      ok: true,
      status: 200,
      headers: {
        get: jest.fn().mockReturnValue('application/json')
      },
      json: async () => mockProduct,
    });

    const { result } = renderHook(() => useProductDetail());

    await act(async () => {
      await result.current.fetchProductDetail('  MLA123456789  ');
    });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(fetch).toHaveBeenCalledWith('/api/items/MLA123456789');
    expect(result.current.product).toEqual(mockProduct);
  });
}); 
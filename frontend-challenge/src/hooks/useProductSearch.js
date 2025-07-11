import { useState, useCallback } from 'react';

// Simula ser react query pero con hooks nativos de react
const useProductSearch = () => {
  const [searchState, setSearchState] = useState({
    query: '',
    results: [],
    isLoading: false,
    error: null,
    hasSearched: false
  });

  const searchProducts = useCallback(async (query) => {
    if (!query || !query.trim()) {
      return;
    }

    setSearchState(prev => ({
      ...prev,
      isLoading: true,
      error: null,
      query: query.trim()
    }));

    try {
      const searchParams = new URLSearchParams({
        q: query.trim(),
        limit: '10',
        offset: '0'
      });

      const response = await fetch(`/api/search?${searchParams}`);
      
      // Verificar si la respuesta es HTML (indica que MSW no interceptó)
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('text/html')) {
        console.error('MSW not intercepting requests - got HTML response');
        throw new Error('Error de configuración del servidor mock. Por favor recarga la página.');
      }
      
      // Si es un 404 pero con JSON válido (sin resultados)
      if (response.status === 404) {
        try {
          const errorData = await response.json();
          if (errorData.error === 'Not found' && errorData.message.includes('No results')) {
            // Es un 404 válido de MSW (sin resultados)
            setSearchState(prev => ({
              ...prev,
              results: [],
              isLoading: false,
              error: null,
              hasSearched: true
            }));
            return;
          }
        } catch (jsonError) {
          // Si falla al parsear JSON del 404, es un error real
          throw new Error('No se pudo conectar con el servidor de búsqueda');
        }
      }
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `Error del servidor: ${response.status}`);
      }

      const data = await response.json();

      setSearchState(prev => ({
        ...prev,
        results: data.results || [],
        isLoading: false,
        error: null,
        hasSearched: true
      }));

    } catch (error) {
      console.error('Error searching products:', error);
      
      // mensaje de error segun el tipo
      let errorMessage = 'Error al buscar productos';
      
      if (error.message.includes('Failed to fetch') || error.message.includes('NetworkError')) {
        errorMessage = 'Error de conexión. Verifica tu conexión a internet.';
      } else if (error.message.includes('MSW') || error.message.includes('configuración')) {
        errorMessage = error.message;
      } else if (error.message.includes('JSON')) {
        errorMessage = 'Error de formato en la respuesta del servidor.';
      } else {
        errorMessage = error.message;
      }
      
      setSearchState(prev => ({
        ...prev,
        results: [],
        isLoading: false,
        error: errorMessage,
        hasSearched: true
      }));
    }
  }, []);

  const clearSearch = useCallback(() => {
    setSearchState({
      query: '',
      results: [],
      isLoading: false,
      error: null,
      hasSearched: false
    });
  }, []);

  return {
    ...searchState,
    searchProducts,
    clearSearch
  };
};

export default useProductSearch; 
 
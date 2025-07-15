import { useState, useCallback } from 'react';

const useProductDetail = () => {
  
  const [detailState, setDetailState] = useState({
    product: null,
    isLoading: false,
    error: null,
    hasLoaded: false
  });

  const fetchProductDetail = useCallback(async (productId) => {
    if (!productId || !productId.trim()) {
      setDetailState(prev => ({
        ...prev,
        error: 'ID de producto requerido',
        hasLoaded: true
      }));
      return;
    }

    const trimmedId = productId.trim();

    setDetailState(prev => ({
      ...prev,
      isLoading: true,
      error: null,
      product: null
    }));

    let retryCount = 0;
    const maxRetries = 3;
    let timeoutId;

    const fetchWithRetry = async () => {
      try {
        const response = await fetch(`/api/items/${trimmedId}`);
        
        // Detectar si MSW no está interceptando (respuesta HTML)
        const contentType = response.headers && response.headers.get ? response.headers.get('content-type') : null;
        if (contentType && contentType.includes('text/html')) {
          // MSW no está listo, intentar retry
          if (retryCount < maxRetries) {
            retryCount++;
            timeoutId = setTimeout(fetchWithRetry, 200 * retryCount); // Backoff exponencial
            return;
          } else {
            // Se alcanzo el maximo de intentos
            throw new Error('Error de configuración del servidor mock. Por favor recarga la página.');
          }
        }
        
        if (response.status === 404) {
          setDetailState(prev => ({
            ...prev,
            product: null,
            isLoading: false,
            error: 'Producto no encontrado',
            hasLoaded: true
          }));
          return;
        }
        
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || `Error del servidor: ${response.status}`);
        }

        const productData = await response.json();

        setDetailState(prev => ({
          ...prev,
          product: productData,
          isLoading: false,
          error: null,
          hasLoaded: true
        }));

      } catch (error) {
        console.error('Error fetching product detail:', error);
        
        let errorMessage = 'Error al cargar el detalle del producto';
        
        if (error.message.includes('Failed to fetch') || error.message.includes('NetworkError')) {
          errorMessage = 'Error de conexión. Verifica tu conexión a internet.';
        } else if (error.message.includes('MSW') || error.message.includes('configuración')) {
          errorMessage = error.message;
        } else if (error.message.includes('JSON')) {
          errorMessage = 'Error de formato en la respuesta del servidor.';
        } else {
          errorMessage = error.message;
        }
        
        setDetailState(prev => ({
          ...prev,
          product: null,
          isLoading: false,
          error: errorMessage,
          hasLoaded: true
        }));
      }
    };

    // Iniciar el fetch con retry
    fetchWithRetry();

    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, []);

  const clearProductDetail = useCallback(() => {
    setDetailState({
      product: null,
      isLoading: false,
      error: null,
      hasLoaded: false
    });
  }, []);

  return {
    ...detailState,
    fetchProductDetail,
    clearProductDetail
  };
};

export default useProductDetail; 
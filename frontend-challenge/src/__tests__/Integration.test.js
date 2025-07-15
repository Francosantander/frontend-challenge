import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useRouter, useSearchParams } from 'next/navigation';

import SearchBox from '@/components/search/SearchBox/SearchBox';
import SearchResults from '@/components/search/SearchResults/SearchResults';
import ProductDetail from '@/components/product/ProductDetail/ProductDetail';

jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
  useSearchParams: jest.fn()
}));

jest.mock('@/hooks/useProductSearch');
jest.mock('@/hooks/useProductDetail');
jest.mock('@/hooks/useIsMobile');

describe('Integration Tests - Complete User Flow', () => {
  const mockRouter = {
    push: jest.fn(),
    back: jest.fn()
  };

  const mockSearchParams = {
    get: jest.fn()
  };

  const mockSearchResults = [
    {
      id: 'MLA123456789',
      title: 'iPhone 13 Pro Max 256GB',
      price: 1500000,
      thumbnail: 'https://example.com/iphone.jpg',
      installments: { quantity: 12, amount: 125000 },
      reviews: { rating_average: 4.8, total: 250 },
      shipping: { free_shipping: true },
      condition: 'new'
    },
    {
      id: 'MLA987654321',
      title: 'Samsung Galaxy S21',
      price: 800000,
      thumbnail: 'https://example.com/samsung.jpg',
      condition: 'used'
    }
  ];

  const mockProductDetail = {
    id: 'MLA123456789',
    title: 'iPhone 13 Pro Max 256GB',
    price: 1500000,
    original_price: 1800000,
    condition: 'new',
    sold_quantity: 150,
    pictures: [
      { id: '1', url: 'https://example.com/img1.jpg' },
      { id: '2', url: 'https://example.com/img2.jpg' }
    ],
    description: { plain_text: 'Excelente iPhone en perfectas condiciones.' },
    reviews: { rating_average: 4.8, total: 250 },
    shipping: { free_shipping: true },
    available_quantity: 25,
    installments: { quantity: 12, amount: 125000 }
  };

  beforeEach(() => {
    useRouter.mockReturnValue(mockRouter);
    useSearchParams.mockReturnValue(mockSearchParams);
    
    require('@/hooks/useIsMobile').default = jest.fn().mockReturnValue(false);
    
    jest.clearAllMocks();
  });

  test('should complete search to product detail flow', async () => {
    const user = userEvent.setup();

    const mockUseProductSearch = require('@/hooks/useProductSearch').default;
    mockUseProductSearch.mockReturnValue({
      results: mockSearchResults,
      isLoading: false,
      error: null,
      hasSearched: true,
      searchProducts: jest.fn()
    });

    mockSearchParams.get.mockReturnValue('');

    const { rerender } = render(<SearchBox />);
    
    const searchInput = screen.getByPlaceholderText('Buscar productos, marcas y más...');
    const searchButton = screen.getByLabelText('Buscar');

    await user.type(searchInput, 'iphone');
    await user.click(searchButton);

    expect(mockRouter.push).toHaveBeenCalledWith('/search?q=iphone');

    rerender(<SearchResults results={mockSearchResults} hasSearched={true} query="iphone" />);

    expect(screen.getByText('iPhone 13 Pro Max 256GB')).toBeInTheDocument();
    expect(screen.getByText('Samsung Galaxy S21')).toBeInTheDocument();
    expect(screen.getByText('$ 1.500.000')).toBeInTheDocument();

    const productLink = screen.getByRole('link', { name: /iPhone 13 Pro Max 256GB/i });
    fireEvent.click(productLink);

    rerender(
      <ProductDetail 
        product={mockProductDetail}
        isLoading={false}
        error={null}
        hasLoaded={true}
      />
    );

    expect(screen.getByText('iPhone 13 Pro Max 256GB')).toBeInTheDocument();
    expect(screen.getByText('17% OFF')).toBeInTheDocument();
    expect(screen.getByText('Llega gratis hoy')).toBeInTheDocument();
  });

  test('should navigate back from product detail', () => {
    render(
      <ProductDetail 
        product={mockProductDetail}
        isLoading={false}
        error={null}
        hasLoaded={true}
      />
    );

    const backButton = screen.getByLabelText('Volver a los resultados de búsqueda');
    fireEvent.click(backButton);

    expect(mockRouter.back).toHaveBeenCalledTimes(1);
  });

  test('should show loading states in correct sequence', async () => {
    const user = userEvent.setup();

    const mockUseProductSearch = require('@/hooks/useProductSearch').default;
    mockUseProductSearch.mockReturnValue({
      results: [],
      isLoading: true,
      error: null,
      hasSearched: false,
      searchProducts: jest.fn()
    });

    mockSearchParams.get.mockReturnValue('');

    const { rerender } = render(<SearchBox />);
    
    const searchInput = screen.getByPlaceholderText('Buscar productos, marcas y más...');
    await user.type(searchInput, 'test');
    await user.click(screen.getByLabelText('Buscar'));

    rerender(<SearchResults isLoading={true} query="test" />);
    expect(screen.getByText('Buscando productos...')).toBeInTheDocument();
    expect(screen.getByText(/Estamos buscando los mejores productos para:/)).toBeInTheDocument();

    mockUseProductSearch.mockReturnValue({
      results: mockSearchResults,
      isLoading: false,
      error: null,
      hasSearched: true,
      searchProducts: jest.fn()
    });

    rerender(<SearchResults results={mockSearchResults} hasSearched={true} query="test" />);
    expect(screen.queryByText('Buscando productos...')).not.toBeInTheDocument();
    expect(screen.getByText('iPhone 13 Pro Max 256GB')).toBeInTheDocument();

    rerender(
      <ProductDetail 
        product={null}
        isLoading={true}
        error={null}
        hasLoaded={false}
      />
    );

    expect(screen.getByLabelText('Volver a los resultados de búsqueda')).toBeInTheDocument();
    expect(screen.queryByText('iPhone 13 Pro Max 256GB')).not.toBeInTheDocument();
  });

  test('should handle errors gracefully in user flow', () => {
    const { rerender } = render(
      <SearchResults 
        error="Error de conexión" 
        hasSearched={true} 
        query="test" 
      />
    );

    expect(screen.getByText('Oops! Algo salió mal')).toBeInTheDocument();
    expect(screen.getByText('Error de conexión')).toBeInTheDocument();
    expect(screen.getByText('Intentar nuevamente')).toBeInTheDocument();

    rerender(
      <ProductDetail 
        product={null}
        isLoading={false}
        error="Producto no encontrado"
        hasLoaded={false}
      />
    );

    expect(screen.getByRole('alert')).toBeInTheDocument();
    expect(screen.getByText('Error al cargar el producto')).toBeInTheDocument();
    expect(screen.getByText('Producto no encontrado')).toBeInTheDocument();
  });

  test('should adapt flow for mobile users', () => {
    require('@/hooks/useIsMobile').default = jest.fn().mockReturnValue(true);

    const { rerender } = render(
      <ProductDetail 
        product={mockProductDetail}
        isLoading={false}
        error={null}
        hasLoaded={true}
      />
    );

    expect(screen.getByText('Comprar ahora')).toBeInTheDocument();
    
    expect(screen.getByText('Descripción')).toBeInTheDocument();
  });

  test('should handle no results scenario', () => {
    render(
      <SearchResults 
        results={[]} 
        hasSearched={true} 
        query="nonexistent" 
      />
    );

    expect(screen.getByText('No encontramos lo que buscas')).toBeInTheDocument();
    expect(screen.getByText('No hay productos que coincidan con')).toBeInTheDocument();
    expect(screen.getByText('"nonexistent"')).toBeInTheDocument();
    expect(screen.getByText('Te sugerimos:')).toBeInTheDocument();
  });

  test('should handle product not found after search', () => {
    render(
      <ProductDetail 
        product={null}
        isLoading={false}
        error={null}
        hasLoaded={true}
      />
    );

    expect(screen.getByText('Producto no encontrado')).toBeInTheDocument();
    expect(screen.getByText('El producto que buscas no existe o ha sido eliminado.')).toBeInTheDocument();
  });
}); 
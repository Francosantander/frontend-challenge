import { render, screen, fireEvent } from '@testing-library/react';
import { useRouter } from 'next/navigation';
import ProductDetail from '@/components/product/ProductDetail/ProductDetail';
import useIsMobile from '@/hooks/useIsMobile';

jest.mock('next/navigation', () => ({
  useRouter: jest.fn()
}));

jest.mock('@/hooks/useIsMobile');

jest.mock('@/components/product/ProductDetail/ProductGallery', () => {
  return function MockProductGallery({ images, title }) {
    return (
      <div data-testid="product-gallery">
        <span>Gallery for: {title}</span>
        <span>Images count: {images?.length || 0}</span>
      </div>
    );
  };
});

jest.mock('@/components/product/ProductDetail/ProductInfo', () => {
  return function MockProductInfo({ product, isMobile }) {
    return (
      <div data-testid="product-info">
        <span>Product Info for: {product?.title}</span>
        <span>Mobile: {isMobile ? 'Yes' : 'No'}</span>
      </div>
    );
  };
});

describe('ProductDetail', () => {
  const mockRouter = {
    back: jest.fn()
  };

  const mockProduct = {
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
    description: {
      plain_text: 'Excelente iPhone 13 Pro Max en perfectas condiciones.'
    },
    reviews: {
      rating_average: 4.8,
      total: 250
    }
  };

  beforeEach(() => {
    useRouter.mockReturnValue(mockRouter);
    useIsMobile.mockReturnValue(false);
    jest.clearAllMocks();
  });

  test('should render product successfully with all data', () => {
    render(
      <ProductDetail 
        product={mockProduct}
        isLoading={false}
        error={null}
        hasLoaded={true}
      />
    );

    expect(screen.getByLabelText('Volver a los resultados de búsqueda')).toBeInTheDocument();
    expect(screen.getByTestId('product-gallery')).toBeInTheDocument();
    expect(screen.getByTestId('product-info')).toBeInTheDocument();
    expect(screen.getByText('Gallery for: iPhone 13 Pro Max 256GB')).toBeInTheDocument();
    expect(screen.getByText('Images count: 2')).toBeInTheDocument();
    expect(screen.getByText('Descripción')).toBeInTheDocument();
    expect(screen.getByText('Excelente iPhone 13 Pro Max en perfectas condiciones.')).toBeInTheDocument();
  });

  test('should show loading state with skeleton', () => {
    render(
      <ProductDetail 
        product={null}
        isLoading={true}
        error={null}
        hasLoaded={false}
      />
    );

    expect(screen.getByLabelText('Volver a los resultados de búsqueda')).toBeInTheDocument();
    expect(screen.queryByTestId('product-gallery')).not.toBeInTheDocument();
    expect(screen.queryByTestId('product-info')).not.toBeInTheDocument();
  });

  test('should show error state with retry option', () => {
    render(
      <ProductDetail 
        product={null}
        isLoading={false}
        error="Error al cargar el producto"
        hasLoaded={false}
      />
    );

    expect(screen.getByRole('alert')).toBeInTheDocument();
    expect(screen.getAllByText('Error al cargar el producto')).toHaveLength(2); // h2 y p
    expect(screen.getByText('Volver a la página principal')).toBeInTheDocument();
  });

  test('should show not found state when product is null and hasLoaded is true', () => {
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

  test('should return null when product is null and hasLoaded is false', () => {
    const { container } = render(
      <ProductDetail 
        product={null}
        isLoading={false}
        error={null}
        hasLoaded={false}
      />
    );

    expect(container.firstChild).toBeNull();
  });

  test('should call router.back when back button is clicked', () => {
    render(
      <ProductDetail 
        product={mockProduct}
        isLoading={false}
        error={null}
        hasLoaded={true}
      />
    );

    fireEvent.click(screen.getByLabelText('Volver a los resultados de búsqueda'));
    expect(mockRouter.back).toHaveBeenCalledTimes(1);
  });

  test('should call router.back when retry button is clicked in error state', () => {
    render(
      <ProductDetail 
        product={null}
        isLoading={false}
        error="Error de conexión"
        hasLoaded={false}
      />
    );

    fireEvent.click(screen.getByText('Volver a la página principal'));
    expect(mockRouter.back).toHaveBeenCalledTimes(1);
  });

  test('should render mobile layout when isMobile is true', () => {
    useIsMobile.mockReturnValue(true);

    render(
      <ProductDetail 
        product={mockProduct}
        isLoading={false}
        error={null}
        hasLoaded={true}
      />
    );

    expect(screen.getByTestId('product-info')).toBeInTheDocument();
    expect(screen.getByText('Mobile: Yes')).toBeInTheDocument();
  });

  test('should render desktop layout when isMobile is false', () => {
    useIsMobile.mockReturnValue(false);

    render(
      <ProductDetail 
        product={mockProduct}
        isLoading={false}
        error={null}
        hasLoaded={true}
      />
    );

    expect(screen.getByTestId('product-info')).toBeInTheDocument();
    expect(screen.getByText('Mobile: No')).toBeInTheDocument();
  });

  test('should handle product without description', () => {
    const productWithoutDescription = {
      ...mockProduct,
      description: null
    };

    render(
      <ProductDetail 
        product={productWithoutDescription}
        isLoading={false}
        error={null}
        hasLoaded={true}
      />
    );

    expect(screen.queryByText('Descripción')).not.toBeInTheDocument();
    expect(screen.getByTestId('product-gallery')).toBeInTheDocument();
  });

  test('should handle product without pictures', () => {
    const productWithoutPictures = {
      ...mockProduct,
      pictures: []
    };

    render(
      <ProductDetail 
        product={productWithoutPictures}
        isLoading={false}
        error={null}
        hasLoaded={true}
      />
    );

    expect(screen.getByText('Images count: 0')).toBeInTheDocument();
    expect(screen.getByTestId('product-gallery')).toBeInTheDocument();
  });
}); 
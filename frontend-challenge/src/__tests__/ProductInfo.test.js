import { render, screen } from '@testing-library/react';
import ProductInfo from '@/components/product/ProductDetail/ProductInfo';

describe('ProductInfo', () => {
  const mockProduct = {
    title: 'iPhone 13 Pro Max 256GB',
    price: 1500000,
    original_price: 1800000,
    condition: 'new',
    sold_quantity: 150,
    available_quantity: 25,
    installments: {
      quantity: 12,
      amount: 125000
    },
    shipping: {
      free_shipping: true
    },
    reviews: {
      rating_average: 4.8,
      total: 250
    }
  };

  test('should render product title and basic info', () => {
    render(<ProductInfo product={mockProduct} isMobile={false} />);

    expect(screen.getByText('iPhone 13 Pro Max 256GB')).toBeInTheDocument();
    expect(screen.getByText('Nuevo')).toBeInTheDocument();
    expect(screen.getByText('| +150 vendidos')).toBeInTheDocument();
  });

  test('should format price correctly', () => {
    render(<ProductInfo product={mockProduct} isMobile={false} />);

    expect(screen.getByText('$ 1.500.000')).toBeInTheDocument();
    expect(screen.getAllByText('00')).toHaveLength(3); 

    expect(screen.getByText('$ 1.800.000')).toBeInTheDocument();
  });

  test('should calculate and show discount', () => {
    render(<ProductInfo product={mockProduct} isMobile={false} />);

    expect(screen.getByText('17% OFF')).toBeInTheDocument();
  });

  test('should show installments info on desktop', () => {
    render(<ProductInfo product={mockProduct} isMobile={false} />);

    expect(screen.getByText(/Mismo precio en 12 cuotas de \$ 125.000/)).toBeInTheDocument();
  });

  test('should show reviews and rating on desktop', () => {
    render(<ProductInfo product={mockProduct} isMobile={false} />);

    expect(screen.getByText('4.8')).toBeInTheDocument();
    expect(screen.getByText('(250)')).toBeInTheDocument();
    
    const stars = screen.getAllByText('★');
    expect(stars).toHaveLength(5);
  });

  test('should show shipping info when free shipping available', () => {
    render(<ProductInfo product={mockProduct} isMobile={false} />);

    expect(screen.getByText('Llega gratis hoy')).toBeInTheDocument();
    expect(screen.getByText('Solo en CABA y zonas de GBA')).toBeInTheDocument();
    expect(screen.getByText(/Comprando dentro de las próximas/)).toBeInTheDocument();
  });

  test('should show stock and quantity selector', () => {
    render(<ProductInfo product={mockProduct} isMobile={false} />);

    expect(screen.getByText('Stock disponible')).toBeInTheDocument();
    expect(screen.getByText('Cantidad:')).toBeInTheDocument();
    expect(screen.getByText('(25 disponibles)')).toBeInTheDocument();
    
    const select = screen.getByRole('combobox');
    expect(select).toBeInTheDocument();
  });

  test('should show action buttons', () => {
    render(<ProductInfo product={mockProduct} isMobile={false} />);

    expect(screen.getByText('Comprar ahora')).toBeInTheDocument();
    expect(screen.getByText('Agregar al carrito')).toBeInTheDocument();
  });

  test('should hide installments on mobile', () => {
    render(<ProductInfo product={mockProduct} isMobile={true} />);

    expect(screen.queryByText(/Mismo precio en/)).not.toBeInTheDocument();
  });

  test('should show reviews in mobile layout', () => {
    render(<ProductInfo product={mockProduct} isMobile={true} />);

    expect(screen.getByText('Comprar ahora')).toBeInTheDocument();
  });

  test('should hide desktop-only elements on mobile', () => {
    render(<ProductInfo product={mockProduct} isMobile={true} />);

    expect(screen.queryByText('iPhone 13 Pro Max 256GB')).not.toBeInTheDocument();
    
    expect(screen.queryByLabelText('Agregar a favoritos')).not.toBeInTheDocument();
  });

  test('should handle product without discount', () => {
    const productWithoutDiscount = {
      ...mockProduct,
      original_price: undefined
    };

    render(<ProductInfo product={productWithoutDiscount} isMobile={false} />);

    expect(screen.queryByText(/% OFF/)).not.toBeInTheDocument();
    expect(screen.getByText('$ 1.500.000')).toBeInTheDocument();
  });

  test('should handle product without reviews', () => {
    const productWithoutReviews = {
      ...mockProduct,
      reviews: undefined
    };

    render(<ProductInfo product={productWithoutReviews} isMobile={false} />);

    expect(screen.queryByText(/★/)).not.toBeInTheDocument();
    expect(screen.queryByText(/\(\d+\)$/)).not.toBeInTheDocument();
  });

  test('should handle product without shipping info', () => {
    const productWithoutShipping = {
      ...mockProduct,
      shipping: undefined
    };

    render(<ProductInfo product={productWithoutShipping} isMobile={false} />);

    expect(screen.queryByText('Llega gratis hoy')).not.toBeInTheDocument();
  });

  test('should handle product without installments', () => {
    const productWithoutInstallments = {
      ...mockProduct,
      installments: undefined
    };

    render(<ProductInfo product={productWithoutInstallments} isMobile={false} />);

    expect(screen.queryByText(/Mismo precio en/)).not.toBeInTheDocument();
  });

  test('should show condition correctly for used products', () => {
    const usedProduct = {
      ...mockProduct,
      condition: 'used'
    };

    render(<ProductInfo product={usedProduct} isMobile={false} />);

    expect(screen.getByText('Usado')).toBeInTheDocument();
  });

  test('should limit quantity selector to maximum 10 or available quantity', () => {
    const productWithLowStock = {
      ...mockProduct,
      available_quantity: 3
    };

    render(<ProductInfo product={productWithLowStock} isMobile={false} />);

    expect(screen.getByText('(3 disponibles)')).toBeInTheDocument();
    
    const select = screen.getByRole('combobox');
    const options = select.getElementsByTagName('option');
    expect(options).toHaveLength(3);
  });
}); 
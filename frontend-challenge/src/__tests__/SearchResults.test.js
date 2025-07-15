import { render, screen, fireEvent } from '@testing-library/react';
import SearchResults from '@/components/search/SearchResults/SearchResults';

jest.mock('next/link', () => {
  return function MockLink({ children, href, ...props }) {
    return (
      <a href={href} {...props}>
        {children}
      </a>
    );
  };
});

describe('SearchResults', () => {
  const mockProducts = [
    {
      id: 'MLA123456789',
      title: 'Apple iPhone 13 Pro',
      price: 1500000,
      thumbnail: 'https://example.com/iphone.jpg',
      installments: {
        quantity: 12,
        amount: 125000
      },
      reviews: {
        rating_average: 4.5,
        total: 150
      },
      shipping: {
        free_shipping: true
      },
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

  test('should render products list correctly', () => {
    render(
      <SearchResults 
        results={mockProducts}
        hasSearched={true}
        query="iphone"
      />
    );

    expect(screen.getByText('Apple iPhone 13 Pro')).toBeInTheDocument();
    expect(screen.getByText('Samsung Galaxy S21')).toBeInTheDocument();
    expect(screen.getByText('$ 1.500.000')).toBeInTheDocument();
    expect(screen.getByText('$ 800.000')).toBeInTheDocument();
  });

  test('should show loading state with skeleton', () => {
    render(
      <SearchResults 
        isLoading={true}
        query="iphone"
      />
    );

    expect(screen.getByText('Buscando productos...')).toBeInTheDocument();
    expect(screen.getByText(/Estamos buscando los mejores productos para:/)).toBeInTheDocument();
    expect(screen.getByText('iphone')).toBeInTheDocument();
  });

  test('should show no results message when search returns empty', () => {
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

  test('should show error state and retry button', () => {
    render(
      <SearchResults 
        error="Error de conexión"
        hasSearched={true}
        query="iphone"
      />
    );

    expect(screen.getByText('Oops! Algo salió mal')).toBeInTheDocument();
    expect(screen.getByText('Error de conexión')).toBeInTheDocument();
    expect(screen.getByText('Intentar nuevamente')).toBeInTheDocument();
  });

  test('should not render anything when hasSearched is false', () => {
    const { container } = render(
      <SearchResults 
        results={mockProducts}
        hasSearched={false}
        query="iphone"
      />
    );

    expect(container.firstChild).toBeNull();
  });

  test('should format prices correctly', () => {
    render(
      <SearchResults 
        results={[{
          id: 'MLA123',
          title: 'Test Product',
          price: 1234567.89,
          thumbnail: 'https://example.com/test.jpg'
        }]}
        hasSearched={true}
        query="test"
      />
    );

    expect(screen.getByText('$ 1.234.567')).toBeInTheDocument();
  });

  test('should show installments when available', () => {
    render(
      <SearchResults 
        results={[{
          id: 'MLA123',
          title: 'Test Product',
          price: 1200000,
          thumbnail: 'https://example.com/test.jpg',
          installments: {
            quantity: 6,
            amount: 200000
          }
        }]}
        hasSearched={true}
        query="test"
      />
    );

    expect(screen.getByText(/Mismo precio en 6 cuotas de \$ 200.000/)).toBeInTheDocument();
  });

  test('should show reviews and rating when available', () => {
    render(
      <SearchResults 
        results={[{
          id: 'MLA123',
          title: 'Test Product',
          price: 1000000,
          thumbnail: 'https://example.com/test.jpg',
          reviews: {
            rating_average: 4.7,
            total: 25
          }
        }]}
        hasSearched={true}
        query="test"
      />
    );

    expect(screen.getByText('4.7')).toBeInTheDocument();
    expect(screen.getByText('(25)')).toBeInTheDocument();
    expect(screen.getAllByText('★')).toHaveLength(5);
  });

  test('should show free shipping badge when available', () => {
    render(
      <SearchResults 
        results={[{
          id: 'MLA123',
          title: 'Test Product',
          price: 1000000,
          thumbnail: 'https://example.com/test.jpg',
          shipping: {
            free_shipping: true
          }
        }]}
        hasSearched={true}
        query="test"
      />
    );

    expect(screen.getByText('Envío gratis')).toBeInTheDocument();
  });

  test('should show condition correctly', () => {
    render(
      <SearchResults 
        results={[
          {
            id: 'MLA123',
            title: 'New Product',
            price: 1000000,
            thumbnail: 'https://example.com/test.jpg',
            condition: 'new'
          },
          {
            id: 'MLA456',
            title: 'Used Product',
            price: 500000,
            thumbnail: 'https://example.com/test2.jpg',
            condition: 'used'
          }
        ]}
        hasSearched={true}
        query="test"
      />
    );

    expect(screen.getByText('Nuevo')).toBeInTheDocument();
    expect(screen.getByText('Usado')).toBeInTheDocument();
  });

  test('should create correct links to product detail', () => {
    render(
      <SearchResults 
        results={[{
          id: 'MLA123456789',
          title: 'Test Product',
          price: 1000000,
          thumbnail: 'https://example.com/test.jpg'
        }]}
        hasSearched={true}
        query="test"
      />
    );

    const productLink = screen.getByRole('link');
    expect(productLink).toHaveAttribute('href', '/items/MLA123456789');
  });

  test('should have proper accessibility attributes', () => {
    render(
      <SearchResults 
        error="Test error"
        hasSearched={true}
        query="test"
      />
    );

    const errorElement = screen.getByRole('alert');
    expect(errorElement).toBeInTheDocument();
  });

  test('should have proper image alt attributes', () => {
    render(
      <SearchResults 
        results={[{
          id: 'MLA123',
          title: 'Test Product Title',
          price: 1000000,
          thumbnail: 'https://example.com/test.jpg'
        }]}
        hasSearched={true}
        query="test"
      />
    );

    const productImage = screen.getByAltText('Test Product Title');
    expect(productImage).toBeInTheDocument();
    expect(productImage).toHaveAttribute('loading', 'lazy');
  });
}); 
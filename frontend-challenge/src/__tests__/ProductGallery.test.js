import { render, screen, fireEvent } from '@testing-library/react';
import ProductGallery from '@/components/product/ProductDetail/ProductGallery';

describe('ProductGallery', () => {
  const mockImages = [
    { id: '1', url: 'https://example.com/img1.jpg' },
    { id: '2', url: 'https://example.com/img2.jpg' },
    { id: '3', url: 'https://example.com/img3.jpg' }
  ];

  const mockTitle = 'iPhone 13 Pro Max';

  test('should render gallery with multiple images', () => {
    render(<ProductGallery images={mockImages} title={mockTitle} />);

    const mainImage = screen.getByAltText(mockTitle);
    expect(mainImage).toBeInTheDocument();
    expect(mainImage).toHaveAttribute('src', mockImages[0].url);

    expect(screen.getByLabelText('Ver imagen 1 de 3')).toBeInTheDocument();
    expect(screen.getByLabelText('Ver imagen 2 de 3')).toBeInTheDocument();
    expect(screen.getByLabelText('Ver imagen 3 de 3')).toBeInTheDocument();

    expect(screen.getByText('1 / 3')).toBeInTheDocument();
  });

  test('should change main image when thumbnail is clicked', () => {
    render(<ProductGallery images={mockImages} title={mockTitle} />);

    const mainImage = screen.getByAltText(mockTitle);
    const secondThumbnail = screen.getByLabelText('Ver imagen 2 de 3');

    expect(mainImage).toHaveAttribute('src', mockImages[0].url);
    expect(screen.getByText('1 / 3')).toBeInTheDocument();

    fireEvent.click(secondThumbnail);

    expect(mainImage).toHaveAttribute('src', mockImages[1].url);
    expect(screen.getByText('2 / 3')).toBeInTheDocument();
  });

  test('should show single image without thumbnails', () => {
    const singleImage = [mockImages[0]];
    
    render(<ProductGallery images={singleImage} title={mockTitle} />);

    const mainImage = screen.getByAltText(mockTitle);
    expect(mainImage).toBeInTheDocument();
    expect(mainImage).toHaveAttribute('src', singleImage[0].url);

    expect(screen.queryByLabelText(/Ver imagen/)).not.toBeInTheDocument();
    expect(screen.queryByText(/\/ 1/)).not.toBeInTheDocument();
  });

  test('should show placeholder when no images provided', () => {
    render(<ProductGallery images={[]} title={mockTitle} />);

    expect(screen.getByText('Sin imagen disponible')).toBeInTheDocument();
    expect(screen.queryByRole('img')).not.toBeInTheDocument();
  });

  test('should show placeholder when images is null', () => {
    render(<ProductGallery images={null} title={mockTitle} />);

    expect(screen.getByText('Sin imagen disponible')).toBeInTheDocument();
    expect(screen.queryByRole('img')).not.toBeInTheDocument();
  });

  test('should show placeholder when images is undefined', () => {
    render(<ProductGallery title={mockTitle} />);

    expect(screen.getByText('Sin imagen disponible')).toBeInTheDocument();
    expect(screen.queryByRole('img')).not.toBeInTheDocument();
  });

  test('should have proper accessibility attributes', () => {
    render(<ProductGallery images={mockImages} title={mockTitle} />);

    const thumbnails = screen.getAllByRole('button');
    expect(thumbnails).toHaveLength(3);

    expect(screen.getByLabelText('Ver imagen 1 de 3')).toBeInTheDocument();
    expect(screen.getByLabelText('Ver imagen 2 de 3')).toBeInTheDocument();
    expect(screen.getByLabelText('Ver imagen 3 de 3')).toBeInTheDocument();

    expect(screen.getByAltText('iPhone 13 Pro Max - imagen 1')).toBeInTheDocument();
    expect(screen.getByAltText('iPhone 13 Pro Max - imagen 2')).toBeInTheDocument();
  });

  test('should handle missing image ids', () => {
    const imagesWithoutIds = [
      { url: 'https://example.com/img1.jpg' },
      { url: 'https://example.com/img2.jpg' }
    ];

    render(<ProductGallery images={imagesWithoutIds} title={mockTitle} />);

    expect(screen.getByAltText(mockTitle)).toBeInTheDocument();
    expect(screen.getByText('1 / 2')).toBeInTheDocument();
  });
}); 